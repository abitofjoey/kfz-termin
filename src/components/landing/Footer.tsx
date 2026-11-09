import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand/Brand";
import { useConsent } from "@/lib/consent";
import { launchedCities } from "@/lib/cities";

export function Footer({ city }: { city?: string } = {}) {
  const { openSettings } = useConsent();
  const cities = [...launchedCities()].sort((a, b) => a.name.localeCompare(b.name, "de"));
  const linkCls = "hover:text-white";
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Brand city={city ?? ""} size="sm" asLink={false} onDark invertIcon />
          <nav aria-label="Städte" className="mt-3 text-sm text-white/90">
            Städte:{" "}
            {cities.map((c, i) => (
              <Fragment key={c.slug}>
                {i > 0 ? <span aria-hidden="true"> · </span> : null}
                <a href={`/${c.slug}`} className="underline-offset-2 hover:text-white hover:underline">
                  {c.name}
                </a>
              </Fragment>
            ))}
          </nav>
          <p className="mt-2 text-sm text-white/90">© 2026 KFZ-Termin</p>
        </div>

        <nav aria-label="Rechtliches und Kontakt" className="flex flex-col items-start gap-2 text-sm text-white/90">
          <Link to="/impressum" className={linkCls}>Impressum</Link>
          <Link to="/datenschutz" className={linkCls}>Datenschutz</Link>
          <Link to="/agb" className={linkCls}>AGB</Link>
          <Link to="/widerrufsbelehrung" className={linkCls}>Widerrufsbelehrung</Link>
          <button type="button" onClick={openSettings} className={`text-left ${linkCls}`}>
            Cookie-Einstellungen
          </button>
          <a href="mailto:info@kfz-termin.online" className={linkCls}>
            Kontakt: info@kfz-termin.online
          </a>
          <Link
            to="/widerruf"
            className="mt-2 inline-flex items-center rounded-md border-2 border-white/80 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Vertrag widerrufen
          </Link>
        </nav>
      </div>
    </footer>
  );
}
