# Plan: Preis 9,99 € + zusätzliche Zahlungsmethoden

## 1. Preis von 19 € auf 9,99 € ändern

Alle Fundstellen werden konsistent angepasst:

| Datei | Stelle | Alt → Neu |
|---|---|---|
| `src/lib/stripe.functions.ts` | `unit_amount: 1900` | `999` (Cent) |
| `src/components/landing/BookingForm.tsx` | „19€" im Service-Dropdown | „9,99 €" |
| `src/components/landing/BookingForm.tsx` | Button „Jetzt für 19 € buchen" | „Jetzt für 9,99 € buchen" |
| `src/components/landing/BookingForm.tsx` | Hinweistext „19,00 € inkl. aller Gebühren …" | „9,99 € …" |
| `src/components/landing/Pricing.tsx` | „19€ einmalig" Preis-Kachel | „9,99 €" |
| `src/components/landing/Hero.tsx` | „Für nur 19 €" | „Für nur 9,99 €" |
| `src/routes/index.tsx` | Meta-Description „Ab 19 €." | „Ab 9,99 €." |
| `src/routes/agb.tsx` | „19,00 € pro Auftrag" | „9,99 € pro Auftrag" |
| `src/lib/email-templates/booking-confirmation.tsx` | Bestätigungs-Mail „Betrag 19,00 €" | „9,99 €" |

Ich greppe nach dem Commit nochmal nach „19" / „1900", damit nichts vergessen wurde.

## 2. PayPal & weitere Zahlungsmethoden bei Stripe Checkout

**Was im Code passiert:**
In `src/lib/stripe.functions.ts` ist Checkout aktuell hart auf Karte begrenzt:
```ts
payment_method_types: ["card"],
```
Ich ersetze das durch Stripes „Automatic Payment Methods":
```ts
automatic_payment_methods: { enabled: true },
```
Damit zeigt Stripe automatisch alle Zahlungsarten an, die in deinem Stripe-Konto aktiviert sind (Karte, PayPal, Klarna, Apple/Google Pay, Sofort, Giropay, etc.) – passend zum Gerät und Land des Käufers.

**Was du in Stripe selbst machen musst:**
Stripe Checkout zeigt nur Methoden, die in deinem Stripe-Konto freigeschaltet sind. PayPal & Co. müssen einmalig im Stripe-Dashboard aktiviert werden:

1. Stripe-Dashboard → **Settings → Payments → Payment methods**
2. PayPal, Klarna, Apple Pay, Google Pay, Sofort, Giropay etc. jeweils auf **„Turn on"** stellen.
3. Bei PayPal: Stripe verbindet sich automatisch mit PayPal – kein eigenes PayPal-Konto nötig (Stripe wickelt die Auszahlung).

**Produkt in Stripe anlegen?** Nein, nicht nötig. Wir nutzen `price_data` mit dynamischen Beträgen (kein Stripe-Produktkatalog), das funktioniert weiter wie bisher – nur der Betrag ändert sich auf 999 Cent.

## Technische Hinweise

- Preise in Stripe immer in **Cent als Integer** → `999` (nicht `9.99`).
- `automatic_payment_methods` ist mit dem aktuellen `mode: "payment"` voll kompatibel.
- `receipt_email` / Erfolgs-/Abbruch-URLs bleiben unverändert.
- Keine DB-Migration nötig, der Preis wird nirgendwo in der Datenbank gespeichert.
