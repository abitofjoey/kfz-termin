import { Link } from "@tanstack/react-router";
import { useConsent } from "@/lib/consent";

export function CookieBanner() {
  const { hydrated, hasDecided, acceptAll, rejectAll, openSettings } = useConsent();

  if (!hydrated || hasDecided) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-lg border border-border bg-background p-5 shadow-2xl sm:inset-x-auto sm:right-4 sm:left-auto"
    >
      <h2 className="text-base font-semibold text-foreground">Cookies & Analyse</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Wir verwenden technisch notwendige Cookies, damit die Website funktioniert. Mit deiner
        Einwilligung nutzen wir zusätzlich Analyse-Cookies inkl. Google Tag Manager, um die Seite
        zu verbessern, sowie Marketing-Cookies (Google Ads) zur Erfolgsmessung unserer Anzeigen.
        Dabei können personenbezogene Daten an Google in die USA übertragen werden – ein Land
        ohne mit der EU vergleichbares Datenschutzniveau (Risiko: Zugriff durch US-Behörden).
        Mit „Alle akzeptieren" willigst du ausdrücklich in diese Übermittlung nach Art. 49
        Abs. 1 lit. a DSGVO ein. Du kannst deine Auswahl jederzeit widerrufen oder in den
        Einstellungen anpassen.{" "}
        <Link to="/datenschutz" className="text-accent underline">
          Mehr Infos
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={openSettings}
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Einstellungen
        </button>
        <button
          type="button"
          onClick={rejectAll}
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Nur notwendige
        </button>
        <button
          type="button"
          onClick={acceptAll}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
