import { ArrowRight, MapPin } from "lucide-react";
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
          <span className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
              <MapPin className="h-6 w-6 text-accent" aria-hidden="true" />
            </span>
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
