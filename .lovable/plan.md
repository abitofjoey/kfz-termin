# "not_found": Angebot neue Wunschtermine + automatische Erstattung nach 48 h

Zweige "found" und "error" bleiben exakt unverändert. Kein Deploy, keine echten Aufrufe von Route oder Seite.

## 1. Datenbank
```sql
ALTER TABLE public.bookings
  ADD COLUMN rebook_token uuid UNIQUE,
  ADD COLUMN rebook_offered_at timestamptz,
  ADD COLUMN rebook_used_at timestamptz,
  ADD COLUMN refund_claimed_at timestamptz,
  ADD COLUMN refunded_at timestamptz,
  ADD COLUMN stripe_refund_id text,
  ADD COLUMN refund_error text;
```
Nur neue, leere Spalten. pg_cron, pg_net und Vault sind in der Datenbank bereits installiert.

## 2. Abholroute `pending-bookings.ts`
Nur eine Zeile ergänzt: `.is("search_result", null)`. Sonst nichts.

## 3. Erstattungs-Helfer `src/lib/refund.server.ts`
`refundBooking(booking, anlass: "direkt" | "gewaehlt" | "frist")`:
1. Bedingtes Update `refund_claimed_at=now()` nur wenn `refund_claimed_at IS NULL AND refunded_at IS NULL`; bei "gewaehlt" und "frist" zusätzlich `rebook_used_at IS NULL`, bei "frist" außerdem `search_result='not_found'` und `rebook_offered_at < now() - 48 h` – alles in derselben UPDATE-Anweisung. Keine Zeile → Rückgabe `{ skipped: true }`, nichts weiter. So gewinnt bei gleichzeitiger Terminwahl und Fristablauf immer genau einer.
2. `AUTO_REFUND === "off"` → `"disabled"`; ohne `stripe_session_id` → `refund_error='keine Stripe-Session'`, `"failed"`.
3. Sonst Stripe (STRIPE_SECRET_KEY), Session laden, payment_intent (String/Objekt-ID), `refunds.create({ payment_intent }, { idempotencyKey: "refund-<id>" })` → `"refunded"` / `charge_already_refunded` → `"already"` / sonst `refund_error` (500 Zeichen) → `"failed"`. Nie weiterwerfen.
4. Kundenmail `search-not-found` (Key `booking-notfound-<id>`, refundOk, anlass, searchError, selectedDates); Erfolg → `result_notified_at=now()`.
5. Interne Mail `search-not-found-internal` (Key `booking-notfound-internal-<id>-refund`) mit refundStatus, stripeRefundId, refundError, anlass.

## 4. Route `result.ts`, Zweig "not_found"
Das bestehende bedingte Update bekommt zusätzlich `.or("rebook_used_at.is.null,assigned_to_script.eq.true")`. Trifft keine Zeile zu: Buchung neu prüfen – ist `search_result` noch null (Bedingung passt nicht, verspätete Meldung des alten Durchlaufs), Antwort 200 `{ ok: true, stale: true }`, nichts ändern, keine Mails; sonst wie bisher `{ ok: true, alreadyRecorded: true }`. Danach:
- a) `rebook_used_at` gesetzt oder `search_error='email_limit'` → Helfer mit "direkt".
- b) sonst Angebot: `rebook_token` (nur falls leer, `crypto.randomUUID()`), `rebook_offered_at=now()`; Kundenmail `search-rebook-offer` (Key `booking-rebook-offer-<id>`), interne Mail (Key `booking-notfound-internal-<id>-offer`, refundStatus "offered", Frist).
- c) 200 `{ ok: true, emailSent, outcome }`. Logging nur Status.

Hinweis: Beim zweiten "not_found" nach neuer Terminwahl steht `search_result` wieder auf null (siehe 5), daher greift das bedingte Update erneut und dann Fall a).

## 5. Neue Seite `/termine-aendern?t=<token>`
- `noindex, nofollow`, Design wie die übrige Seite (Header/Footer, Farben).
- Server-Funktion `getRebookState` (supabaseAdmin, Token per Zod als UUID geprüft) liefert nur Vorname, Service, Wunschtermine und Zustand. Zustände und Texte wörtlich wie vorgegeben: ungültig / bereits gewählt (mit neuen Terminen) / Erstattung beantragt / abgelaufen / Auswahl.
- Auswahl: derselbe Kalender wie im Buchungsformular (mehrere Tage, getCalendarBounds inkl. 14-Uhr-Grenze, Wochenenden und 12.10. gesperrt), Tipp-Text, Knopf „Neue Termine bestätigen", darunter Link-Knopf „Lieber Geld zurück" mit Rückfrage („Ja, Geld zurück" / „Abbrechen").
- Aktionen nur per Klick (POST). Seitenaufruf ändert nie etwas.
- `submitRebookDates`: Token, Daten serverseitig gegen dieselben Kalenderregeln prüfen (Prüflogik aus booking.functions.ts in eine gemeinsame Funktion gezogen, Verhalten der Buchung unverändert), bedingtes Update (rebook_used_at/refund_claimed_at/refunded_at leer, Angebot ≤ 48 h): neue `selected_dates`, `search_result=null`, `search_error=null`, `assigned_to_script=false`, `rebook_used_at=now()`. Dann Mails `search-rebook-confirmed` und `search-rebook-internal`.
- `requestRebookRefund`: Token, `rebook_used_at` leer → Helfer mit "gewaehlt".

## 6. Erstattung nach 48 h
- Neue Route `POST /api/internal/refunds/due` (x-script-key wie die anderen): sucht fällige Buchungen (not_found, Angebot älter 48 h, nicht gewählt, nicht beansprucht/erstattet), Helfer mit "frist" je Buchung, Antwort `{ ok: true, processed }`.
- Stündlicher Aufruf per pg_cron + pg_net, Minute 17. Der Schlüssel wird in Vault abgelegt (einmalig per Datenbank-Befehl, nicht in einer Migration), der Cron-Job liest ihn zur Laufzeit aus `vault.decrypted_secrets`. Ziel-URL: https://kfz-termin.online/api/internal/refunds/due.
- Cron-Job und Vault-Eintrag werden jetzt **nicht** angelegt – erst nach deinem Bescheid nach dem Publish.

## 7.–9. Neue Kundenmails (Design wie appointment-found.tsx, in registry.ts)
- `search-rebook-offer.tsx`: Texte, Button „Neue Termine wählen", Link „Rückerstattung anfordern", Frist (Europe/Berlin, „Wochentag, TT.MM.JJJJ um HH:MM Uhr") wörtlich.
- `search-not-found.tsx`: Betreff „Deine Rückerstattung ist beantragt", Einleitung je nach anlass/searchError (bei "direkt" ohne email_limit ist das der zweite Versuch: „…leider ist auch im Zeitraum deiner neuen Wunschtermine keiner…" – wie vorgegeben), Wunschtermine „Dienstag, 06.10.2026", infoBox je nach refundOk, „Neuer Versuch?", „Fragen?".
- `search-rebook-confirmed.tsx`: Betreff, Liste, infoBox, „Fragen?".

## 10. Interne Mails
- `search-not-found-internal.tsx`: Betreff und Hinweis je nach refundStatus (offered/refunded/already/failed/disabled), Anlass in Klartext; Rest bleibt.
- `search-rebook-internal.tsx` (neu): Betreff „Neue Termine gewählt: {Name}", Name, E-Mail, Service, neue Termine, Buchungs-ID, Hinweis „Der Pi übernimmt den Auftrag automatisch."

## 11. AGB § 6 Abs. 1
Letzten Satz durch deinen neuen Text ersetzen. Sonst nichts.

## Danach
Typprüfung, 401-Test ohne Schlüssel, Seite nur mit ungültigem Token ansehen, Diff zeigen. Kein Deploy.
