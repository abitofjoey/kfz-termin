import { BRAND_NAME, launchedCities, settingsFor, type CityConfig, type ServiceCategory } from "@/lib/cities";
import { getServices } from "@/lib/services";
import { formatPrice, vatShortNote } from "@/lib/price";
import { LEGAL_CITIES } from "@/content/legal/cities";

const CATEGORY_LABEL: Record<ServiceCategory, string> = { kfz: "Kfz", fuehrerschein: "Führerschein" };

function hoursText(h: { from: number; to: number }): string {
  return h.from === 0 && h.to === 24 ? "rund um die Uhr" : `täglich von ${h.from} bis ${h.to} Uhr`;
}

function citySection(c: CityConfig): string {
  const services = getServices(c.slug);
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const lines: string[] = [];
  lines.push(`## ${c.name}`, "");
  lines.push(`- Seite: [${c.name}](/${c.slug})`);
  lines.push(`- Behörde: ${c.authorityName}`);
  lines.push(`- Preis: ${formatPrice(c.priceCents)} pro Auftrag (${vatShortNote()})`);
  for (const cat of categories) {
    const s = settingsFor(c, cat);
    const prefix = categories.length > 1 ? `${CATEGORY_LABEL[cat]}: ` : "";
    lines.push(`- ${prefix}Suchzeiten: ${hoursText(s.searchHours)}`);
    lines.push(
      `- ${prefix}Bestätigung: ` +
        (s.customerConfirmationHours != null
          ? `Die Behörde schickt eine Bestätigungsmail; der Link muss innerhalb von ${s.customerConfirmationHours} Stunden angeklickt werden, sonst verfällt der Termin.`
          : "Keine Bestätigung durch den Kunden nötig."),
    );
  }
  for (const cat of categories) {
    lines.push("", `### Anliegen${categories.length > 1 ? ` – ${CATEGORY_LABEL[cat]}` : ""}`, "");
    services.filter((s) => s.category === cat).forEach((s, i) => lines.push(`${i + 1}. ${s.label}`));
  }
  return lines.join("\n");
}

/** Inhalt von /llms.txt – allgemeiner Teil fest, Städte aus launchedCities(). */
export function buildLlmsTxt(): string {
  const cities = launchedCities().slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
  return [
    `# ${BRAND_NAME}`,
    "",
    `> Automatisierte Terminsuche bei Kfz-Zulassungs- und Führerscheinstellen. ${BRAND_NAME} sucht im Auftrag des Kunden nach einem freien Termin und bucht ihn – mit Geld-zurück-Garantie.`,
    "",
    `${BRAND_NAME} ist ein Dienst von Eike Hoffmann (Köln, Deutschland). Kunden geben Wunschtermine und Daten an, die Plattform sucht automatisiert nach einem freien Termin bei der zuständigen Behörde (derzeit ${LEGAL_CITIES}) und bucht diesen im Namen des Kunden. Der Dienst ist keine Behörde und mit den Städten weder geschäftlich noch rechtlich verbunden.`,
    "",
    "## Pages",
    "",
    "- [Startseite](/): Überblick und Auswahl der Stadt.",
    ...cities.map((c) => `- [${c.name}](/${c.slug}): Ablauf, Preise, FAQ und Buchungsformular für ${c.authorityName}.`),
    "- [Impressum](/impressum): Anbieterkennzeichnung gemäß § 5 DDG.",
    "- [Datenschutz](/datenschutz): Datenschutzerklärung nach DSGVO.",
    "- [AGB](/agb): Allgemeine Geschäftsbedingungen.",
    "",
    ...cities.flatMap((c) => [citySection(c), ""]),
    "## Was der Dienst nicht ist",
    "",
    "- Keine Behörde, keine Kooperation mit den Städten.",
    "- Kein Erscheinen vor Ort: Den Termin nimmt der Kunde selbst wahr.",
    "- Keine Uhrzeitauswahl: Es wird der erstmögliche freie Slot an einem Wunschtag gebucht.",
    "- Keine Erfolgsgarantie: Buchbar ist nur, was die Behörde freigibt (daher die Geld-zurück-Garantie).",
    "",
    "## Kontakt",
    "",
    "- E-Mail: info@kfz-termin.online",
    "- Anbieter: Eike Hoffmann, Longericher Str. 31, 50739 Köln, Deutschland",
    "",
  ].join("\n");
}
