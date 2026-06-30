## Ziel
Die Pflicht-Mindestanzahl an Wunschtagen von **3 auf 2** reduzieren – an allen Stellen, an denen die Zahl genannt oder validiert wird.

## Gefundene Stellen

1. **`src/components/landing/BookingForm.tsx`**
   - Zod-Validierung: `.min(3, "Bitte wähle mindestens 3 Wunschtage…")` → `.min(2, "Bitte wähle mindestens 2 Wunschtage…")`
   - Label: `"Wunschtermine (mindestens 3 Tage)"` → `"…(mindestens 2 Tage)"`
   - Info-Tooltip: `"…mindestens 3 Tage erforderlich."` → `"…mindestens 2 Tage erforderlich."`
   - Hinweistext unter dem Kalender (`selectedDates.length < 3` Logik + Texte „noch X weitere Tage") → Schwelle auf `2` ändern, Texte entsprechend anpassen.

2. **`src/lib/booking.functions.ts`** (Server-Validierung)
   - `selected_dates: z.array(z.string()).min(3).max(60)` → `.min(2).max(60)`
   - Wichtig, sonst lehnt der Server eine 2-Tage-Buchung ab, obwohl das Formular sie erlaubt.

3. **`src/components/landing/Faq.tsx`** (FAQ-Antwort)
   - „Es müssen mindestens 3 Tage ausgewählt werden…" → „Es müssen mindestens 2 Tage ausgewählt werden…"

## Bewusst NICHT geändert
- **`src/components/landing/Testimonials.tsx`**: „Termin in drei Tagen" – das bezieht sich auf die Wartezeit bis zum Termin, nicht auf die Mindestauswahl. Bleibt unverändert.
- **`BookingForm.tsx` Zeile 319** (`Math.min(3, c + 1)`): Limit für die FIN-Fahrzeug-Anzahl (max. 3 Fahrzeuge), unabhängig vom Datums-Thema. Bleibt unverändert.
- Der Kalender selbst (`mode="multiple"`, disabled-Range etc.) bleibt unangetastet – nur die Mindestanzahl-Logik darunter wird angepasst.

## Verifikation nach Umsetzung
- Build durchlaufen lassen.
- Im Preview prüfen: Mit 2 ausgewählten Tagen erscheint kein Fehler mehr, Submit funktioniert, FAQ zeigt „2".
