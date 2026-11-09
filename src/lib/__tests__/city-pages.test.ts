import { describe, it, expect } from "vitest";
import { CITIES, cityOrDefault } from "@/lib/cities";
import { bonnFaq } from "@/content/cities/bonn";

describe("Kundenseiten nach Stadt", () => {
  it("Altbuchung ohne Stadt nutzt Köln-Behörde", () => {
    expect(cityOrDefault(null).pages.authorityShort).toBe("Zulassungsstelle Köln");
  });
  it("Köln nutzt Standardtexte (unverändert)", () => {
    expect(cityOrDefault("koeln").pages.successIntro).toBeNull();
    expect(cityOrDefault("koeln").pages.successNotice).toBeNull();
  });
  it("Bonn: rund um die Uhr, ohne Hinweis auf sofortige Verbindlichkeit", () => {
    const p = cityOrDefault("bonn").pages;
    expect(p.authorityShort).toBe("Stadt Bonn");
    expect(p.successIntro).toContain("rund um die Uhr nach einem freien Termin bei der Stadt Bonn");
    expect(p.successNotice).toContain("Du musst nichts mehr bestätigen");
    expect(p.successNotice).not.toMatch(/verbindlich/i);
  });
  it("kein Kundentext nennt 'sofort verbindlich'", () => {
    for (const c of Object.values(CITIES)) {
      const pageText = `${c.pages.successIntro ?? ""} ${c.pages.successNotice ?? ""}`;
      expect(pageText).not.toMatch(/sofort verbindlich/i);
    }
    const faqText = bonnFaq.map((f) => `${f.q} ${f.a}`).join(" ");
    expect(faqText).not.toMatch(/sofort verbindlich/i);
  });
});
