# Robuste Zahlungsbestätigung via Stripe-Webhook

## Problem

Die Bestätigungsmails (Kunde + intern) werden aktuell **nur** ausgelöst, wenn der Kunde nach der Zahlung auf `/buchung-erfolgreich` zurückgeleitet wird (`confirmCheckoutSession` in `src/lib/stripe.functions.ts`). Schließt der Kunde den Tab, verliert das Netz oder wird bei Wallets (Apple Pay / Google Pay / Klarna) nicht sauber zurückgeleitet, passiert in deiner App **nichts** — obwohl Stripe das Geld hat. Genau das ist bei Jan Rausch passiert: `paid=false` in der DB, keine einzige Mail in `email_send_log`.

Die letzte Änderung (DSGVO-Anonymisierung) hat damit nichts zu tun.

## Lösung

Eine öffentliche Stripe-Webhook-Route ergänzen, die Stripe **server-zu-server** aufruft, sobald die Zahlung abgeschlossen ist — unabhängig davon, ob der Browser zurückkommt.

### 1. Neue Route `src/routes/api/public/stripe/webhook.ts`

- `POST`-Handler, der `Stripe-Signature` mit `STRIPE_WEBHOOK_SECRET` über `stripe.webhooks.constructEventAsync` verifiziert (raw body via `request.text()`).
- Behandelt `checkout.session.completed` (und sicherheitshalber `checkout.session.async_payment_succeeded` für Klarna/SEPA).
- Liest `session.metadata.booking_id`, setzt `paid=true`, `status='paid'`, und versendet beide Mails — **idempotent** über `confirmation_sent_at` und die bereits genutzten `idempotencyKey`s `booking-confirm-<id>` / `booking-internal-<id>`.
- Antwortet immer schnell mit `200`, damit Stripe nicht retried, wenn alles ok ist.
- Logik wird in eine gemeinsame Hilfsfunktion `finalizePaidBooking(bookingId)` ausgelagert, die sowohl der Webhook als auch die bestehende `confirmCheckoutSession` aufrufen (Erfolgsseite bleibt als „Sofort-Feedback" für den Kunden, aber ist nicht mehr alleinige Auslöserin).

### 2. Bestehende `confirmCheckoutSession` refactoren

- Ruft intern `finalizePaidBooking` auf — keine doppelte Logik.
- Race-Condition (Webhook und Success-Page treffen gleichzeitig ein) wird durch das `confirmation_sent_at`-Flag + `idempotencyKey` abgefangen: nur eine der beiden Seiten versendet tatsächlich.

### 3. Secret + Stripe-Dashboard

- Neuer Secret `STRIPE_WEBHOOK_SECRET`.
- Du legst im Stripe-Dashboard unter **Developers → Webhooks** einen Endpoint an:
  - URL: `https://kfz-termin.online/api/public/stripe/webhook`
  - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- Stripe zeigt das Signing Secret an (`whsec_…`) — das speicherst du in den Lovable-Secrets.

### 4. Jan Rauschs Buchung manuell nachfahren

Einmalig per Migration / SQL: `paid=true` setzen und die beiden Mails einmalig anstoßen (entweder direkt aus der DB via `enqueue_email`, oder einmaliger Aufruf einer kleinen Admin-Server-Funktion, die nur du auslösen kannst). Konkret schlage ich vor: kurzer manueller Trigger nach Deployment, damit Jan seine Bestätigung bekommt und du die interne Mail siehst.

## Was sich für den Nutzer ändert

- Keine sichtbare Änderung im Frontend.
- Bestätigungsmails kommen **immer** an, sobald Stripe „paid" meldet — auch wenn der Kunde den Tab schließt.
- Verlorene Buchungen wie Jans Fall passieren nicht mehr.

## Technische Details (kompakt)

- `/api/public/*` umgeht Lovable-Auth (Webhook-konform), Signaturprüfung ersetzt die Auth.
- `await request.text()` **vor** jeglichem JSON-Parsing — Stripe-Signatur erfordert den exakten Raw-Body.
- Verifizierung mit `stripe.webhooks.constructEventAsync` (Edge-kompatibel, nicht die sync-Variante).
- Idempotenz auf zwei Ebenen: `confirmation_sent_at`-Spalte (DB) + `idempotencyKey` im Email-Queue (`booking-confirm-<bookingId>`).
