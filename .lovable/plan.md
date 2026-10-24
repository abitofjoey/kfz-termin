# Interne Abfrage GET /api/internal/heartbeat

Neue Datei `src/routes/api/internal/heartbeat.ts`, sonst keine Änderungen.

## Ablauf
1. `x-script-key` gegen `SCRIPT_API_KEY` prüfen wie in `pending-bookings.ts` (fehlt Secret: 500; falscher/fehlender Schlüssel: 401, vor jedem Datenbankzugriff).
2. `script_heartbeat` für `city = 'koeln'` lesen (nur `last_poll_at`), über den Server-Client.
3. Keine Zeile: 404. Lesefehler: 500 (nur Fehlercode loggen).
4. Antwort 200: `{ "lastPollAt": "<ISO>", "ageSeconds": <Math.floor((jetzt - lastPollAt)/1000)> }`, auf dem Server berechnet.

Nur lesend: kein Upsert von `last_poll_at`, keine Mails.

## Danach
Typprüfung, Build, 401-Test ohne Schlüssel, dann veröffentlichen.
