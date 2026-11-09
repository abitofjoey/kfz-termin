# Buchungsbestätigung: Rechtstexte optisch zurücknehmen (Köln und Bonn)

Es gibt kein PDF und keinen Anhang. Der Wortlaut bleibt vollständig gleich, nur die Anordnung und die Optik ändern sich.

## Änderungen in der Mail „Deine Buchung … ist bestätigt"
1. Die Box „Widerrufsbelehrung" an ihrer bisherigen Stelle behält nur:
   - den Bestätigungs-Absatz („Du hast vor der Buchung ausdrücklich verlangt …"), unverändert
   - den Link zum Online-Widerruf (https://kfz-termin.online/widerruf), unverändert
2. Die vollständige Widerrufsbelehrung mit Stand, Muster-Widerrufsformular und dem AGB-Link wandert ganz ans Ende, nach „Bei Fragen …", der Kontaktadresse und dem Gruß:
   - eine Trennlinie
   - die Überschrift „Rechtliche Pflichtangaben"
   - der gesamte Text in grauer Schrift mit 12 px, ohne eigene Box; die Zwischenüberschriften bleiben fett, ebenfalls klein und grau
   - die Leerlinien im Formular bleiben, aber ebenfalls klein und grau
3. Das gilt für Köln und Bonn gleich. Alle anderen Teile der Mail bleiben unverändert.

## Prüfung
- Ein Vergleich vorher/nachher: Jeder Satz der Belehrung und des Formulars steht weiterhin in der Mail (Textvergleich).
- Vorschau der Mail für Köln und Bonn als Screenshot.
- Typprüfung und Tests.
- Nicht veröffentlichen.

## Technisch
- Nur `src/lib/email-templates/booking-confirmation.tsx`: Den Block mit der Belehrung in eine eigene Section unter dem Gruß verschieben, mit neuen Stil-Konstanten (12 px, #6b7280) und einer Trennlinie (`Hr`).
