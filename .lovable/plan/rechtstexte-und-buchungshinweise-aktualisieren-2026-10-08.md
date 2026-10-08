# Rechtstexte und Buchungshinweise aktualisieren

Es werden ausschließlich die verlangten Texte, Links und Darstellungen geändert. Buchungsablauf, Zahlung, interne API, Script-Anbindung und sonstiges Verhalten bleiben unverändert. Nichts wird veröffentlicht.

## 1. Impressum
- Unter „Kontakt“ nach der E-Mail-Adresse „Telefon: 0151 53461798“ ergänzen.
- „Streitschlichtung“ durch „Verbraucherstreitbeilegung“ und den vorgegebenen Ein-Satz-Text ersetzen.
- Den vollständigen Hinweis samt Link zur eingestellten EU-OS-Plattform entfernen.
- Alle übrigen Inhalte unverändert lassen.

## 2. Widerrufsbelehrung
- Neue Seite `/widerrufsbelehrung` im bestehenden Rechtsseiten-Layout und mit `noindex` anlegen.
- Textblock A vollständig und wortgleich darstellen; Überschriften, Fettdruck, Absätze, Mail-Link und Ausfüll-Linien entsprechend formatieren.
- Das Muster-Widerrufsformular optisch abgesetzt in einem Kasten darstellen.
- Im Footer „Widerrufsbelehrung“ als internen Link zwischen „AGB“ und „Cookie-Einstellungen“ ergänzen. Die danach vorhandene Kontaktadresse bleibt unverändert hinter den verlangten Rechtslinks stehen.

## 3. AGB
- Den gesamten bisherigen Seiteninhalt durch Textblock B ersetzen.
- Nur die ausdrücklich verlangte Abweichung in § 2 Abs. 2 anwenden: ausschließlich Erinnerung per E-Mail an die angegebene E-Mail-Adresse, ohne SMS.
- E-Mail-Adresse und interne Verweise verlinken; bestehendes Rechtsseiten-Layout und `noindex` beibehalten.

## 4. Datenschutzerklärung
- Den gesamten bisherigen Seiteninhalt durch Textblock C ersetzen.
- Abschnitt 6 Abs. 2 durch den vorgegebenen Text ohne SMS-Erinnerung ersetzen.
- In Abschnitt 9 den Platzhalter durch den tatsächlich verwendeten verwalteten E-Mail-Dienst ersetzen: Lovable Labs AB, Regeringsgatan 25, 111 53 Stockholm, Schweden.
- Die vorhandene Google-Analytics-Mess-ID `G-NQXH96FZW3` an den beiden vorgesehenen Stellen einsetzen.
- E-Mail-Adressen und externe Ziele als Links formatieren; bestehendes Rechtsseiten-Layout und `noindex` beibehalten.

## 5. Buchungsformular
- Den letzten Button wortgleich in „Zahlungspflichtig buchen“ ändern.
- Die bereits vorhandene Pflicht-Checkbox zum sofortigen Beginn unverändert lassen: Sie ist im Formularschema verpflichtend und ihr Text stimmt bereits wortgleich mit § 7 Abs. 2 überein.
- Direkt über dem Button den vorgegebenen Satz zu AGB, Widerrufsbelehrung und Datenschutzerklärung ergänzen; alle drei Begriffe öffnen ihre interne Seite in einem neuen Tab.
- Die übrige bestehende Zustimmung zu AGB und Datenschutz sowie sämtliche Formularlogik unverändert lassen.

## 6. Buchungsbestätigungs-Mail
- Den vorhandenen verkürzten Abschnitt „Widerrufsbelehrung“ am Ende der Kundenmail ersetzen.
- Dort zuerst den vorgegebenen Satz zum verlangten sofortigen Beginn einfügen.
- Anschließend Textblock A einschließlich des vollständigen Muster-Widerrufsformulars als Mailtext einfügen.
- Danach wortgleich „Unsere AGB: kfz-termin.online/agb“ ergänzen und die Adresse verlinken.
- Alle übrigen Inhalte und das bestehende Maildesign unverändert lassen.

## 7. Prüfung und Abschluss
- Die betroffenen Seiten, Footer-Links, neuen Tabs, Pflicht-Checkbox, Buttonbeschriftung und E-Mail-Vorschau prüfen.
- Typprüfung und aktuellen Vorschau-Build kontrollieren.
- Am Ende die tatsächlich geänderten Dateien auflisten und einen Diff zeigen.
- Nicht veröffentlichen.

## Technische Details
Voraussichtlich betroffen:
- `src/routes/impressum.tsx`
- `src/routes/widerrufsbelehrung.tsx` (neu)
- `src/routes/agb.tsx`
- `src/routes/datenschutz.tsx`
- `src/components/landing/Footer.tsx`
- `src/components/landing/BookingForm.tsx`
- `src/lib/email-templates/booking-confirmation.tsx`

Die neue Inhaltsroute erhält eigene eindeutige Meta-Daten einschließlich `og:title`, `og:description`, `og:type`, `twitter:card`, Canonical-URL und `noindex, follow`. Automatisch erzeugte Routendateien können sich durch die neue Seite aktualisieren, werden aber nicht manuell bearbeitet.