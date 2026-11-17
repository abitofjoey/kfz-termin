# Neuss-Texte, Check-in-Hinweis und Ort statt Seitenname

Neuss bleibt verborgen, nichts wird veröffentlicht. Pi-Schnittstellen bleiben unverändert. Köln, Bonn und Recklinghausen bleiben Wort für Wort gleich, außer beim Ort im Betreff (Recklinghausen: „in Marl").

## A) Check-in-Satz kommt aus der Konfiguration
- Der feste Satz „Mit dieser Nummer meldest du dich vor Ort am Check-in-Terminal an." in der Terminmail entfällt als fester Text.
- Neues optionales Feld `mail.referenceHint`, angezeigt an derselben Stelle (nur wenn eine Nummer da ist):
  - Bonn und Recklinghausen: genau der bisherige Satz
  - Neuss: „Mit dem QR-Code aus der Mail des Kreises oder deinem Geburtsdatum meldest du dich vor Ort am Check-in-Terminal an."
  - Köln: kein Wert. Geprüft: Köln hat keine Nummer in den Mails (`showBookingReference` aus), die Zeile erscheint dort heute nie – bleibt so.
- Test: Neuss enthält den neuen Satz genau einmal und den alten nicht; Bonn/Recklinghausen exakt wie vorher.

## B) Ort statt Seitenname
1. `CityConfig.regionName` (Pflicht): Köln „Köln", Bonn „Bonn", Recklinghausen „Kreis Recklinghausen", Neuss „Rhein-Kreis Neuss".
2. `CityLocation.town` (Pflicht): Köln „Köln"; alle vier Bonner Standorte „Bonn"; Marl „Marl"; Neuss „Neuss", Grevenbroich „Grevenbroich", Dormagen „Dormagen", Meerbusch „Meerbusch".
3. Helfer `bookedTown(city, locationId)`: Ort des gebuchten Standorts, sonst Ort des ersten Standorts.
4. Terminmail: Betreff und Vorschauzeile „Dein Termin in {Ort} ist gebucht". Der Kalendereintrag (Google-Link und .ics) nennt heute keinen Stadtnamen als Ort, sondern Behörde und Standortadresse – bleibt daher unverändert.
5. Vor der Buchung: Geprüft wurden Zahlungs-/Suchbestätigung und Erfolgsseite – dort steht heute kein „{Stadtname}" als Ort (es wird die Behörde aus der Konfiguration genutzt). `regionName` wird dort also nur verwendet, wo ich beim Umsetzen doch eine Stelle finde; sonst bleiben die Texte gleich. Die Seite „Buchung abgebrochen" („Zurück zur Seite für …") ist ein Seitenname und bleibt.
6. Neuss-Hero: „Dein Termin beim Straßenverkehrsamt Rhein-Kreis Neuss –" / „automatisch gebucht". Seitentitel und Beschreibung bleiben.
7. Tests: Betreff bei Buchung in Grevenbroich = „Dein Termin in Grevenbroich ist gebucht", Recklinghausen „… in Marl …", Bonn „… in Bonn …", Köln „… in Köln …" (unverändert).

## C) Neuss-Texte
- `mail.onSiteSteps`: deine 5 Schritte wörtlich, fett wie angegeben (ersetzt die bisherigen 4).
- `mail.cityConfirmationNote` und `mail.calendarCheckIn`: deine Texte wörtlich.
- FAQ Nr. 2 „Warum fragt ihr nach meinem Geburtsdatum?": neue Antwort wörtlich.
- Tests für alle vier Texte.

## Technische Details
- `src/lib/cities.ts`: Typen `referenceHint?`, `regionName`, `town`, Helfer `bookedTown`, Werte je Stadt/Standort.
- `src/lib/email-templates/appointment-found.tsx`: Satz aus `referenceHint`, Betreff/Preview über `bookedTown`.
- `src/content/cities/neuss.ts`: Hero, FAQ 2.
- Tests in `neuss.test.ts`, `bonn.test.ts` und einer Prüfung für Köln/Recklinghausen; alle bestehenden Tests bleiben grün.
