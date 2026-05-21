import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Lohnt sich der Service für mich?",
    a: "Ja – besonders wenn Sie einen konkreten Wunschtermin haben, einen früheren Termin als aktuell verfügbar suchen, oder keine Zeit haben täglich selbst nachzuschauen. Die Zulassungsstelle bietet auch eine direkte Online-Buchung an – manchmal sind dort spontan freie Termine verfügbar. Unser Service übernimmt die tägliche Suche automatisch für Sie.",
  },
  {
    q: "Wie schnell bekomme ich einen Termin?",
    a: "Termine bei der Kölner Zulassungsstelle sind immer 14 Tage im Voraus buchbar – täglich kommen neue Slots dazu, manchmal sogar für denselben Tag. Wir prüfen das automatisch für Sie und buchen den ersten freien Termin an einem Ihrer Wunschtage. Je mehr Tage Sie auswählen, desto höher die Erfolgswahrscheinlichkeit.",
  },
  {
    q: "Was passiert wenn kein Termin gefunden wird?",
    a: "Wir suchen täglich innerhalb Ihres gewählten Zeitraums – maximal 14 Tage. Wird in diesem Zeitraum kein passender Termin gefunden, erstatten wir Ihnen den vollen Betrag ohne Wenn und Aber.",
  },
  {
    q: "Für welche Fahrzeuge gilt der Service?",
    a: "Für die Anmeldung von Gebrauchtfahrzeugen (ausgenommen ausländische Fahrzeuge) und Neufahrzeugen (ausgenommen technisch veränderte Neufahrzeuge gem. § 13 EG-FGV) bei der Kölner Kfz-Zulassungsstelle.",
  },
  {
    q: "Was muss ich zum Termin mitbringen?",
    a: "Das hängt von Ihrem Anliegen ab. Bitte prüfen Sie vorab auf der Seite der Stadt Köln welche Unterlagen erforderlich sind. Wichtig: Bitte erscheinen Sie pünktlich – bei Verspätungen von mehr als 30 Minuten verfällt der Termin automatisch.",
  },
  {
    q: "Was ist die Bestätigungsmail der Zulassungsstelle?",
    a: "Nach unserer Buchung schickt die Kölner Zulassungsstelle automatisch eine E-Mail an Sie mit einem Bestätigungslink. Diesen müssen Sie innerhalb von 3 Stunden anklicken – sonst verfällt der Termin unwiderruflich.",
  },
  {
    q: "Was passiert wenn ich die Bestätigungsmail verpasse?",
    a: "Leider können wir keinen Ersatz garantieren wenn der Termin durch eine verpasste Bestätigung verfällt. Bitte halten Sie Ihr E-Mail-Postfach bereit sobald Sie bei uns gebucht haben.",
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
    q: "Gibt es Anliegen die ich ohne Termin erledigen kann?",
    a: "Ja – sogenannte Kurzanliegen wie Abmeldung, Adressänderung, Ersatzkennzeichen oder Feinstaubplakette können Sie ohne Termin direkt bei der Zulassungsstelle erledigen. Servicezeiten: Mo 8–12h | Di 10–15h | Mi 8–12h | Do 9–14h | Fr 8–12h. Bitte melden Sie sich beim Wachpersonal am Eingang.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function Faq() {
  return (
    <section id="faq" className="bg-secondary/40 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
