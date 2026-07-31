## Ausgangslage (geprüft)

- Die kritische Kette ist: HTML (478 ms) → `styles-*.css` (508 ms) → `inter-lat...woff2` (575 ms).
- `src/styles.css` importiert `@fontsource-variable/inter` **komplett**. Das Paket enthält alle Subsets (latin, latin-ext, cyrillic, greek, vietnamese) – die Schriftdateien werden zwar nur bei Bedarf geladen, aber alle `@font-face`-Regeln landen im CSS und blähen die 15 KiB Stylesheet unnötig auf.
- In `src/routes/__root.tsx` gibt es aktuell nur den Stylesheet-Link, **keinen** `preload` für die Schrift. Deshalb wird die Schrift erst entdeckt, wenn das CSS fertig geparst ist (die dritte Stufe der Kette).

Realistisch sind hier ca. 70–150 ms, keine Wunder. Score 93 ist bereits gut – die folgenden Schritte sind risikoarm und ändern nichts an Optik oder Funktion.

## Geplante Änderungen

### 1. Nur das benötigte Latin-Subset laden
In `src/styles.css` den Import von `@fontsource-variable/inter` auf die Latin-Variante umstellen (`.../latin.css` bzw. das entsprechende Subset-File des Pakets). Ergebnis: weniger `@font-face`-Regeln, kleineres render-blockierendes Stylesheet. Darstellung bleibt identisch, da auf der Seite ausschließlich lateinische Zeichen (inkl. Umlaute) vorkommen.

### 2. Schrift vorladen (Kette von 3 auf 2 Stufen kürzen)
In `src/routes/__root.tsx` in `head().links` ein `rel="preload"` mit `as="font"`, `type="font/woff2"` und `crossOrigin="anonymous"` auf die Inter-Latin-woff2 ergänzen. Der Browser startet den Font-Download dann parallel zum CSS statt danach.

Da Vite die Datei mit Hash ausliefert, wird der Pfad über einen Asset-Import (`?url`) aus `@fontsource-variable/inter/files/...` ermittelt, nicht hartkodiert – sonst bricht der Preload beim nächsten Build.

### 3. `font-display` prüfen
Sicherstellen, dass die Schrift mit `font-display: swap` geladen wird (Fontsource setzt das standardmäßig). Falls nicht gesetzt, ergänzen – verhindert unsichtbaren Text während des Ladens.

## Bewusst nicht gemacht

- **„Ungenutztes JavaScript 136 KiB"**: Der Rest steckt in React/Router/Formular-Logik, die für die interaktive Buchung gebraucht wird. Weiteres Aufsplitten würde die Ladereihenfolge verkomplizieren und Regressionsrisiko beim Buchungsformular erzeugen – Nutzen wenige Millisekunden. Nicht empfohlen.
- **CSS inline einbetten**: Würde das Render-Blocking ganz entfernen, aber das HTML um ~15 KiB aufblähen und den Browser-Cache für wiederkehrende Besucher aushebeln. Netto kein klarer Gewinn.
- **Cache-TTL für `flock.js`**: Das ist ein Skript der Lovable-Plattform, dessen Cache-Header wir nicht steuern können. Auf der veröffentlichten Domain ohne Preview-Overhead fällt das ohnehin weg.
- **Preconnect-Hinweise**: Lighthouse meldet selbst „keine weiteren Ursprünge geeignet" – alles wird schon von der eigenen Domain geliefert.

## Verifikation

TypeScript-Check, danach im Preview prüfen, dass „Inter Variable" weiterhin gerendert wird und Umlaute korrekt aussehen. Die Verbesserung wird erst nach dem Veröffentlichen in PageSpeed messbar.
