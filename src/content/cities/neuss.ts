import { formatPrice } from "@/lib/price";
import { CITIES } from "@/lib/cities";
import type { CityContent } from "./koeln";
import type { FaqItem } from "@/components/landing/Faq";
import { bonnFaq } from "./bonn";

const N = CITIES.neuss;
const PRICE = formatPrice(N.priceCents);

/** Häkchen-Liste der Service-Karte (für alle Anliegen gleich). */
export function neussPricingFeatures(): string[] {
  return ["Suche rund um die Uhr", "4 Standorte im Kreis", "Geld-zurück-Garantie", "Persönlicher Support"];
}

const NOT_FOUND_Q = "Was passiert, wenn kein Termin gefunden wird?";

export const neussFaq: FaqItem[] = [
  {
    q: "Muss ich den Termin noch bestätigen?",
    a: "Nein. Du bekommst unsere E-Mail mit allen Daten und zusätzlich die Bestätigung des Rhein-Kreises Neuss.",
  },
  {
    q: "Warum fragt ihr nach meinem Geburtsdatum?",
    a: "Der Rhein-Kreis Neuss verlangt es bei jeder Online-Terminbuchung. Vor Ort kannst du deinen Termin damit auch am Terminal aktivieren, falls du den QR-Code nicht dabei hast. Wir geben es nur an den Kreis weiter und löschen es nach Abschluss automatisch.",
  },
  {
    q: "Welchen Standort soll ich wählen?",
    a: "Alle vier Standorte sind für den ganzen Kreis zuständig. Wählst du „egal“, buchen wir den ersten passenden Termin. Willst du nur an bestimmte Standorte, wähle sie aus.",
  },
  {
    q: "Kann jemand anderes für mich hingehen?",
    a: "Ja, mit Vollmacht. Gebucht wird der Termin aber immer auf die Person, um deren Fahrzeug es geht – der Kreis überträgt Termine nicht auf andere Personen.",
  },
  {
    q: "Kann ich mehrere Fahrzeuge auf einmal erledigen?",
    a: "Ja, bis zu drei Fahrzeuge pro Termin. Wähle die Anzahl im Formular.",
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

export const neussContent: CityContent = {
  meta: {
    title: "Termin Straßenverkehrsamt Neuss – automatisch gebucht | KFZ-Termin",
    description: `Wunschtermin beim Straßenverkehrsamt Rhein-Kreis Neuss (Neuss, Grevenbroich, Dormagen, Meerbusch): Wir suchen rund um die Uhr und buchen automatisch. ${PRICE} mit Geld-zurück-Garantie.`,
    ogTitle: "Termin Straßenverkehrsamt Neuss – automatisch gebucht",
    ogDescription: `Wir suchen rund um die Uhr nach freien Terminen bei der Kfz-Zulassung im Rhein-Kreis Neuss und buchen automatisch. ${PRICE} mit Geld-zurück-Garantie.`,
    ogImage: "https://kfz-termin.online/og-image-neuss.jpg",
    ogImageAlt: "KFZ-Termin Neuss – Logo",
  },
  hero: {
    badge: "Rhein-Kreis Neuss · 4 Standorte",
    headline: "Dein Termin beim Straßenverkehrsamt Rhein-Kreis Neuss –",
    headlineAccent: "automatisch gebucht",
    locationHeadline: "Dein Termin beim Straßenverkehrsamt {town} –",
    intro:
      "Neuss, Grevenbroich, Dormagen oder Meerbusch: Du wählst Anliegen, Standort und Wunschtage, wir suchen rund um die Uhr nach frei werdenden Terminen und buchen automatisch für dich.",
    searchHoursLabel: "Suche rund um die Uhr",
    scopeLabel: "Neuss, Grevenbroich, Dormagen, Meerbusch",
  },
  multi: {
    formNotice: {
      kfz: "**Wichtig:** Bitte die Daten der **Person angeben, auf die der Termin gebucht wird** (Halterin/Halter bzw. Antragsteller/in), inklusive Geburtsdatum. Laut Kreis sind Termine **nicht auf andere Personen übertragbar**. Mit Vollmacht kann jemand anderes hingehen. Es wird nur das gebuchte Anliegen am gebuchten Standort bearbeitet.",
    },
    steps: [
      { title: "Anliegen wählen", text: "Wähle dein Anliegen und die Anzahl der Fahrzeuge." },
      { title: "Standort & Wunschtage", text: "Neuss, Grevenbroich, Dormagen, Meerbusch oder egal – und alle Tage, an denen du kannst." },
      { title: "Wir suchen für dich", text: "Rund um die Uhr, auch nachts und früh morgens, wenn der Kreis neue Termine freigibt." },
      { title: "Termin erhalten", text: "Du bekommst eine E-Mail von uns mit allen Infos und deiner Terminnummer, dazu die Bestätigung des Kreises." },
    ],
    locationsTitle: "Die Zulassungsstellen im Rhein-Kreis Neuss",
    locationsNote:
      "Alle vier Standorte sind für den ganzen Kreis zuständig. Wählst du „egal“, nehmen wir den ersten passenden Termin an einem der vier.",
    honestNote: "",
    bookingNotice:
      "Wir suchen rund um die Uhr nach freien Terminen. Sobald wir einen gefunden haben, buchen wir ihn für dich – alle Infos bekommst du per E-Mail von uns und vom Rhein-Kreis Neuss.",
    servicesSubtitle: "Wähle dein Anliegen – einheitlicher Preis, keine versteckten Kosten.",
    pricingFeatures: neussPricingFeatures,
  },
  info: {
    title: "Wissenswertes zur Kfz-Zulassung im Rhein-Kreis Neuss",
    locations: N.locations.map((l) => ({ name: l.name, address: l.address })),
    phone: "02131 928-9090",
    phoneLabel: "Straßenverkehrsamt Rhein-Kreis Neuss",
    links: [
      { label: "Termin selbst buchen", href: N.portalUrl },
      { label: "Infos des Straßenverkehrsamts", href: N.infoUrl },
    ],
    note:
      "Die Straßenverkehrsämter in Neuss, Grevenbroich, Dormagen und Meerbusch sind für alle Städte und Gemeinden im Rhein-Kreis Neuss zuständig: Neuss, Dormagen, Grevenbroich, Meerbusch, Kaarst, Korschenbroich, Jüchen und Rommerskirchen. Ohne Termin werden keine Anliegen bearbeitet. Der Kreis stellt neue Termine laufend online – frei werdende Termine sind oft in wenigen Minuten wieder weg. Genau dann sucht unser Service für dich. In Meerbusch kannst du nur mit Karte (EC) zahlen.",
  },
  faq: neussFaq,
  serviceJsonLd: {
    name: "KFZ-Termin Neuss – automatische Terminbuchung",
    description:
      "Automatische Terminbuchung beim Straßenverkehrsamt des Rhein-Kreises Neuss in Neuss, Grevenbroich, Dormagen und Meerbusch. Privater Dienst, nicht mit dem Kreis verbunden. Suche rund um die Uhr und automatische Buchung, sobald ein Termin an einem Wunschtag frei wird.",
    areaServed: { "@type": "AdministrativeArea", name: "Rhein-Kreis Neuss" },
  },
};
