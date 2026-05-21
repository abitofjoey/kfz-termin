## Änderungen in `src/components/landing/Faq.tsx`

### Bestehende Antwort aktualisieren
„Wie schnell bekomme ich einen Termin?" → neue Antwort:
„Termine bei der Kölner Zulassungsstelle sind immer 14 Tage im Voraus buchbar – täglich kommen neue Slots dazu, manchmal sogar für denselben Tag. Wir prüfen das automatisch für Sie und buchen den ersten freien Termin an einem Ihrer Wunschtage. Je mehr Tage Sie auswählen, desto höher die Erfolgswahrscheinlichkeit."

### Vier neue FAQ-Einträge hinzufügen
Eingefügt im bestehenden `items`-Array (sinnvolle Reihenfolge: nach „Lohnt sich der Service für mich?"):

1. **„Kann ich meinen Termin auch selbst online buchen?"** — Antwort wie vom Nutzer angegeben.
2. **„Kann ich meinen Termin auch telefonisch buchen?"** — Antwort wie angegeben (0221 / 221-26635).
3. **„Gibt es Anliegen die ich ohne Termin erledigen kann?"** — Antwort mit Servicezeiten der Kurzanliegen.
4. **„Was muss ich zum Termin mitbringen?"** — Antwort inkl. 30-Minuten-Verspätungshinweis.

### Nicht angefasst
Alle anderen Komponenten, Styling, Routing, Backend.
