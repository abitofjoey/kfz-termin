import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export type InfoContent = {
  title: string;
  /** Eine Adresse (Köln) … */
  address?: string;
  /** … oder mehrere Standorte (Bonn). */
  locations?: { name: string; address: string }[];
  openingHours?: string;
  phone: string;
  /** Zusatz zum Telefon, z.B. "Bürgerdienste der Stadt Bonn". */
  phoneLabel?: string;
  links: { label: string; href: string }[];
  note: string;
};

export function InfoBlock({ content }: { content: InfoContent }) {
  return (
    <section aria-labelledby="info-heading" className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-border bg-muted/50 p-8">
          <h2 id="info-heading" className="text-xl font-bold">
            {content.title}
          </h2>
          <dl className="mt-6 space-y-3 text-sm">
            {content.address ? (
            <div>
              <dt className="flex gap-3 font-semibold">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Adresse</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">{content.address}</dd>
            </div>
            ) : null}
            {content.locations?.map((l) => (
            <div key={l.name}>
              <dt className="flex gap-3 font-semibold">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{l.name}</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">{l.address}</dd>
            </div>
            ))}
            {content.openingHours ? (
            <div>
              <dt className="flex gap-3 font-semibold">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Öffnungszeiten</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">{content.openingHours}</dd>
            </div>
            ) : null}
            <div>
              <dt className="flex gap-3 font-semibold">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Telefon{content.phoneLabel ? ` (${content.phoneLabel})` : ""}</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">{content.phone}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            {content.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {l.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{content.note}</p>
        </div>
      </div>
    </section>
  );
}
