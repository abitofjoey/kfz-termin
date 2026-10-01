import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Mona Liskow",
    service: "Google Rezension",
    quote:
      "Klasse Tool für eine schnelle Terminvergabe. Sehr intuitiv aufgebaut, hat alles problemlos geklappt. Würde ich jedem empfehlen, der kurzfristig einen KFZ-Termin benötigt.",
  },
  {
    name: "Konstantin Inspektor",
    service: "Google Rezension",
    quote:
      "Reibungsloser Vorgang von der Bezahlung bis zum Termin in der KFZ-Stelle Köln. Vertrauenswürdiger Anbieter. 100% Weiterempfehlung!",
  },
  {
    name: "Mario T",
    service: "Google Rezension",
    quote: "Top service",
  },
  {
    name: "M. K.",
    service: "Google Rezension",
    quote:
      "Top. Termin schon am Folgetag erhalten und damit das Fahrzeug anmelden können. Dies bei total nettem Kontakt. Besser geht nicht!",
  },
];

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 id="testimonials-heading" className="text-2xl font-bold sm:text-3xl">
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
                <div className="flex gap-0.5" role="img" aria-label="5 von 5 Sternen">
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
