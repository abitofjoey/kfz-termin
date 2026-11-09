import { ArrowRight } from "lucide-react";
import { LandmarkIcon } from "@/components/brand/LandmarkIcon";
import { launchedCities } from "@/lib/cities";

/** Große Stadt-Karten; bei einer Stadt eine breite Karte, sonst Raster. */
export function CityCards() {
  const cities = launchedCities();
  const grid = cities.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid";
  return (
    <div className={grid}>
      {cities.map((c) => (
        <a
          key={c.slug}
          href={`/${c.slug}`}
          className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border-2 border-border bg-card p-6 shadow-sm transition hover:border-primary focus-visible:border-primary"
        >
          <span className="flex min-w-0 flex-col gap-3">
            <LandmarkIcon icon={c.landmarkIcon} className="h-14 w-14 text-accent" />
            <span>
              <span className="block text-2xl font-bold sm:text-3xl">{c.name}</span>
              <span className="block text-sm text-muted-foreground">
                Termin bei der Zulassungsstelle {c.name}
              </span>
            </span>
          </span>
          <ArrowRight className="h-6 w-6 shrink-0 text-primary transition group-hover:translate-x-1" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
