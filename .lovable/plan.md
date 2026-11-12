# Neue Stadt: Recklinghausen (Zulassung Marl)

Recklinghausen wird nach der Anleitung für neue Städte angelegt, erst **verborgen und nicht buchbar** (launched/bookable = false). Köln und Bonn sollen sich danach genau wie heute verhalten: gleiche Seiten, gleiche Mails, gleiches Format fürs Script.

## 1. Stadt-Konfiguration
- Ein neuer Eintrag `recklinghausen` mit allen Werten aus deiner Datei. Den Preis übernimmt er gemeinsam mit Köln und Bonn (12,99 €). Die Suche läuft rund um die Uhr, der Kalender beginnt morgen, gilt 28 Tage und hat keine Wochenenden. Die Buchung ist sofort verbindlich.
- Das Feld `landmarkIcon` zeigt auf das Rathaus-Wahrzeichen (SVG unverändert, dazu eine React-Variante wie bei Bonn).

## 2. Kleine Verallgemeinerungen
- **a) Neues Feld `flow: "single" | "multi"`.** Köln bekommt "single", Bonn und Recklinghausen "multi". Diese Stellen werden von `locationChoice` auf `flow === "multi"` umgestellt: die Script-Zuordnung (Bonner Format) und die Standort-/Nummern-Zeilen in den drei internen Mails (neue Buchung, Termin gefunden, Widerruf nach Fund). Danach steuert `locationChoice` nur noch die Standortauswahl im Formular. Bonn hat bei beiden Feldern den Wert true bzw. "multi", deshalb ändert sich dort nichts.
- **b) Buchungsformular (gemeinsames Formular für Städte mit mehreren Standorten)**
  - Den Kfz/Führerschein-Schalter gibt es nur noch, wenn die Stadt Anliegen in mehr als einer Kategorie hat.
  - Hat die Stadt nur einen Standort, erscheint statt der Auswahl ein ruhiger Kasten „Standort: Zulassung Marl, Stettiner Str. 10, 45770 Marl“. Es wird `locations: null` gesendet, der Server macht daraus `["marl"]`.
  - Verlangt die Stadt eine Anrede, gibt es das Pflichtfeld Anrede (Herr/Frau/Divers) vor dem Vornamen. Sie wird in `bookings.salutation` gespeichert; der Server übernimmt sie nur bei solchen Städten, sonst bleibt sie "" wie heute. Das Script bekommt sie über die vorhandene Zuordnung m/w/d.
  - „Dienstleistungszentrum (Berliner Platz 2)“ und der Bonner Hauptstandort greifen nur noch für Bonn.
- **c) Stadtseite:** Es werden nur Kategorien mit mindestens einem Anliegen angezeigt. Gibt es nur eine Gruppe, entfallen die Umschalter.
- **d) Mails:** Diese Texte kommen neu in die Stadt-Konfiguration: `mail.referenceLabel`, `mail.onSiteSteps` (mit Platzhalter {nummer}), `mail.cityConfirmationNote` und `mail.infoLinkLabel`. Bonn bekommt exakt die heutigen Sätze („Aufrufnummer“, 15 Min., Apple Pay, „Die Stadt Bonn …“, „Seite der Stadt Bonn“). Verwendet werden sie in der Mail „Termin gefunden“ (Zweig sofort verbindlich), in der Buchungsbestätigung, in den internen Mails und im Kalendereintrag (.ics). Für Recklinghausen gelten deine Texte mit „Terminnummer“ und „Seite des Kreises Recklinghausen“. Die Führerschein-Fotozeile bleibt, wie sie ist.

## 3. Anliegen
Eine eigene Liste mit 8 Kfz-Anliegen genau nach deiner Tabelle (ID, Bezeichnung, Kachel, Titel, Untertitel, Hinweis, Höchstzahl, Rang, Info-Link). Die Script-Nummern 1–8 kommen in die Script-Zuordnung für Recklinghausen. Eine Abmeldung gibt es nicht.

## 4. Inhalte der Stadtseite
Meta-Daten, Startbereich, die Abschnitte für Städte mit mehreren Standorten (Formularhinweis Kfz, Schritte, Standort, Preis-Merkmale), Wissenswertes, FAQ (die letzte Frage wörtlich wie bei Bonn) und Service-Daten für Suchmaschinen mit `areaServed` = AdministrativeArea „Kreis Recklinghausen“. Alles wörtlich aus deiner Datei. Die Seite wird bei den Stadtinhalten eingetragen.
- **Vorschaubild:** `/og-image-recklinghausen.jpg` im Stil des Bonner Bildes, mit dem Rathaus unten. Ich zeige es dir vor dem Einbau. Gefällt es dir nicht, lasse ich es weg.

## 5. Rechtstexte
Städte- und Behördenlisten so, wie in deiner Datei angegeben. „Stand: November 2026“ bleibt.

## 6. Tests
- Alle bestehenden Köln-/Bonn-Tests bleiben unverändert grün.
- Neue Tests: 8 Anliegen mit Script-Nummern 1–8 und Höchstzahlen; die Script-Zuordnung im Bonner Format (Anrede Frau → „w“, Anzahl = Fahrzeuge, standorte ["marl"], kategorie "kfz"); Kalender ab morgen, 28 Tage, ohne Wochenenden; eine Buchung ohne Anrede wird abgelehnt; keine Umschalter und keine Standortwahl im Formular. Dazu kommt ein Test, dass die Bonner Mailtexte wörtlich gleich bleiben.

## Nicht geändert
Die Pi-Schnittstellen (pending-bookings, result, portal-check), die Köln- und Bonn-Texte und die Preise. Nicht veröffentlicht, die Stadt bleibt verborgen. Live geht sie erst nach deiner Freigabe.
