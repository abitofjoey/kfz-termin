# Audit: Zahlungen & Buchungsbestätigungen für alle Methoden

Ziel: Sicherstellen, dass jede in Stripe aktivierte Zahlungsart (Karte, PayPal, Klarna, Apple/Google Pay, Sofort/Giropay etc.) eine bezahlte Buchung **garantiert** finalisiert und beide Mails verschickt — auch wenn der Kunde die Success-Seite nie öffnet oder die Zahlung asynchron erfolgt.

## Was geprüft wird (nur lesend, keine Code-Änderungen)

### 1. Stripe-Webhook-Konfiguration
- Webhook im Stripe-Dashboard zeigt auf `https://kfz-termin.online/api/public/stripe/webhook`
- Abonnierte Events enthalten **mindestens**:
  - `checkout.session.completed` (sofortige Methoden: Karte, Apple/Google Pay, PayPal)
  - `checkout.session.async_payment_succeeded` (verzögerte Methoden: Klarna, SEPA, Sofort, Giropay-Nachfolger)
  - `checkout.session.async_payment_failed` (für Fehlerlog/Monitoring, optional)
- `STRIPE_WEBHOOK_SECRET` ist gesetzt (✓ laut Secrets-Liste)
- Recent Deliveries: alle Calls geben 200 zurück

### 2. Webhook-Handler-Code (`src/routes/api/public/stripe/webhook.ts`)
- Verifiziert Signatur korrekt mit Raw-Body
- Reagiert auf beide Event-Typen (`completed` + `async_payment_succeeded`) → ✓ bereits drin
- Idempotenz: `finalizePaidBooking` setzt `confirmation_sent_at` → mehrfaches Feuern erzeugt keine Duplikat-Mails

### 3. Success-Page-Pfad (`confirmCheckoutSession`)
- Wird beim Öffnen von `/buchung-erfolgreich` getriggert → sendet Mails sofort (bessere UX)
- Aber: Funktioniert auch ohne, da Webhook die Quelle der Wahrheit ist
- Race-Condition zwischen Webhook und Success-Page ist durch `confirmation_sent_at`-Check abgedeckt

### 4. Verifikation an echten Daten
- Letzte ~10 Buchungen aus `bookings` prüfen: alle bezahlten haben `paid=true`, `confirmation_sent_at` gesetzt
- `email_send_log` prüfen: für jede bezahlte Buchung existieren beide Logs (`booking-confirm-*` + `booking-internal-*`) mit Status `sent`
- DLQ / Failed-Mails: keine offenen Fehler in den letzten 7 Tagen

### 5. Async-Zahlungen (Klarna, SEPA, Sofort)
- Bei diesen wird der Checkout abgeschlossen, aber `payment_status` ist erst `unpaid`/`processing`
- Erst `async_payment_succeeded` (Minuten bis Tage später) liefert `paid` — der Webhook MUSS dieses Event abonniert haben, sonst bleiben solche Buchungen ewig auf `unpaid`
- Prüfung: Liste der abonnierten Events im Stripe-Dashboard

## Was ich liefere

Ein kurzer Report mit:
- ✓/✗ für jeden der 5 Punkte oben
- Ggf. exakte Liste fehlender Events im Webhook (mit copy-paste-fertiger Anleitung wie du sie in Stripe nachträgst)
- Ggf. Liste von Buchungen, die "hängen" (bezahlt laut Stripe, aber nicht bei uns als `paid` markiert) und für die wir die Admin-Route nochmal triggern sollten

## Was ich NICHT mache (außer du sagst es nochmal explizit)
- Keine Code-Änderungen — der Webhook-Handler ist aktuell korrekt
- Keine neuen Secrets
- Kein Refactoring von `confirmCheckoutSession` oder `finalizePaidBooking`

Falls beim Audit ein konkretes Problem auftaucht (z. B. `async_payment_succeeded` nicht abonniert), erstelle ich danach einen neuen Plan für den Fix.
