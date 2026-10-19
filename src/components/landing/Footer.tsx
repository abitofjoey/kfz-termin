import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand/Brand";
import { useConsent } from "@/lib/consent";

export function Footer() {
  const { openSettings } = useConsent();
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Brand city="Köln" size="sm" asLink={false} onDark />
          <p className="mt-2 text-sm text-white/90">
            © 2026 KFZ-Termin
          </p>
        </div>

        <nav aria-label="Rechtliches und Kontakt" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
          <Link to="/impressum" className="hover:text-white">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-white">Datenschutz</Link>
          <Link to="/agb" className="hover:text-white">AGB</Link>
          <Link to="/widerrufsbelehrung" className="hover:text-white">Widerrufsbelehrung</Link>
          <button
            type="button"
            onClick={openSettings}
            className="hover:text-white"
          >
            Cookie-Einstellungen
          </button>
          <a href="mailto:info@kfz-termin.online" className="hover:text-white">
            Kontakt: info@kfz-termin.online
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <Link
          to="/widerruf"
          className="inline-flex items-center rounded-md border-2 border-white/80 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          Vertrag widerrufen
        </Link>
      </div>
    </footer>
  );
}
