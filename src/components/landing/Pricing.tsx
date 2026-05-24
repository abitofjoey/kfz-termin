import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { SERVICES, type ServiceId, getService } from "@/lib/services";

type Props = {
  onSelect: (service: ServiceId) => void;
};

const features = [
  "Tägliche Suche 7–18 Uhr",
  "Bis zu 14 Tage Suchzeitraum",
  "Geld-zurück-Garantie",
  "Persönlicher Support",
];

export function Pricing({ onSelect }: Props) {
  const [activeId, setActiveId] = useState<ServiceId>("gebraucht");
  const active = getService(activeId);

  return (
    <section id="preise" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Unsere Services</h2>
          <p className="mt-4 text-muted-foreground">
            Wählen Sie Ihre Dienstleistung – einheitlicher Preis, keine versteckten Kosten.
          </p>
        </div>

        {/* Kachel-Auswahl */}
        <div
          role="tablist"
          aria-label="Dienstleistung wählen"
          className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
        >
          {SERVICES.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(s.id)}
                className={[
                  "rounded-lg border px-3 py-3 text-center text-sm font-medium transition",
                  "min-h-[3.25rem] flex items-center justify-center",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/30",
                ].join(" ")}
              >
                {s.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Dynamische Karte */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-bold">{active.label}</h3>
              {active.infoUrl ? (
                <a
                  href={active.infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  aria-label={`Mehr Infos zu ${active.label} bei der Stadt Köln`}
                  title="Mehr Infos bei der Stadt Köln"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Infos Stadt Köln</span>
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{active.subtitle}</p>
            {active.note ? (
              <p className="mt-1 text-xs text-muted-foreground">{active.note}</p>
            ) : null}

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-primary">19€</span>
              <span className="text-sm text-muted-foreground">einmalig</span>
            </div>

            <ul className="mt-6 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onSelect(active.id)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Jetzt buchen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
