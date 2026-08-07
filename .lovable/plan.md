# Core Web Vitals: weitere Optimierungen

## Einschätzung der Befunde

- **Unused JavaScript (137 KiB)** – hier liegt das echte Potenzial. Das Buchungsformular zieht `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns` + Locale, Radix-Dialoge und `sonner` ins Startbundle, obwohl es weit unter dem Sichtbereich liegt.
- **Render-blocking CSS (14,8 KiB / 150 ms)** – ein einziges Stylesheet, bereits klein und gehasht/gecached. Aufwand für Critical-CSS-Inlining ist hoch, Risiko (Flash ungestylter Inhalte) real, Gewinn gering. Nicht anfassen.
- **LCP-Renderverzögerung 870 ms** – die H1 wird serverseitig gerendert; die Verzögerung kommt aus Hydration + Schriftwechsel. Sinkt automatisch, wenn das Startbundle kleiner wird.
- **`/~flock.js` Cache-TTL 25 Min.** – Lovable-eigenes Skript, nicht von uns steuerbar. Kein Fix möglich.
- **Preconnect-Kandidaten**: keine – alle Ressourcen kommen von der eigenen Domain. Nichts zu tun.

## Umsetzung

1. **Buchungsformular nachladen**: `BookingForm` in `src/routes/index.tsx` per `React.lazy` + `Suspense` laden, mit einem Platzhalter in exakt der Höhe/Optik des Abschnitts (Überschrift + Kartenrahmen bleiben sichtbar), damit sich das Layout nicht verschiebt und der Anker `#buchung` weiterhin sofort existiert.
2. **Vorladen beim ersten Bedarf**: Das Chunk wird zusätzlich vorgeladen, sobald der Nutzer scrollt bzw. einen Preis-Button („Termin buchen") klickt – so ist das Formular beim Ankommen bereits da und die bestehende Scroll-zum-Formular-Logik inklusive Service-Vorauswahl funktioniert unverändert.
3. **Toaster nachladen**: `sonner`-`Toaster` ebenfalls verzögert einbinden, da Toasts erst nach Interaktion auftreten.
4. **Verifizieren**: Produktions-Build, Bundle-Größen vor/nach vergleichen, dann im Preview den kompletten Buchungsablauf durchklicken (Service-Auswahl → Formular → Kalender → Validierung) plus Toast-Anzeige.

## Nicht Teil des Plans

Keine Änderung an Texten, Logik, Serverfunktionen, Stripe-Flow oder Design. Reine Ladestrategie.

## Erwartung

Startbundle deutlich kleiner (Ziel: großer Teil der 137 KiB entfällt), LCP-Renderverzögerung sinkt. Performance-Score liegt schon bei 93 – der Rest ist plattformseitig begrenzt.
