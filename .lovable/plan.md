## Ziel

Cleanes Markenbild (Logo + Schriftzug "KFZ-Termin Köln") als Link-Vorschaubild + zwei Download-Varianten.

## Was ich mache

### 1. OG-Bild für Link-Vorschau (`public/og-image.jpg`, 1200×630)

- **Hintergrund:** Markenblau `#1c2233` (vollflächig).
- **Logo invertiert:** weißes abgerundetes Quadrat mit blauem Haken (`#1c2233`).
- **Schriftzug daneben:** „KFZ-Termin **Köln**" in Weiß, „Köln" im Akzent-Orange wie im Header.
- **Untertitel klein darunter:** „Wunschtermin bei der Zulassungsstelle".
- Erzeugt mit `imagegen` (premium-Tier wegen Text-Lesbarkeit), Format JPG.

### 2. Download-Variante hell (`public/brand-kfz-termin-light.png`, 1200×630)

- **Weißer Hintergrund**, original Logo (dunkelblaues Quadrat, weißer Haken), dunkelblauer Text.
- Für Print, E-Mail-Signatur, helle Hintergründe.
- Abrufbar unter `https://kfz-termin.online/brand-kfz-termin-light.png`.

### 3. Download-Variante dunkel (`public/brand-kfz-termin-dark.png`, 1200×630)

- **Blauer Hintergrund** `#1c2233`, invertiertes Logo (weißes Quadrat, blauer Haken), weißer Text, „Köln" in Akzent-Orange.
- Selbes Design wie das OG-Bild, aber als separate PNG-Datei zum Download.
- Abrufbar unter `https://kfz-termin.online/brand-kfz-termin-dark.png`.

### 4. Meta-Tag minimal angleichen

- In `src/routes/__root.tsx`: `og:image:alt` auf „KFZ-Termin Köln – Logo" aktualisieren.
- `og:image`-Pfad bleibt `/og-image.jpg` — Datei wird einfach überschrieben.

## Was ich NICHT ändere

- Header/Menübar (nutzt weiterhin `mark.svg`).
- Keine Änderungen an Pricing, Booking-Form, Mails oder Routen.

## Hinweis nach dem Publish

Facebook/LinkedIn/WhatsApp cachen Vorschaubilder tagelang. Nach dem Publish manuell refreshen:
- **Facebook/Instagram/WhatsApp:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/
