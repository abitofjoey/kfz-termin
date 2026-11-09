import { formatPrice, isVatActive } from "@/lib/price";
import { cityOrDefault } from "@/lib/cities";
import { useState, useRef } from "react";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import {
  POPULAR_SERVICES,
  MORE_SERVICES,
  type ServiceId,
} from "@/lib/services";


/** Minimal-Form eines Anliegens für Kacheln und Karte (Köln-Service oder Stadt-Service). */
export type PricingItem = {
  id: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  note?: string;
  infoUrl?: string;
  cardTitle?: string;
};

export type PricingGroup = {
  key: string;
  label: string;
  popular: PricingItem[];
  more: PricingItem[];
};

type KoelnProps = {
  onSelect: (service: ServiceId) => void;
};

type CityProps = {
  /** Bereiche mit Umschalter (z. B. Kfz-Zulassung | Führerschein). */
  groups: PricingGroup[];
  cityName: string;
  price: string;
  subtitle: string;
  features: (item: PricingItem, groupKey: string) => string[];
  onSelect: (id: string, groupKey: string) => void;
};

const features = [
  "Suche täglich von 6 bis 20 Uhr",
  "Bis zu 14 Tage Suchzeitraum",
  "Geld-zurück-Garantie",
  "Persönlicher Support",
];

const KOELN_GROUPS: PricingGroup[] = [
  { key: "kfz", label: "", popular: POPULAR_SERVICES, more: MORE_SERVICES },
];

/** Köln: unverändert. */
export function Pricing({ onSelect, city }: KoelnProps & { city?: string }) {
  const c = cityOrDefault(city);
  return (
    <ServicePricing
      groups={KOELN_GROUPS}
      cityName={c.name}
      price={formatPrice(c.priceCents)}
      subtitle="Wähle deine Dienstleistung – einheitlicher Preis, keine versteckten Kosten."
      features={() => features}
      onSelect={(id) => onSelect(id as ServiceId)}
      initialId="gebraucht"
    />
  );
}

/** Stadtfähige Service-Auswahl mit optionalem Bereichs-Umschalter. */
export function ServicePricing({
  groups,
  cityName,
  price,
  subtitle,
  features: featuresFor,
  onSelect,
  initialId,
}: CityProps & { initialId?: string }) {
  const [groupKey, setGroupKey] = useState(groups[0].key);
  const group = groups.find((g) => g.key === groupKey) ?? groups[0];
  const all = [...group.popular, ...group.more];
  const [activeId, setActiveId] = useState<string>(initialId ?? all[0].id);
  const [showMore, setShowMore] = useState(false);
  const active = all.find((s) => s.id === activeId) ?? all[0];
  const cardRef = useRef<HTMLDivElement>(null);

  const switchGroup = (key: string) => {
    if (key === groupKey) return;
    const next = groups.find((g) => g.key === key)!;
    setGroupKey(key);
    // Erste Kachel des Bereichs wählen, damit die Karte nie leer ist.
    setActiveId(next.popular[0]?.id ?? next.more[0].id);
    setShowMore(false);
  };

  const handleBadgeClick = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const renderTile = (s: PricingItem) => {
    const isActive = s.id === activeId;
    return (
      <button
        key={s.id}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => handleBadgeClick(s.id)}
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
  };

  return (
    <section id="preise" aria-labelledby="preise-heading" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="preise-heading" className="text-3xl font-bold sm:text-4xl">Unsere Services</h2>
          <p className="mt-4 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {groups.length > 1 ? (
          <div className="mt-8 flex justify-center">
            <div role="radiogroup" aria-label="Bereich wählen" className="inline-grid grid-cols-2 rounded-lg border border-border bg-muted p-1">
              {groups.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  role="radio"
                  aria-checked={g.key === groupKey}
                  onClick={() => switchGroup(g.key)}
                  className={[
                    "rounded-md px-4 py-2 text-sm font-semibold transition sm:px-6",
                    g.key === groupKey ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Kachel-Auswahl + Karte */}
        <div ref={cardRef} className="scroll-mt-4">
          <div
            role="tablist"
            aria-label="Dienstleistung wählen"
            className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
          >
            {group.popular.map(renderTile)}
          </div>

          <div
            id="weitere-anliegen"
            role="tablist"
            aria-label="Weitere Dienstleistungen"
            hidden={!showMore}
            className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-3 sm:gap-3"
          >
            {group.more.map(renderTile)}
          </div>

          {group.more.length > 0 ? (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
              aria-controls="weitere-anliegen"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary transition hover:bg-accent/30"
            >
              {showMore
                ? "Weniger anzeigen"
                : `Weitere Anliegen anzeigen (${group.more.length})`}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
          ) : null}


          {/* Dynamische Karte */}
          <div className="mx-auto mt-8 max-w-xl">

          <div className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-bold">{active.cardTitle ?? active.label}</h3>
              {active.infoUrl ? (
                <a
                  href={active.infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  aria-label={`Mehr Infos zu ${active.cardTitle ?? active.label} bei der Stadt ${cityName}`}
                  title={`Mehr Infos bei der Stadt ${cityName}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Infos Stadt {cityName}</span>
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{active.subtitle}</p>
            {active.note ? (
              <p className="mt-1 text-xs text-muted-foreground">{active.note}</p>
            ) : null}

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-primary">{price}</span>
              <span className="text-sm text-muted-foreground">einmalig{isVatActive() ? " · inkl. 19 % USt." : ""}</span>
            </div>

            <ul className="mt-6 space-y-2">
              {featuresFor(active, group.key).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onSelect(active.id, group.key)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Jetzt buchen
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
