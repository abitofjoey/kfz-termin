## Ziel
Ladezeit verbessern, ohne Design, Funktion oder Texte zu ändern. Nur die Punkte umsetzen, die wirklich messbar helfen und risikoarm sind.

## 1. Google Fonts selbst hosten (größter Hebel, ca. 500–700 ms)
Aktuell lädt die Seite Inter über `fonts.googleapis.com` → das erzeugt die kritische Kette
HTML → googleapis-CSS → gstatic-woff2 (658 ms) und blockiert das Rendering.

- Paket `@fontsource-variable/inter` installieren und in `src/styles.css` importieren (lokale Paket-CSS, kein URL-Import).
- Die drei `<link>`-Tags für Google Fonts (2× preconnect + stylesheet) in `src/routes/__root.tsx` entfernen.
- `--font-sans` bleibt `"Inter", …` – identische Schrift, identische Optik. Die Font-Datei kommt dann vom selben Server, wird mit `font-display: swap` geladen und blockiert das Rendering nicht mehr.

## 2. Gründerbild verkleinern (ca. 7 KiB)
`src/assets/brand/eike.webp` ist 240×240 und wird mit 120×120 angezeigt (bewusst für Retina).
- Statt einer starren Verkleinerung ein `srcset` mit einer zusätzlichen 120px-Variante ergänzen, damit Standard-Displays die kleine Datei laden und Retina weiterhin scharf bleibt.
- Bild bleibt `loading="lazy"`, Optik unverändert.

## 3. Nicht genutztes JavaScript im Startbundle reduzieren
Der Kalender im Buchungsformular (`react-day-picker` + `date-fns`-Locale) ist der größte einzelne Brocken, den beim ersten Rendern niemand sieht – er liegt weit unter dem Fold.
- Den `Calendar` in `BookingForm.tsx` per `React.lazy` + `Suspense` nachladen, mit einem Platzhalter in exakt gleicher Höhe, damit kein Layout-Sprung entsteht.
- Verhalten, Validierung und Server-Logik bleiben unverändert; der Kalender ist beim Scrollen/Öffnen bereits geladen.

## Nicht umgesetzt (bewusst)
- `/~flock.js` Cache-TTL: Lovable-interne Datei, nicht durch den Projektcode beeinflussbar.
- Weiteres Code-Splitting des Router-/React-Bundles: hoher Aufwand, geringer Nutzen, erhöhtes Risiko.

## Technisches Detail
Betroffene Dateien: `package.json` (eine neue Font-Dependency), `src/styles.css`, `src/routes/__root.tsx`, `src/components/landing/Founder.tsx`, `src/components/landing/BookingForm.tsx`. Keine Änderungen an Datenbank, Server-Funktionen, Stripe- oder E-Mail-Flow. Abschluss mit Typecheck und einem Blick auf die Vorschau (Schrift + Kalender sichtbar korrekt).
