import type { CityService } from "@/lib/services";
import { formatPrice } from "@/lib/price";
import { CITIES, KOELN_PRICE_CENTS } from "@/lib/cities";
import type { ServiceCategory } from "@/lib/cities";

const K = CITIES.koeln;
const H = K.customerConfirmationHours;
const SH = K.searchHours;

const PRICE = formatPrice(KOELN_PRICE_CENTS);
import type { FaqItem } from "@/components/landing/Faq";
import type { HeroContent } from "@/components/landing/Hero";
import type { InfoContent } from "@/components/landing/InfoBlock";

export type CityContent = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string; ogImage?: string; ogImageAlt?: string };
  hero: HeroContent;
  /** Infokasten mit einem Standort (Köln). */
  info?: InfoContent;
  /** Zusatzinhalte für Städte mit mehreren Standorten (z.B. Bonn). */
  multi?: {
    steps: { title: string; text: string }[];
    locationsTitle: string;
    locationsNote: string;
    honestNote: string;
    bookingNotice: string;
    /** Hinweis über dem Formular: wessen Daten eingetragen werden, je Bereich. **fett** wird fett dargestellt. */
    formNotice?: Partial<Record<ServiceCategory, string>>;
    /** Untertitel des Abschnitts "Unsere Services". */
    servicesSubtitle?: string;
    /** Häkchen-Liste der Service-Karte je Anliegen. */
    pricingFeatures?: (service: CityService) => string[];
  };
  /** Texte der Einzelstandort-Seite (Ablauf, Formularhinweise). */
  single?: {
    stepsIntro: string;
    steps: { title: string; text: string }[];
    /** Hinweis über dem Formular: wessen Daten eingetragen werden. **fett** wird fett dargestellt. */
    formNotice: string;
    emailHint: string;
  };
  faq: FaqItem[];
  /** Zusätzliche Felder für das Service-JSON-LD. */
  serviceJsonLd: { name: string; description: string; areaServed?: { "@type": "City" | "AdministrativeArea"; name: string } };
};

export const koelnFaq: FaqItem[] = [
  {
    q: "Lohnt sich der Service für mich?",
    a: `Ja – besonders wenn du kurzfristig einen Termin brauchst, einen konkreten Wunschzeitraum hast oder keine Zeit hast täglich selbst nachzuschauen. Die direkte Online-Buchung der Zulassungsstelle ist oft wochenlang ausgebucht – unser Service findet auch kurzfristig freie Slots, zum Beispiel wenn du gerade ein Auto gekauft hast, umgezogen bist oder eine Frist läuft. Termine beim Straßenverkehrsamt Köln sind deshalb so schwer zu bekommen, weil die Nachfrage sehr hoch ist und neue Slots meist nur zu bestimmten Zeiten freigegeben werden – oft sind sie innerhalb weniger Minuten vergeben. Die ${PRICE} lohnen sich, wenn du nicht jeden Morgen selbst die Seite der Stadt Köln prüfen kannst oder willst. Wer regelmäßig Zeit dafür hat, braucht den Service nicht.`,
  },
  {
    q: "Was kostet der Service?",
    a: `${PRICE} einmalig, keine weiteren Kosten. Wird in deinem Zeitraum kein Termin frei, kannst du einmalig neue Wunschtermine wählen oder bekommst den vollen Betrag zurück – ohne Wenn und Aber.`,
  },
  {
    q: "Wie schnell bekomme ich einen Termin?",
    a: "Es ist nicht genau vorhersagbar – es kann wenige Minuten dauern, wenn gerade ein Slot frei wird, aber auch einige Tage. Unser System prüft täglich von 6 bis 20 Uhr und bucht sofort den ersten freien Termin an einem deiner Wunschtage. Je mehr Tage du auswählst, desto höher die Wahrscheinlichkeit und desto schneller geht es.",
  },
  {
    q: "Welche Tage soll ich im Kalender auswählen?",
    a: "Du wählst Tage, an denen du Zeit hast. Wir buchen dir nur einen einzigen Termin – den ersten freien Slot an einem deiner Wunschtage. Je mehr Tage du wählst, desto höher die Chance und desto schneller geht es.",
  },
  {
    q: "Was ist die FIN und wo finde ich sie?",
    a: "Die FIN ist die Fahrzeug-Identifizierungsnummer deines Autos. Wir benötigen nur die letzten 4 Zeichen – diese findest du in deinem Fahrzeugschein (Zulassungsbescheinigung Teil I) unter dem Feld „E\". Pro Termin können bis zu 3 Fahrzeuge angemeldet werden (bei einigen Anliegen höchstens 2) – du kannst im Buchungsformular weitere FIN-Felder hinzufügen.",
  },
  {
    q: "Kann ich mehrere Fahrzeuge in einem Termin anmelden?",
    a: `Ja, du kannst bis zu 3 Fahrzeuge in einem Termin anmelden, bei einigen Anliegen höchstens 2. Im Buchungsformular fügst du über „+ Weiteres Fahrzeug hinzufügen" einfach die FIN-Endung jedes weiteren Fahrzeugs hinzu. Der Preis bleibt pauschal ${PRICE} pro Termin, unabhängig von der Anzahl der Fahrzeuge.`,
  },
  {
    q: "Wie werde ich informiert wenn ein Termin gefunden wurde?",
    a: "Sobald wir einen Termin für dich gebucht haben, bekommst du zwei E-Mails: eine von uns mit Datum und Uhrzeit und eine von der Kölner Zulassungsstelle mit deinem persönlichen Bestätigungslink.",
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
    a: "Wir suchen täglich innerhalb deines gewählten Zeitraums – maximal 14 Tage. Wird kein Termin frei, bekommst du automatisch eine E-Mail: Du kannst einmalig neue Wunschtermine wählen, ohne erneut zu bezahlen, oder dir mit einem Klick den vollen Betrag erstatten lassen. Meldest du dich nicht innerhalb von 48 Stunden, erstatten wir automatisch.",
  },
  {
    q: "Kann ich den Auftrag stornieren?",
    a: "Ja – solange noch kein Termin gebucht wurde, kannst du jederzeit per Mail an info@kfz-termin.online stornieren. Nach erfolgter Buchung gilt die Leistung als erbracht.",
  },
  {
    q: "Für welche Anliegen gilt der Service?",
    a: "Wir unterstützen alle 19 auf dieser Seite aufgeführten Anliegen – von der An- und Abmeldung über Kennzeichenwechsel, Anschriften- und Namensänderung, technische Änderungen bis hin zu H-Kennzeichen, Saison-, Kurzzeit- und Ausfuhrkennzeichen, Feinstaubplakette, Ersatz des Fahrzeugscheins und Neusiegelung sowie Verlust und Abholung des Fahrzeugbriefs, Zulassung importierter Fahrzeuge und technisch veränderter Neufahrzeuge (§ 13 EG-FGV). Über die \"Infos Stadt Köln\"-Links bei jedem Service findest du die offiziellen Details direkt auf der Seite der Stadt Köln. Die häufigsten Anliegen sind: KFZ anmelden für Neufahrzeuge und Gebrauchtfahrzeuge, Auto ummelden nach Umzug oder Kauf, Kennzeichenwechsel, Wiederzulassung, H-Kennzeichen und Saisonkennzeichen.",
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

export const koelnContent: CityContent = {
  meta: {
    title: "Dein Wunschtermin bei der Kölner Zulassungsstelle – automatisch gebucht",
    description:
      `Dein Wunschtermin bei der Kölner Zulassungsstelle – automatisch gebucht. Für KFZ-Zulassung, Auto anmelden, Ummeldung & Abmeldung. ${PRICE} mit Geld-zurück-Garantie.`,
    ogTitle: "Dein Wunschtermin bei der Kölner Zulassungsstelle – automatisch gebucht",
    ogDescription:
      `Dein Wunschtermin bei der Kölner Zulassungsstelle – automatisch gebucht. Für KFZ-Zulassung, Auto anmelden, Ummeldung & Abmeldung. ${PRICE} mit Geld-zurück-Garantie.`,
    ogImage: "https://kfz-termin.online/og-image.jpg",
    ogImageAlt: "KFZ-Termin – Logo",
  },
  hero: {
    badge: "Zulassungsstelle Köln",
    headline: "Dein Wunschtermin bei der Kölner Zulassungsstelle –",
    headlineAccent: "automatisch gebucht.",
    intro:
      "Kein freier Termin, keiner der zeitlich passt – oder du brauchst ihn einfach kurzfristig? Wir übernehmen die Suche und buchen automatisch sobald ein Slot frei wird.",
    searchHoursLabel: "Suche täglich von 6 bis 20 Uhr",
    scopeLabel: "Nur Zulassungsstelle Köln",
  },
  info: {
    title: "Wissenswertes zur Kölner Zulassungsstelle",
    address: "Max-Glomsda-Straße 4, 51105 Köln",
    openingHours: "Mo 7–14h | Di 7–18h | Mi 7–13h | Do 7–16h | Fr 7–13h",
    phone: "0221 / 221-26635",
    links: [
      { label: "Termin selbst buchen", href: "https://termine.stadt-koeln.de/m/kfz-zulassung/extern/calendar/?uid=67523a04-37af-4131-9495-0a3566e0eb8b" },
      { label: "Kfz-Zulassung Online (i-Kfz)", href: "https://www.stadt-koeln.de/service/produkt/kfz-zulassung-online" },
    ],
    note:
      "Manche Anliegen kannst du komplett online ohne Termin erledigen. Unser Service lohnt sich, wenn du einen konkreten Wunschtermin brauchst oder keine Zeit hast, täglich selbst nachzuschauen.",
  },
  single: {
    stepsIntro: `In fünf einfachen Schritten zu deinem Termin bei der ${K.adjective} Zulassungsstelle.`,
    steps: [
      { title: "Daten eingeben", text: "Formular in rund 2 Minuten ausfüllen und Wunschtage auswählen." },
      { title: "Sicher bezahlen", text: "Sichere Zahlung per Kreditkarte oder PayPal über Stripe." },
      { title: "Wir suchen für dich", text: `Unser System prüft täglich von ${SH.from}–${SH.to} Uhr auf einen freien Slot an einem deiner Wunschtage – du musst nichts tun.` },
      { title: "Bestätigungs-E-Mail erhalten", text: `Sobald ein Termin reserviert ist, bekommst du eine E-Mail von uns und eine von der ${K.pages.authorityShort} mit dem Bestätigungslink.` },
      { title: "Termin bestätigen", text: `Bitte bestätige den Termin innerhalb von ${H} Stunden per Klick in der E-Mail – andernfalls verfällt die Reservierung.` },
    ],
    formNotice:
      "**Wichtig:** Bitte die Daten der **künftigen Halterin / des künftigen Halters** angeben – darauf wird der Termin gebucht. Jemand anderes kann mit Vollmacht hingehen. Pro E-Mail-Adresse ist nur eine Buchung möglich.",
    emailHint: `Sobald wir einen Termin gefunden haben, schickt dir die ${K.adjective} Zulassungsstelle eine Bestätigungsmail – bitte klicke den Link darin innerhalb von ${H} Stunden an.`,
  },
  faq: koelnFaq,
  serviceJsonLd: {
    name: "KFZ-Termin – Zulassungsstelle Köln",
    description:
      "Automatisierte Terminbuchung für die Kfz-Zulassungsstelle Köln. Tägliche Suche nach freien Slots und automatische Buchung, sobald ein Termin passt.",
  },
};
