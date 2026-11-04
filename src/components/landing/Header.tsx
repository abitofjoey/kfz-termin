import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand/Brand";
import { launchedCities, getCity } from "@/lib/cities";

/** Kopfzeile. Mit `city` zusätzlich die Anker der Stadtseite. */
export function Header({ city }: { city?: string } = {}) {
  const c = getCity(city);
  const base = c ? `/${c.slug}` : "";
  const cta = c ? `${base}#buchung` : "/#staedte";
  const linkCls = "hover:text-foreground";
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Brand city={c?.name ?? ""} />
        <nav aria-label="Hauptnavigation" className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" className={linkCls}>Start</Link>
          {launchedCities().map((x) => (
            <a key={x.slug} href={`/${x.slug}`} className={linkCls}>{x.name}</a>
          ))}
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
          Jetzt buchen
        </a>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-sm font-medium">
            Menü
          </summary>
          <nav
            aria-label="Hauptnavigation mobil"
            className="absolute right-0 mt-2 flex w-48 flex-col gap-1 rounded-md border border-border bg-background p-2 text-sm shadow-lg"
          >
            <Link to="/" className="rounded px-2 py-1.5 hover:bg-muted">Start</Link>
            {launchedCities().map((x) => (
              <a key={x.slug} href={`/${x.slug}`} className="rounded px-2 py-1.5 hover:bg-muted">{x.name}</a>
            ))}
            {c ? (
              <>
                <a href={`${base}#ablauf`} className="rounded px-2 py-1.5 hover:bg-muted">Ablauf</a>
                <a href={`${base}#preise`} className="rounded px-2 py-1.5 hover:bg-muted">Preise</a>
                <a href={`${base}#faq`} className="rounded px-2 py-1.5 hover:bg-muted">FAQ</a>
              </>
            ) : null}
            <a href={cta} className="mt-1 rounded bg-primary px-2 py-1.5 text-center font-semibold text-primary-foreground">
              Jetzt buchen
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
