## Situation

Der Security-Scanner meldet: `bookings` hat RLS aktiv, aber **keine Policies**. Das bedeutet: Kein Client (anon/authenticated) kann über PostgREST auf die Tabelle zugreifen — die Daten sind **bereits sicher**.

Alle App-Zugriffe auf `bookings` laufen ausschließlich serverseitig über `supabaseAdmin` (Service Role) in:
- `src/lib/booking.functions.ts`
- `src/lib/booking-finalize.server.ts`
- `src/lib/stripe.functions.ts`

Service Role umgeht RLS grundsätzlich — funktional ändert sich also nichts.

## Fix

Reiner Klarheits-Fix per Migration: explizite Policies ergänzen, damit der Scanner sieht, dass der Zustand gewollt ist.

1. Explizite Service-Role-Policy `FOR ALL` auf `public.bookings` (nur Dokumentation — Service Role hätte ohnehin Zugriff).
2. Sicherstellen, dass **keine** GRANTs an `anon`/`authenticated` bestehen bzw. diese entzogen sind, damit Client-Zugriffe weiterhin blockiert bleiben.

Keine Code-Änderungen. Keine Auswirkung auf Buchungs-Flow, Stripe-Webhook, E-Mail-Versand oder Ähnliches.

## Nicht Teil dieses Plans

Die anderen aktuell im Security-Panel gelisteten Findings (transactional email endpoint, SECURITY DEFINER functions) fasse ich hier nicht an — du hast nur nach `bookings_no_policies` gefragt.
