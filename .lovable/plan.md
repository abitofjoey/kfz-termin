## Ziel

- **info@kfz-termin.online** überall auf der Seite als sichtbare Kontaktadresse (Impressum, Footer, Datenschutz).
- **buchung@kfz-termin.online** als Absender + Antwortadresse bei allen Buchungs-Mails.

Beide Postfächer liegen bei Zoho und sind voll funktional für **Empfang** (Eingang in deinem Zoho-Postfach). Für das **Versenden** der automatischen Buchungs-Mails nutzt die App weiterhin Lovable Email über die verifizierte Subdomain `notify.kfz-termin.online` — im Posteingang des Empfängers steht aber `buchung@kfz-termin.online` als Absender und Antworten gehen direkt in dein Zoho-Postfach.

---

## Änderungen auf der Website (Anzeige)

**1. `src/routes/impressum.tsx`**
- Kontakt-Sektion: `eike@jeh-digital.de` → `info@kfz-termin.online` (Mailto-Link + Anzeigetext).

**2. `src/routes/datenschutz.tsx`**
- Zeile 94: „Adresse buchung@notify.kfz-termin.online" → korrekt darstellen als `buchung@kfz-termin.online` (Buchungsvorgang) und `info@kfz-termin.online` als allgemeine Kontaktadresse ergänzen.

**3. `src/components/landing/Footer.tsx`**
- Kontaktblock prüfen und `info@kfz-termin.online` als Mailto-Link hinzufügen (falls noch keine E-Mail im Footer steht).

**4. `src/routes/agb.tsx`**
- Falls Kontaktangaben vorhanden, ebenfalls auf `info@kfz-termin.online` setzen.

---

## Änderungen am Mailversand

**5. `src/lib/email/send.server.ts`** (wird für Buchungsbestätigungen genutzt)
- `FROM_ADDRESS` umstellen auf: `KFZ-Termin Köln <buchung@kfz-termin.online>` (Anzeige im Posteingang des Kunden).
- `reply_to` bleibt: `buchung@kfz-termin.online` (Kundenantworten landen in deinem Zoho-Postfach).
- `SENDER_DOMAIN` bleibt **technisch zwingend** `notify.kfz-termin.online` (nur diese Subdomain ist bei Lovable Email verifiziert).

**6. `src/routes/lovable/email/transactional/send.ts`** (generischer Sender, falls genutzt)
- Analog: `from`-Header von `noreply@kfz-termin.online` auf `buchung@kfz-termin.online` umstellen, damit beide Sender konsistent sind.

---

## Hinweis: Display-From auf Root-Domain

Damit der From-Header `buchung@kfz-termin.online` (Root-Domain) sauber zugestellt wird, muss in den Lovable Email Settings die Option **„Display From Root Domain"** aktiv sein. Diese ist beim Setup standardmäßig aktiviert. Sollte nach dem Deploy eine Mail abgelehnt werden, prüfe ich das nach.

---

## Was NICHT geändert wird

- Zoho-DNS-Records (MX, SPF, DKIM, DMARC) — bleiben wie eingetragen.
- Die `notify.kfz-termin.online`-Subdomain — wird weiter für den technischen Versand gebraucht.
- Templates selbst (Inhalt/Design der Bestätigungsmails).

---

## Ergebnis

- Kunden sehen im Posteingang: **Absender „KFZ-Termin Köln <buchung@kfz-termin.online>"** → Antworten gehen automatisch an dein Zoho-Postfach `buchung@`.
- Auf der Webseite, im Impressum und Datenschutz steht **info@kfz-termin.online** als allgemeine Kontaktadresse.
- Beide Postfächer werden aktiv genutzt und sauber getrennt.
