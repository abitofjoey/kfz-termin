## Status

Der Fix für `email_send_weak_auth` ist bereits im Code:

`src/routes/lovable/email/transactional/send.ts` prüft den `Authorization`-Header jetzt gegen `SUPABASE_SERVICE_ROLE_KEY` (timing-safe Vergleich). Ein normaler Supabase-JWT wird abgelehnt (401). Die internen Aufrufer (`booking-finalize.server.ts` → `sendTransactionalEmailServer`) rufen die HTTP-Route gar nicht auf, sondern die Helper-Funktion direkt — sind also nicht betroffen.

## Aufgabe

Nur das persistierte Security-Finding als **fixed** markieren, damit es aus dem Security-Panel verschwindet. Keine Code- oder DB-Änderungen.
