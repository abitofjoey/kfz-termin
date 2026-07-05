## Problem

Die `bookings`-Tabelle hat eine RLS-Policy, die `anon` und `authenticated` erlaubt, direkt Zeilen einzufügen (mit nur schwachen Feldchecks). Ein Angreifer könnte damit die Datenbank mit gefälschten Buchungen füllen – ohne Stripe-Zahlung.

## Ist das relevant?

Ja. Zwar entsteht ohne Zahlung keine reale Bearbeitung, aber Spam-Inserts würden die Tabelle mit Fake-Namen/Emails/FINs/Telefonnummern fluten und Storage sowie DSGVO-Aufwand verursachen.

## Fix

Der Buchungsflow läuft komplett serverseitig über `supabaseAdmin` (Service-Role, umgeht RLS) in `booking.functions.ts`, `stripe.functions.ts` und `booking-finalize.server.ts`. Es gibt keinen Client-Code, der direkt in `bookings` schreibt oder liest. Die Anon-Policy ist also überflüssig.

**Migration:**

```sql
DROP POLICY "Anyone can create a booking with valid data" ON public.bookings;
-- RLS bleibt aktiv; keine Policy → anon/authenticated können weder lesen noch schreiben.
-- service_role (supabaseAdmin) bypassed RLS weiterhin → Buchungsflow unverändert.
```

## Auswirkungen

- Buchungsformular funktioniert weiter (nutzt `createBooking` server function mit Service-Role).
- Stripe-Webhook und Finalize-Flow unverändert.
- Anonyme Direkt-Inserts blockiert.
