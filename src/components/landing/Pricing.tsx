import { Check } from "lucide-react";

type Props = {
  onSelect: (service: "gebraucht" | "neu") => void;
};

const features = [
  "Tägliche Suche 7–18 Uhr",
  "Bis zu 14 Tage Suchzeitraum",
  "Geld-zurück-Garantie",
  "Persönlicher Support",
];

export function Pricing({ onSelect }: Props) {
  return (
    <section id="preise" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Preise</h2>
          <p className="mt-4 text-muted-foreground">
            Transparent und fair. Keine versteckten Kosten.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <PriceCard
            title="Anmeldung Gebrauchtfahrzeug"
            subtitle="Umschreibung nach Zuzug oder bei Verkauf / Halterwechsel"
            note="Ausgenommen ausländische Fahrzeuge"
            onClick={() => onSelect("gebraucht")}
          />
          <PriceCard
            title="Anmeldung Neufahrzeug"
            subtitle="Erstzulassung Ihres neuen Fahrzeugs"
            note="Ausgenommen technisch veränderte Neufahrzeuge gem. § 13 EG-FGV"
            onClick={() => onSelect("neu")}
          />
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  title,
  subtitle,
  note,
  onClick,
}: {
  title: string;
  subtitle: string;
  note: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition hover:shadow-md">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-bold text-primary">19€</span>
        <span className="text-sm text-muted-foreground">einmalig</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Gesamtpreis, keine USt. gem. § 19 UStG (Kleinunternehmer)
      </p>


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
        onClick={onClick}
        className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Jetzt buchen
      </button>
    </div>
  );
}
