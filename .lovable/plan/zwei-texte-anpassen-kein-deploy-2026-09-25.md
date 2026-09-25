# Zwei Texte anpassen (kein Deploy)

Nur zwei Textblöcke ändern, Design/Farben/Icons bleiben unverändert.

## 1. `src/routes/buchung-erfolgreich.tsx` – gelber Warnkasten (AlertTriangle)

Absatz im `<p>` innerhalb der Warnbox ersetzen durch:

> `<strong>Wichtig:</strong> Sobald wir einen Termin gefunden haben, bekommst du zwei E-Mails: eine von uns mit Datum und Uhrzeit und eine von der Zulassungsstelle Köln mit einem Bestätigungslink. Diesen Link musst du <strong>innerhalb von 3 Stunden</strong> anklicken – sonst verfällt der Termin unwiderruflich. Bitte schau dann auch in deinen Ordnern <strong>Spam</strong> und <strong>Werbung</strong> nach, automatische E-Mails landen dort manchmal.`

Die bestehenden Klassen (`border-warning-border bg-warning text-warning-foreground`) und das Icon bleiben unverändert.

## 2. `src/lib/email-templates/booking-confirmation.tsx` – infoBox „🕐 So läuft es ab"

Ersten Textblock ersetzen durch:

> `Sobald wir einen passenden Termin gefunden haben, bekommst du zwei E-Mails: eine von uns mit Datum und Uhrzeit und eine von der Zulassungsstelle mit einem Bestätigungslink. <strong>Du hast dann 3 Stunden Zeit, den Termin über diesen Link zu bestätigen</strong> – andernfalls verfällt er unwiderruflich.`

Direkt darunter (gleiche infoBox, zweiter `<Text style={infoText}>`):

> `<strong>Wichtig:</strong> Schau in dieser Zeit bitte auch in deine Ordner Spam und Werbung. Automatische E-Mails landen dort manchmal.`

Styles (`infoBox`, `infoTitle`, `infoText`) bleiben unverändert.

## Technische Hinweise
- Keine Migration, keine weiteren Dateien.
- Nach Umsetzung: Typprüfung, Diff zeigen. Kein Deploy.
