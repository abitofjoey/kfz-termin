# Zwei kleine Verbesserungen: Erstattungs-Link und Zustandsreihenfolge

Nur die zwei genannten Änderungen, sonst nichts. Kein Deploy.

## 1. Link „Rückerstattung anfordern" öffnet die Rückfrage direkt

**`src/lib/email-templates/search-rebook-offer.tsx`**
- Der Link „Rückerstattung anfordern" bekommt eine eigene URL mit `&aktion=erstattung` angehängt. Der Button „Neue Termine wählen" bleibt ohne den Parameter.

**`src/routes/termine-aendern.tsx`**
- `validateSearch` nimmt zusätzlich den optionalen Parameter `aktion` an.
- Im Zustand „Auswahl" ist die Rückfrage („Möchtest du dir den vollen Betrag erstatten lassen?" mit „Ja, Geld zurück" / „Abbrechen") direkt aufgeklappt, wenn `aktion=erstattung` in der Adresse steht. Umsetzung: der Anfangswert von `confirmRefund` ist `aktion === "erstattung"`.
- Kalender und der Button „Neue Termine bestätigen" bleiben sichtbar. Ausgelöst wird die Erstattung weiterhin nur per Klick auf „Ja, Geld zurück".

## 2. Neue Reihenfolge der Zustände in `getRebookState`

**`src/lib/rebook.functions.ts`**
- Neue Reihenfolge der Prüfung:
  1. `refund_claimed_at` oder `refunded_at` gesetzt → „Erstattung beantragt" (wie bisher)
  2. `search_result = 'found'` → **neuer Zustand** „Termin gebucht"
  3. `rebook_used_at` gesetzt → „bereits gewählt" (wie bisher)
  4. danach wie bisher: abgelaufen, dann Auswahl
- Neuer Zustand `found` im State-Typ.

**`src/routes/termine-aendern.tsx`**
- Anzeige für den neuen Zustand: „Wir haben einen Termin für dich gebucht. Alle Details findest du in unserer E-Mail und in der Bestätigung der Zulassungsstelle."

## Abschluss

- Typprüfung (`bunx tsgo --noEmit`)
- Diff der geänderten Dateien zeigen
- Kein Deploy
