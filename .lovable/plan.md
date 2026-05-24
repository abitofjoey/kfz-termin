## Problem

Klick auf "Jetzt buchen" in einer Service-Kachel scrollt zwar zum Formular, das Feld "Dienstleistung" zeigt aber weiterhin den ersten Wert (bzw. den, der beim ersten Mount aktiv war). Grund: `react-hook-form` setzt `defaultValues` nur einmal beim Mount – spätere Änderungen an der `preselected`-Prop werden ignoriert.

## Lösung

In `src/components/landing/BookingForm.tsx` die Prop `preselected` reaktiv ins Formular übertragen:

1. `setValue` aus `useForm` zusätzlich destrukturieren.
2. Einen `useEffect` ergänzen, der bei jeder Änderung von `preselected` `setValue("service_type", preselected, { shouldValidate: true, shouldDirty: false })` aufruft (nur wenn `preselected` gesetzt ist).
3. `useEffect` zur Importliste in der bestehenden React-Import-Zeile ergänzen.

Damit wird die in `Pricing` ausgewählte Kachel beim Klick auf "Jetzt buchen" automatisch im Formular vorausgewählt – auch wenn der Nutzer mehrfach zwischen Services wechselt.

Keine weiteren Dateien, keine DB- oder Backend-Änderungen nötig.