# Preis auf 9,99 € senken (alle Städte)

## 1. Preis
- In der Stadt-Konfiguration den Grundpreis von 12,99 € auf **9,99 €** setzen. Köln, Bonn, Recklinghausen und Neuss hängen daran. Alle Texte laufen weiter über die zentrale Preisformatierung.

## 2. Checkout bei offenen, unbezahlten Buchungen
- Beim Betrag für den Checkout gilt künftig: Ist die Buchung **unbezahlt**, zählt der kleinere Wert aus dem gespeicherten Betrag und dem aktuellen Stadtpreis. Ist der aktuelle Preis kleiner, wird der gespeicherte Betrag der Buchung auf 9,99 € nachgetragen (wie beim bisherigen Nachtrag für leere Beträge).
- Bezahlte Buchungen werden nie angefasst; der Checkout lehnt sie schon heute ab. Erstattungen nutzen weiter den tatsächlich bezahlten Betrag.
- Folge: Wer jetzt 9,99 € gespeichert hat, bleibt bei 9,99 €. Würde der Preis später wieder steigen, zahlen offene Buchungen weiterhin ihren alten, niedrigeren Betrag.

## 3. Tests
- Preis-, Neuss- und Recklinghausen-Tests erwarten 999 bzw. „9,99 €".
- Neu: unbezahlte Buchung mit 1299 → Checkout 999 und Nachtrag; Buchung mit 999 → 999 ohne Nachtrag; Buchung ohne Betrag → 999 mit Nachtrag.

## 4. Suche nach „12,99"
- Im Code steht „12,99 €" fest nur in einem Kommentar der Preisformatierung (wird angepasst) und in den Tests. Nach der Änderung prüfe ich in der Vorschau die gerenderten Seiten: Startseite, alle vier Stadtseiten (inkl. FAQ, Meta-Title/-Description, JSON-LD-Preis), AGB, außerdem die Vorschauen der Bestätigungsmail und der internen Mail sowie die Stripe-Produktbeschreibung. Treffer liste ich auf.

## 5. Umsatzsteuer
- Die Regel ab 1.1.2027 bleibt unverändert; dann erscheint automatisch „9,99 € inkl. 19 % USt.".

## 6. Nach dem Veröffentlichen
- Ohne Anmeldung /koeln, /bonn, /recklinghausen und /neuss auf der Live-Seite öffnen und prüfen, dass überall 9,99 € steht.
- Stripe-Checkout: Um die Bezahlseite zu sehen, muss eine echte Buchung angelegt werden. Ich lege dafür eine Köln-Testbuchung mit Testdaten an, öffne nur die Stripe-Seite und lese den Betrag ab, ohne zu bezahlen. Die Buchung bleibt unbezahlt, löst keine Mail aus, erreicht das Script nicht und wird nach 30 Tagen automatisch gelöscht. Alternativ kannst du den Checkout selbst prüfen.

Veröffentlicht wird nach grünen Tests.
