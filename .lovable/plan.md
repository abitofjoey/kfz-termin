## Ziel

Den bestehenden runden WhatsApp-Button unten rechts ersetzen durch eine **grüne Auto-Silhouette** (Seitenansicht) in WhatsApp-Grün (#25D366), mit dem **weißen WhatsApp-Logo mittig** auf der Karosserie.

## Umsetzung

**Datei:** `src/components/WhatsAppButton.tsx` (anpassen)

- Statt rundem `<span>` mit Kreis-Hintergrund: ein Inline-SVG mit zwei Ebenen:
  1. **Auto-Silhouette** als Pfad in `fill="#25D366"` — schlichte, moderne Seitenansicht (Karosserie + Dach + zwei Räder als dunklere Kreise für Kontrast).
  2. **WhatsApp-Logo** (vereinfachte Sprechblase mit Hörer) zentriert auf der Karosserie in Weiß.
- Größe: ca. 72×44px auf Desktop, 60×36px auf Mobile (Auto ist breiter als hoch — Container-Box entsprechend anpassen).
- Position bleibt: `fixed bottom-6 right-6` (Desktop) / `bottom-4 right-4` (Mobile).
- Schatten, Fade-in nach 300px Scroll, Puls-Animation (3s) und Hover-Tooltip „Fragen? Schreib uns!" bleiben unverändert.
- Klick-Link bleibt unverändert (`https://wa.me/4917643477088?text=...`).

## Hinweis zum Stil

Eine Auto-Silhouette mit Logo darin ist visuell ungewöhnlich — der Button wird etwas verspielter und weniger sofort als „WhatsApp" erkennbar als ein klassischer runder Button. Falls nach dem Sehen das Logo zu klein/unklar wirkt, können wir das Auto vergrößern oder das Logo prominenter platzieren.

## Geänderte Dateien

- `src/components/WhatsAppButton.tsx`
