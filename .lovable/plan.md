## Markenverständnis (neu)

- **Wortmarke = „KFZ-Termin"** (Hauptmarke, stadtunabhängig)
- **Stadt** = austauschbarer Zusatz dahinter („KFZ-Termin **Köln**", später „KFZ-Termin Hamburg" etc.)
- **Bildmarke darf kein einzelnes „K"** sein, sondern muss neutral funktionieren – egal welche Stadt dahintersteht.

## Bildmarken-Konzept (schlicht, CD-konform)

Ein kleines, ruhiges Icon-Mark in **Anthrazit-Dunkelblau** mit dezentem blauen Akzent. Ich gehe ohne Rückfrage in diese Richtung, weil sie am besten zum bestehenden Look passt – falls du eine andere Variante willst, sag Bescheid:

**Vorschlag:** Ein abgerundetes Quadrat (gleicher Radius wie die Buttons) mit einem stilisierten **Häkchen / Kalender-Tick** – signalisiert „Termin gesichert" und ist gleichzeitig generisch genug für jede Stadt. Keine Auto-Silhouette (wirkt schnell kitschig und einengt thematisch), kein Buchstabe.

In der Bildmarke selbst steht **kein Text**. Die Wortmarke daneben ist textbasiert (siehe unten) und damit für jede Stadt wiederverwendbar – nur die Stadt wird ausgetauscht.

## Wortmarke

Reine Typo, kein extra Schriftzug-Asset, damit die Stadt flexibel bleibt:

```
[icon]  KFZ-Termin <Stadt>
```

- „KFZ-Termin" – Inter Bold, Anthrazit
- „Köln" / „Hamburg" / … – Inter Bold, Akzentblau

→ Stadt wird perspektivisch als Prop an die Header-/Footer-Komponente übergeben (z. B. `<Brand city="Köln" />`), sodass für ein zweites Standort-Projekt nur ein einziger String getauscht werden muss.

## Assets, die generiert werden

Nur das Icon (Mark) ist eine Grafik – die Wortmarke bleibt Text/HTML.

| Datei | Größe | Zweck |
|---|---|---|
| `src/assets/brand/mark.png` | 512×512, transparent | Header-/Footer-Icon |
| `public/favicon.svg` | vektoriell | moderner Tab-Icon |
| `public/favicon.ico` | 32+16 | Fallback Tab-Icon |
| `public/apple-touch-icon.png` | 180×180, anthrazit-Hintergrund | iOS Homescreen |
| `public/icon-192.png` | 192×192, anthrazit-Hintergrund | Android/PWA |
| `public/icon-512.png` | 512×512, anthrazit-Hintergrund | Android/PWA |
| `public/og-image.jpg` | 1200×630 | Social-Preview (WhatsApp/LinkedIn/Facebook/Twitter) – „KFZ-Termin Köln" prominent, mit Subline und Mark |
| `public/site.webmanifest` | – | PWA-Metadaten |

Favicon-/App-Icon-Varianten: Mark **gefüllt auf Anthrazit-Hintergrund** (volles Quadrat statt transparent), damit es im Tab und auf dem Homescreen Kontrast hat.

## Einbindung im Code

1. **Neue Komponente `src/components/brand/Brand.tsx`** mit Props `{ city?: string; size?: "sm"|"md" }` – rendert Mark + „KFZ-Termin <city>". Eine zentrale Stelle für die ganze Marke.
2. **`src/components/landing/Header.tsx`** – aktuelle „K"-Box + Spans ersetzen durch `<Brand city="Köln" />`.
3. **`src/components/landing/Footer.tsx`** – kleines `<Brand city="Köln" size="sm" />` einsetzen, falls dort aktuell nichts steht / sonst prüfen.
4. **`src/routes/__root.tsx` – `head().links` ergänzen:**
   - `rel="icon" type="image/svg+xml" href="/favicon.svg"`
   - `rel="icon" type="image/x-icon" href="/favicon.ico"`
   - `rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"`
   - `rel="manifest" href="/site.webmanifest"`
5. **`head().meta` im `__root.tsx` ergänzen (sitewide):**
   - `og:site_name` = „KFZ-Termin"
   - `og:image` = `https://kfz-termin.online/og-image.jpg` (+ width 1200, height 630)
   - `twitter:card` = `summary_large_image`, `twitter:image` = gleiches Bild
   - `theme-color` = Anthrazit-Hex (passend zu `--primary`)

## Was nicht geändert wird

- `styles.css`, Farben, Layout, Routing
- Bestehende Texte, Stripe-/E-Mail-/Booking-Logik
- Keine neuen Routen

## Technische Details

- Mark wird per Bildgenerator in Premium-Qualität als transparentes PNG erzeugt (SVG-Generierung ist nicht zuverlässig).
- `favicon.svg` schreibe ich kompakt von Hand (einfache geometrische Form → sauberes SVG), `favicon.ico` per `imagemagick` aus dem PNG.
- App-Icons: PNG-Pipeline (`imagemagick`) generiert 180/192/512 aus dem Mark auf Anthrazit-Hintergrund.
- OG-Image als JPG (kleiner, ausreichend für Foto/Verlauf).
- QA: jedes Icon wird in der Zielgröße angeschaut, bevor es verlinkt wird (Lesbarkeit 16 px, Kontrast, keine Beschneidung).

## Wichtig nach dem Build

Damit Social-Vorschauen die neuen Bilder zeigen, muss **erst gepublished werden** – Facebook/LinkedIn-Cache ggf. einmal per Debugger aktualisieren.

## Skalierbarkeit auf andere Städte (perspektivisch)

- Wortmarke: nur die `city`-Prop ändern.
- Mark, Favicon, App-Icons: stadtneutral, **bleiben identisch** für alle Städte.
- OG-Image müsste pro Stadt einmal neu generiert werden (anderer Text) – würde später dann als `og-image-koeln.jpg`, `og-image-hamburg.jpg` etc. abgelegt und per Route ausgewählt.
