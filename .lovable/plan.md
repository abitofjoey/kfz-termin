# Interne Route POST /api/internal/bookings/$id/dates

Neue Route `src/routes/api/internal/bookings/$id/dates.ts`, neue Vorlage `src/lib/email-templates/search-dates-updated.tsx`, Eintrag in `registry.ts`. Sonst keine Änderungen.

## Ablauf der Route
1. `x-script-key` gegen `SCRIPT_API_KEY` prüfen wie in `result.ts` (Secret fehlt: 500; Schlüssel falsch/fehlt: 401, vor jedem Datenbankzugriff).
2. Body per zod: `selectedDates` = 1–60 Einträge, jeweils `YYYY-MM-DD` und echtes Kalenderdatum (z. B. 2026-02-30 abgelehnt). Ungültig: 400.
3. Buchung laden; unbekannt oder `paid = false`: 404.
4. Suche läuft nicht (search_result gesetzt, withdrawn_at gesetzt, refund_claimed_at oder refunded_at gesetzt): nichts ändern, `{ ok: true, ignored: true }`.
5. Neue Liste = eindeutig + aufsteigend sortiert. Keine Kalenderregeln (`areDatesAllowed` wird nicht angewendet).
6. Gleich wie bisherige (sortiert verglichen): `{ ok: true, changed: false }`, keine Mail.
7. Sonst ein bedingtes Update von `selected_dates` (mit denselben Bedingungen wie in Schritt 4 im Update selbst, damit ein gleichzeitiger Widerruf/Ergebnis nicht überschrieben wird). Trifft das Update keine Zeile: `{ ok: true, ignored: true }`.
8. Danach Kundenmail `search-dates-updated` an `booking.email`, Idempotenz-Schlüssel `booking-dates-updated-<id>-<tage mit Komma verbunden>`. Mailfehler nur loggen (ohne Kundendaten), Antwort trotzdem `{ ok: true, changed: true }`. Keine interne Mail.

## Vorlage search-dates-updated
Stil wie `search-email-changed.tsx` (gemeinsame Bausteine aus `customer-email-parts`): Betreff "Deine Wunschtermine wurden aktualisiert", Buchungsnummer, Anrede "Hallo {Vorname}," bzw. "Hallo,", Karte "Deine Wunschtermine" mit allen Tagen im Langformat, Service, Link "Vertrag widerrufen" mit `withdraw_token`, Kontakt und Fußzeile.

## Danach
Typprüfung, Build, 401-Test ohne Schlüssel. Nicht veröffentlichen.
