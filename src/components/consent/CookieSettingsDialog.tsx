import { useEffect, useState } from "react";
import { useConsent } from "@/lib/consent";

export function CookieSettingsDialog() {
  const { settingsOpen, closeSettings, state, savePartial, acceptAll, hydrated } = useConsent();
  const [analytics, setAnalytics] = useState(state.categories.analytics);
  const [marketing, setMarketing] = useState(state.categories.marketing);

  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(state.categories.analytics);
      setMarketing(state.categories.marketing);
    }
  }, [settingsOpen, state.categories.analytics, state.categories.marketing]);

  if (!hydrated || !settingsOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSettings();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 id="cookie-settings-title" className="text-lg font-semibold text-foreground">
            Cookie-Einstellungen
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Wähle, welche Kategorien wir nutzen dürfen. Du kannst deine Auswahl jederzeit ändern.
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Row
            title="Notwendig"
            description="Für den Betrieb der Website und der Buchung erforderlich. Immer aktiv."
            checked
            disabled
          />
          <Row
            title="Analyse (Google Tag Manager, Google Analytics 4, Hotjar)"
            description="Lädt den Google Tag Manager und hilft uns, Nutzung und Probleme zu verstehen (anonymisierte Statistiken, Heatmaps, Session-Aufzeichnungen)."
            checked={analytics}
            onChange={setAnalytics}
          />
          <Row
            title="Marketing (Google Ads)"
            description="Misst Erfolg unserer Werbeanzeigen (Conversion-Tracking, Remarketing)."
            checked={marketing}
            onChange={setMarketing}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-muted px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeSettings}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-background/80"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => savePartial({ analytics, marketing })}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-background/80"
          >
            Auswahl speichern
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
    </div>
  );
}

function Row({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span className="flex-1">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-5 w-5 accent-primary disabled:opacity-60"
      />
    </label>
  );
}
