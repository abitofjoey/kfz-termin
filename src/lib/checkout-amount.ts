import { cityOrDefault } from "@/lib/cities";

/**
 * Betrag für die Checkout-Session: immer der bei der Buchung gespeicherte Betrag.
 * Nur falls leer, gilt der aktuelle Preis der Stadt (und wird nachgetragen).
 */
export function resolveCheckoutAmount(booking: { amount_cents: number | null; city: string | null }) {
  if (booking.amount_cents != null) return { amountCents: booking.amount_cents, needsBackfill: false };
  return { amountCents: cityOrDefault(booking.city).priceCents, needsBackfill: true };
}

/** Produktbeschreibung im Stripe-Checkout, abhängig von der Stadt der Buchung. */
export function checkoutDescription(citySlug: string | null | undefined): string {
  const c = cityOrDefault(citySlug);
  if (c.slug === "koeln") return "KFZ-Termin Köln – Terminservice bei der Zulassungsstelle";
  return `${c.siteName} – Terminservice bei der Stadt ${c.name}`;
}
