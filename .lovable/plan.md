# "not_found": automatische Rückerstattung + Kundenmail

Die Zweige "found" und "error" bleiben exakt unverändert. Nichts wird deployt.

## 1. Datenbank
```sql
ALTER TABLE public.bookings
  ADD COLUMN refunded_at timestamptz,
  ADD COLUMN stripe_refund_id text,
  ADD COLUMN refund_error text;
```
Nur neue, leere Spalten – Live-App bleibt unberührt.

## 2. Route `result.ts`, Zweig "not_found"
Bestehendes bedingtes Update auf `search_result='not_found'` und `alreadyRecorded`-Antwort bleiben. Danach:

a) Rückerstattung (eigener Helfer im selben Zweig):
- `AUTO_REFUND === "off"` → `refundStatus = "disabled"`, nichts in der DB.
- Ohne `stripe_session_id` → `refund_error = 'keine Stripe-Session'`, `"failed"`.
- Sonst: Stripe-Client mit `STRIPE_SECRET_KEY` (wie in stripe.functions.ts, dynamisch importiert), Session laden, `payment_intent` (String oder Objekt-ID) → `stripe.refunds.create({ payment_intent }, { idempotencyKey: "refund-<id>" })`.
  - Erfolg: `refunded_at=now()`, `stripe_refund_id`, `"refunded"`.
  - Code `charge_already_refunded`: `refunded_at=now()`, `"already"`.
  - Sonst: `refund_error` (max. 500 Zeichen), `"failed"`. Kein Weiterwerfen.
  - Fehlt `payment_intent` in der Session → wie sonstiger Fehler (`"failed"`).

b) Kundenmail `search-not-found` an `booking.email`, Key `booking-notfound-<id>`, zusätzlich `refundOk`, `searchError`, `selectedDates`. Bei Erfolg `result_notified_at=now()`.

c) Interne Mail `search-not-found-internal` (Key unverändert) wird **nach** der Kundenmail gesendet, zusätzlich mit `refundStatus`, `stripeRefundId`, `refundError`.

d) Antwort 200 `{ ok: true, emailSent, refundStatus }` (emailSent = Kundenmail). Logging nur Status.

Hinweis: Wird dieselbe Buchung erneut mit "not_found" gemeldet, greift wie bisher `alreadyRecorded` – es gibt dann keinen zweiten Erstattungsversuch.

## 3. Neues Template `search-not-found.tsx`
- In `registry.ts` als `'search-not-found'`.
- Design, Style-Konstanten, „Fragen?"-Karte und Footer 1:1 wie `appointment-found.tsx`.
- Betreff/Preview/Überschrift und beide Texte (normal / `email_limit`) wörtlich aus deiner Vorlage.
- Karte „Deine Wunschtermine": Daten als „Dienstag, 06.10.2026" + Service.
- infoBox „Deine Rückerstattung" je nach `refundOk` mit deinen zwei Texten.
- Karte „Neuer Versuch?" mit Link auf https://kfz-termin.online und hervorgehobenem Tipp.
- previewData (refundOk: true).

## 4. Interne Mail `search-not-found-internal.tsx`
- Betreff: „automatisch erstattet" bei refunded/already, sonst „BITTE MANUELL ERSTATTEN".
- Hinweis oben je nach refundStatus (4 Texte wörtlich), plus „Der Kunde wurde per Mail informiert."
- Rest unverändert.

## 5. AGB § 6 Abs. 1
„auf Anfrage den gezahlten Betrag vollständig" → „den gezahlten Betrag automatisch und vollständig". Sonst nichts.

## Danach
Typprüfung, 401-Test ohne Schlüssel, Diff zeigen. Kein echter Aufruf (würde echt erstatten), kein Deploy. `AUTO_REFUND` muss nicht angelegt werden – ohne Wert ist die Erstattung aktiv.
