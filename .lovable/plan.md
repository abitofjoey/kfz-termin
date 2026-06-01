## Performance-Optimierungen (PageSpeed-Befunde)

Ziel: LCP, FCP & TBT spürbar senken. Fokus auf die größten Hebel aus dem Report.

### 1. Logo-Bild drastisch verkleinern (größter Hebel, ~629 KiB → ~2 KiB)
`src/assets/brand/mark.png` ist 1024×1024 PNG (≈630 KiB), wird aber nur als 32×32 angezeigt.
- Logo durch eine optimierte SVG-Version ersetzen (`src/assets/brand/mark.svg`) **oder** als 64×64 WebP exportieren.
- `Brand.tsx` aktualisiert den Import auf die neue Datei.
- Datei wird auch in `Founder` / `Datenschutz` ggf. mit ausgetauscht (gleicher Import-Pfad).

### 2. Google Fonts entkoppeln (spart ~600–750 ms Render-Blocking)
Aktuell: `@import url(...)` in `styles.css` → blockiert CSS-Parsing & Rendering, kein Preconnect.
- `@import` aus `src/styles.css` entfernen.
- Stattdessen in `src/routes/__root.tsx` `head().links` setzen:
  - `preconnect` auf `https://fonts.googleapis.com` und `https://fonts.gstatic.com` (mit `crossorigin`)
  - `preload` der CSS als `as="style"`
  - `stylesheet` mit `media="print" onload="this.media='all'"`-Pattern (oder einfacher: nur `preconnect` + normaler Link, da Inter mit `display=swap` bereits SwAP nutzt).
- Font-Weights auf das tatsächlich genutzte Minimum reduzieren (z. B. 400, 600, 700 statt 400/500/600/700/800), wenn 500 & 800 nicht verwendet werden.

### 3. Founder-Foto lokal & responsive einbinden (spart ~70 KiB + 330 ms LCP)
Aktuelles Bild liegt extern (`jeh-digital.de`), 1200×1200, schlechter Cache-Header (≈30 Min).
- Foto einmalig herunterladen, auf 240×240 (für 2× Retina von 120×120) als WebP konvertieren.
- Unter `src/assets/brand/eike.webp` ablegen und im `Founder`-Component importieren.
- `loading="lazy"` & `decoding="async"` bleiben. Vorteil: lange Cache-TTL, kein Cross-Origin-Connect, kein DNS-Lookup.

### 4. LCP-Element-Renderverzögerung (2.540 ms)
Die Hero-Headline ist das LCP-Element. Die Verzögerung kommt fast vollständig aus 2.+3. (CSS+Font blockieren). Wenn 2. erledigt ist, fällt diese Zeit automatisch.
- Zusätzlich: `font-display: swap` ist via Google-URL bereits aktiv – keine Code-Änderung nötig.

### 5. Hinweis zu „Unused JavaScript" (98 KiB)
Stammt überwiegend aus Vendor-Bundles (React/Router/Supabase) und ist auf Tanstack-Start-SSR-Apps schwer ohne Refactor signifikant zu senken. Wir lassen das in diesem Schritt bewusst aus, weil der ROI niedriger ist als die Punkte 1–3.

### Geänderte Dateien
- `src/styles.css` – `@import` entfernen
- `src/routes/__root.tsx` – `preconnect` + Font-`stylesheet`-Links in `head().links`
- `src/assets/brand/mark.svg` (neu) bzw. neues kleines `mark.png`/`webp`
- `src/components/brand/Brand.tsx` – Import aktualisieren
- `src/components/landing/Founder.tsx` – lokales Bild
- `src/assets/brand/eike.webp` (neu, heruntergeladen & konvertiert)

### Erwarteter Effekt
- LCP: ~6,7 s → erwartet ~3–4 s (–600 KiB Bild, –750 ms Font-Blocking, –330 ms externer Connect)
- FCP: ~3,3 s → ~1,5–2 s (Font/CSS nicht mehr blockierend)
- Transfer: –700 KiB beim ersten Aufruf
