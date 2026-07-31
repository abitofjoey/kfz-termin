## Ziel
Die drei Lighthouse-Barrierefreiheitsfehler beheben – ohne Funktions- oder sichtbare Layoutänderungen (bis auf eine minimal hellere Akzentfarbe im Footer, die für den Kontrast nötig ist).

## 1. Sterne-Bewertung (unzulässiges ARIA)
`src/components/landing/Testimonials.tsx`: Das `<div class="flex gap-0.5" aria-label="5 von 5 Sternen">` hat keine Rolle, darf also kein `aria-label` tragen.
- `role="img"` auf dem Div ergänzen. Optisch identisch, Screenreader liest weiterhin „5 von 5 Sternen".

## 2. Definitionsliste (Infobox Zulassungsstelle)
`src/components/landing/InfoBlock.tsx`: `<dt>`/`<dd>` liegen zwei Ebenen tief (`dl > div > div > dt`), erlaubt ist nur `dl > div > dt/dd`.
- Struktur pro Eintrag auf ein Grid umbauen: das direkte `div`-Kind der `dl` bekommt `grid grid-cols-[auto_1fr] gap-x-3`, das Icon wandert in das `<dt>` (Icon + Label nebeneinander), das `<dd>` steht direkt darunter in der zweiten Spalte.
- Ergebnis ist pixelnah zur jetzigen Darstellung (Icon links, Label fett, Wert darunter grau).

## 3. Kontrast
- **Footer** (`src/components/brand/Brand.tsx` / `Footer.tsx`): `text-accent` (blau) auf dunkelblauem Footer-Hintergrund erreicht kein AA. Der `Brand`-Komponente eine Option geben, für dunkle Flächen eine hellere Akzentfarbe zu verwenden (z. B. `text-accent-foreground/80` bzw. ein neues Token für hellen Akzent), und diese nur im Footer setzen. Header/heller Hintergrund bleibt unverändert.
- **Footer-Links** (`text-white/70`, `text-white/80`): auf volle Deckkraft bzw. `text-primary-foreground` anheben, damit auch der als fehlerhaft gemeldete Footer-Block besteht. Optisch nur minimal heller.

## Technisches Detail
Nur Präsentations-/Markup-Änderungen in drei Dateien: `Testimonials.tsx`, `InfoBlock.tsx`, `Brand.tsx` + `Footer.tsx`. Keine Logik, keine Datenbank, keine Routen betroffen. Danach Build-Check.
