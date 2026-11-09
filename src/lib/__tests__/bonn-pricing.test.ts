import { describe, expect, it } from "vitest";
import { getCityService, getServices } from "@/lib/services";
import { bonnPricingFeatures } from "@/content/cities/bonn";

describe("Bonner Service-Karte", () => {
  it("Neuzulassung (nur DLZ) zeigt Dienstleistungszentrum und 5 Wochen", () => {
    const f = bonnPricingFeatures(getCityService("bonn", "neuzulassung")!);
    expect(f).toContain("Standort: nur im Dienstleistungszentrum (Berliner Platz 2)");
    expect(f).toContain("Bis zu 5 Wochen Suchzeitraum");
  });

  it("Umschreibung zeigt alle vier Standorte", () => {
    expect(bonnPricingFeatures(getCityService("bonn", "umschreibung")!)).toContain(
      "Standort: alle vier Bonner Standorte",
    );
  });

  it("Führerschein zeigt 10 Wochen", () => {
    expect(bonnPricingFeatures(getCityService("bonn", "fs-umtausch")!)).toContain("Bis zu 10 Wochen Suchzeitraum");
  });

  it("je Bereich 9 sichtbare Kacheln, erste Kfz = Umschreibung, erste Führerschein = Umtausch", () => {
    for (const [cat, first] of [["kfz", "Umschreibung"], ["fuehrerschein", "Umtausch"]] as const) {
      const pop = getServices("bonn")
        .filter((s) => s.category === cat && s.popularRank)
        .sort((a, b) => a.popularRank! - b.popularRank!);
      expect(pop).toHaveLength(9);
      expect(pop[0].shortLabel).toBe(first);
    }
  });
});
