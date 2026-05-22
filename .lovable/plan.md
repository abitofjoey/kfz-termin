## Ziel

Nach 30 Sekunden Verweildauer erscheint neben dem WhatsApp-Auto-Button eine kleine schließbare Sprechblase mit CTA „Fragen? Schreib uns bei WhatsApp."

## Umsetzung

**Datei:** `src/components/WhatsAppButton.tsx` (erweitern)

- Timer: 30s nach Mount, Dialog erscheint nur wenn Nutzer >300px gescrollt hat (also der Button sichtbar ist).
- Schließung speichern in `sessionStorage` → pro Session nur einmal.
- Dialog: weiße Sprechblase, max-w ~280px, links neben dem Auto auf Desktop, darüber auf Mobile.
- Inhalt: Kurztext + CTA-Button „Bei WhatsApp schreiben" (öffnet wa.me-Link) + X-Schließen-Button.
- Sanfter Fade-in + Slide-Up Animation.

## Geänderte Dateien

- `src/components/WhatsAppButton.tsx`
