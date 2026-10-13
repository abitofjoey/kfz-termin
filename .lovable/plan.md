# Pi-Wächter

Interne Mails an info@kfz-termin.online, wenn der Pi still ist oder Aufträge liegen bleiben. Kundenabläufe, `found`/`not_found`/`error`, Refunds und Ack bleiben unverändert.

## 1. Migration
- Tabelle `public.script_heartbeat` (`city text primary key`, `last_poll_at timestamptz not null`, `alert_sent_at timestamptz`).
- `GRANT ALL ... TO service_role`, kein Grant an anon/authenticated; RLS an, Policy nur für service_role (wie bei bookings).

## 2. `GET /api/internal/pending-bookings`
- Nach erfolgreicher Schlüsselprüfung: Upsert `{ city: 'koeln', last_poll_at: now() }` in eigenem try/catch (nur Fehlertext loggen). Antwortinhalt und Status bleiben identisch.

## 3. Neue Route `POST /api/internal/health/check`
Datei `src/routes/api/internal/health/check.ts`, gleicher `x-script-key`-Check vor jedem DB-Zugriff (401).
- a) `last_poll_at` älter als 30 Min. und `alert_sent_at` leer: Mail „Pi meldet sich nicht“ (letzte Abfrage in Europe/Berlin, Hinweis „Prüfen: Strom, Internet, VNC auf 100.121.9.74:5901“), danach `alert_sent_at = now()`. Gibt es noch keine Zeile, wird kein Alarm ausgelöst.
- b) `last_poll_at` jünger als 5 Min. und `alert_sent_at` gesetzt: Mail „Pi wieder erreichbar“, `alert_sent_at = null`.
- c) Nicht abgeholt: `paid=true`, `assigned_to_script=false`, `search_result` leer, `created_at` älter als 30 Min. und ab 14.10.2026 → Mail je Buchung, idempotencyKey `health-notpickedup-<id>`.
- d) Ohne Ergebnis: `paid=true`, `assigned_to_script=true`, `search_result` leer, `refund_claimed_at` leer, `created_at` ab 14.10.2026, letzter Wunschtag mehr als 2 Tage vor heute (Berlin) → Mail je Buchung, idempotencyKey `health-stuck-<id>`.
- Buchungen ohne Wunschtermine werden übersprungen. Mailfehler blockieren den Rest nicht.
- Antwort: `{ ok: true, piAlert, notPickedUp, stuck }`. Dabei ist `piAlert` gleich `"down"`, `"recovered"` oder `null`; die anderen Werte sind Anzahlen.

## 4. Mail-Vorlagen (Stil wie `search-error-internal`, fester Empfänger info@)
- `pi-down-internal`, `pi-recovered-internal`, `booking-not-picked-up-internal`, `booking-stuck-internal`, alle in `registry.ts` eingetragen.

## 5. Cron-Job
- Wird noch nicht angelegt. Nach deinem Signal: Job `health-check`, `*/15 * * * *`, aufgebaut wie `refunds-due-hourly`.

## Prüfung
Typprüfung, 401-Test ohne Schlüssel, Diff. Kein Deploy.
