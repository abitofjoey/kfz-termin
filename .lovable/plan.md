# Neuss: Texte laut Bestätigungsmail des Kreises

Nur Neuss. Köln, Bonn und Recklinghausen bleiben Wort für Wort gleich. Neuss bleibt verborgen, keine Veröffentlichung.

## 1. Neuer Hinweis unter der Terminnummer (`mail.referenceHint`)
- Neues optionales Feld `referenceHint` in der Stadt-Konfiguration, nur bei Neuss gesetzt:
  „Mit dem QR-Code aus der Mail des Kreises oder deinem Geburtsdatum meldest du dich vor Ort am Check-in-Terminal an."
- Anzeige in der Terminmail („Termin gefunden") klein direkt unter der Zeile mit der Terminnummer. Ohne Feld (andere Städte) erscheint nichts.

## 2. Ablauf vor Ort (`mail.onSiteSteps`) ersetzen
Die bisherigen 4 Schritte werden durch deine 5 Schritte ersetzt, fett wie angegeben. Der alte Platzhalter für die Terminnummer im Ablauf entfällt, weil er in den neuen Texten nicht vorkommt.

## 3. `mail.cityConfirmationNote` und `mail.calendarCheckIn`
Beide wörtlich durch deine Texte ersetzt (Hinweis mit QR-Code; Kalendereintrag „Termin am Terminal aktivieren …, frühestens 30 Min. vorher.").

## 4. FAQ Nr. 2
Antwort auf „Warum fragt ihr nach meinem Geburtsdatum?" wörtlich ersetzt.

## Tests
- Neue Prüfungen in `neuss.test.ts`: die fünf Schritte, Hinweis, Kalendertext, FAQ-Antwort, und dass die Terminmail für Neuss den Hinweis unter der Terminnummer enthält, für Bonn nicht.
- Alle bestehenden Tests bleiben grün.

## Technische Details
- `src/lib/cities.ts`: Typ `mail.referenceHint?: string`, Neuss-Werte.
- `src/lib/email-templates/booking-found*.tsx` (Kundenmail): Hinweis rendern, wenn gesetzt.
- `src/content/cities/neuss.ts`: FAQ 2.
