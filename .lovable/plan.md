## Ziel

Die Kunden-Buchungsbestätigung (`src/lib/email-templates/booking-confirmation.tsx`) inhaltlich und visuell an die Vorlage aus den Screenshots angleichen.

## Änderungen an `src/lib/email-templates/booking-confirmation.tsx`

### Struktur (neue Reihenfolge)

1. **Kopf**: Kleiner Brand-Eyebrow "KFZ-Termin Köln" über H1 "Buchungsbestätigung", danach feine Trennlinie.
2. **Anrede + Intro**: „Hallo {Anrede Vorname Nachname}," + „vielen Dank für deine Buchung. Deine Zahlung ist eingegangen und wir haben deinen Auftrag erhalten. Wir beginnen ab sofort mit der Terminsuche bei der Kölner Zulassungsstelle."
3. **Info-Box „So läuft es ab"** (blau hinterlegt, mit Uhr-Icon-Optik): Sobald Termin gefunden → Bestätigungs-E-Mail der Zulassungsstelle → 3 Stunden Bestätigungsfrist, sonst verfällt unwiderruflich.
4. **Card „Deine Angaben"**: Name, E-Mail, Telefon, Service, FIN (letzte 4 Ziffern), Anmerkungen (nur wenn vorhanden).
5. **Card „Gewünschte Termine"**: Liste mit Kalender-Glyph (📅 oder Unicode) pro Termin.
6. **Card „Zahlung"**: Betrag 19,00 €, Umsatzsteuer-Hinweis (§ 19 UStG), darunter Fußnote „Die Zahlungsquittung erhältst du separat per E-Mail von Stripe."
7. **Warn-Box „Bitte prüfe deine Angaben"** (warm/amber, Dreieck-Optik): Hinweis auf falsche Daten + „Antworte in diesem Fall einfach auf diese E-Mail."
8. **Card „Widerrufsbelehrung"**: Text gemäß Vorlage inkl. „info@kfz-termin.online · Eike Hoffmann".
9. **Footer**: „Bei Fragen antworte einfach auf diese E-Mail." + „info@kfz-termin.online" + „Herzliche Grüße / Dein Team von KFZ-Termin Köln".

### Inhaltliche Korrekturen vs. aktuelle Version

- Intro-Text neu formulieren (aktuell: zwei Absätze, neu: ein Absatz wie oben).
- Die „So läuft es ab"-Box ist **neu** im Mail-Body (war bisher nur auf der Success-Page).
- FIN-Label ändern auf „FIN (letzte 4 Ziffern)".
- „Bitte prüfe deine Angaben"-Hinweis (aktuell als `warnHint` vorhanden) wird zu einer eigenen Card mit Titel & Icon-Optik umgebaut, der Satz „oder deine Zulassung vor Ort abgewiesen werden" entfällt gemäß Vorlage.
- Abschlusstext „Wir suchen jetzt für dich…" wird entfernt (durch die neue Info-Box oben ersetzt).
- Neue Card **„Widerrufsbelehrung"** ergänzen (war bisher nicht in der E-Mail).
- Footer: „info@kfz-termin.online" zusätzlich als eigene Zeile vor „Herzliche Grüße".

### Design / Styling

- Body weiß (`#ffffff`), Container max. 560 px.
- Typo: serifenlose Stack (Inter/Arial), H1 ~28 px bold, Eyebrow ~12 px uppercase grau.
- Cards: heller Grauton (`#f7f8fa`), Border-Radius 10 px, Padding 20–22 px, Section-Title als kleines uppercase Label.
- Info-Box „So läuft es ab": hellblauer Hintergrund (`#eaf2ff`), blauer Akzenttext (`#1a4fa3`), 1 px linker Akzentrand oder Border-Left.
- Warn-Box „Bitte prüfe deine Angaben": warmes Amber (`#fef3c7` Hintergrund, `#78350f` Text).
- Label/Value-Paare als zweispaltige Optik via `Row`/`Column` aus `@react-email/components` für saubere Tabellenoptik (Label links, Wert rechts), mit `Hr` als Trennern – statt aktueller gestapelter Variante.
- Icons als Unicode-Glyphen (🕐, ⚠️, 📅) bzw. einfacher CSS-Punkt – keine externen Bilder.

### Keine Änderungen an

- Props-Interface / `templateData` (Felder bleiben gleich).
- `previewData` (bleibt, ggf. Termine erweitern für besseres Vorschaubild).
- Sende-Logik in `stripe.functions.ts`.
- Interne Notification-Mail an den Betreiber.

## Offene Frage

Keine – Inhalt & Designvorlage sind durch die beiden Screenshots eindeutig.
