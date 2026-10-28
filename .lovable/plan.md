# Abendliche Zwischenmail während der laufenden Suche

## 1. Datenbank
- Migration: `bookings.last_status_mail_at timestamptz` (nullable, kein Default). Sonst nichts.

## 2. Route `POST /api/internal/daily-status`
- `x-script-key` gegen `SCRIPT_API_KEY` wie in health/check, sonst 401 ohne DB-Zugriff.
- Body (zod): `{ dryRun?: boolean, date?: "YYYY-MM-DD" }`. `date` nur zusammen mit `dryRun: true`, sonst 400.
- `heute` = Datum in Europe/Berlin (bzw. simuliertes `date`).
- Pi-Prüfung: `script_heartbeat` (koeln) fehlt oder `last_poll_at` älter als 60 Min → keine Kundenmails; interne Mail `daily-status-pi-internal` an info@ (Schlüssel `daily-status-pi-<heute>`), Antwort `{ ok: true, date, candidates: 0, sent: 0, piDown: true }`. Im dryRun keine Mail, nur `piDown: true` melden.
- Kandidaten: paid, assigned_to_script, search_result/search_error/withdrawn_at/refund_claimed_at/refunded_at/anonymized_at leer, mindestens ein Wunschtag > heute.
- Variante:
  - `wunschtag`, wenn heute in selected_dates (hat Vorrang).
  - sonst `zwischenstand`, wenn letzter Kontakt (spätestes aus confirmation_sent_at, rebook_used_at, email_changed_at, last_status_mail_at, als Berlin-Datum) mindestens 3 Kalendertage vor heute liegt. Alle vier leer → keine Mail.
- Versand `search-daily-status`, Schlüssel `daily-status-<id>-<heute>`; nach Erfolg `last_status_mail_at = now()`. Fehler nur ohne Kundendaten loggen.
- Antwort `{ ok, date, candidates, sent }`; dryRun zusätzlich `list: [{ bookingNumber, variant, remainingDates }]`, ohne Versand und ohne DB-Änderung.

## 3. Vorlagen
- `search-daily-status.tsx` (Stil wie search-email-changed, Bausteine aus customer-email-parts): Buchungsnummer, Anrede, Betreff/Text je Variante wortgleich aus der Vorgabe, Karte „Deine übrigen Wunschtermine" (nur Tage nach heute, Langformat) mit Service, Spam-Hinweis, Kontaktkarte und Fußzeile.
- `daily-status-pi-internal.tsx` (HealthLayout): Betreff „Zwischenmails heute nicht versendet – Pi hat sich zuletzt um … gemeldet" (Berlin-Zeit, bzw. „nie").
- Beide in `registry.ts`.

## 4. Cron-Job (erst nach Veröffentlichung, auf dein Zeichen)
- `daily-status-mail`, `20 19 * * *`, POST an `https://kfz-termin.online/api/internal/daily-status`, Body `{}`, Schlüssel aus `vault.decrypted_secrets` (`script_api_key`), aufgebaut wie health-check. Vorher legt die Route keine Mails ohne Cron/Aufruf an.

## 5. Nicht geändert
Bestehende Mails, result-Route, Erstattung, health/check, andere Cron-Jobs. Keine Schlüssel in Code/Migrationen.

## 6. Prüfung
Typprüfung, Build, 401-Test ohne Schlüssel. Kein Aufruf ohne dryRun, nicht veröffentlichen.

## Zu klären
- **Widerruf-Link in der Fußzeile:** Die gemeinsame Kundenmail-Fußzeile enthält derzeit „Vertrag widerrufen". Vorschlag: für diese Mail eine Fußzeile ohne den Link (Rest gleich), wie gewünscht „keine Links zu Widerruf/Termine ändern".
- **Cron-Zeit:** Im Sommer läuft der Job erst 21:20 Uhr; im Winter 20:20 – beides nach Suchende 20:00, passt.
