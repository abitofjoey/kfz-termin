## Ziel
Im Buchungsformular können bis zu **3 Fahrzeuge** pro Termin angegeben werden. Feld 1 bleibt Pflicht, Felder 2 und 3 sind optional und werden per Klick eingeblendet.

## UX-Empfehlung: Progressive Disclosure mit "+ Weiteres Fahrzeug hinzufügen"

**Empfohlen:** Nur Feld 1 sofort sichtbar. Darunter Hinweistext *"Bis zu 3 Fahrzeuge pro Termin möglich"* + Button **"+ Weiteres Fahrzeug hinzufügen"**. Beim Klick erscheint Feld 2 mit "✕ Entfernen", danach Feld 3.

**Warum nicht alle 3 Felder direkt anzeigen:**
- Die große Mehrheit hat nur 1 Fahrzeug → 3 leere Felder wirken einschüchternd und suggerieren fälschlich Pflicht
- Klare visuelle Hierarchie: Das Wesentliche zuerst, Erweitertes auf Wunsch
- Entspricht etablierter Praxis (Booking.com, Airbnb für zusätzliche Gäste, etc.)
- Der Hinweistext löst die Discoverability-Sorge: Nutzer **wissen**, dass mehr möglich ist

**Warum nicht 3 Felder mit "(optional)"-Label:**
- Funktioniert, ist aber visuell schwerer und weniger elegant
- Mehr Scrollen, höhere wahrgenommene Komplexität

## Umsetzung

### 1. Datenbank-Migration
Neue Spalten in `bookings`:
- `fin_2 text NULL`
- `fin_3 text NULL`

(Beide nullable, kein Default. Keine RLS-Änderungen nötig — die bestehende INSERT-Policy prüft nur Name/Email/paid/status.)

### 2. Frontend `src/components/landing/BookingForm.tsx`
- Schema erweitern: `fin_1` (Pflicht, 4 Zeichen), `fin_2` und `fin_3` optional mit gleicher Regex aber `.optional().or(z.literal(""))`.
- Lokaler State `vehicleCount` (1–3) steuert sichtbare Felder.
- Feld 1: Label *"FIN Fahrzeug 1 – letzte 4 Zeichen"*. Hinweistext: *"Bis zu 3 Fahrzeuge pro Termin möglich. Die FIN findest du im Fahrzeugschein."*
- Unter dem letzten sichtbaren FIN-Feld:
  - Wenn `vehicleCount < 3`: Button **"+ Weiteres Fahrzeug hinzufügen"** (Variant `outline`, dezent).
  - Bei zusätzlichen Feldern: kleiner **"✕ Entfernen"**-Link rechts oben am Feld (setzt Wert auf "" und reduziert Count).
- Submit übergibt `fin_2`/`fin_3` nur wenn nicht leer.

### 3. Server `src/lib/booking.functions.ts`
- Schema um `fin_2`/`fin_3` als optionale 4-Zeichen-Strings erweitern.
- Beim Insert: `fin_2: data.fin_2?.toUpperCase() ?? null`, gleich für fin_3.

### 4. Stripe / Mail-Übergabe `src/lib/stripe.functions.ts`
- `finEnding` umbenennen bzw. ergänzen: an Mail-Templates jetzt ein Array oder kombinierter String übergeben, z.B. `finEndings: [booking.fin_1, booking.fin_2, booking.fin_3].filter(Boolean)`.

### 5. Mail-Templates
- `src/lib/email-templates/booking-confirmation.tsx`: Prop `finEndings: string[]`. Zeile "FIN (letzte 4 Ziffern)" rendert je Fahrzeug eine Zeile bzw. komma-getrennt, z.B. *"4F8K, 9X2P"* — bei 1 Fahrzeug unverändertes Verhalten. Hinweistext anpassen: *"Sollten Name, E-Mail oder eine der FIN nicht korrekt sein..."*.
- `src/lib/email-templates/booking-internal-notification.tsx`: gleiche Anpassung, intern listen wir alle FIN klar untereinander.
- `previewData` in beiden Templates auf `finEndings: ['1234']` bzw. Beispiel mit 2 Einträgen aktualisieren.

### 6. FAQ `src/components/landing/Faq.tsx`
- Bestehende FIN-Frage Antwort ergänzen um den Hinweis: *"Pro Termin können bis zu 3 Fahrzeuge angemeldet werden – du kannst im Buchungsformular weitere FIN-Felder hinzufügen."*
- Optional neue Frage: *"Kann ich mehrere Fahrzeuge in einem Termin anmelden?"* mit Antwort, dass bis zu 3 Fahrzeuge pro Termin möglich sind und die Pauschale von 9,99 € unverändert gilt.

### 7. Nicht betroffen
- Stripe-Preis bleibt 9,99 € pro Buchung (Termin), unabhängig von Fahrzeuganzahl — sofern das deine Absicht ist. **Frage:** Soll der Preis pro Fahrzeug skalieren oder pauschal pro Termin bleiben?
- GA4/GTM-Tracking unverändert (eine Buchung = ein purchase-Event).

## Offene Fragen
1. **Preisgestaltung:** Pauschal 9,99 € egal wie viele Fahrzeuge, oder z. B. 9,99 € + 4,99 € pro weiterem Fahrzeug?
2. **Neue FAQ-Frage** zusätzlich zur Ergänzung der bestehenden — ja oder reicht die Ergänzung?
