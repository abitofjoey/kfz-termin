## Ziel
Beim Teilen des Links (WhatsApp, iMessage, etc.) soll statt eines Seiten-Screenshots ein eigenes, markenkonformes Vorschaubild erscheinen – passend zu Favicon und Logo (dunkles Navy `#1c2233`, weißer Haken, Akzentfarbe).

## Was geändert wird

1. **Neues OG-Bild generieren** (1200×630, JPG)
   - Hintergrund: dunkles Navy mit dezentem Gradient (wie Hero)
   - Logo-Mark (gerundetes Quadrat mit weißem Häkchen) links
   - Wordmark: „KFZ-Termin **Köln**" (Köln in Akzentfarbe)
   - Tagline darunter: „Automatische Terminbuchung bei der Kölner Zulassungsstelle"
   - Kleiner URL-Hinweis unten: `kfz-termin.online`
   - Speichern als `public/og-image.jpg` (überschreibt vorhandenes)

2. **`src/routes/__root.tsx` anpassen**
   - `og:image` und `twitter:image` auf absolute URL umstellen:  
     `https://kfz-termin.online/og-image.jpg`
   - (ersetzt den aktuellen R2-Screenshot-Link)

## Was unverändert bleibt
- Favicon, Apple-Touch-Icon, Manifest, alle Komponenten, Texte, Routing.

Nach dem Deploy kann es 1–2 Tage dauern, bis WhatsApp seinen Cache aktualisiert (Link-Vorschau-Cache ist URL-gebunden).