import { cityOrDefault } from "@/lib/cities";

/**
 * Betrag für die Checkout-Session (nur unbezahlte Buchungen): der kleinere Wert
 * aus gespeichertem Betrag und aktuellem Stadtpreis. Ist der aktuelle Preis
 * kleiner oder der Betrag leer, wird er nachgetragen.
 */
export function resolveCheckoutAmount(booking: { amount_cents: number | null; city: string | null; paid?: boolean | null }) {
  if (booking.paid && booking.amount_cents != null) return { amountCents: booking.amount_cents, needsBackfill: false };
  const current = cityOrDefault(booking.city).priceCents;
  if (booking.amount_cents == null || current < booking.amount_cents) return { amountCents: current, needsBackfill: true };
  return { amountCents: booking.amount_cents, needsBackfill: false };
}

/** Produktbeschreibung im Stripe-Checkout, abhängig von der Stadt der Buchung. */
export function checkoutDescription(citySlug: string | null | undefined): string {
  return cityOrDefault(citySlug).checkoutDescription;
}
