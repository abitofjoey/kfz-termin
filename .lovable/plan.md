## Problemstellung
Die Checkbox im Buchungsformular und die AGB sind rechtlich inkonsistent:

1. **Falscher Paragraph**: Die Checkbox referenziert § 356 Abs. 5 BGB, die AGB korrekt § 356 Abs. 4 BGB.
2. **Ungenauer Checkbox-Text**: Die Checkbox enthält eine verkürzte, rechtlich problematische Formulierung (pauschaler "Verzicht"), die nicht mit den AGB übereinstimmt.

## Lösung
Beide Stellen auf die folgende einheitliche, kürzere Formulierung angleichen:

> „Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB)."

## Änderungen

### 1. `src/routes/agb.tsx`
- Die Zitat-Box in § 7 (Zeile 93–96) ersetzt die lange Version durch die kurze Version oben.
- Der erklärende Text drumherum bleibt unverändert.

### 2. `src/components/landing/BookingForm.tsx`
- Die Checkbox für `agree_waiver` (Zeile 305–306) wird ersetzt durch die kurze Version oben.
- Der Paragraph-Referenz wird korrigiert von Abs. 5 auf Abs. 4.

## Ergebnis
AGB und Checkbox enthalten dann identische, rechtssichere Formulierungen mit korrektem Paragraphen (§ 356 Abs. 4 BGB).