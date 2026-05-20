import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            K
          </div>
          <span className="text-lg font-bold text-foreground">
            KFZ-Termin <span className="text-accent">Köln</span>
          </span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="/#ablauf" className="hover:text-foreground">Ablauf</a>
          <a href="/#preise" className="hover:text-foreground">Preise</a>
          <a href="/#buchung" className="hover:text-foreground">Buchen</a>
          <a href="/#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="/#buchung"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-block"
        >
          Termin sichern
        </a>
      </div>
    </header>
  );
}
