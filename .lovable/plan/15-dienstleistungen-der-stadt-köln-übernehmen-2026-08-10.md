# 15 Dienstleistungen der Stadt Köln übernehmen

## Ausgangslage

Alle Dienstleistungen kommen aus einer zentralen Liste (`src/lib/services.ts`). Kachel-Auswahl, Detailkarte, das Auswahlfeld im Buchungsformular, die Validierung der Serverfunktion und das Label in Datenbank/E-Mails greifen alle auf diese Liste zu. Das heißt: die 6 neuen Anliegen müssen nur an einer Stelle ergänzt werden, dann erscheinen sie überall automatisch.

## Neu hinzukommende Anliegen

1. Ersatz Zulassungsbescheinigung Teil I (Fahrzeugschein)
2. Abmeldung eines Fahrzeugs (Außerbetriebsetzung)
3. Anschriftenänderung in den Fahrzeugpapieren (ohne Halterwechsel, nur innerhalb Köln)
4. Feinstaubplakette
5. Änderung des Familiennamens in Fahrzeugpapieren (Heirat etc.)
6. Neusiegelung von Kennzeichen (Ersatz bei Beschädigung oder Unlesbarkeit)

Die bestehenden 9 bleiben unverändert (Titel/Untertitel werden an die Formulierung der Stadt Köln angeglichen, wo sie abweichen). Reihenfolge wie bei der Stadt Köln. Bearbeitungszeiten werden nicht angezeigt.

## Darstellung „Unsere Services"

Kachel-Auswahl bleibt – sie funktioniert gut. Damit der Abschnitt bei 15 Einträgen nicht überfüllt wirkt:

- Standardmäßig sind die 8 häufigsten Anliegen als Kacheln sichtbar (Gebraucht-, Neufahrzeug, Kennzeichenwechsel, Abmeldung, Ersatz ZB I, Wiederzulassung, Technische Änderung, Anschriftenänderung).
- Darunter ein Button „Weitere Anliegen anzeigen (7)", der die restlichen Kacheln aufklappt (Text wechselt auf „Weniger anzeigen").
- Wird über das Buchungsformular oder einen Link ein verstecktes Anliegen vorausgewählt, klappt der Bereich automatisch auf, damit die Auswahl sichtbar ist.
- Detailkarte darunter bleibt exakt wie jetzt (Titel, Untertitel, Hinweis, Infos-Stadt-Köln-Link, 9,99 €, Feature-Liste, „Jetzt buchen").
- Zugänglichkeit: der Aufklapp-Button erhält `aria-expanded`/`aria-controls`, die Tabliste behält ihre Rolle.

## Weitere Stellen

- Auswahlfeld im Buchungsformular: enthält automatisch alle 15 – geprüft wird, dass die längeren Titel im Dropdown sauber umbrechen.
- Serverseitige Validierung und das in der Datenbank gespeicherte Label ziehen aus derselben Liste; Bestätigungs- und interne Benachrichtigungs-E-Mail zeigen das Label ebenfalls automatisch.
- Bestehende Buchungen sind nicht betroffen (Label wird als Text gespeichert).
- `public/llms.txt`: Abschnitt mit allen 15 Anliegen ergänzen (für KI-Agenten/LLM-Auffindbarkeit).
- FAQ-Antwort zum Leistungsumfang bleibt gültig, wird nur leicht ergänzt.

## Technisch

- `src/lib/services.ts`: 6 neue Einträge inkl. `label`, `shortLabel`, `subtitle`, ggf. `note` und `infoUrl` (offizielle Stadt-Köln-Produktseiten); neues optionales Feld `popular: true` für die 8 Standard-Kacheln.
- `src/components/landing/Pricing.tsx`: Aufklapp-Logik plus Auto-Aufklappen bei vorausgewähltem Anliegen.
- `public/llms.txt`: Liste der Anliegen.
- Prüfung: Typecheck plus Klick-Test (Kachelauswahl, Aufklappen, Vorauswahl ins Formular, Dropdown mit 15 Einträgen).

## Nicht Teil des Plans

Kein Preisänderung, keine Änderung am Kalender, Stripe-Flow, an E-Mail-Templates oder am Datenbankschema.
