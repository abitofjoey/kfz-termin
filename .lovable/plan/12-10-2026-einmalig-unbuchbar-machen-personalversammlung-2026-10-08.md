# 12.10.2026 einmalig unbuchbar machen (Personalversammlung)

Die Zulassungsstelle ist am Montag, 12.10.2026 geschlossen. Dieser Tag soll im Buchungskalender nicht wählbar sein und Buchungen mit diesem Wunschtag sollen abgelehnt werden.

## Umsetzung

1. **`src/lib/booking.functions.ts` – `getCalendarBounds`**
   - Zusätzlich zur bisherigen Antwort eine Liste gesperrter Tage zurückgeben: `blockedDatesISO: ["2026-10-12"]` (als Konstante, damit weitere Sperrtage später leicht ergänzbar sind).

2. **`src/components/landing/BookingForm.tsx` – Kalender**
   - `blockedDatesISO` aus den Bounds lesen und in lokale Dates umwandeln.
   - In der `disabled`-Prüfung des Kalenders zusätzlich sperren, wenn das Datum in der Sperrliste ist. Der 12.10. erscheint dann ausgegraut wie Wochenenden.

3. **`src/lib/booking.functions.ts` – `createBooking` (Absicherung serverseitig)**
   - Beim Absenden prüfen: Enthält `selected_dates` ausschließlich gesperrte Tage bzw. einen gesperrten Tag, wird die Buchung mit einer freundlichen Fehlermeldung abgelehnt („Am 12.10.2026 ist die Zulassungsstelle geschlossen..."). So kann der Tag auch nicht über einen alten Browser-Stand oder direkten Aufruf gebucht werden.
   - Verhalten: Wenn der Nutzer mehrere Tage gewählt hat und nur einer davon der 12.10. ist, wird die Buchung ebenfalls abgelehnt mit dem Hinweis, den Tag zu entfernen – so bleibt die Regel eindeutig.

## Technische Details

- Keine Datenbank-Migration nötig, keine Änderung an bestehenden Buchungen.
- Bestehende Logik (14-Uhr-Cutoff, 14-Tage-Fenster, Wochenend-Sperre) bleibt unverändert.
- Sperrliste als Konstante `BLOCKED_DATES` in `booking.functions.ts`, damit der Tag nach dem 12.10. leicht wieder entfernt werden kann.
- Prüfung mit `bunx tsgo --noEmit`; Sichtprüfung im Preview, dass der 12.10. ausgegraut ist.
- Nicht deployen.
