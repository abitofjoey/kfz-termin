# Mehrstädte-Check und Aufräumen

Ziel: Weitere Städte brauchen nur noch Einstellungen und Inhalte. Köln und Bonn bleiben inhaltlich gleich. Es wird erst veröffentlicht, wenn du die Ergebnisliste gesehen hast.

## Vorher-Aufnahme (Grundlage für den Vergleich)
- Vor jeder Änderung wird das fertige HTML aller Seiten gespeichert (/, /koeln, /bonn, Rechtstexte, Kundenseiten mit Köln- und Bonn-Buchung). Dazu kommen alle 25 Kundenmails und die internen Mails mit Beispieldaten (Köln, Bonn Kfz, Bonn Führerschein).
- Nach dem Umbau wird alles erneut erzeugt und verglichen. Erwartet ist „identisch“. Ausnahmen: die bewusst neue Rechtstexte-Quelle mit gleichem Wortlaut und /llms.txt.

## A. Fest eingebaute Stadttexte in die Konfiguration
1. **Steps, BookingForm, Pricing:** Texte mit Stadt, Behörde oder Frist kommen nach `content/cities/koeln.ts` bzw. aus `cities.ts` (name, adjective, authorityName, customerConfirmationHours). Die Komponenten enthalten danach keinen Stadtnamen mehr. Für Köln bleibt jedes Zeichen gleich.
2. **Mails:** Jede feste Angabe „3 Stunden“ in den sechs genannten Vorlagen nutzt künftig `customerConfirmationHours`. Fehlt dieser Wert (Bonn), wird der Satz weggelassen bzw. die bestehende Bonn-Variante verwendet. „Zulassungsstelle“ in Kundenmails wird durch die Behördenbezeichnung der Stadt ersetzt. Ist für Bonn-Führerscheinanliegen eine eigene Bezeichnung nötig, kommt sie als neues Feld je Kategorie dazu. Für Köln bleibt die Ausgabe gleich.
3. **checkout-amount.ts:** Die Sonderregel für Köln wird durch das neue Feld `checkoutDescription` in `cities.ts` ersetzt. Der Köln-Text bleibt gleich.
4. **Brand.tsx:** Es gibt keinen Standardwert „Köln“ mehr. Ohne Stadt steht dort nur „KFZ-Termin“. Alle Aufrufer werden geprüft, damit Köln-Seiten weiter „Köln“ zeigen.
5. **Rechtstexte:** Eine neue Konstante in `src/content/legal/cities.ts` enthält die Liste der Behörden und das eigene Stand-Datum. Sie wird in AGB, Datenschutz und Widerrufsbelehrung (Seite und Mail) verwendet. Sie wird bewusst nicht aus `launchedCities()` erzeugt.
6. **/llms.txt:** Eine erzeugte Route ersetzt `public/llms.txt`. Sie enthält einen festen allgemeinen Teil und je gestarteter Stadt: Behörde, Suchzeiten, Bestätigungsregel, Anliegen und Preis aus der Konfiguration. Die statische Datei wird gelöscht.
7. **og-image:** Die Startseite nutzt `/og-image.jpg`. Ich sehe mir das Bild an und melde dir, ob darauf Köln zu sehen ist. Am Bild selbst ändere ich nichts.

## B. Prüfung (Ergebnisliste für dich, ohne Codeänderung)
8. Alle 25 Kundenmails werden für Köln, Bonn Kfz und Bonn Führerschein erzeugt. Für jede Mail zeige ich den Betreff und die Stellen mit Stadt, Behörde oder Frist. Alles, was für Bonn falsch oder kölnspezifisch ist, wird markiert.
9. Interne Mails (neue Buchung, Fehler, Health-Check, Tagesstatus, Notbetrieb): Ich prüfe, ob [Köln]/[Bonn] im Betreff steht und ob Standort, Aufrufnummer und „finanziert“ enthalten sind.
10. Admin-Bereich: Im Projekt habe ich keine eigene Admin-Seite gefunden. Ich prüfe, wo Buchungen verwaltet werden, und melde den Befund: Stadt-Spalte und Filter, Bonn-Felder, ob die Erstattung für Bonn genauso abläuft. Fehlt etwas, kommt es auf die Liste, wird aber nicht gebaut.
11. /buchung-erfolgreich, /buchung-abgebrochen, /termine-aendern, /email-aendern und /widerruf werden mit einer Bonn-Testbuchung bzw. ?city=bonn aufgerufen. Ich prüfe die Texte auf Screenshots.

Gefundene Fehler aus B werden nur aufgelistet und nicht automatisch behoben, außer sie gehören direkt zu den Punkten unter A.

## C. Dokumentation
12. Neue Datei `docs/neue-stadt.md` mit einer Checkliste in 6 Schritten (wie von dir beschrieben). Jedes Feld in `cities.ts` wird mit seiner Bedeutung erklärt. `AGENTS.md` bekommt einen Verweis darauf und eine Regel für die Rechtstexte-Konstante.

## Abschluss
Typprüfung, alle Tests und neue Tests: keine Stadtnamen in den Komponenten, Köln-Frist aus der Konfiguration, /llms.txt enthält nur gestartete Städte. Danach kommen der Vorher/Nachher-Vergleich und die Ergebnisliste zu B. Dann warte ich auf dich, nichts wird veröffentlicht.
