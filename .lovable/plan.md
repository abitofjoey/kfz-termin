# Stufe 2: Bonn als zweite Stadt (gebaut, aber versteckt)

Bonn wird komplett auf der bestehenden Stadt-Struktur gebaut und bleibt `launched: false` und `bookable: false`. Köln bleibt Wort für Wort und Byte für Byte gleich (Seite, Mails, Pi-Antwort, Kalender).

## 1. Stadt-Konfiguration Bonn
- Name, Adjektiv, Behörde "Stadt Bonn – Kfz-Zulassung und Führerscheinstelle", Portal-URL wie angegeben.
- Vier Standorte: `dlz`, `hardtberg`, `beuel`, `godesberg` mit Adressen.
- Formular: keine FIN, keine Anrede, Standortwahl an, Checkbox "finanziert" an.
- Sofort verbindlich (keine 3-Stunden-Frist), Suche 0–24 Uhr.
- Kalender: frühestens morgen, kein 14-Uhr-Cutoff, keine Wochenenden; Fenster Kfz 35 Tage, Führerschein 70 Tage (über die Kategorie-Überschreibung).
- Preis aus der zentralen Preisangabe (12,99 €).
- Mails: Aufrufnummer und Stornolink an.
- Pi-Wächter (Health-Check und abendliche Zwischenmail) laufen künftig für alle buchbaren Städte statt nur veröffentlichte. Für Köln ändert sich dadurch nichts.

## 2. Dienstleistungen Bonn
- Eigene Bonner Liste mit den 35 Anliegen und Script-Nummern 1–35, je mit Kategorie (`kfz`/`fuehrerschein`), möglichen Standorten und Höchstzahl Fahrzeuge (Standard 5; Nr. 11, 12 = 1; Nr. 14 = 3; Führerschein immer 1 Person).
- Kölner Liste und Nummern 1–19 bleiben unverändert.

## 3. Formular auf /bonn
- Oben Wahl "Kfz-Zulassung" oder "Führerschein"; danach nur passende Anliegen, Kalenderfenster je Kategorie.
- Felder: Vorname, Nachname, E-Mail, Telefon. Anzahl Fahrzeuge nur bei Kfz.
- Standort: "Egal wo – Hauptsache Wunschtermin (höchste Chance)" (Standard) oder "Nur bestimmte Standorte" mit Checkboxen, nur die fürs Anliegen möglichen. Nur DLZ möglich → stattdessen Hinweis "Dieses Anliegen bearbeitet Bonn nur im Dienstleistungszentrum (Berliner Platz 2)."
- Checkbox (nur Kfz) "Fahrzeug ist finanziert oder geleast" mit Hinweis; angehakt → nur DLZ.
- Hinweis über dem Absenden-Button wie vorgegeben.
- Solange nicht buchbar: Formular sichtbar mit Hinweis "Buchungen für Bonn starten in Kürze", Absenden gesperrt (zusätzlich serverseitig abgelehnt).
- Gespeichert: Stadt `bonn`, gewählte Standorte (bei "Egal wo" alle möglichen), neues Feld "finanziert". Kategorie folgt aus dem Anliegen. Server prüft alles nach (Standorte gegen Anliegen, finanziert → nur DLZ, Kalenderfenster).
- Das Kölner Formular sieht und verhält sich exakt wie bisher.

## 4. Schnittstelle für das Pi-Script
- `pending-bookings?city=bonn`: bekanntes Format, zusätzlich in `nutzerdaten`: `standorte`, `finanziert`, `kategorie`; `service` = Bonner Nummer; Anrede/FIN leer; `anzahl` bei Führerschein "1", bei Kfz die gewählte Fahrzeugzahl.
- Kölner Antwort bleibt identisch (keine neuen Felder für Köln).
- Ergebnis-Route speichert Standort, Aufrufnummer, Stornolink wie bisher; die Mails nutzen sie.

## 5. Mails für Bonn
- Alle Unterschiede laufen über die Stadt-Konfiguration; Köln-Mails bleiben Zeichen für Zeichen gleich (Vorher/Nachher-Vergleich).
- Bestätigung: statt 3-Stunden-Hinweis der vorgegebene Rund-um-die-Uhr-Text.
- Termin gefunden: Betreff "Dein Termin in Bonn ist gebucht"; Datum, Uhrzeit, Standort mit Adresse, Aufrufnummer mit Check-in-Hinweis, "Die Buchung ist verbindlich – du musst nichts mehr bestätigen", Stornolink mit vorgegebenem Text.
- Übrige Mails (nicht gefunden, Zwischenstand, Widerruf, Wunschtermine geändert, E-Mail-Limit) mit Bonner Ort und Behörde.
- Widerruf nach erfolgter Buchung: Kundenmail enthält den Stornolink.
- Interne Mails mit `[Bonn]`, plus Standort, Aufrufnummer und "finanziert".

## 6. Inhalt /bonn
- Eigener sachlicher Text, nichts von Köln kopiert, keine erfundenen Zahlen.
- Hero wie vorgegeben; Standortblock mit vier Adressen und Hinweis auf DLZ-only-Anliegen; ehrlicher Hinweis zu mehreren Wochen Vorlauf.
- FAQ: die sechs vorgegebenen Fragen plus Preis/Geld-zurück (Preis aus Konfiguration); FAQ-Strukturdaten.
- Keine Kundenstimmen.
- Meta-Titel wie vorgegeben, eigene Beschreibung, Service-Strukturdaten mit "Bonn". Seite bleibt `noindex`, nicht in Sitemap, Kopfzeile, Fußzeile oder Startseite.

## 7. Ergänzungen
- Stripe-Produktbeschreibung aus der Stadt der Buchung; Köln behält "KFZ-Termin Köln – Terminservice bei der Zulassungsstelle", Bonn "KFZ-Termin Bonn – Terminservice bei der Stadt Bonn".
- Kaufmeldung auf /buchung-erfolgreich: zusätzlich `city: "<slug>"` auf oberster Ebene, sonst unverändert.

## 8. Absicherung
- Köln-Vergleich wie in Stufe 1: /koeln Text und Struktur, alle Mails, pending-bookings-Antwort, Kalender.
- Neue Tests: Kalenderfenster Kfz 35 / Führerschein 70 und kein Cutoff; Standort-Filter je Anliegen; finanziert → nur DLZ; Format `pending-bookings?city=bonn`; Bonn nicht buchbar → Server lehnt ab; Stripe-Text je Stadt.
- Typprüfung, Build, Klicktest von /bonn. Nicht veröffentlichen.

## Hinweis zur Testphase
Die Pi-Überwachung greift für "buchbare" Städte. Mit `bookable: false` wird Bonn also erst überwacht, wenn du Bonn buchbar schaltest (z. B. versteckte Testphase: `launched: false`, `bookable: true`). Das ist so umgesetzt, wie du es beschrieben hast.

## Technische Details
- Migration (additiv): `bookings.financed boolean not null default false`. Kategorie wird nicht gespeichert, sondern aus dem Anliegen abgeleitet.
- `services.ts`: Bonner Dienstleistungs-IDs in eigener Liste, Typ wird von Köln-Union auf städtespezifisch erweitert; Felder `category`, `locations`, `maxVehicles`. `SCRIPT_SERVICE_MAP_BY_CITY.bonn` 1–35.
- Fahrzeuganzahl Bonn: neue Spalte `vehicle_count smallint` (nullable) in derselben Migration, da Bonn keine FINs hat und `anzahl` sonst nicht ableitbar ist; Köln zählt weiter über FINs.
- `script-mapping.ts`: Zusatzfelder nur bei `locationChoice`-Städten, Köln-Ausgabe unverändert.
- `health/check.ts`, `daily-status.ts`: `launchedCities()` → `bookableCities()`.
- `calendar-rules.ts`: Kategorie-Parameter; Bonn `cutoffHour` so gesetzt, dass `afterCutoffOffsetDays = minOffsetDays = 1`.
- `BookingForm` erhält stadtabhängige Abschnitte (Kategorie, Standort, finanziert) hinter `city.form`-Schaltern; Köln-Pfad unverändert.
- Inhalte in `src/content/cities/bonn.ts`, Registrierung in `content/cities/index.ts`.
