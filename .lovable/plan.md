## Ziel
1. **Kalender-Cutoff:** Ab 14:00 Uhr (Europe/Berlin) wird der Folgetag im Buchungskalender ausgegraut – analog zu Wochenenden/vergangenen Tagen.
2. **Suchzeit-Text:** Überall wo aktuell „7–18 Uhr" / „7 bis 18 Uhr" steht, auf „7–20 Uhr" bzw. „7 bis 20 Uhr" ändern.

## 1. Cutoff-Logik (serverseitig, Europe/Berlin)

Neue Server-Function `getCalendarBounds` in `src/lib/booking.functions.ts`:

- Ermittelt via `Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', ... })` das aktuelle Datum + Stunde in Berlin.
- Liefert:
  - `minDateISO` = morgen (YYYY-MM-DD), oder übermorgen falls Berlin-Stunde ≥ 14.
  - `maxDateISO` = Berlin-heute + 14 Tage.
  - `todayISO` = Berlin-heute (für `startMonth`).

In `src/components/landing/BookingForm.tsx`:

- Die bestehende Client-Berechnung (`useEffect` mit `startOfDay(new Date())`, `minDate`, `maxDate`) wird durch einen `useEffect`-Aufruf der neuen Server-Function ersetzt (via `useServerFn`). Die zurückgegebenen ISO-Strings werden zu `Date`-Objekten geparst.
- Fallback bleibt: solange die Werte nicht geladen sind, wird der bestehende Platzhalter (`<div className="h-[320px]" />`) gezeigt — kein SSR-Hydration-Mismatch.
- Der Rest des Kalenders (Wochenend-Sperre, `mode="multiple"`, UI-Texte) bleibt unverändert.

Grund für serverseitige Berechnung: Client-Uhr kann falsch/verstellt sein — der Cutoff muss auf der echten Berlin-Zeit basieren.

## 2. Suchzeit „18 Uhr" → „20 Uhr"

Textänderungen in:
- `src/components/landing/Steps.tsx` — „7–18 Uhr" → „7–20 Uhr"
- `src/components/landing/Hero.tsx` — „Suche täglich von 7 bis 18 Uhr" → „…7 bis 20 Uhr"
- `src/components/landing/Pricing.tsx` — dito
- `src/components/landing/Faq.tsx` — dito
- `public/llms.txt` — „7 bis 18 Uhr" → „7 bis 20 Uhr"

## Nicht angefasst
- Kalender-UI/Styling, Auswahl-Logik, Validierung, Wochenend-Regel.
- Buchungs-/Payment-Flow, RLS, Datenbank.
- Andere Texte oder Business-Logik.

## Technische Details
- Server-Function ist unauthenticated (öffentliche Landing-Page) und liefert nur berechnete Datumsgrenzen — keine sensitiven Daten, kein DB-Zugriff nötig.
- Berlin-Stunde via `Intl.DateTimeFormat`:
  ```ts
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  const berlinHour = Number(parts.hour);
  const berlinToday = `${parts.year}-${parts.month}-${parts.day}`;
  ```
- Cutoff-Konstante: `14` (fest kodiert wie besprochen).