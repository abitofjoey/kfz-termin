## Rechtliche Klärung: Wann erlischt das Widerrufsrecht?

Nach **§ 356 Abs. 4 BGB** erlischt das Widerrufsrecht bei einer Dienstleistung **nicht schon mit dem Beginn der Ausführung**, sondern erst, wenn **alle** drei Voraussetzungen erfüllt sind:

1. Der Unternehmer hat die Dienstleistung **vollständig erbracht**.
2. Der Verbraucher hat **vor** Beginn der Ausführung **ausdrücklich zugestimmt**, dass mit der Ausführung vor Ablauf der Widerrufsfrist begonnen wird.
3. Der Verbraucher hat seine **Kenntnis bestätigt**, dass er das Widerrufsrecht **mit vollständiger Vertragserfüllung verliert**.

Konkret für kfz-termin.online: Solange nur „gesucht" wird und noch kein Termin gebucht ist, **bleibt das Widerrufsrecht bestehen** – der Kunde kann widerrufen, schuldet aber Wertersatz für die bereits erbrachte Sucharbeit (§ 357a Abs. 2 BGB). Erst mit dem **erfolgreich gebuchten Termin** (vollständige Erbringung, vgl. AGB § 6) erlischt das Widerrufsrecht.

## Status der vorhandenen Inhalte

- **AGB (`src/routes/agb.tsx` § 7, Zeilen 98–146)**: rechtlich **korrekt formuliert** – nennt ausdrücklich „mit vollständiger Erbringung der Leistung erlischt" und differenziert sauber zwischen Widerruf vor / während / nach der Suche.
- **Bestätigungs-E-Mail (`src/lib/email-templates/booking-confirmation.tsx` Zeilen 111–117)**: ebenfalls **korrekt** – „erlischt mit vollständiger Erbringung der Leistung (gebuchter Termin)".
- **Checkbox im Buchungsformular (`src/components/landing/BookingForm.tsx` Zeile 316)**: **juristisch falsch** in der aktuellen Kurzfassung („damit entfällt"), weil sie suggeriert, dass das Widerrufsrecht bereits mit Beginn der Suche erlischt. Das genügt zudem nicht den formalen Anforderungen an die Zustimmungs- und Kenntnisnahmeerklärung nach § 356 Abs. 4 BGB.

## Änderung

Nur **eine Zeile** im Buchungsformular zurück auf die rechtlich saubere Langfassung setzen, identisch mit dem in der AGB § 7 zitierten Wortlaut:

**`src/components/landing/BookingForm.tsx`, Zeile 316** – ersetzen durch:

> „Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB)."

AGB und E-Mail-Templates bleiben unverändert, da bereits korrekt.

## Kein Handlungsbedarf an

- `src/routes/agb.tsx`
- `src/lib/email-templates/booking-confirmation.tsx`
- `src/routes/buchung-erfolgreich.tsx` / FAQ (betreffen nur den 3-Stunden-Bestätigungslink der Zulassungsstelle, nicht das Widerrufsrecht)
