## Diagnose

Die Buchungen wurden korrekt als bezahlt markiert und die Bestätigungs-E-Mails wurden in die Queue eingereiht — alle 4 Einträge im `email_send_log` hängen aber im Status **`pending`** fest. Das heißt: die Mails werden erzeugt, aber nicht versendet, weil der Queue-Dispatcher (Cron-Job `process-email-queue`) entweder nicht läuft oder seinen Vault-Secret-Key verloren hat (z. B. nach einem Service-Role-Key-Wechsel).

Die Domain `notify.kfz-termin.online` ist verifiziert — daran liegt es nicht.

Zur Stripe-Quittung: diese wird nur gesendet, wenn in den Stripe-E-Mail-Settings **„Successful payments"** aktiv ist **und** der Checkout mit `receipt_email` läuft. Das ist im Code gesetzt. In Stripe Test Mode kommen Quittungs-Mails nur, wenn unter *Settings → Emails* explizit „Email customers about… successful payments" aktiviert ist (separat von Live-Mode). Bitte dort prüfen.

## Plan

1. **E-Mail-Infrastruktur neu provisionieren** via `email_domain--setup_email_infra` (idempotent). Das legt den fehlenden bzw. defekten `process-email-queue` Cron-Job neu an und aktualisiert das Vault-Secret mit dem aktuellen Service-Role-Key.
2. **Warten & prüfen**: nach ~10 Sekunden den `email_send_log` erneut abfragen — die 4 pending Einträge sollten dann auf `sent` wechseln. Falls Fehler auftreten, `error_message` auswerten.
3. **Stripe-Quittung**: Nutzer bitten, in Stripe → Settings → Emails (Test-Mode getrennt von Live) „Successful payment" zu aktivieren — der Code übergibt `receipt_email` bereits korrekt, daran muss in der App nichts geändert werden.

Keine Code-Änderungen nötig — nur Infrastruktur-Refresh.