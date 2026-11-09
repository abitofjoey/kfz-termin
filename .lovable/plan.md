# Kalender-Links in der Mail „Termin gefunden/gebucht“ (Köln und Bonn)

Nichts wird veröffentlicht. Am Ende gibt es eine Vorschau der Mails und der Kalenderdatei.

## Was der Kunde sieht
Unter den Termindaten (Kasten „Dein Termin“) stehen zwei neue Links, in beiden Mail-Varianten:
- Button **„In Google Kalender eintragen“**: Er öffnet Google Kalender mit einem vorausgefüllten Termin.
- Link **„Für Apple-Kalender/Outlook (.ics)“**: Er lädt die Datei `kfz-termin.ics` herunter.

Beide Wege tragen dasselbe ein:
- **Titel:** „Kfz-Termin: <Anliegen> (Stadt <Name>)“. Bei Führerschein-Anliegen heißt es „Führerschein-Termin: …“.
- **Zeit:** der gebuchte Termin mit 30 Minuten Dauer.
- **Ort:** In Köln die Adresse der Zulassungsstelle, in Bonn die Adresse des gebuchten Standorts. Fehlt der Standort, wird die Hauptadresse der Stadt genommen.
- **Beschreibung:**
  - Bonn: „Aufrufnummer: <Nr>. Check-in am Terminal 15 Min. vorher bis 5 Min. nach Beginn. Stornieren: <Stornolink>“
  - Köln: „Bitte den Bestätigungslink der Stadt innerhalb von <Stunden> Stunden anklicken, sonst verfällt der Termin.“
  - Bei beiden zusätzlich „Unterlagen: <Link>“. Das ist der Unterlagen-Link des Anliegens, sonst der allgemeine Link der Stadt, so wie heute in der Mail.
- **Erinnerung:** 1 Tag vorher, nur in der .ics-Datei. Google übernimmt eine Erinnerung über den Link nicht, dort gilt die Standard-Erinnerung des Kunden.

## Sicherheit
- Jede Buchung bekommt einen eigenen neuen, zufälligen Kalender-Schlüssel. Ich nehme bewusst nicht den Schlüssel von „Termine ändern“ oder „Widerruf“: Wer die Kalenderdatei weiterleitet, soll damit keine Buchung ändern oder widerrufen können.
- Der Kalender-Link liefert die Datei nur, wenn ein gefundener Termin vorliegt. Bei unbekanntem Schlüssel, ohne Termin, bei widerrufener oder anonymisierter Buchung kommt „nicht gefunden“.
- Die Datei enthält keine E-Mail-Adresse, keine Telefonnummer und keine FIN.

## Ablauf der Umsetzung
1. **Datenbank:** neues Feld für den Kalender-Schlüssel. Bestehende Buchungen bekommen ihn automatisch, neue ebenfalls.
2. **Gemeinsamer Baustein für den Termininhalt:** Titel, Zeit, Ort und Beschreibung werden an einer Stelle aus der Stadt-Konfiguration erzeugt. Daraus entstehen der Google-Link und die .ics-Datei.
3. **Neue Adresse `/kalender/<schlüssel>.ics`:** Antwort als Kalenderdatei zum Herunterladen.
4. **Mail:** Die Meldung „Termin gefunden“ gibt den Schlüssel an die Mail weiter. Die Mail zeigt Button und Link. Ältere Mails sind nicht betroffen, Köln bleibt sonst Wort für Wort gleich.
5. **Tests und Vorschau.**

## Tests
- Termin im Sommer (z. B. 06.10.2026, 08:20 Uhr) wird zu 06:20 UTC, im Winter (z. B. 12.01.2027, 08:20 Uhr) zu 07:20 UTC.
- Umlaute (Köln, Führerschein) bleiben in der .ics-Datei korrekt.
- Komma, Semikolon, Backslash und Zeilenumbruch im Text werden richtig maskiert.
- Lange Zeilen werden nach 75 Zeichen umbrochen, auch bei Umlauten.
- Die Datei enthält UID (Buchungs-ID@kfz-termin.online), DTSTAMP und eine Erinnerung 1 Tag vorher.
- Google-Link: Zeiten im Format `YYYYMMDDTHHMMSSZ`, alle Teile korrekt kodiert.
- Titel „Führerschein-Termin“ bei Bonner Führerschein-Anliegen.
- Kalender-Link ohne Termin oder mit falschem Schlüssel: „nicht gefunden“.

## Vorschau für dich
- Bilder der Mail für Köln, Bonn Kfz und Bonn Führerschein.
- Eine echte .ics-Datei je Stadt zum Ausprobieren.
- Die Datei prüfe ich mit einem Kalender-Prüfwerkzeug. Apple Kalender, Outlook und den Google-Import kann ich hier nicht öffnen. Das bitte einmal selbst testen, die Dateien bekommst du dafür.

## Technische Details
- Migration: `bookings.calendar_token uuid not null default gen_random_uuid()` plus Unique-Index. Bestehende Zeilen werden über den Default befüllt. Die Anonymisierung lässt das Feld unverändert, die Route prüft aber `anonymized_at`.
- `src/lib/calendar.ts`: `buildCalendarEvent(booking)` → `{title, start, end, location, description}`; `googleCalendarUrl(ev)`, `buildIcs(ev, uid, now)`.
  - Der Termin ist als UTC-ISO-Zeitpunkt gespeichert. Die Mail zeigt ihn in Europe/Berlin, die .ics-Datei nutzt UTC mit `Z` und kommt ohne VTIMEZONE aus.
  - CRLF-Zeilenenden; RFC-5545-Escaping für `\ ; , \n`; Zeilen nach 75 Oktetten UTF-8 falten, ohne Mehrbyte-Zeichen zu teilen.
  - VALARM mit `TRIGGER:-P1D` und `ACTION:DISPLAY`; PRODID, METHOD:PUBLISH.
- Route `src/routes/kalender/{$token}[.]ics.ts`: Token mit zod als uuid prüfen. Lesen über den Admin-Client, Ladung erst im Handler. Bedingungen: `search_result='found'`, `appointment_at not null`, `withdrawn_at is null`, `anonymized_at is null`. Header: `Content-Type: text/calendar; charset=utf-8`, `Content-Disposition: attachment; filename="kfz-termin.ics"`, `Cache-Control: private, no-store`.
- `result.ts` (found-Zweig): `calendarToken` und `category` in `templateData` ergänzen, sonst nichts ändern. `appointment-found.tsx`: neuer Abschnitt in beiden Zweigen nach dem Terminkasten.
- Tests in `src/lib/__tests__/calendar.test.ts`. Danach Typecheck, alle Tests, Vorher/Nachher-Vergleich der übrigen Mails.
