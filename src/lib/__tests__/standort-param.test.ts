import { describe, it, expect } from "vitest";
import { getCity } from "@/lib/cities";
import { CITY_CONTENT } from "@/content/cities";
import { resolveStandort, heroForStandort, initialLocationState } from "@/lib/standort";

const N = getCity("neuss")!;
const nh = CITY_CONTENT.neuss.hero;

describe("?standort= (Neuss)", () => {
  it("grevenbroich → Überschrift und Vorwahl", () => {
    const loc = resolveStandort(N, nh, "grevenbroich");
    expect(heroForStandort(nh, loc).headline).toBe("Dein Wunschtermin beim Straßenverkehrsamt Grevenbroich –");
    expect(heroForStandort(nh, loc).headlineAccent).toBe("automatisch gebucht.");
    expect(heroForStandort(nh, loc).badge).toBe(nh.badge);
    expect(initialLocationState(loc)).toEqual({ mode: "specific", chosen: ["grevenbroich"] });
  });
  it("xyz → wie ohne Parameter", () => {
    const loc = resolveStandort(N, nh, "xyz");
    expect(loc).toBeNull();
    expect(heroForStandort(nh, loc)).toBe(nh);
    expect(initialLocationState(loc)).toEqual({ mode: "any", chosen: [] });
  });
  it("Bonn ?standort=beuel bleibt unverändert", () => {
    const bh = CITY_CONTENT.bonn.hero;
    const loc = resolveStandort(getCity("bonn"), bh, "beuel");
    expect(loc).toBeNull();
    expect(heroForStandort(bh, loc).headline).toBe(bh.headline);
    expect(initialLocationState(loc).mode).toBe("any");
  });
  it("Köln und Recklinghausen ignorieren den Parameter", () => {
    expect(resolveStandort(getCity("koeln"), CITY_CONTENT.koeln.hero, "koeln")).toBeNull();
    expect(resolveStandort(getCity("recklinghausen"), CITY_CONTENT.recklinghausen.hero, "marl")).toBeNull();
  });
});
