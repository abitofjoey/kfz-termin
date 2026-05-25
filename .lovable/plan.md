## Ziel
Tonalität und Rechtschreibung in den Schritten (Steps) und Hinweisen (Hero, BookingForm, Pricing) vereinheitlichen – sachlich, freundlich-professionell, durchgängiges „Sie", korrekte Typografie (Gedankenstriche, Auslassungspunkte, geschütztes Leerzeichen vor €).

## Änderungen

### src/components/landing/Steps.tsx
- Schritt 1: „Formular in 2 Minuten ausfüllen und Wunschtage wählen." → „Formular in rund 2 Minuten ausfüllen und Wunschtage auswählen."
- Schritt 2: „Kreditkarte oder PayPal via Stripe." → „Sichere Zahlung per Kreditkarte oder PayPal über Stripe."
- Schritt 3: Text bleibt inhaltlich, aber geglättet: „Neue Termine sind oft innerhalb von Minuten vergeben – unser System prüft die Verfügbarkeit automatisch, rund um die Uhr."
- Schritt 4: „Automatische Mail der Zulassungsstelle Köln sobald Termin reserviert." → „Sobald ein Termin reserviert ist, erhalten Sie eine automatische E-Mail der Zulassungsstelle Köln."
- Schritt 5: „Innerhalb 3 Stunden per Klick in der Mail bestätigen – sonst verfällt der Termin." → „Bitte bestätigen Sie den Termin innerhalb von 3 Stunden per Klick in der E-Mail – andernfalls verfällt die Reservierung."
- Untertitel: „In fünf einfachen Schritten zu Ihrem Termin bei der Kölner Zulassungsstelle." (bleibt, ist bereits sauber)

### src/components/landing/Hero.tsx
- Subline: „Neue Termine sind oft in Minuten weg – unser System prüft automatisch, rund um die Uhr. Für nur 19€, ohne Stress und ohne täglich selbst nachschauen zu müssen." → „Neue Termine sind oft innerhalb von Minuten vergeben – unser System prüft die Verfügbarkeit automatisch, rund um die Uhr. Für nur 19 €, ohne Stress und ohne tägliches Nachschauen."

### src/components/landing/BookingForm.tsx
- Wichtig-Hinweis: „Sobald wir einen Termin gefunden haben, erhalten Sie eine E-Mail mit einem Bestätigungslink. Diesen müssen Sie innerhalb von 3 Stunden anklicken – sonst verfällt der Termin unwiderruflich." → „Sobald wir einen Termin gefunden haben, erhalten Sie eine E-Mail mit einem Bestätigungslink. Bitte klicken Sie diesen innerhalb von 3 Stunden an – andernfalls verfällt der Termin unwiderruflich."
- Kurzfrist-Hinweis: „Termine in den nächsten 3 Tagen sind sehr selten verfügbar. Wir empfehlen zusätzlich Tage weiter in der Zukunft auszuwählen." → „Termine in den nächsten 3 Tagen sind nur selten verfügbar. Wir empfehlen, zusätzlich weitere Tage in der Zukunft auszuwählen."
- FIN-Hinweis: „Die letzten 4 Ziffern finden Sie in Ihren Fahrzeugdokumenten (Fahrzeugschein / Fahrzeugbrief)." → „Die letzten 4 Zeichen finden Sie in Ihren Fahrzeugdokumenten (Fahrzeugschein oder Fahrzeugbrief)." (FIN enthält Buchstaben und Zahlen → „Zeichen" statt „Ziffern")
- Label „FIN – letzte 4 Ziffern" → „FIN – letzte 4 Zeichen"
- Zod-Fehlertext: „Genau 4 Zeichen (Buchstaben oder Zahlen)" bleibt.
- Zod-Fehlertext Wunschtage: „Bitte wählen Sie mindestens 5 Wunschtage für eine realistische Erfolgschance." → „Bitte wählen Sie mindestens 5 Wunschtage aus, um die Erfolgschance zu erhöhen."
- Button-Text: „Jetzt für 19€ buchen" → „Jetzt für 19 € buchen"
- Fußnote: „19,00 € inkl. aller Gebühren, keine USt. · Sichere Zahlung via Stripe · Bestätigungsmail direkt nach Buchung" → „19,00 € inkl. aller Gebühren (keine USt.) · Sichere Zahlung über Stripe · Bestätigungs-E-Mail direkt nach der Buchung"

### src/components/landing/Pricing.tsx
- Untertitel: „Wählen Sie Ihre Dienstleistung – einheitlicher Preis, keine versteckten Kosten." (bleibt)
- Features-Liste bleibt unverändert (bereits sauber).

## Nicht im Scope
Keine Logik-, Layout- oder Designänderungen. Reine Text-/Typografie-Politur.