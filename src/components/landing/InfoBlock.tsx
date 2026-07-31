import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export function InfoBlock() {
  return (
    <section aria-labelledby="info-heading" className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-border bg-muted/50 p-8">
          <h2 id="info-heading" className="text-xl font-bold">
            Wissenswertes zur Kölner Zulassungsstelle
          </h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="flex gap-3 font-semibold">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Adresse</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">
                Max-Glomsda-Straße 4, 51105 Köln
              </dd>
            </div>
            <div>
              <dt className="flex gap-3 font-semibold">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Öffnungszeiten</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">
                Mo 7–14h | Di 7–18h | Mi 7–13h | Do 7–16h | Fr 7–13h
              </dd>
            </div>
            <div>
              <dt className="flex gap-3 font-semibold">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Telefon</span>
              </dt>
              <dd className="pl-7 text-muted-foreground">0221 / 221-26635</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a
              href="https://termine.stadt-koeln.de/m/kfz-zulassung/extern/calendar/?uid=67523a04-37af-4131-9495-0a3566e0eb8b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Termin selbst buchen <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.stadt-koeln.de/service/produkt/kfz-zulassung-online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Kfz-Zulassung Online (i-Kfz){" "}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Manche Anliegen kannst du komplett online ohne Termin erledigen.
            Unser Service lohnt sich, wenn du einen konkreten Wunschtermin
            brauchst oder keine Zeit hast, täglich selbst nachzuschauen.
          </p>
        </div>
      </div>
    </section>
  );
}
