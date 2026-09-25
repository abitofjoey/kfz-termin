# Termin-gefunden-Rückmeldung vom Script

Ergänzung: Das Script meldet einen gefundenen Termin zurück, die Buchung wird aktualisiert und Kunde + intern werden per Mail informiert. Bestehender Code bleibt inhaltlich unverändert, außer den zwei bewussten Adressänderungen.

## 1. Migration (public.bookings)

```sql
alter table public.bookings
  add column search_result text check (search_result in ('found')),
  add column appointment_at timestamptz,
  add column found_at timestamptz,
  add column result_notified_at timestamptz;
```
`status` und Zugriffsregeln bleiben unverändert.

## 2. Adressänderungen
- `src/lib/email/send.server.ts`: `REPLY_TO` → `info@kfz-termin.online` (gilt für alle Mails; Absender bleibt).
- `src/lib/email-templates/booking-internal-notification.tsx`: `to` → `info@kfz-termin.online`.

## 3. Neue Route `src/routes/api/internal/bookings/$id/result.ts`
Aufbau wie `pending-bookings/$id/ack.ts` (x-script-key-Check vor jedem DB-Import, sonst 401).

POST-Ablauf:
1. Body per Zod prüfen: `result === "found"`, `appointmentAt`/`bookedAt` gültige Zeitangaben → sonst 400.
2. Buchung laden; fehlt oder `paid = false` → 404.
3. Bedingtes Update (`.is("search_result", null)`, mit `select` der betroffenen Zeilen): `search_result='found'`, `appointment_at`, `found_at`.
   Keine Zeile aktualisiert → `{ ok: true, alreadyRecorded: true }`, keine Mails.
4. Mails über `sendTransactionalEmailServer`: `appointment-found` an `booking.email` (Key `booking-found-<id>`) und `appointment-found-internal` (Key `booking-found-internal-<id>`).
5. Kundenmail erfolgreich → `result_notified_at = now()`.
6. Antwort 200 `{ ok: true, emailSent }`, auch bei Mailfehler. Logging nur Status/Fehler, keine Kundendaten.

## 4. Template `appointment-found.tsx` (Kunde)
Gleiches Design/Style-Konstanten wie `booking-confirmation.tsx` (Farben, Karten, infoBox, warnBox, Footer, SITE_NAME). Inhalte exakt wie vorgegeben: Betreff, Preview, Überschrift, Begrüßung, Karte „Dein Termin“ (Datum „Dienstag, 06. Oktober 2026 um 08:20 Uhr“, Service, Ort), warnBox mit Frist = found_at + 3 h („HH:MM“) und Spam-Hinweis, infoBox „Zum Termin“ mit Link zur Stadt-Köln-Seite, Karte „Fragen?“ (E-Mail, WhatsApp, Telefon als Links) + „Oder antworte einfach auf diese E-Mail.“, previewData.

## 5. Template `appointment-found-internal.tsx`
Fester Empfänger `info@kfz-termin.online`, schlichtes Design (Stil wie bestehende interne Mail). Betreff „Termin gefunden: {Vorname Nachname} – {Datum Uhrzeit}“; Inhalt: Name, E-Mail, Telefon, Service, Termin, gebucht um, Buchungs-ID; previewData.

Beide Templates in `registry.ts` eintragen.

## Technische Hinweise
- Alle Zeiten via `Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin" })` formatiert; Templates erhalten ISO-Strings und formatieren selbst.
- Nach Umsetzung: Typecheck, 401-Test ohne Key, Plan + Diff zeigen. Kein Deploy.
