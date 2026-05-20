## Was passiert gerade

- Das Backend ist korrekt eingerichtet (Lovable Cloud – deshalb siehst du in deinem eigenen Supabase-Konto nichts).
- Die Tabelle `bookings` hat eine `INSERT`-Regel für jedermann, aber **keine `SELECT`-Regel** (gewollt, damit niemand fremde Buchungen lesen kann).
- Unsere Server-Funktion fügt ein und liest die neue Zeile sofort wieder zurück (`.select("id").single()`). Das Zurücklesen scheitert an der fehlenden `SELECT`-Regel → die ganze Buchung wird abgewiesen.

## Fix

Den Insert in `src/lib/booking.functions.ts` über den vertrauenswürdigen Server-Client (`supabaseAdmin`, Service-Role) ausführen. Dieser umgeht RLS – das ist genau der vorgesehene Weg für serverseitige Schreibvorgänge, die der Nutzer nie direkt machen darf.

### Änderungen

1. `**src/lib/booking.functions.ts**`
  - `createClient(url, publishableKey)` entfernen.
  - Stattdessen `supabaseAdmin` aus `@/integrations/supabase/client.server` importieren und verwenden.
  - Insert + `.select("id").single()` bleibt unverändert und funktioniert dann.
2. **Sicherheit bleibt erhalten**
  - Validierung läuft weiterhin per Zod **vor** dem Insert (Pflichtfelder, FIN-Format, mind. 5 Datumswerte, gültige E-Mail).
  - RLS-Regeln auf der Tabelle bleiben unverändert – Browser-Clients können weiterhin keine Buchungen lesen.
3. **Keine DB-Migration nötig.**

## Erwartetes Ergebnis

Nach dem Fix:

- Formular abschicken → Buchung wird gespeichert.
- Direkt danach Stripe-Checkout im Test-Modus (Karte `4242 4242 4242 4242`).
- Nach erfolgreicher Zahlung Weiterleitung auf `/buchung-erfolgreich`, dort wird die Buchung als bezahlt markiert.