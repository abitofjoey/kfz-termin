import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand/Brand";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Brand city="Köln" size="sm" asLink={false} />
          <p className="mt-2 text-sm text-white/70">
            © 2026 KFZ-Termin
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <Link to="/impressum" className="hover:text-white">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-white">Datenschutz</Link>
          <Link to="/agb" className="hover:text-white">AGB</Link>
          <a href="mailto:eike@jeh-digital.de" className="hover:text-white">
            Kontakt: eike@jeh-digital.de
          </a>
        </nav>
      </div>
    </footer>
  );
}
