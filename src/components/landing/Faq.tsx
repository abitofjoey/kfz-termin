import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Wie schnell bekomme ich einen Termin?",
    a: "Das hängt von Ihrer Flexibilität ab. Mit mindestens 5 Wunschtagen gelingt die Buchung häufig innerhalb von 24 bis 48 Stunden. Wir suchen täglich von 7 bis 18 Uhr.",
  },
  {
    q: "Was passiert wenn kein Termin gefunden wird?",
    a: "Wir suchen so lange wie Ihr gewählter Wunschzeitraum geht – maximal 14 Tage. Wird in diesem Zeitraum kein passender Termin gefunden, erstatten wir Ihnen den vollen Betrag.",
  },
  {
    q: "Kann ich eine Uhrzeit wählen?",
    a: "Nein. Wir buchen den erstmöglichen freien Slot an einem Ihrer Wunschtage. Eine Uhrzeitauswahl ist nicht möglich.",
  },
  {
    q: "Muss ich einen Account anlegen?",
    a: "Nein. Kein Login, kein Passwort. Alles läuft über Ihre E-Mail-Adresse.",
  },
  {
    q: "Was ist die Bestätigungsmail der Zulassungsstelle?",
    a: "Nach unserer Buchung schickt die Kölner Zulassungsstelle automatisch eine E-Mail an Sie mit einem Bestätigungslink. Diesen müssen Sie innerhalb von 1 Stunde anklicken – sonst verfällt der Termin.",
  },
  {
    q: "Was passiert wenn ich die Bestätigungsmail verpasse?",
    a: "Leider können wir keinen Ersatz garantieren wenn der Termin durch eine verpasste Bestätigung verfällt. Bitte halten Sie Ihr Postfach bereit sobald Sie bei uns gebucht haben.",
  },
  {
    q: "Für welche Fahrzeuge gilt der Service?",
    a: "Für die Anmeldung von Gebrauchtfahrzeugen (ausgenommen ausländische Fahrzeuge) und Neufahrzeugen (ausgenommen technisch veränderte Neufahrzeuge gem. § 13 EG-FGV) bei der Kölner Zulassungsstelle.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Häufige Fragen</h2>
          <p className="mt-4 text-muted-foreground">
            Antworten auf die wichtigsten Fragen zu unserem Service.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
