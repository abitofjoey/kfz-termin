# Ergebnis "not_found" für die Result-Route

Der Ablauf für "found" bleibt exakt gleich. Nichts wird deployt.

## 1. Migration
Constraint in der Datenbank heißt tatsächlich `bookings_search_result_check` (aktuell `search_result = 'found'`).

```sql
ALTER TABLE public.bookings DROP CONSTRAINT bookings_search_result_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_search_result_check
  CHECK (search_result IN ('found', 'not_found'));
```

## 2. Route `src/routes/api/internal/bookings/$id/result.ts`
- Body-Schema wird zu einer discriminated union auf `result`:
  - `found` mit `appointmentAt` + `bookedAt` (wie bisher)
  - `not_found` ohne weitere Felder
- Schlüsselprüfung, JSON-/Body-Prüfung (400), Laden der Buchung und 404 bei fehlend/`paid=false` bleiben gemeinsam und unverändert.
- Neuer Zweig für `not_found` (direkt nach der 404-Prüfung, bevor der found-Code läuft):
  - Update `search_result='not_found'` nur wenn `search_result IS NULL`; sonst `{ ok: true, alreadyRecorded: true }` ohne Mail.
  - Keine Kundenmail, `result_notified_at` wird nicht gesetzt.
  - Eine interne Mail `search-not-found-internal`, idempotencyKey `booking-notfound-internal-<id>`, Daten: Name, E-Mail, Telefon, Service, `selectedDates`, Buchungs-ID, `stripeSessionId`.
  - Antwort 200 `{ ok: true, emailSent }`, auch bei Mailfehler; Logging nur Status ohne Kundendaten.
- Der found-Code bleibt Zeile für Zeile gleich (nur Zugriff auf die Zeitfelder erfolgt nach der Typ-Eingrenzung).

## 3. Neues Template `src/lib/email-templates/search-not-found-internal.tsx`
- Gleiches schlichtes Design/Styles wie `appointment-found-internal.tsx`, `to: 'info@kfz-termin.online'`.
- Betreff: `Kein Termin gefunden – Rückerstattung: {Vorname Nachname}`
- Hinweis oben: "Für diese Buchung wurde im Zeitraum der Wunschtermine kein Termin gefunden. Bitte die Rückerstattung im Stripe-Dashboard veranlassen."
- Felder: Name, E-Mail, Telefon, Service, Wunschtermine (Liste TT.MM.JJJJ), Buchungs-ID, Stripe-Session-ID.
- previewData ergänzt.
- In `registry.ts` als `'search-not-found-internal'` eingetragen.

## Danach
Typprüfung, 401-Test ohne Schlüssel, Diff zeigen. Kein Deploy.
