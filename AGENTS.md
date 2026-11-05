# Project Architecture Rules

- Keep standalone legal documents as leaf routes under `src/routes` using the shared `LegalPage` shell, because each document needs a stable public URL and its own metadata.- City-specific data lives only in `src/lib/cities.ts` (rules, switches `launched`/`bookable`), `src/content/cities/<slug>.ts` (page texts) and per-city lists in `src/lib/services.ts`; pages render via the shared `/$city` route, so a new city needs configuration and content, not new code.
- Bookings without a city and script calls without `?city=` default to `koeln`, because the running Pi script and old bookings predate multi-city support.
- Prices come only from `priceCents` in `src/lib/cities.ts` via `formatPrice`; each booking stores `amount_cents` at creation and checkout/mails use it, so price changes never alter what earlier customers pay.
