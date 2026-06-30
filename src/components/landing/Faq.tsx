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
    a: "Es ist nicht genau vorhersagbar – es kann wenige Minuten dauern, wenn gerade ein Slot frei wird, aber auch einige Tage. Unser System prüft täglich von 7 bis 18 Uhr und bucht sofort den ersten freien Termin an einem deiner Wunschtage. Je mehr Tage du auswählst, desto höher die Wahrscheinlichkeit und desto schneller geht es.",
  },
  {
    q: "Welche Tage soll ich im Kalender auswählen?",
    a: "Du wählst Tage, an denen du Zeit hast. Wir buchen dir nur einen einzigen Termin – den ersten freien Slot an einem deiner Wunschtage. Je mehr Tage du wählst, desto höher die Chance und desto schneller geht es.",
  },
  {
    q: "Was ist die FIN und wo finde ich sie?",
    a: "Die FIN ist die Fahrzeug-Identifizierungsnummer deines Autos. Wir benötigen nur die letzten 4 Zeichen – diese findest du in deinem Fahrzeugschein (Zulassungsbescheinigung Teil I) unter dem Feld „E\". Pro Termin können bis zu 3 Fahrzeuge angemeldet werden – du kannst im Buchungsformular weitere FIN-Felder hinzufügen.",
  },
  {
    q: "Kann ich mehrere Fahrzeuge in einem Termin anmelden?",
    a: "Ja, du kannst bis zu 3 Fahrzeuge in einem Termin anmelden. Im Buchungsformular fügst du über „+ Weiteres Fahrzeug hinzufügen\" einfach die FIN-Endung jedes weiteren Fahrzeugs hinzu. Der Preis bleibt pauschal 9,99 € pro Termin, unabhängig von der Anzahl der Fahrzeuge.",
  },
  {
    q: "Wie werde ich informiert wenn ein Termin gefunden wurde?",
    a: "Sobald wir einen Termin für dich gebucht haben, bekommst du automatisch eine E-Mail direkt von der Kölner Zulassungsstelle mit deinem persönlichen Bestätigungslink.",
  },
  {
    q: "Was ist die Bestätigungsmail der Zulassungsstelle?",
    a: "Nach unserer Buchung schickt die Kölner Zulassungsstelle automatisch eine E-Mail mit einem Bestätigungslink. Diesen musst du innerhalb von 3 Stunden anklicken – sonst verfällt der Termin unwiderruflich. Prüfe regelmäßig nach unserer Buchungsbestätigung dein Postfach – auch den Spam-Ordner.",
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
