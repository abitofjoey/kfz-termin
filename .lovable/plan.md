## Ziel

Jan Rauschs Buchung nachträglich finalisieren und beide Bestätigungsmails (Kunde + intern) versenden, jetzt wo der Stripe-Webhook live ist.

## Vorgehen

1. **Einmalige Admin-Server-Funktion `triggerFinalizeBooking`** in `src/lib/admin-finalize.functions.ts` anlegen
   - Geschützt mit `requireSupabaseAuth` + Rollenprüfung (`has_role(..., 'admin')`), damit das kein offener Endpoint ist.
   - Nimmt `bookingId` als Input, lädt intern `finalizePaidBooking` aus `@/lib/booking-finalize.server` und ruft sie auf.
   - Gibt `{ ok: true, alreadySent: boolean }` zurück.

2. **Direkt nach Deployment via `invoke-server-function` aufrufen** mit Jans `booking_id` (`eb5f03c6-ef4d-4e9e-8c08-5ce8004797f5`).
   - `finalizePaidBooking` ist bereits idempotent über `confirmation_sent_at` → kein Risiko bei Mehrfachaufruf.
   - Setzt `paid=true`, `status='paid'`, verschickt `booking-confirmation` an `jrausch@mail.de` und `booking-internal-notification` an dich, setzt `confirmation_sent_at`.

3. **Verifizieren**
   - `email_send_log` für `booking-confirm-eb5f03c6...` und `booking-internal-eb5f03c6...` checken (Status `sent`).
   - `bookings`-Row checken: `paid=true`, `confirmation_sent_at` gesetzt.
   - Du prüfst zusätzlich deinen Posteingang.

4. **Stripe-Webhook-Smoketest** (du)
   - Im Stripe-Dashboard → Developers → Webhooks → dein Endpoint → "Recent deliveries" prüfen, ob die Aufrufe `200` zurückbekommen.
   - Optional eine kleine Test-Buchung mit deiner eigenen Mail, um zu sehen dass Webhook + Success-Page beide harmlos koexistieren (genau eine Mail dank Idempotenz).

## Technische Details

- Neue Datei: `src/lib/admin-finalize.functions.ts` (client-safe Pfad, damit der Build-Schutz nicht greift; lädt `booking-finalize.server` erst im Handler dynamisch).
- Kein Schema-Change, keine Migration, kein neuer Secret.
- Die Funktion bleibt nach Jans Fall im Code — nützlich, falls in Zukunft mal manuell nachgefahren werden muss.

## Was passiert NICHT

- Keine Änderung am Webhook, an `finalizePaidBooking`, an `confirmCheckoutSession` oder an den Templates.
- Kein direkter DB-Update per SQL — das würde den Mailversand umgehen.
