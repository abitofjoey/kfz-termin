import { cityOrDefault } from "@/lib/cities";

/**
 * Betrag für die Checkout-Session: immer der bei der Buchung gespeicherte Betrag.
 * Nur falls leer, gilt der aktuelle Preis der Stadt (und wird nachgetragen).
 */
export function resolveCheckoutAmount(booking: { amount_cents: number | null; city: string | null }) {
  if (booking.amount_cents != null) return { amountCents: booking.amount_cents, needsBackfill: false };
  return { amountCents: cityOrDefault(booking.city).priceCents, needsBackfill: true };
}
