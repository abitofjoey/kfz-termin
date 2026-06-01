## Hinweis zu Halter:in-Daten im Buchungsformular ergänzen

**Ziel:** Klar machen, dass alle eingegebenen Daten (Anrede, Vorname, Name, E-Mail, Telefon) die der **künftigen Halter:in des Fahrzeugs** sein müssen — nicht z. B. die einer dritten Person, die für jemanden bucht.

**Ort:** `src/components/landing/BookingForm.tsx`, direkt unter der Headline „Jetzt Termin buchen" und der bestehenden Unterzeile, vor dem `<form>`.

**Umsetzung:**
Eine dezente Info-Box (gleicher Stil wie der bestehende `warning`-Hinweis im Formular, mit `Info`-Icon) mit folgendem Text:

> **Wichtig:** Bitte gib die Daten der **künftigen Halterin / des künftigen Halters** des Fahrzeugs an (Anrede, Vor- und Nachname, E-Mail, Telefonnummer). Diese Angaben werden bei der Zulassungsstelle für die Terminbuchung verwendet.

Keine Änderung an Formularfeldern, Validierung oder Server-Logik — rein visueller, klärender Hinweis.
