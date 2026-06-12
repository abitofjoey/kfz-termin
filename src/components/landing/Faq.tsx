import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Lohnt sich der Service für mich?",
    a: "Ja – besonders wenn du kurzfristig einen Termin brauchst, einen konkreten Wunschzeitraum hast oder keine Zeit hast täglich selbst nachzuschauen. Die direkte Online-Buchung der Zulassungsstelle ist oft wochenlang ausgebucht – unser Service findet auch kurzfristig freie Slots, zum Beispiel wenn du gerade ein Auto gekauft hast, umgezogen bist oder eine Frist läuft.",
  },
  {
    q: "Was kostet der Service?",
    a: "9,99 € einmalig, keine weiteren Kosten. Wird innerhalb deines gewählten Zeitraums kein Termin gefunden, erstatten wir dir den vollen Betrag – ohne Wenn und Aber.",
  },
  {
    q: "Wie schnell bekomme ich einen Termin?",
    a: "Termine bei der Kölner Zulassungsstelle sind immer 14 Tage im Voraus buchbar – täglich kommen neue Slots dazu, manchmal sogar für denselben Tag. Wir prüfen das täglich von 7 bis 18 Uhr und buchen den ersten freien Termin an einem deiner Wunschtage.",
  },
  {
    q: "Welche Tage soll ich im Kalender auswählen?",
    a: "Je mehr Tage du auswählst, desto schneller finden wir einen Termin. Für den frühestmöglichen Termin empfehlen wir alle verfügbaren Tage anzuhaken – das System bucht dann den ersten freien Slot.",
  },
  {
    q: "Was ist die FIN und wo finde ich sie?",
    a: "Die FIN ist die Fahrzeug-Identifizierungsnummer deines Autos. Wir benötigen nur die letzten 4 Zeichen – diese findest du in deinem Fahrzeugschein (Zulassungsbescheinigung Teil I) unter dem Feld „E\".",
  },
  {
    q: "Wie werde ich informiert wenn ein Termin gefunden wurde?",
    a: "Sobald wir einen Termin für dich gebucht haben, bekommst du automatisch eine E-Mail direkt von der Kölner Zulassungsstelle mit deinem persönlichen Bestätigungslink.",
  },
  {
    q: "Was ist die Bestätigungsmail der Zulassungsstelle?",
    a: "Nach unserer Buchung schickt die Kölner Zulassungsstelle automatisch eine E-Mail mit einem Bestätigungslink. Diesen musst du innerhalb von 3 Stunden anklicken – sonst verfällt der Termin unwiderruflich. Tipp: Prüfe direkt nach unserer Buchungsbestätigung dein Postfach – auch den Spam-Ordner.",
  },
  {
    q: "Was passiert wenn ich die Bestätigungsmail verpasse?",
    a: "In diesem Fall verfällt der Termin und wir können leider keinen neuen garantieren. Halte dein Postfach im Blick sobald du gebucht hast – auch den Spam-Ordner.",
  },
  {
    q: "Was passiert wenn kein Termin gefunden wird?",
    a: "Wir suchen täglich innerhalb deines gewählten Zeitraums – maximal 14 Tage. Wird kein passender Termin gefunden, erstatten wir dir den vollen Betrag. Schreib uns dazu einfach eine kurze Mail an info@kfz-termin.online.",
  },
  {
    q: "Kann ich den Auftrag stornieren?",
    a: "Ja – solange noch kein Termin gebucht wurde, kannst du jederzeit per Mail an info@kfz-termin.online stornieren. Nach erfolgter Buchung gilt die Leistung als erbracht.",
  },
  {
    q: "Für welche Anliegen gilt der Service?",
    a: "Wir unterstützen alle auf dieser Seite aufgeführten Anliegen – von der Fahrzeuganmeldung über Kennzeichenwechsel und technische Änderungen bis hin zu H-Kennzeichen, Saisonkennzeichen und mehr. Über die \"Infos Stadt Köln\"-Links bei jedem Service findest du die offiziellen Details direkt auf der Seite der Stadt Köln.",
  },
  {
    q: "Was muss ich zum Termin mitbringen?",
    a: "Das hängt von deinem Anliegen ab. Über die \"Infos Stadt Köln\"-Links bei jedem Service oben auf dieser Seite findest du die offiziellen Informationen mit den genauen Unterlagen. Wichtig: Bitte erscheine pünktlich – bei Verspätungen von mehr als 30 Minuten verfällt der Termin automatisch.",
  },
  {
    q: "Kann ich eine Uhrzeit wählen?",
    a: "Nein. Wir buchen den erstmöglichen freien Slot an einem deiner Wunschtage. Eine Uhrzeitauswahl ist aktuell nicht möglich.",
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
