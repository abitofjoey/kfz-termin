# Versteckte Seite /ads-grafiken – Werbegrafiken zum Herunterladen

Reine Hilfsseite. An der bestehenden Website wird nichts geändert (keine Seiten, Texte, Preise, Formulare, Navigation, Meta-Tags).

## Neue Dateien

1. **`src/routes/ads-grafiken.tsx`** – versteckte Seite:
   - `head()` mit `robots: noindex, nofollow`, eigener Titel, kein og:image.
   - Nicht verlinkt, nicht in der Sitemap (Sitemap nutzt `launchedCities()` + feste Routen, die Seite wird dort nicht ergänzt).
   - Zusätzlich `Disallow: /ads-grafiken` in `public/robots.txt`.
   - Rendert alle Grafiken als Vorschau (SVG live im DOM) mit Button „Als PNG laden" pro Grafik.
   - Städte aus `launchedCities()` (cities.ts) – neue Städte bekommen automatisch eine Zeile, sofern ein Motiv hinterlegt ist.

2. **`src/lib/ads-graphics.tsx`** – SVG-Bausteine (kein neues Design, exakt die bestehende Logo-Optik):
   - Farben aus dem bestehenden Logo: Hintergrund dunkles Blau `#111729`, Kachel weiß mit dunklem Haken `#1c2233` (Pfad aus `src/assets/brand/mark.svg`: `M16 33 L28 44 L48 22`), Schrift Inter, „KFZ-Termin" weiß, Stadtname Orange `#ff6200`, Untertitel hellblau-weiß.
   - `LogoSquare(city)`: 1200×1200, Symbol oben mittig, darunter „KFZ-Termin <Stadt>", darunter klein „Wunschtermin bei der Zulassungsstelle", Inhalt mittig mit Rand, deckender Hintergrund.
   - `LogoWide(city)`: 1200×300 (4:1), Symbol links, Schriftzug rechts daneben, ohne Untertitel, deckend.
   - `LandmarkArt(city, format)`: Strichgrafik in Orange `#ff6200` auf `#111729`, eine durchgehende Linienführung, einheitliche Strichstärke, runde Enden (`stroke-linecap/join=round`), keine Füllung. Motiv ≥ 60 % der Höhe, Wichtiges im mittleren 80-%-Bereich. Kein Text, kein Logo.
     - Köln = Kölner Dom: zwei hohe Türme mit Spitzen, Dach dazwischen – selbst gezeichnet aus einfachen Linien.
     - Bonn = Bonner Münster: hoher Mittelturm mit Nebentürmen – selbst gezeichnet.
     - Je Format (1:1 und 1,91:1) eigene Anordnung (eigene viewBox-Pfade/Transform), kein simples Beschneiden.
   - Motiv-Zuordnung pro Stadt in einer kleinen Map (`koeln → dom`, `bonn → muenster`); Stadt ohne Motiv zeigt einen Hinweis statt einer Grafik.

3. **PNG-Export** (in der Seite, Client-seitig):
   - SVG wird serialisiert → `Image` über Blob-URL → `<canvas>` in exakter Zielgröße → `canvas.toBlob("image/png")` → Download per `deliverFile`-Pattern (Blob, `a.download`, verzögertes `revokeObjectURL`).
   - Font-Einbettung: Inter Variable WOFF2 wird als data-URL in das SVG eingebettet (`@font-face` im SVG-`<style>`), damit der Canvas-Export die gleiche Schrift nutzt (für Canvas-Text kein CORS-/Taint-Problem, da alles same-origin/data-URL).
   - sRGB durch Canvas-Standard; PNGs liegen weit unter 5 MB (flächige Grafiken).

## Dateinamen (je Stadt, 8 Dateien gesamt)

- `logo-koeln-1200x1200.png`, `logo-koeln-1200x300.png`
- `bild-koeln-1200x1200.png`, `bild-koeln-1200x628.png`
- analog für Bonn.

## Nicht tun

- Kein Stadtwappen, keine Behörden-Optik, keine Fotos, keine Personen, keine Marken Dritter.
- Köln und Bonn gleicher Stil, nur Motiv und Stadtname unterscheiden sich.
- Keine Änderung an bestehenden Seiten/Komponenten.

## Prüfung

- Typecheck + Build.
- Playwright: /ads-grafiken öffnen, Screenshots der Vorschau (Desktop), einen Download-Button klicken und prüfen, dass die PNG die exakte Pixelgröße hat und nicht leer ist.
- Prüfen, dass /ads-grafiken nicht in der Sitemap steht und robots.txt den Eintrag hat.
- Nicht veröffentlichen. Vorschau-Link nennen.
