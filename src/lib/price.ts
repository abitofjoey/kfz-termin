/** Zentrale Preis- und Umsatzsteuer-Helfer. Preise selbst stehen in cities.ts (priceCents). */

/** Ab diesem Berliner Kalendertag gelten Preise inkl. 19 % USt. */
export const VAT_FROM = "2027-01-01";

/** 1299 → "12,99 €" */
export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

function berlinDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
}

export function isVatActive(now: Date = new Date()): boolean {
  return berlinDay(now) >= VAT_FROM;
}

/** Kurzer Hinweis für Formular / Preis-Sektion. */
export function vatShortNote(now: Date = new Date()): string {
  return isVatActive(now) ? "inkl. 19 % USt." : "keine USt.";
}

/** Zeile „Umsatzsteuer“ in der Bestätigungsmail. */
export function vatMailValue(now: Date = new Date()): string {
  return isVatActive(now) ? "inkl. 19 % USt." : "Keine USt. gem. § 19 UStG";
}

/** Satz in den AGB. */
export function vatAgbSentence(now: Date = new Date()): string {
  return isVatActive(now)
    ? "Der Preis versteht sich inklusive der gesetzlichen Umsatzsteuer."
    : "Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.";
}
