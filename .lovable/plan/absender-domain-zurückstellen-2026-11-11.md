# Absender-Domain zurückstellen

1. In der Mail-Versanddatei die Anzeige-Domain des Absenders wieder auf `kfz-termin.online` setzen. Absender dann z. B. „KFZ-Termin Bonn <buchung@kfz-termin.online>“.
2. Versand-Domain (`notify.kfz-termin.online`) und Antwort-an (info@kfz-termin.online) bleiben unverändert. Sonst keine Änderungen.
3. Veröffentlichen.
4. Eine interne Test-Mail (Buchungsbenachrichtigung mit Testdaten, Name „TEST – Absender-Test“) an info@kfz-termin.online schicken und melden, ob der Mailserver sie angenommen hat.

## Technisch
- `src/lib/email-templates/send-email.ts`, Zeile 17: `FROM_DOMAIN = "kfz-termin.online"`.
