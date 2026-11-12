import { formatPrice } from "@/lib/price";
import { CITIES } from "@/lib/cities";
import type { CityContent } from "./koeln";
import type { FaqItem } from "@/components/landing/Faq";
import { bonnFaq } from "./bonn";

const R = CITIES.recklinghausen;
const PRICE = formatPrice(R.priceCents);

/** Häkchen-Liste der Service-Karte (für alle Anliegen gleich). */
export function recklinghausenPricingFeatures(): string[] {
  return ["Suche rund um die Uhr", "Standort: Zulassung Marl, Stettiner Str. 10", "Geld-zurück-Garantie", "Persönlicher Support"];
}

const NOT_FOUND_Q = "Was passiert, wenn kein Termin gefunden wird?";

export const recklinghausenFaq: FaqItem[] = [
  {
    q: "Muss ich den Termin noch bestätigen?",
    a: "Nein. Du bekommst unsere E-Mail mit allen Daten und zusätzlich die Bestätigung des Kreises Recklinghausen.",
  },
  {
    q: "Was ist die Terminnummer?",
    a: "Sie steht in unserer E-Mail und in der Bestätigung des Kreises. Vor Ort meldest du dich damit am Check-in-Terminal an.",
  },
  {
    q: "Wie läuft der Termin vor Ort ab?",
    a: "Melde dich frühestens 10 Minuten vor Beginn am Check-in-Terminal an – per QR-Code aus der Mail des Kreises oder mit deiner Terminnummer. Ohne Anmeldung wirst du nicht aufgerufen. Danach wartest du im Warteraum, bis deine Nummer erscheint.",
  },
  {
    q: "Kann ich vor Ort bar zahlen?",
    a: "Nein. Das Straßenverkehrsamt Marl nimmt nur EC-/Debitkarte oder Kreditkarte.",
  },
  {
    q: "Wo findet der Termin statt?",
    a: "In der Zulassungsstelle Marl, Stettiner Str. 10, 45770 Marl. Sie ist für den ganzen Kreis zuständig – in der Stadt Recklinghausen selbst gibt es keine eigene Zulassungsstelle.",
  },
  {
    q: "Kann ich mehrere Fahrzeuge auf einmal erledigen?",
    a: "Ja, je nach Anliegen bis zu zwei, drei oder vier Fahrzeuge pro Termin. Im Formular siehst du die Höchstzahl.",
  },
  {
    q: "Kann ich auch eine Abmeldung buchen?",
    a: "Nein, Abmeldungen vergibt der Kreis nicht als Online-Termin. Du kannst dein Fahrzeug online über i-Kfz abmelden oder vor Ort vorbeigehen.",
  },
  { q: "Wann sucht ihr?", a: "Rund um die Uhr – an allen deinen Wunschtagen." },
  {
    q: "Ich kann den Termin doch nicht wahrnehmen – was nun?",
    a: "Storniere ihn bitte über den Link in unserer E-Mail, damit er wieder frei wird.",
  },
  {
    q: "Was kostet der Service?",
    a: `${PRICE} einmalig, keine weiteren Kosten. Die Gebühren des Straßenverkehrsamts zahlst du wie gewohnt vor Ort.`,
  },
  { q: NOT_FOUND_Q, a: bonnFaq.find((f) => f.q === NOT_FOUND_Q)!.a },
];

export const recklinghausenContent: CityContent = {
  meta: {
    title: "Termin Straßenverkehrsamt Marl (Kreis Recklinghausen) – automatisch gebucht | KFZ-Termin",
    description: `Wunschtermin bei der Kfz-Zulassungsstelle Marl für den ganzen Kreis Recklinghausen: Wir suchen rund um die Uhr und buchen automatisch. ${PRICE} mit Geld-zurück-Garantie.`,
    ogTitle: "Termin Zulassungsstelle Marl (Kreis Recklinghausen) – automatisch gebucht",
    ogDescription: `Wir suchen rund um die Uhr nach freien Terminen beim Straßenverkehrsamt Marl und buchen automatisch. ${PRICE} mit Geld-zurück-Garantie.`,
  },
  hero: {
    badge: "Kreis Recklinghausen · Zulassung Marl",
    headline: "Dein Wunschtermin bei der Zulassungsstelle Marl –",
    headlineAccent: "automatisch gebucht",
    intro:
      "Für alle Städte im Kreis Recklinghausen: Du wählst Anliegen und Wunschtage, wir suchen rund um die Uhr nach frei werdenden Terminen und buchen automatisch für dich.",
    searchHoursLabel: "Suche rund um die Uhr",
    scopeLabel: "Zulassung Marl",
  },
  multi: {
    formNotice: {
      kfz: "**Wichtig:** Bitte die Daten der **künftigen Halterin / des künftigen Halters** angeben – darauf wird der Termin gebucht. Jemand anderes kann mit Vollmacht hingehen. Im Termin wird nur das gebuchte Anliegen bearbeitet.",
    },
    steps: [
      { title: "Anliegen wählen", text: "Wähle dein Anliegen und die Anzahl der Fahrzeuge." },
      { title: "Wunschtage wählen", text: "Wähle alle Tage, an denen du nach Marl kommen kannst." },
      { title: "Wir suchen für dich", text: "Wir suchen rund um die Uhr nach freien Terminen an deinen Wunschtagen." },
      { title: "Termin erhalten", text: "Du bekommst eine E-Mail von uns mit allen Infos und deiner Terminnummer, dazu die Bestätigung des Kreises mit QR-Code." },
    ],
    locationsTitle: "Die Zulassungsstelle in Marl",
    locationsNote: "Die Zulassungsstelle in Marl ist für den ganzen Kreis Recklinghausen zuständig.",
    honestNote: "",
    bookingNotice:
      "Wir suchen rund um die Uhr nach freien Terminen. Sobald wir einen gefunden haben, buchen wir ihn für dich – alle Infos bekommst du per E-Mail von uns und vom Kreis Recklinghausen.",
    servicesSubtitle: "Wähle dein Anliegen – einheitlicher Preis, keine versteckten Kosten.",
    pricingFeatures: recklinghausenPricingFeatures,
  },
  info: {
    title: "Wissenswertes zur Zulassungsstelle Marl",
    locations: R.locations.map((l) => ({ name: l.name, address: l.address })),
    phone: "02361 53-7777",
    phoneLabel: "Straßenverkehrsamt Kreis Recklinghausen",
    links: [
      { label: "Termin selbst buchen", href: R.portalUrl },
      { label: "Infos des Straßenverkehrsamts", href: "https://www.kreis-re.de/strassenverkehrsamt" },
    ],
    note:
      "Die Zulassungsstelle in Marl ist für alle zehn Städte im Kreis zuständig: Castrop-Rauxel, Datteln, Dorsten, Gladbeck, Haltern am See, Herten, Marl, Oer-Erkenschwick, Recklinghausen und Waltrop. Vor Ort zahlst du nur bargeldlos. Manche Anliegen kannst du auch online ohne Termin erledigen (i-Kfz). Unser Service lohnt sich, wenn du einen konkreten Wunschtermin brauchst oder keine Zeit hast, selbst ständig nachzuschauen.",
  },
  faq: recklinghausenFaq,
  serviceJsonLd: {
    name: "KFZ-Termin Recklinghausen – automatische Terminbuchung",
    description:
      "Automatische Terminbuchung bei der Kfz-Zulassungsstelle des Kreises Recklinghausen in Marl. Privater Dienst, nicht mit dem Kreis verbunden. Suche rund um die Uhr und automatische Buchung, sobald ein Termin an einem Wunschtag frei wird.",
    areaServed: { "@type": "AdministrativeArea", name: "Kreis Recklinghausen" },
  },
};
