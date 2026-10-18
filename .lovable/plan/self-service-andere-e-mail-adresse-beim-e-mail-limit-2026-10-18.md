# Self-Service „andere E-Mail-Adresse" beim E-Mail-Limit

found- und not_found-Zweig, Erstattung, pending-bookings und Cron-Jobs bleiben unverändert. Keine Schlüssel in Code oder Migrationen. Kein Deploy, Test erst nach deinem OK.

## 1. Datenbank
```sql
alter table public.bookings
  add column email_change_token uuid unique,
  add column email_changed_at timestamptz;
```
Rein additiv, Zugriffsregeln bleiben (nur service_role).

## 2. Route `result.ts`, error-Zweig
Nur bei `email_limit`, nach dem erfolgreichen search_error-Update und vor dem Mailversand: `token = booking.email_change_token ?? crypto.randomUUID()`, speichern, als `emailChangeToken` an `search-email-limit` übergeben. Schlägt das Speichern fehl → 500 wie bei den anderen DB-Fehlern (Mail geht dann nicht raus, Script kann erneut melden). Rest des Zweigs unverändert.

## 3. Mail `search-email-limit`
- Hauptbutton „Andere E-Mail-Adresse eintragen" → `https://kfz-termin.online/email-aendern?token=…` (Button-Stil wie in search-rebook-offer).
- Kleiner Link darunter: „Ich habe meinen bestehenden Termin bei der Zulassungsstelle storniert – mit dieser Adresse weitersuchen" → gleiche URL mit `&aktion=storniert`.
- Text „Antworte einfach auf diese E-Mail …" bleibt als Alternative; Erstattungshinweis unverändert. Ohne Token (Vorschau/Altfälle) entfallen Button und Link.

## 4. Neue Seite `/email-aendern`
Aufbau und Stil wie termine-aendern, noindex, eigene Metadaten. Zustände über `getEmailChangeState(token)` in dieser Reihenfolge: invalid → refunded → found → done („Wir suchen bereits mit {Adresse} weiter") → expired (not_found oder alle Wunschtage vor heute, Europe/Berlin) → form.
- form: bisherige Adresse maskiert (z. B. `ma***@gmail.com`), Felder „Neue E-Mail-Adresse" + „wiederholen", der vorgegebene Hinweistext, Button „Neue Adresse speichern" und Button „Termin storniert – mit bisheriger Adresse weitersuchen".
- `aktion=storniert`: der Storniert-Button wird hervorgehoben bzw. mit Rückfrage direkt aufgeklappt; ausgelöst wird nur per Klick.
- Nach Erfolg: Bestätigungszustand „Danke, wir suchen weiter mit {Adresse}".

## 5. Server-Funktion `submitEmailChange({ token, newEmail?, storniert? })`
- zod: token uuid; newEmail getrimmt, klein, gültige Adresse; ungleich der alten (außer storniert). Genau eins von beiden.
- Ein Update mit allen Bedingungen (token, search_error = email_limit, search_result null, refund_claimed_at null, refunded_at null). Setzt email (nur bei neuer Adresse), search_error/search_error_at = null, assigned_to_script = false, email_changed_at = now(). Keine Zeile → „Dieser Link ist nicht mehr gültig."
- Danach Mails `search-email-changed` (an die aktuelle Adresse, mit Wunschterminen im Langformat) und `search-email-changed-internal` (Buchungs-ID, alte und neue Adresse bzw. „storniert, gleiche Adresse"). Keys enthalten email_changed_at, damit ein späterer zweiter Wechsel wieder Mails auslöst. Mailfehler ändern das Ergebnis nicht. Logging ohne Kundendaten.
- Beide Templates in `registry.ts`.

## 6. Pi-Wächter (`health/check.ts`)
email_changed_at zählt mit zum Freigabezeitpunkt für „nicht abgeholt". Mail-Schlüssel bleibt `health-notpickedup-<id>-<run>` und wird nur bei gesetztem email_changed_at zu `health-notpickedup-<id>-<run>-<email_changed_at>`. Sonst bleibt die Datei unverändert.

## 7. Keine paid-Prüfung
getEmailChangeState und submitEmailChange prüfen paid nicht (der Token entsteht nur bei bezahlten Buchungen), damit die Testbuchung mit paid = false funktioniert.

## Hinweis
Nach dem Wechsel ist search_error leer. Meldet das Script dann not_found, bekommt der Kunde wie gewünscht das Wunschtermin-Angebot statt der direkten Erstattung.

## Danach
Typprüfung und Build, kein Publish. Test mit Testbuchung erst nach deinem OK.
