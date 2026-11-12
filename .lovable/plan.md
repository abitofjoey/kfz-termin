# Köln: kurzfristiger Tag nach 14 Uhr

## Was sich für Kunden ändert
- Köln ab 14 Uhr: Der morgige Tag ist im Kalender wieder wählbar, dezent markiert (gestrichelter Rand, Legende „kurzfristig“).
- Nur wenn er gewählt ist, erscheint unter dem Kalender der Hinweis „**Kurzfristig für morgen:** Die Chance ist gering …“ (Text wörtlich wie vorgegeben, gleicher Stil wie bestehende Hinweise).
- Ist nur morgen gewählt: Fehler „Für morgen ist die Chance gering – bitte wähle mindestens einen weiteren Wunschtag.“, Absenden gesperrt. „Ausgewählt: x Tage“ zählt ihn mit.
- Gleiches Verhalten auf der Seite „Termine ändern“ (neue Wunschtermine) für Köln-Buchungen.
- Vor 14 Uhr, Freitag nach 14 Uhr, Bonn, Recklinghausen, Mails, FAQ, Pi-Schnittstellen: unverändert.

## Umsetzung
1. `src/lib/cities.ts`: `CalendarRules.shortNoticeAfterCutoff?: boolean`, nur Köln `true`.
2. `src/lib/calendar-rules.ts`:
   - `computeCalendarBounds` liefert zusätzlich `shortNoticeDateISO` (heute + `minOffsetDays`, nur wenn Flag gesetzt, nach Cutoff, kein Wochenende bei `allowWeekends: false`, kein Sperrtag; sonst `null`). `minDateISO`/`maxDateISO` unverändert.
   - `areDatesAllowed`: kurzfristiger Tag erlaubt, wenn mindestens ein weiterer erlaubter Tag dabei ist.
   - Neuer kleiner Helfer `isShortNoticeOnly(dates, …)` für die konkrete Fehlermeldung.
3. Server:
   - Köln-Buchung (`booking.functions.ts`): prüft heute nur Sperrtage, nicht die Kalendergrenzen. Ich ergänze dort **nur** die neue Regel (nur kurzfristiger Tag → Fehler mit obigem Text), damit sich sonst nichts verschärft.
   - Neue Wunschtermine (`rebook.functions.ts`): nutzt bereits `areDatesAllowed`; bei „nur morgen“ kommt die neue Fehlermeldung.
   - Bonn/Recklinghausen-Weg (`city-booking.ts`): unverändert, da das Flag dort fehlt.
4. Oberfläche: `BookingForm.tsx` (Köln) und `termine-aendern.tsx` – Markierung, Hinweis, Fehler. `CityBookingForm.tsx` bleibt unberührt.
5. Tests (neue Datei) mit genau den genannten Fällen: Dienstag 15 Uhr, 10 Uhr, Freitag 15 Uhr, Bonn/Recklinghausen immer `null`, drei `areDatesAllowed`-Fälle; bestehende Tests bleiben grün.

Nicht veröffentlichen, bis du es sagst.
