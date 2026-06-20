## Problem
Auf Mobile sieht der Nutzer im Service-Bereich nur die Badge-Auswahl (z. B. „Gebrauchtfahrzeug“, „Neufahrzeug"…). Wenn er ein Badge tippt, ändert sich zwar die Detail-Karte darunter – aber die Karte liegt außerhalb des Viewports, sodass der Nutzer die Änderung nicht mitbekommt.

## Empfohlene Lösung
Bei Klick auf ein Badge **nur auf Mobile** sanft zur Detail-Karte scrollen (`scrollIntoView`). Das ist der geringste Eingriff, verändert das Desktop-Verhalten nicht und gibt dem Nutzer sofort visuelles Feedback.

### Alternative Ansätze (nicht empfohlen)
| Ansatz | Nachteil |
|--------|----------|
| Akkordeon (Badge klappt inline auf) | Bricht das aktuelle Layout komplett auf, unterschiedliche Höhen verschieben die restliche Seite |
| Sticky-Karte unten am Viewport | Nimmt permanent Platz weg, überlappt ggf. Inhalte |
| Carousel/Swipe | Aufwendiger, nicht offensichtlich für Nutzer |

## Umsetzung

### 1. `src/components/landing/Pricing.tsx` – Scroll zur Karte auf Mobile
- Füge einen `ref` auf den Karten-Container (`<div className="mx-auto mt-8 max-w-xl">`) hinzu.
- Erkenne Mobile via `window.innerWidth < 640` (Tailwind `sm:`-Breakpoint).
- Im `onClick` jedes Badges: nach `setActiveId(...)` prüfen, ob Mobile aktiv ist. Falls ja, `cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })` ausführen (mit kleinem `setTimeout` oder `requestAnimationFrame`, damit React den State-Update gerendert hat).

### 2. Keine Änderungen an
- Desktop-Verhalten: dort bleibt alles wie gehabt (Badges ändern die Karte, kein automatisches Scrollen).
- `index.tsx` / `handleSelect`: das Scrollen zum Buchungsformular bei „Jetzt buchen“ bleibt unberührt.

## Ergebnis
- Mobile: Badge-Tap → Seite scrollt sanft zur Detail-Karte, Nutzer sieht sofort das Ergebnis.
- Desktop: Kein Unterschied zum aktuellen Verhalten.