# Interne Script-API für bezahlte Buchungen

Ziel: Ein externes Script kann bezahlte, noch nicht abgearbeitete Buchungen abholen und danach als "übernommen" markieren. Kein bestehender Code wird verändert.

## 1. Datenbank-Migration

Zwei neue Spalten auf `bookings`:
- `assigned_to_script` (ja/nein, Standard: nein)
- `assigned_to_script_at` (Zeitpunkt der Übernahme, leer bis zur Übernahme)

Keine Änderung an bestehenden Zugriffsregeln: die Tabelle bleibt nur über den Server erreichbar.

## 2. Neuer Zugangsschlüssel

Ein Projekt-Secret `SCRIPT_API_KEY` wird angelegt; den Wert (langer Zufallsstring) gibst du im Freigabedialog selbst ein. Ohne passenden Schlüssel im Header `x-script-key` antwortet die API mit 401 und greift gar nicht auf die Datenbank zu.

## 3. Neue Endpunkte

Zwei Route-Dateien, aufgebaut wie der bestehende Stripe-Webhook (`createFileRoute` mit `server.handlers`, `supabaseAdmin` aus `@/integrations/supabase/client.server`):

- `src/routes/api/internal/pending-bookings.ts` — GET: alle Buchungen mit `paid = true` und `assigned_to_script = false`.
- `src/routes/api/internal/pending-bookings.$id.ack.ts` — POST: markiert eine Buchung als übernommen.

### GET-Antwort

```text
{ "bookings": [ { "bookingId": ..., "nutzerdaten": {...}, "wunschDaten": [...] } ] }
```

Mapping wie vorgegeben:
- `anrede`: Herr→"m", Frau→"w", Divers→"d", sonst "m"
- `vorname`, `nachname`, `email`, `telefon` direkt aus der Zeile
- `fin` = fin_1, `fin2`/`fin3` = fin_2/fin_3 oder `""`
- `anzahl` = Anzahl nicht-leerer FIN-Felder als String ("1"/"2"/"3")
- `service` = Nummer 1–15 aus der vorgegebenen Tabelle, exakter Textvergleich auf `service_type`. Kein Treffer → `service` weglassen, stattdessen `serviceUnklar: true` (kein Raten)
- `wunschDaten`: `selected_dates` von `YYYY-MM-DD` zu `DD.MM.YYYY`

### POST `/api/internal/pending-bookings/:id/ack`

Setzt `assigned_to_script = true` und `assigned_to_script_at = now()`, aber nur solange `assigned_to_script` noch `false` ist (Bedingung im Update, damit ein zweiter Aufruf nichts überschreibt). Antwort: `{ "ok": true }` — auch beim Wiederholungsaufruf, also idempotent.

## Technische Hinweise

- `service_type` in der Datenbank enthält die Label-Texte aus `src/lib/services.ts`; die Nummerntabelle wird als konstantes Mapping in der Route hinterlegt.
- `/api/internal/*` liegt bewusst nicht unter `/api/public/*`; der Schlüsselcheck erfolgt zusätzlich direkt im Handler.
- Antworten enthalten Kundendaten, daher: kein Logging von Feldinhalten, nur Fehler/Statuszeilen.
- Nach der Umsetzung zeige ich den Diff; es wird nicht veröffentlicht.
