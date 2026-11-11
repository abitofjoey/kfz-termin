import { formatPrice } from "@/lib/price";
import { CITIES } from "@/lib/cities";
import type { CityContent } from "./koeln";
import type { FaqItem } from "@/components/landing/Faq";
import type { CityService } from "@/lib/services";

/** Häkchen-Liste der Bonner Service-Karte. */
export function bonnPricingFeatures(service: CityService): string[] {
  const dlzOnly = service.locations?.length === 1 && service.locations[0] === "dlz";
  return [
    "Suche rund um die Uhr",
    dlzOnly ? "Standort: nur im Dienstleistungszentrum (Berliner Platz 2)" : "Standort: alle vier Bonner Standorte",
    "Geld-zurück-Garantie",
    "Persönlicher Support",
  ];
}

const PRICE = formatPrice(CITIES.bonn.priceCents);

export const bonnFaq: FaqItem[] = [
  {
    q: "Muss ich den Termin noch bestätigen?",
    a: "Nein. Du bekommst unsere E-Mail mit allen Daten und zusätzlich die Bestätigung der Stadt.",
  },
  {
    q: "Was ist die Aufrufnummer?",
    a: "Die steht in unserer E-Mail. Vor Ort meldest du dich damit am Check-in-Terminal an.",
  },
  {
    q: "Wie läuft der Termin vor Ort ab?",
    a: "Sei pünktlich, sonst verfällt der Termin. Melde dich am Check-in-Terminal an – frühestens 15 Minuten vorher, spätestens 5 Minuten nach Beginn – per QR-Code aus der Mail der Stadt oder mit deiner Aufrufnummer. Danach wirst du über die Anzeigetafel zum Schalter aufgerufen.",
  },
  {
    q: "Was brauche ich für Fotos beim Führerschein?",
    a: "Fotos kannst du vor Ort an den Selbsterfassungsgeräten machen oder ein ausgedrucktes Foto von einem zertifizierten Fotografen mitbringen. Für den internationalen Führerschein und die Fahrerkarte werden nur ausgedruckte Fotos angenommen.",
  },
  {
    q: "Kann ich vor Ort mit Karte zahlen?",
    a: "Ja, mit EC- oder Kreditkarte sowie Apple Pay und Google Pay.",
  },
  {
    q: "An welchem Standort bekomme ich den Termin?",
    a: "Du wählst im Formular, ob dir der Standort egal ist oder welche Standorte infrage kommen. Manche Anliegen und finanzierte oder geleaste Fahrzeuge bearbeitet Bonn nur im Dienstleistungszentrum.",
  },
  {
    q: "Wann sucht ihr?",
    a: "Rund um die Uhr – an allen deinen Wunschtagen und Standorten.",
  },
  {
    q: "Ich kann den Termin doch nicht wahrnehmen – was nun?",
    a: "Storniere ihn bitte über den Link in unserer E-Mail, damit er wieder frei wird.",
  },
  {
    q: "Gilt das auch für den Führerschein?",
    a: "Ja, zum Beispiel für Umtausch, Ersterteilung, internationalen Führerschein oder die Umschreibung eines ausländischen Führerscheins.",
  },
  {
    q: "Was kostet der Service?",
    a: `${PRICE} einmalig, keine weiteren Kosten. Die Gebühren der Stadt zahlst du wie gewohnt vor Ort.`,
  },
  {
    q: "Was passiert, wenn kein Termin gefunden wird?",
    a: "Wird an deinen Wunschtagen kein Termin frei, bekommst du automatisch eine E-Mail: Du kannst einmalig neue Wunschtermine wählen, ohne erneut zu bezahlen, oder dir mit einem Klick den vollen Betrag erstatten lassen. Meldest du dich nicht innerhalb von 48 Stunden, erstatten wir automatisch.",
  },
];

export const bonnContent: CityContent = {
  meta: {
    title: "Termin Zulassungsstelle & Führerscheinstelle Bonn – automatisch gebucht | KFZ-Termin",
    description: `Wunschtermin bei der Stadt Bonn für Kfz-Zulassung und Führerschein: Wir suchen rund um die Uhr und buchen automatisch – an allen vier Standorten. ${PRICE} mit Geld-zurück-Garantie.`,
    ogTitle: "Termin Zulassungsstelle & Führerscheinstelle Bonn – automatisch gebucht",
    ogDescription: `Wir suchen rund um die Uhr nach freien Terminen bei der Stadt Bonn und buchen automatisch. ${PRICE} mit Geld-zurück-Garantie.`,
    ogImage: "https://kfz-termin.online/og-image-bonn.jpg",
    ogImageAlt: "KFZ-Termin Bonn – Logo",
  },
  hero: {
    badge: "Stadt Bonn",
    headline: "Dein Wunschtermin in Bonn –",
    headlineAccent: "Kfz-Zulassung und Führerschein, automatisch gebucht",
    intro:
      "Du wählst Anliegen, Wunschtage und Standorte. Wir suchen rund um die Uhr nach frei werdenden Terminen und buchen automatisch für dich.",
    searchHoursLabel: "Suche rund um die Uhr",
    scopeLabel: "Vier Standorte in Bonn",
  },
  multi: {
    personNotice: "Diese Angaben werden bei der Stadt Bonn für die Terminbuchung verwendet. Mehrfachbuchungen über dieselbe E-Mail-Adresse sind nicht möglich.",
    steps: [
      { title: "Anliegen wählen", text: "Wähle Kfz-Zulassung oder Führerschein und dann dein Anliegen." },
      { title: "Wunschtage und Standort", text: "Wähle die Tage, an denen du kannst, und den Standort, der für dich passt." },
      { title: "Wir suchen für dich", text: "Wir suchen rund um die Uhr nach freien Terminen an deinen Wunschtagen und Standorten." },
      { title: "Termin erhalten", text: "Du bekommst eine E-Mail von uns mit allen Infos zu deinem Termin und eine Bestätigung von der Stadt Bonn." },
    ],
    locationsTitle: "Die vier Bonner Standorte",
    locationsNote:
      "Viele Anliegen bearbeitet Bonn nur im Dienstleistungszentrum im Stadthaus. Im Formular siehst du für jedes Anliegen, welche Standorte möglich sind.",
    honestNote: "",
    bookingNotice:
      "Wir suchen rund um die Uhr nach freien Terminen. Sobald wir einen gefunden haben, buchen wir ihn für dich – alle Infos bekommst du per E-Mail von uns und von der Stadt Bonn.",
    servicesSubtitle: "Wähle dein Anliegen – einheitlicher Preis, keine versteckten Kosten.",
    pricingFeatures: bonnPricingFeatures,
  },
  info: {
    title: "Wissenswertes zu den Bonner Standorten",
    locations: CITIES.bonn.locations.map((l) => ({ name: l.name, address: l.address })),
    phone: "0228 77 66 77",
    phoneLabel: "Bürgerdienste der Stadt Bonn",
    links: [
      { label: "Termin selbst buchen", href: "https://termine.bonn.de/m/dlz/extern/calendar/?uid=b91bb67b-15cf-44df-ab0b-96ebe25c1ae3&lang=de" },
      { label: "Öffnungszeiten und Kontakt", href: "https://www.bonn.de/vv/oe/_/Dez._I/33/33-4/Dienstleistungszentrum.php" },
    ],
    note:
      "Viele Anliegen bearbeitet Bonn nur im Dienstleistungszentrum im Stadthaus – im Formular siehst du, welche Standorte möglich sind. Manche Kfz-Anliegen kannst du auch online ohne Termin erledigen (i-Kfz). Unser Service lohnt sich, wenn du einen konkreten Wunschtermin brauchst oder keine Zeit hast, selbst ständig nachzuschauen.",
  },
  faq: bonnFaq,
  serviceJsonLd: {
    name: "KFZ-Termin Bonn – automatische Terminbuchung",
    description:
      "Automatische Terminbuchung bei der Kfz-Zulassung und Führerscheinstelle der Stadt Bonn. Privater Dienst, nicht mit der Stadt verbunden. Suche rund um die Uhr und automatische Buchung, sobald ein Termin an einem Wunschtag frei wird.",
  },
};
