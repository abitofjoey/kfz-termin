import { formatPrice } from "@/lib/price";
import { CITIES } from "@/lib/cities";
import type { CityContent } from "./koeln";
import type { FaqItem } from "@/components/landing/Faq";

const PRICE = formatPrice(CITIES.bonn.priceCents);

export const bonnFaq: FaqItem[] = [
  {
    q: "Muss ich den Termin noch bestätigen?",
    a: "Nein. In Bonn ist die Buchung sofort verbindlich. Du bekommst unsere E-Mail mit allen Daten und zusätzlich die Bestätigung der Stadt.",
  },
  {
    q: "Was ist die Aufrufnummer?",
    a: "Die steht in unserer E-Mail. Vor Ort meldest du dich damit am Check-in-Terminal an.",
  },
  {
    q: "An welchem Standort bekomme ich den Termin?",
    a: "Du wählst im Formular, ob dir der Standort egal ist oder welche Standorte infrage kommen. Manche Anliegen und finanzierte oder geleaste Fahrzeuge bearbeitet Bonn nur im Dienstleistungszentrum.",
  },
  {
    q: "Wann sucht ihr?",
    a: "Rund um die Uhr. Auch am Wunschtag selbst: Viele Termine werden morgens ab 7 Uhr für denselben Tag frei.",
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
    steps: [
      { title: "Anliegen wählen", text: "Kfz-Zulassung oder Führerschein – und dann dein konkretes Anliegen." },
      { title: "Wunschtage und Standorte", text: "Wähle die Tage, an denen du kannst, und ob dir der Standort egal ist." },
      { title: "Wir suchen rund um die Uhr", text: "Auch Termine, die am Wunschtag selbst frei werden – oft schon ab 7 Uhr morgens." },
      { title: "Termin ist gebucht", text: "Du bekommst eine E-Mail mit Datum, Uhrzeit, Standort und Aufrufnummer. Die Buchung ist sofort verbindlich." },
    ],
    locationsTitle: "Die vier Bonner Standorte",
    locationsNote:
      "Viele Anliegen bearbeitet Bonn nur im Dienstleistungszentrum im Stadthaus. Im Formular siehst du für jedes Anliegen, welche Standorte möglich sind.",
    honestNote:
      "Reguläre Termine gibt es in Bonn oft erst mehrere Wochen im Voraus. Unser Service lohnt sich, wenn du früher einen Termin brauchst – wir buchen Termine, die durch Absagen frei werden.",
    bookingNotice:
      "Wir suchen rund um die Uhr und buchen auch Termine, die am Wunschtag selbst frei werden – oft schon ab 7 Uhr morgens. Die Buchung ist sofort verbindlich, eine Bestätigung bei der Stadt ist nicht nötig.",
  },
  faq: bonnFaq,
  serviceJsonLd: {
    name: "KFZ-Termin Bonn",
    description:
      "Automatisierte Terminbuchung bei der Stadt Bonn für Kfz-Zulassung und Führerschein. Suche rund um die Uhr und automatische Buchung, sobald ein Termin an einem Wunschtag frei wird.",
  },
};
