import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { LandmarkIcon } from "@/components/brand/LandmarkIcon";
import { launchedCities, getCity } from "@/lib/cities";

/** Alle freigeschalteten Städte, alphabetisch. */
function sortedCities() {
  return [...launchedCities()].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/** Kopfzeile. Mit `city` zusätzlich die Anker der Stadtseite. */
export function Header({ city, home }: { city?: string; home?: boolean } = {}) {
  const c = getCity(city);
  const base = c ? `/${c.slug}` : "";
  const cta = c ? `${base}#buchung` : home ? "#stadt-waehlen" : "/#staedte";
  const ctaLabel = home ? "Stadt wählen" : "Jetzt buchen";
  const linkCls = "hover:text-foreground";
  const cities = sortedCities();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Brand city={c?.name ?? ""} />
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" className={linkCls}>Start</Link>
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="inline-flex items-center gap-1 hover:text-foreground focus-visible:text-foreground"
            >
              Städte <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <ul className="min-w-40 rounded-md border border-border bg-background p-1 shadow-lg">
                {cities.map((x) => {
                  const current = x.slug === c?.slug;
                  return (
                    <li key={x.slug}>
                      <a
                        href={`/${x.slug}`}
                        aria-current={current ? "page" : undefined}
                        className={`flex items-center gap-2 rounded px-3 py-1.5 hover:bg-muted ${current ? "font-semibold text-accent" : "text-foreground"}`}
                      >
                        <LandmarkIcon icon={x.landmarkIcon} className="landmark-icon-menu h-[18px] w-[18px]" />
                        {x.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {c ? (
            <>
              <a href={`${base}#ablauf`} className={linkCls}>Ablauf</a>
              <a href={`${base}#preise`} className={linkCls}>Preise</a>
              <a href={`${base}#faq`} className={linkCls}>FAQ</a>
            </>
          ) : null}
        </nav>
        <a
          href={cta}
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:inline-block"
        >
          {ctaLabel}
        </a>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-sm font-medium">
            Menü
          </summary>
          <nav
            aria-label="Hauptnavigation mobil"
            className="absolute right-0 mt-2 flex w-52 flex-col gap-1 rounded-md border border-border bg-background p-2 text-sm shadow-lg"
          >
            <Link to="/" className="rounded px-2 py-1.5 hover:bg-muted">Start</Link>
            <details className="group/cities">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded px-2 py-1.5 hover:bg-muted">
                Städte <ChevronDown className="h-4 w-4 transition-transform group-open/cities:rotate-180" aria-hidden="true" />
              </summary>
              <div className="ml-2 flex flex-col border-l border-border pl-2">
                {cities.map((x) => {
                  const current = x.slug === c?.slug;
                  return (
                    <a
                      key={x.slug}
                      href={`/${x.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted ${current ? "font-semibold text-accent" : ""}`}
                    >
                      <LandmarkIcon icon={x.landmarkIcon} className="landmark-icon-menu h-[18px] w-[18px]" />
                      {x.name}
                    </a>
                  );
                })}
              </div>
            </details>
            {c ? (
              <>
                <a href={`${base}#ablauf`} className="rounded px-2 py-1.5 hover:bg-muted">Ablauf</a>
                <a href={`${base}#preise`} className="rounded px-2 py-1.5 hover:bg-muted">Preise</a>
                <a href={`${base}#faq`} className="rounded px-2 py-1.5 hover:bg-muted">FAQ</a>
              </>
            ) : null}
            <a href={cta} className="mt-1 rounded bg-primary px-2 py-1.5 text-center font-semibold text-primary-foreground">
              {ctaLabel}
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
