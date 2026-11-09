# Bonn-Seite an Kölner Aufbau angleichen

Köln bleibt Wort für Wort und Byte für Byte gleich (Seite und Mails). Nicht veröffentlichen, nur Vorschau.

## Neue Reihenfolge /bonn
Hero (bleibt) → So funktioniert's → Unsere Services (neu) → Wer steckt hinter KFZ-Termin? (Founder wie Köln) → Jetzt Termin buchen (Bonner Formular) → Die vier Bonner Standorte → FAQ. Keine Kundenstimmen. Der bisherige einfache Preis-Block entfällt (Preis steht in der Service-Karte).

## 1. So funktioniert's
Vier Schritte mit den neuen Texten aus deinem Briefing; der Hinweis zu „Reguläre Termine … mehrere Wochen im Voraus" bleibt darunter.

## 2. Unsere Services
- Überschrift „Unsere Services", Untertitel „Wähle dein Anliegen – einheitlicher Preis, keine versteckten Kosten."
- Umschalter „Kfz-Zulassung | Führerschein", Standard Kfz.
- Kachel-Raster: 9 sichtbar in deiner Reihenfolge (Kfz: 1,3,13,7,8,15,11,12,9; Führerschein: 22,23,24,25,28,27,30,26,29), Rest hinter „Weitere Anliegen anzeigen (n)".
- Karte: Titel, Untertitel, Hinweis (klein, entfällt bei „–"), Preis aus Konfiguration, Häkchen-Liste (rund um die Uhr; 5 Wochen bzw. 10 Wochen Führerschein; Standort „alle vier Bonner Standorte" oder „nur im Dienstleistungszentrum (Berliner Platz 2)" je nach möglichen Standorten; Geld-zurück; Support), Link „Infos Stadt Bonn" (infoUrl des Anliegens, sonst bonn.de), Button „Jetzt buchen" → scrollt zum Formular und wählt Bereich und Anliegen vor.
- In der Kölner Karte wird „Infos Stadt Köln" aus dem Stadtnamen erzeugt – Ausgabe identisch.

## 3. Texte entschärfen (Bonn)
- Hinweis über dem Absenden-Button: neuer Text aus dem Briefing.
- FAQ „Wann sucht ihr?": „Rund um die Uhr – an allen deinen Wunschtagen und Standorten."
- Bestätigungsmail Bonn: Satz „Auch Termine am Wunschtag selbst buchen wir – oft schon ab 7 Uhr morgens." gestrichen.
- „sofort verbindlich" nur noch in FAQ „Muss ich den Termin noch bestätigen?" und in der Termin-gebucht-Mail; übrige Bonner Stellen umformuliert – ich liste sie dir als Vorher/Nachher auf.

## Prüfung
Typprüfung, alle Tests, Köln-Vergleich (/koeln-Text und alle Kölner Mails unverändert), Screenshots von /bonn (beide Umschalter-Zustände, „Jetzt buchen" wählt im Formular vor). Danach Vorschau-Link.

## Technische Details
- `services.ts`: Bonner Dienstleistungen erhalten `tileLabel`, `subtitle`, `hint` sowie Kennzeichnung `popular` mit Reihenfolge; Daten 1–35 aus dem Briefing.
- `Pricing.tsx` wird stadtfähig: optionale Props (Service-Liste, Kategorien, Features-Funktion, Preis, Stadtname). Ohne Props exakt heutiges Köln-Verhalten.
- `CityBookingForm` bekommt eine Vorauswahl (Kategorie + Anliegen) per Prop/Callback aus `MultiLocationLanding`.
- `MultiLocationLanding` setzt `Founder` (bereits stadtneutral) und die neue Reihenfolge ein; Steps-Texte in `src/content/cities/bonn.ts`.
- Test: Bonner Standort-Häkchen (DLZ-only vs. alle vier) und Suchzeitraum je Kategorie.
