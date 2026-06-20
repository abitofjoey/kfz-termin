import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Lukas M.",
    service: "Ummeldung",
    quote:
      "Auftrag morgens abgeschickt – keine Stunde später kam die Mail mit dem Termin für den nächsten Tag. Damit hatte ich ehrlich nicht gerechnet. Top.",
  },
  {
    name: "Sabine K.",
    service: "Wunschkennzeichen",
    quote:
      "Ich brauchte kurzfristig einen Termin und hatte wenig Hoffnung, online noch etwas Passendes zu finden. Noch am selben Tag kam die Bestätigung – Termin in drei Tagen. Hat sich für mich wirklich gelohnt.",
  },
  {
    name: "Markus B.",
    service: "Neuzulassung",
    quote:
      "Hatte noch eine Frage zur FIN und einfach kurz angerufen. Wurde direkt und freundlich erklärt, ging super unkompliziert.",
  },
  {
    name: "Jonas R.",
    service: "Außerbetriebsetzung",
    quote:
      "Formular ausgefüllt, bezahlt, fertig. Musste nichts mehr machen, bis die Bestätigungsmail kam. Genau so soll's sein.",
  },
];

export function Testimonials() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Erfahrungen unserer Kund:innen
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Das sagen Personen, die KFZ-Termin Köln bereits genutzt haben.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex gap-0.5" aria-label="5 von 5 Sternen">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground">
                  „{t.quote}"
                </p>
                <div className="border-t border-border pt-3">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.service}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
