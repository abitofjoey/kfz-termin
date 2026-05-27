## Änderungen

### 1) Formulierungen zur Suchzeit vereinheitlichen → „täglich von 7 bis 18 Uhr"

Ersetzt werden nur Stellen, die sich auf die **Suchzeit** beziehen. Allgemeine „automatisch"-Stellen (z. B. automatische Buchung, automatische Bestätigungs-E-Mail der Zulassungsstelle, Stripe-Quittung) und „jederzeit" im Kontext von Cookie-Einwilligung/Widerruf bleiben unverändert.

- `src/components/landing/Hero.tsx`
  - Zeile 19–20: „prüft die Verfügbarkeit automatisch, rund um die Uhr." → „prüft die Verfügbarkeit täglich von 7 bis 18 Uhr."
  - Zeile 39 (Badge): „Suche rund um die Uhr" → „Suche täglich von 7 bis 18 Uhr"
  - Zeile 15 („automatisch gebucht.") bleibt – bezieht sich auf das Buchen, nicht auf die Suchzeit.
- `src/components/landing/Pricing.tsx`
  - Zeile 10: „Suche rund um die Uhr" → „Suche täglich von 7 bis 18 Uhr"
- `src/components/landing/Steps.tsx`
  - Zeile 20: „… unser System prüft die Verfügbarkeit automatisch, rund um die Uhr." → „… unser System prüft die Verfügbarkeit täglich von 7 bis 18 Uhr."
  - Zeile 26 („automatische E-Mail der Zulassungsstelle") bleibt – Mail-Versand, keine Suchzeit.
- `src/components/landing/Faq.tsx`
  - Zeile 11: „Unser Service übernimmt die tägliche Suche automatisch für dich." → „Unser Service prüft täglich von 7 bis 18 Uhr für dich."
  - Zeile 15: „Wir prüfen das automatisch für dich …" → „Wir prüfen das täglich von 7 bis 18 Uhr für dich …"
  - Zeilen 19, 27, 31 bleiben – beziehen sich nicht auf die Suchzeit.

Nicht angefasst (kein Suchzeit-Bezug): `__root.tsx`/`index.tsx` Meta-Descriptions („Automatische Terminsuche"), Datenschutz/Cookie-Texte mit „jederzeit", `stripe.functions.ts`, `buchung-abgebrochen.tsx`.

### 2) Hilfetext beim Telefonfeld im Buchungsformular

- `src/components/landing/BookingForm.tsx`: Das `<Field label="Telefonnummer" …>` erhält einen `hint`-Prop (wird bereits von der `Field`-Komponente unter dem Input gerendert):
  
  „Wir senden Ihnen eine SMS und E-Mail sobald ein Termin für Sie gefunden wurde – damit Sie die Bestätigungsmail rechtzeitig anklicken können."

### Hinweis
Die Texte verwenden ansonsten durchgängig „du"/„dich". Der vom Nutzer vorgegebene Hilfetext ist im „Sie"-Stil – ich übernehme ihn **wörtlich** wie angegeben. Sag Bescheid, falls ich ihn auf „du" umformulieren soll („Wir senden dir eine SMS und E-Mail, sobald ein Termin für dich gefunden wurde – damit du die Bestätigungsmail rechtzeitig anklicken kannst.").