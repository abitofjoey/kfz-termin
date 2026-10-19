# Online-Widerruf („Vertrag widerrufen“, § 356a BGB)

## 1. Datenbank (eine Migration, ohne Schlüssel)
- `bookings`: `withdraw_token uuid UNIQUE DEFAULT gen_random_uuid()` (vorhandene Zeilen werden dadurch befüllt), `withdrawn_at timestamptz`.
- Die Einschränkung `bookings_search_result_check` wird so ersetzt, dass `found`, `not_found` und `withdrawn` erlaubt sind.
- Neue Tabelle `withdrawals`: id, created_at, name, email, contract_reference, booking_id (uuid, nullable, ohne Fremdschlüssel, damit das Löschen nach 10 Jahren nicht blockiert), source (`link`/`formular`), outcome (`erstattet`, `manuell`, `bereits_erstattet`, `termin_gefunden`), processed_at. RLS an, Zugriff nur für service_role.
- `anonymize_old_bookings` wird erweitert. Zugeordnete Widerrufe werden zusammen mit ihrer Buchung anonymisiert (name, email, contract_reference). Widerrufe ohne Zuordnung werden nach 180 Tagen anonymisiert, das ist dieselbe Frist wie bei Buchungen ohne Wunschtermine. Die Rückgabe der Funktion zählt weiter nur Buchungen, der Cron-Job bleibt unverändert.

## 2. Buchungsnummer
- Neue Hilfsfunktion `bookingNumber(id)` gibt die ersten 8 Zeichen in Großbuchstaben zurück.
- Die Zeile „Buchungsnummer: 45A1000A“ steht gut sichtbar oben in allen Kundenmails: booking-confirmation, appointment-found, search-email-limit, search-not-found, search-rebook-offer, search-rebook-confirmed, search-email-changed, withdrawal-received, Erstattungsmails und die neue Mail „Termin kurz vor Widerruf“.

## 3. Seite /widerruf (noindex, Stil wie termine-aendern)
- **Mit Token:** Server-Funktion `getWithdrawalPrefill(token)` liefert Name, maskierte E-Mail, Buchungsnummer, Anliegen und Wunschtermine. Ungültiger Token: Hinweis und leeres Formular.
- **Ohne Token:** Felder Name, E-Mail-Adresse (die bei der Buchung angegeben wurde), „Welche Buchung?“ (optional). Es gibt keine Frage nach dem Grund und keinen Login.
- **Absenden:** Der Button „Widerruf bestätigen“ ist ein eigener Schritt. Beim Aufrufen der Seite passiert nichts.
- **Ergebnis:** „Wir haben deinen Widerruf am {Datum} um {Uhrzeit} Uhr erhalten. Eine Bestätigung ist per E-Mail unterwegs.“ (Europe/Berlin)
- **Missbrauchsschutz:** Ein verstecktes Honeypot-Feld. Ist es ausgefüllt, kommt eine scheinbar erfolgreiche Antwort, aber nichts wird gespeichert. Höchstens 5 Widerrufe pro E-Mail-Adresse und Stunde, gezählt in `withdrawals`.

## 4. Server-Funktion `submitWithdrawal`
Eingaben werden mit zod geprüft (Längenbegrenzung, gültige E-Mail).
a) Die Zeile in `withdrawals` wird gespeichert. Klappt das nicht, gibt es eine Fehlermeldung, und es geht keine Mail raus.
b) Mail `withdrawal-received` an die angegebene Adresse: Inhalt der Erklärung, Datum und Uhrzeit des Eingangs. Sie bestätigt nur den Eingang, nicht die Wirksamkeit.
c) Zuordnung:
- Mit Token: die Buchung zum Token, Quelle `link`.
- Ohne Token: bezahlte, nicht anonymisierte Buchungen mit derselben E-Mail (Groß-/Kleinschreibung egal), deren Nachname im Namen vorkommt. Ist im Freitext eine 8-stellige Buchungsnummer erkennbar, muss sie passen. Weiter geht es nur bei genau einem Treffer, sonst outcome `manuell`.

d) Bearbeitung:
- `found` ergibt `termin_gefunden`.
- `refund_claimed_at`/`refunded_at` gesetzt ergibt `bereits_erstattet`.
- Sonst wird `withdrawn_at` gesetzt. Ist `search_result` leer, wird es auf `withdrawn` gesetzt, und zwar per bedingtem Update auf „noch leer“, damit es kein Rennen mit einem gleichzeitigen `found` gibt. Danach folgt `refundBooking(…, "widerruf")` und outcome `erstattet`.

e) Mail `withdrawal-internal` an info@ mit den Angaben, der Buchung (oder „keine eindeutige Zuordnung“) und dem Ergebnis. Danach wird `processed_at` gesetzt.

Mails haben feste Idempotenz-Schlüssel je Widerruf-ID. Mailfehler werden nur protokolliert.

## 5. Erstattung
- `RefundAnlass` bekommt den neuen Wert `widerruf`. Die Bedingung beim Beanspruchen ist nur „refund_claimed_at/refunded_at leer“.
- Die Kunden-Erstattungsmail bekommt dafür den Text „Wir haben die Terminsuche beendet und erstatten dir den vollen Betrag.“ Andere Anlässe bleiben unverändert.

## 6. Persönlicher Link in Mails
Kleiner Textlink „Du möchtest die Suche abbrechen? Vertrag widerrufen“ zu `https://kfz-termin.online/widerruf?token=…` in booking-confirmation, search-rebook-confirmed, search-email-limit und search-email-changed. Die Aufrufer geben dafür `withdraw_token` mit. Ohne Token gibt es keinen Link.

## 7. Footer-Button
Ein umrandeter Button „Vertrag widerrufen“ in einer eigenen Zeile, getrennt von den Rechtslinks. Er ist ein echter Link mit Fokusrahmen und erscheint auf allen Seiten.

## 8. Pi-Script
- `pending-bookings`: neues Feld `withdrawn` mit den IDs, deren `withdrawn_at` in den letzten 14 Tagen liegt. `bookings` bleibt unverändert.
- `result`: Kommt `found` für eine Buchung mit `withdrawn`, ändert sich der Zustand nicht. Es gehen eine interne Warnmail (mit Termin) und eine Kundenmail „Termin kurz vor Widerruf“ mit dem vorgegebenen Text raus (neue Vorlagen, einmalig je Buchung). `not_found` und `error` werden für widerrufene Buchungen weiter ignoriert. Ich prüfe dabei, ob der bestehende „bereits gesetzt“-Zweig das schon abdeckt.

## 9. Rechtstexte
- /widerrufsbelehrung und Widerrufsbelehrung in booking-confirmation: Hinweis, dass der Widerruf auch online über „Vertrag widerrufen“ unter https://kfz-termin.online/widerruf möglich ist.
- /datenschutz: neuer Abschnitt Widerrufsformular (Daten: Name, E-Mail, Angaben zur Buchung, Zeitpunkt; Zweck: Bearbeitung und Nachweis; Speicherdauer wie in Punkt 1).
- AGB § 7 (1): Hinweis auf den Online-Weg.

## 10. Nicht geändert
Stripe-Checkout, Kalender, Wunschtermin-Angebot, Ablauf der E-Mail-Änderung (außer Buchungsnummer und Link), health/check, Cron-Jobs.

## 11. Prüfung
Typprüfung und Build. Die Seite /widerruf wird ohne Token und mit ungültigem Token aufgerufen, ohne Absenden. Nichts wird veröffentlicht, und es gibt keinen Test mit echten Buchungen.

## Offener Punkt, bitte entscheiden
AGB § 7 (4) und die Liste darunter sehen bei einem Widerruf während der laufenden Suche nur eine **anteilige** Erstattung vor. Die Vorgabe will den **vollen** Betrag. Vorschlag: Die automatische volle Erstattung bleibt, wie vorgegeben. Die AGB passe ich nur an, wenn du das bestätigst (z. B. „Widerruf während laufender Suche: volle Rückerstattung“). Ohne deine Bestätigung bleibt § 7 bis auf den Online-Hinweis unverändert.
