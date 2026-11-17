import type { CityConfig, CityLocation } from "@/lib/cities";
import type { HeroContent } from "@/components/landing/Hero";

/** ?standort=<id> → Standort, nur wenn die Stadt das unterstützt (hero.locationHeadline + Standortwahl). */
export function resolveStandort(
  city: CityConfig | undefined,
  hero: HeroContent | undefined,
  raw: unknown,
): CityLocation | null {
  if (!city || !hero?.locationHeadline || typeof raw !== "string" || !raw) return null;
  if (city.flow !== "multi" || !city.form.locationChoice) return null;
  return city.locations.find((l) => l.id === raw) ?? null;
}

/** Überschrift der Stadtseite, ggf. mit Standort. */
export function heroForStandort(hero: HeroContent, loc: CityLocation | null): HeroContent {
  if (!loc || !hero.locationHeadline) return hero;
  return { ...hero, headline: hero.locationHeadline.replace("{town}", loc.town) };
}

/** Startwerte der Standortwahl im Formular. */
export function initialLocationState(loc: CityLocation | null): { mode: "any" | "specific"; chosen: string[] } {
  return loc ? { mode: "specific", chosen: [loc.id] } : { mode: "any", chosen: [] };
}
