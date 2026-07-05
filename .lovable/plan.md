## Fix: Buchungsfenster konstant halten

Aktuell: `maxDateISO = today + 14`, unabhängig vom Cutoff. Nach 14 Uhr rutscht `minDate` auf übermorgen — das Fenster schrumpft dann auf 13 Tage.

**Änderung in `src/lib/booking.functions.ts` (`getCalendarBounds`):**
- `maxDateISO = today + (14 + minOffset − 1)` — also `today + 14` vor 14 Uhr, `today + 15` ab 14 Uhr.
- Damit bleibt das buchbare Fenster ab `minDate` konstant 14 Kalendertage (≈ 10 Werktage nach Wochenend-Filter).

Kein weiterer Code muss angepasst werden — `BookingForm.tsx` liest die Werte bereits über die Server-Function.