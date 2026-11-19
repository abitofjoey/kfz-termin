import { describe, it, expect } from "vitest";
import { render } from "@react-email/components";
import * as React from "react";
import { formatPrice, isVatActive, vatShortNote, vatAgbSentence } from "@/lib/price";
import { resolveCheckoutAmount } from "@/lib/checkout-amount";
import { cityOrDefault } from "@/lib/cities";
import { template as confirmation } from "@/lib/email-templates/booking-confirmation";

describe("Preis", () => {
  it("alle Städte kosten 9,99 €", () => {
    for (const c of ["koeln", "bonn", "recklinghausen", "neuss"]) expect(cityOrDefault(c).priceCents).toBe(999);
    expect(formatPrice(999)).toBe("9,99 €");
  });
  it("Buchung ohne Betrag → Checkout 999 und Nachtrag", () => {
    expect(resolveCheckoutAmount({ amount_cents: null, city: "koeln" })).toEqual({ amountCents: 999, needsBackfill: true });
  });
  it("unbezahlte Buchung mit 1299 → Checkout 999 und Nachtrag", () => {
    expect(resolveCheckoutAmount({ amount_cents: 1299, city: "bonn", paid: false })).toEqual({ amountCents: 999, needsBackfill: true });
  });
  it("Buchung mit 999 → Checkout 999 ohne Nachtrag", () => {
    expect(resolveCheckoutAmount({ amount_cents: 999, city: "koeln", paid: false })).toEqual({ amountCents: 999, needsBackfill: false });
  });
  it("bezahlte Buchung mit 1299 bleibt unverändert", () => {
    expect(resolveCheckoutAmount({ amount_cents: 1299, city: "koeln", paid: true })).toEqual({ amountCents: 1299, needsBackfill: false });
  });
  it("Bestätigungsmail mit amount_cents 999 zeigt 9,99 €", async () => {
    const html = await render(React.createElement(confirmation.component, { ...confirmation.previewData, amountCents: 999 }));
    expect(html).toContain("9,99 €");
    expect(html).not.toContain("12,99 €");
  });
});

describe("Umsatzsteuer ab 2027 (Berliner Zeit)", () => {
  it("31.12.2026 23:59 Berlin: noch keine USt.", () => {
    const d = new Date("2026-12-31T22:59:00Z");
    expect(isVatActive(d)).toBe(false);
    expect(vatShortNote(d)).toBe("keine USt.");
  });
  it("01.01.2027 00:00 Berlin: inkl. 19 % USt.", () => {
    const d = new Date("2026-12-31T23:00:00Z");
    expect(isVatActive(d)).toBe(true);
    expect(vatShortNote(d)).toBe("inkl. 19 % USt.");
    expect(vatAgbSentence(d)).toBe("Der Preis versteht sich inklusive der gesetzlichen Umsatzsteuer.");
  });
});
