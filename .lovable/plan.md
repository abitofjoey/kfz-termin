# Neuss (Rhein-Kreis Neuss) onboarden – mit Geburtsdatum

Umsetzung nach `docs/neue-stadt.md` und deiner Vorlage, Bonner Ablauf mit Standortwahl, Texte im Stil von Recklinghausen. Neuss bleibt **verborgen und nicht buchbar**, nichts wird veröffentlicht. Köln, Bonn und Recklinghausen bleiben exakt gleich.

## 1. Geburtsdatum (nur Neuss)
- Datenbank: neue Spalte `bookings.birth_date` (Datum, darf leer sein). Rechte wie bei der Telefonnummer.
- Die automatische Löschung leert das Geburtsdatum zusammen mit Telefonnummer und FIN.
- Konfiguration: Schalter `birthDateRequired`, nur bei Neuss an.
- Formular: Pflichtfeld „Geburtsdatum“ unter der Telefonnummer, als Datumsfeld mit Autovervollständigung, darunter dein kleiner Hinweis.
- Server: gültiges Datum, Alter 16 bis 110 Jahre, sonst „Bitte ein gültiges Geburtsdatum angeben.“ Bei allen anderen Städten wird ein mitgeschicktes Geburtsdatum ignoriert und nicht gespeichert.
- Script: Nur beim Format mit Standortwahl (Bonn, Recklinghausen, Neuss) kommt `geburtsdatum` dazu, genau wie es gespeichert ist, sonst leer. Bei Köln ändert sich nichts.
- Geburtsdatum erscheint in keiner Kundenmail.

**Achtung, Admin-Ansicht:** Im Projekt gibt es keine Buchungsansicht und keinen Bearbeiten-Dialog. Diesen Punkt lasse ich weg. Ändern lässt sich das Geburtsdatum wie bisher auf Zuruf direkt in der Datenbank. Eine Admin-Seite wäre ein eigenes, größeres Projekt mit Login.

**Zum Bonner Script-Format:** Bei Bonn und Recklinghausen kommt so zusätzlich `geburtsdatum: ""` mit. Wenn das Pi-Script bei unbekannten Feldern nichts macht, ist das harmlos. Andernfalls kann ich das Feld nur bei Neuss mitschicken. Ich nehme die Variante aus deiner Vorlage, also für alle drei Städte mit Standortwahl.

## 2. Stadt-Konfiguration
Genau wie in deiner Vorlage: vier Standorte, Portal- und Info-Link, 12,99 €, Suche rund um die Uhr, Kalender ab morgen für 28 Tage ohne Wochenenden, sofort verbindlich. Standorte bekommen ein optionales Feld `note`, damit unter Meerbusch klein „Nur Kartenzahlung (EC)“ steht. Die anderen Städte haben keine Notiz, bei ihnen ändert sich also nichts.

## 3. Anliegen
18 Kfz-Anliegen mit den Script-Nummern und Bezeichnungen 1–18 genau wie in der Tabelle, bis zu 3 Fahrzeuge. Ausfuhr und Rote Kennzeichen gibt es nicht in Meerbusch. Die Reihenfolge folgt dem Rang, Rang 1–8 sind als „beliebt“ markiert.

## 4. Inhalte, Wahrzeichen, Rechtstexte
- Neue Seite `neuss` mit allen Texten aus der Vorlage: Seitentitel, Hero, Schritte, Standorte, Infobox, 9 FAQs (Nr. 9 wörtlich wie Bonn) und Angaben für Suchmaschinen mit Gebiet „Rhein-Kreis Neuss“. Als Vorschaubild dient vorerst das allgemeine Bild.
- Das Quirinus-Münster kommt unverändert als Wahrzeichen-Symbol in die Konfiguration.
- Rechtstexte: drei Städtelisten wie vorgegeben ergänzt. In der Datenschutzerklärung kommen die Aufzählung, der neue Satz und die Speicherdauer dazu.

## 5. Tests
Alle bestehenden Tests bleiben unverändert grün. Neue Tests decken ab:
- die 18 Anliegen und die Standorte ohne Meerbusch
- das Script-Format mit `anrede` w, `geburtsdatum` 1990-01-31, Anzahl, Standorten (bei „egal“ alle vier) und `kfz`
- abgelehnte Buchungen: ohne Geburtsdatum, mit dem 31.02., unter 16 Jahren, ohne Anrede
- bei Bonn wird `birth_date` nicht gespeichert
- den Kalender
- das Formular: Standortwahl, Geburtsdatum-Feld, kein „finanziert“

Danach prüfe ich die Seite /neuss in der Vorschau und vergleiche die Mails und das Script-Format von Köln, Bonn und Recklinghausen vorher und nachher.

## Nicht geändert
Pi-Schnittstellen (außer dem neuen Feld), Texte und Preise der anderen Städte, Sichtbarkeit. Keine Veröffentlichung.
