import { describe, it, expect } from "vitest";
import { cityOrDefault } from "@/lib/cities";

describe("Kundenseiten nach Stadt", () => {
  it("Altbuchung ohne Stadt nutzt Köln-Behörde", () => {
    expect(cityOrDefault(null).pages.authorityShort).toBe("Zulassungsstelle Köln");
  });
  it("Köln nutzt Standardtexte (unverändert)", () => {
    expect(cityOrDefault("koeln").pages.successIntro).toBeNull();
    expect(cityOrDefault("koeln").pages.successNotice).toBeNull();
  });
  it("Bonn: sofort verbindlich, rund um die Uhr", () => {
    const p = cityOrDefault("bonn").pages;
    expect(p.authorityShort).toBe("Stadt Bonn");
    expect(p.successIntro).toContain("rund um die Uhr nach einem freien Termin bei der Stadt Bonn");
    expect(p.successNotice).toContain("Die Buchung ist sofort verbindlich");
  });
});
