## Findings-Analyse

### 1. `email_send_weak_auth` — Transactional-Email-Endpoint offen für eingeloggte Nutzer
Die Route `/lovable/email/transactional/send` akzeptiert jedes gültige Supabase-JWT. Da die App **kein Login und keine Registrierung** hat, könnte ein Angreifer trotzdem über den öffentlichen anon-Key selbst einen Supabase-Auth-Account anlegen und dann diese Route missbrauchen (Phishing-Mails im Namen deiner Domain).

Interne Aufrufer nutzen ohnehin `sendTransactionalEmailServer(...)` direkt (siehe `booking-finalize.server.ts`) — die HTTP-Route wird von der App gar nicht mehr gebraucht.

**Fix (kein Breaking Change):** Route auf Service-Role-Bearer umstellen — statt `supabase.auth.getUser(token)` prüfen, ob das Bearer-Token dem `SUPABASE_SERVICE_ROLE_KEY` entspricht (timing-safe). Alle bestehenden App-Flows (Buchungsbestätigung etc.) laufen direkt über `sendTransactionalEmailServer` und sind davon nicht betroffen.

### 2 + 3. SECURITY DEFINER-Funktionen im public-Schema
DB-Check ergibt: nur **2 Funktionen** haben `EXECUTE` für `anon`/`authenticated`:
- `public.email_queue_wake` (Trigger — läuft ohnehin nur beim Enqueue)
- `public.email_queue_dispatch` (wird von pg_cron aufgerufen)

Beide werden **nie** von der App/Client aufgerufen. Alle anderen `SECURITY DEFINER`-Funktionen (`enqueue_email`, `read_email_batch`, `delete_email`, `move_to_dlq`, `delete_ancient_bookings`, `anonymize_old_bookings`) haben bereits kein anon/authenticated-EXECUTE.

**Fix (kein Breaking Change):** `REVOKE EXECUTE ... FROM anon, authenticated` auf diesen beiden Funktionen. pg_cron und Trigger laufen als Superuser bzw. `postgres` und sind nicht betroffen.

## Umsetzung

1. **Migration**: `REVOKE EXECUTE ON FUNCTION public.email_queue_wake(), public.email_queue_dispatch() FROM anon, authenticated;`
2. **Code-Edit** in `src/routes/lovable/email/transactional/send.ts`: JWT-Check durch Service-Role-Bearer-Check ersetzen (timing-safe compare). Keine anderen Änderungen.
3. Security-Findings anschließend als `mark_as_fixed` markieren.

## Nicht betroffen
- Buchungs-Flow, Stripe-Webhook, E-Mail-Versand über `sendTransactionalEmailServer` — alles bleibt wie es ist.
- pg_cron-Jobs (E-Mail-Queue, Anonymisierung, Löschung) — laufen weiter.
- Auth-E-Mails (die kommen aus `auth_emails`-Queue via `enqueue_email`, nicht über diese Route).
