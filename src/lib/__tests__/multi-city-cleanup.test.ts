import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { CITIES } from "@/lib/cities";
import { checkoutDescription } from "@/lib/checkout-amount";
import { koelnContent } from "@/content/cities/koeln";
import { buildLlmsTxt } from "@/lib/llms";

describe("Mehrstädte-Aufräumen", () => {
  it("Komponenten enthalten keinen Stadtnamen", () => {
    for (const f of ["Steps.tsx", "BookingForm.tsx", "Pricing.tsx"]) {
      const src = readFileSync(`src/components/landing/${f}`, "utf8").replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
      expect(src, f).not.toMatch(/Köln|Kölner|Bonn/);
    }
    expect(readFileSync("src/components/brand/Brand.tsx", "utf8")).not.toMatch(/"Köln"/);
  });
  it("Köln-Frist kommt aus der Konfiguration (3 Stunden)", () => {
    expect(CITIES.koeln.customerConfirmationHours).toBe(3);
    expect(koelnContent.single?.steps[4].text).toContain("innerhalb von 3 Stunden");
    expect(koelnContent.single?.emailHint).toContain("Kölner Zulassungsstelle");
  });
  it("Checkout-Beschreibung aus Konfiguration, Köln unverändert", () => {
    expect(checkoutDescription("koeln")).toBe("KFZ-Termin – Terminservice bei der Zulassungsstelle Köln");
    expect(checkoutDescription(null)).toBe("KFZ-Termin – Terminservice bei der Zulassungsstelle Köln");
    expect(checkoutDescription("bonn")).toBe("KFZ-Termin – Terminservice bei der Stadt Bonn");
  });
  it("llms.txt enthält nur launched-Städte", () => {
    const txt = buildLlmsTxt();
    for (const c of Object.values(CITIES)) {
      expect(txt.includes(`## ${c.name}\n`)).toBe(c.launched);
    }
    expect(txt).toContain("täglich von 6 bis 20 Uhr");
    expect(txt).toContain("rund um die Uhr");
  });
});
