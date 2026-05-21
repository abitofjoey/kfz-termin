## Änderungen

### 1. `src/components/landing/BookingForm.tsx` (Kalender-Bereich)
- `maxDate = today + 21 Tage` einführen; Calendar `disabled` erweitern: `date < minDate || date > maxDate || Wochenende`. `endMonth={maxDate}` setzen, damit nicht weitergeblättert werden kann.
- Permanenter Hinweistext unter dem Kalender (immer sichtbar): „Für den frühestmöglichen Termin einfach alle Tage auswählen. Je mehr Tage Sie wählen, desto höher die Erfolgswahrscheinlichkeit."
- Roter Hinweis solange `<5` Tage gewählt: „Bitte wählen Sie mindestens 5 Wunschtage." (ersetzt/ergänzt die bisherige Zod-Fehleranzeige, immer sichtbar bis Bedingung erfüllt).
- Submit-Button: `disabled = submitting || selectedDates.length < 5`.
- Einmaliges Toast-Popup (sonner) wenn erstmals ein Tag mit `> heute + 14 Tage` ausgewählt wird: ein `useRef`-Flag pro Session verhindert Wiederholung. Im `onSelect` der Calendar-Controller-Komponente prüfen. Text: „📅 Termine bei der Kölner Zulassungsstelle werden immer 14 Tage im Voraus freigegeben. Sobald an diesem Tag ein Termin verfügbar wird, buchen wir automatisch den ersten freien Slot für Sie. Möchten Sie einen kurzfristigen Termin? Wählen Sie zusätzlich Tage innerhalb der nächsten 14 Tage."
- Bestehender `hasShortNotice`-Hinweis (3 Tage) bleibt unverändert.

### 2. `src/components/landing/Steps.tsx` (Schritt 3)
- Text von Schritt 3 ergänzen: „Täglich 7–18 Uhr. Termine sind immer 14 Tage im Voraus buchbar – täglich kommen neue dazu. Wir prüfen das automatisch für Sie."

### 3. `src/components/landing/Faq.tsx`
- Antwort auf „Wie schnell bekomme ich einen Termin?" ersetzen durch: „Das hängt von Ihrer Auswahl ab. Termine sind bei der Kölner Zulassungsstelle immer 14 Tage im Voraus buchbar und werden täglich neu freigegeben. Wir prüfen das automatisch und buchen den ersten passenden Slot an einem Ihrer Wunschtage. Je mehr Tage Sie auswählen, desto schneller geht es."
- Neue FAQ direkt danach einfügen: „Lohnt sich der Service für mich?" — „Ja – besonders wenn Sie einen konkreten Wunschtermin haben, einen früheren Termin als aktuell verfügbar suchen, oder einfach keine Zeit haben täglich selbst nachzuschauen. Übrigens: Manchmal sind auf der Seite der Zulassungsstelle spontan freie Termine sichtbar – schauen Sie gerne selbst nach, bevor Sie buchen."

### Nicht angefasst
Backend-Validierung (`selected_dates` min 5 bleibt), restliches Formular, Styling, Routing.
