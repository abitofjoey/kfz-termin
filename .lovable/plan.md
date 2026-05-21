## Ziel
Kunden-Bestätigungsmail (`booking-confirmation.tsx`) um alle eingetragenen Buchungsdaten + kurzen Prüfhinweis erweitern.

## Was ergänzt wird

**1. Neue Props im Template** (Server liefert sie bereits via `templateData`):
- `email`, `phone`, `notes`

**2. Erweiterung der Datenkarte** (im bestehenden `card`-Block):
- Anrede + Vorname + Nachname (eigene Zeile)
- E-Mail
- Telefon
- Service *(bereits vorhanden)*
- FIN (letzte Ziffern) *(bereits vorhanden)*
- Anmerkungen (nur wenn vorhanden)
- Gewünschte Termine *(bereits vorhanden)*

**3. Neuer Hinweis-Block** direkt unter der Karte, im Stil des bestehenden `footerHint` (aber als Warnhinweis, leicht abgesetzt – z. B. heller Gelbton):

> **Bitte prüfen Sie Ihre Angaben.** Sollten Name, E-Mail oder FIN nicht korrekt sein, kann die Bestätigung der Zulassungsstelle Sie nicht erreichen oder Ihre Zulassung vor Ort abgewiesen werden. Antworten Sie in diesem Fall einfach auf diese E-Mail.

## Was nicht geändert wird
- Interne Benachrichtigungsmail an dich – die enthält bereits alle Felder.
- Server-Code (`stripe.functions.ts`) – `templateData` enthält schon alles Nötige.
- `previewData` wird um `email`, `phone`, `notes` ergänzt, damit der Lovable-Dashboard-Preview die neuen Felder zeigt.

## Betroffene Datei
- `src/lib/email-templates/booking-confirmation.tsx` (einzige Änderung)