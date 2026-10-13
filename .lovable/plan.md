# Ergebnis "error" für die Result-Route + Hinweis im Buchungsformular

Die Abläufe für "found" und "not_found" bleiben Zeile für Zeile unverändert. Nichts wird deployt.

## 1. Migration
```sql
alter table public.bookings
  add column search_error text,
  add column search_error_at timestamptz;
```
Rein additiv, Zugriffsregeln bleiben unverändert. Danach Typen neu erzeugen.

## 2. Route `src/routes/api/internal/bookings/$id/result.ts`
- BodySchema: zusätzlicher Zweig `{ result: "error", reason: "email_limit" | "booking_failed" }` (andere reason → 400).
- Schlüsselprüfung, Body-Prüfung, Laden, 404 bei fehlend/`paid=false` bleiben gemeinsam.
- Neuer Zweig `error` direkt nach der 404-Prüfung (vor dem not_found-Zweig):
  - Update `search_error = reason`, `search_error_at = now()` nur wenn `search_result IS NULL`; keine Zeile → `{ ok: true, alreadyRecorded: true }`, keine Mails.
  - `search_result` bleibt NULL.
  - Immer interne Mail `search-error-internal`, Key `booking-error-internal-<id>-<reason>-<search_error_at als ISO-String>` (der im Update gesetzte Zeitpunkt) – so kommt bei jedem erneuten Auftreten eine interne Mail.
  - Nur bei `email_limit` zusätzlich Kundenmail `search-email-limit` an `booking.email`, Key `booking-error-<id>-email_limit-<email>`.
  - `emailSent`: bei `email_limit` = Erfolg der Kundenmail, bei `booking_failed` = Erfolg der internen Mail.
  - Antwort 200 `{ ok: true, emailSent }`, auch bei Mailfehler; Logging nur Status, keine Kundendaten.

## 3. Neues Template `search-email-limit.tsx` (Kunde)
Gleiches Design und Style-Konstanten wie `appointment-found.tsx`. Betreff, Preview, Überschrift, Begrüßung mit Anrede, Text, warnBox "So geht es weiter", infoBox, Karte "Fragen?" und Footer wörtlich wie vorgegeben. previewData ergänzt.

## 4. Neues Template `search-error-internal.tsx`
Fester Empfänger `info@kfz-termin.online`, schlicht wie `appointment-found-internal.tsx`. Betreff und Hinweis oben je nach reason (wörtlich). Felder: Name, E-Mail, Telefon, Service, FIN(s), Wunschtermine (TT.MM.JJJJ), Buchungs-ID, Stripe-Session-ID. Kasten "Auftrag wieder aufnehmen" mit beiden SQL-Zeilen in Monospace (Buchungs-ID eingesetzt) und dem Hinweissatz darunter. previewData ergänzt.

Beide Templates in `registry.ts` eintragen.

## 5. `BookingForm.tsx`
Direkt unter dem E-Mail-Feld der vorgegebene Hinweistext im Stil der bestehenden Feldhinweise. Sonst keine Änderung.

## Danach
Typprüfung, 401-Test ohne Schlüssel, Diff zeigen. Kein Deploy, keine Test-Mails.

## Hinweis
Wird derselbe Fehler mit derselben Adresse erneut gemeldet, kommt die interne Mail erneut, die Kundenmail aber nur einmal pro Adresse.
