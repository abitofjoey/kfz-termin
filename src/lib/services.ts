export type ServiceId =
  | "ersatz-zb1"
  | "abmeldung"
  | "gebraucht"
  | "neu"
  | "kennzeichenwechsel"
  | "anschriftenaenderung"
  | "technische-aenderung"
  | "wiederzulassung"
  | "h-kennzeichen"
  | "feinstaubplakette"
  | "saisonkennzeichen"
  | "kurzzeitkennzeichen"
  | "ausfuhrkennzeichen"
  | "familienname"
  | "neusiegelung"
  | "verlust-zb2"
  | "importfahrzeug"
  | "abholung-zb2"
  | "neu-eg-fgv";

export type Service = {
  id: ServiceId;
  /** Voller Titel, wird in Karte, Form-Select und DB-Label genutzt */
  label: string;
  /** Kurzer Titel für die Kachel */
  shortLabel: string;
  /** Untertitel / Erklärung */
  subtitle: string;
  /** Ausschluss- oder Zusatzhinweis (klein, unter dem Subtitle) */
  note?: string;
  /** Link zur offiziellen Stadt-Köln-Seite mit weiteren Infos (vom Betreiber gepflegt) */
  infoUrl?: string;
  /** Häufig gewählte Anliegen – werden in der Kachel-Auswahl direkt angezeigt */
  popular?: boolean;
  /** Höchstzahl Fahrzeuge pro Termin (Standard 3) */
  maxVehicles?: number;
};

export const SERVICES: Service[] = [
  {
    id: "gebraucht",
    label: "Anmeldung Gebrauchtfahrzeug",
    shortLabel: "Gebrauchtfahrzeug",
    subtitle: "Umschreibung nach Zuzug oder bei Verkauf / Halterwechsel",
    note: "Für Fahrzeuge aus dem Ausland bitte „Zulassung importierter Fahrzeuge“ wählen",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00737/index.html",
    popular: true,
  },
  {
    id: "neu",
    label: "Anmeldung Neufahrzeug",
    shortLabel: "Neufahrzeug",
    subtitle: "Erstzulassung deines neuen Fahrzeugs",
    note: "Für technisch veränderte Neufahrzeuge (§ 13 EG-FGV) bitte das eigene Anliegen wählen",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00729/index.html",
    popular: true,
  },
  {
    id: "wiederzulassung",
    label: "Wiederzulassung",
    shortLabel: "Wiederzulassung",
    subtitle: "Wiederzulassung eines Fahrzeugs auf dieselbe Person",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00740/index.html",
    popular: true,
  },
  {
    id: "ausfuhrkennzeichen",
    label: "Ausfuhrkennzeichen",
    shortLabel: "Ausfuhrkennzeichen",
    subtitle: "Für die Ausfuhr eines Fahrzeugs ins Ausland",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00720/index.html",
    popular: true,
  },
  {
    id: "ersatz-zb1",
    label: "Ersatz Zulassungsbescheinigung Teil I",
    shortLabel: "Ersatz Fahrzeugschein",
    subtitle: "Neuausstellung des Fahrzeugscheins bei Verlust oder Beschädigung",
    popular: true,
    infoUrl: "https://www.stadt-koeln.de/service/produkt/verlust-der-zulassungsbescheinigung-teil-i-fahrzeugschein-1",
  },
  {
    id: "abmeldung",
    label: "Abmeldung eines Fahrzeugs (Außerbetriebsetzung)",
    shortLabel: "Abmeldung",
    subtitle: "Außerbetriebsetzung deines Fahrzeugs",
    popular: true,
    infoUrl: "https://www.stadt-koeln.de/service/produkte/20014/index.html",
  },
  {
    id: "kennzeichenwechsel",
    label: "Kennzeichenwechsel",
    shortLabel: "Kennzeichenwechsel",
    subtitle: "Umkennzeichnung auf Wunsch",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00746/index.html",
    popular: true,
  },
  {
    id: "anschriftenaenderung",
    label: "Anschriftenänderung in den Fahrzeugpapieren",
    shortLabel: "Anschriftenänderung",
    subtitle: "Neue Adresse in den Fahrzeugpapieren eintragen",
    note: "Ohne Halterwechsel, nur innerhalb Köln",
    popular: true,
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00718/index.html",
  },
  {
    id: "technische-aenderung",
    label: "Technische Änderung",
    shortLabel: "Technische Änderung",
    subtitle: "Änderung der Fahrzeugklasse, Eintragung von Zubehörteilen",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00735/index.html",
    popular: true,
  },
  {
    id: "h-kennzeichen",
    label: "H-Kennzeichen",
    shortLabel: "H-Kennzeichen",
    subtitle: "Für historische Fahrzeuge – nur für Kölnerinnen und Kölner",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00726/index.html",
  },
  {
    id: "feinstaubplakette",
    label: "Feinstaubplakette",
    shortLabel: "Feinstaubplakette",
    subtitle: "Ausstellung der Umweltplakette für die Windschutzscheibe",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00783/index.html",
  },
  {
    id: "saisonkennzeichen",
    label: "Saisonkennzeichen",
    shortLabel: "Saisonkennzeichen",
    subtitle: "Saisonzeiträume festlegen, ändern oder löschen",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00732/index.html",
  },
  {
    id: "kurzzeitkennzeichen",
    label: "Kurzzeitkennzeichen",
    shortLabel: "Kurzzeitkennzeichen",
    subtitle: "Für Probe- und Überführungsfahrten",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00728/index.html",
  },
  {
    id: "familienname",
    label: "Änderung des Familiennamens in Fahrzeugpapieren",
    shortLabel: "Namensänderung",
    subtitle: "Neuer Familienname nach Heirat, Scheidung o. Ä.",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00778/index.html",
  },
  {
    id: "neusiegelung",
    label: "Neusiegelung von Kennzeichen",
    shortLabel: "Neusiegelung",
    subtitle: "Ersatz bei Beschädigung oder Unlesbarkeit des Kennzeichens",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/20013/index.html",
  },
  {
    id: "verlust-zb2",
    label: "Verlust der Zulassungsbescheinigung Teil II",
    shortLabel: "Verlust Fahrzeugbrief",
    subtitle: "Verlustmeldung des Fahrzeugbriefs",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00781/index.html",
    maxVehicles: 2,
  },
  {
    id: "importfahrzeug",
    label: "Zulassung importierter Fahrzeuge",
    shortLabel: "Importfahrzeug",
    subtitle: "Zulassung eines Fahrzeugs aus dem Ausland",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/20262/index.html",
    maxVehicles: 2,
  },
  {
    id: "abholung-zb2",
    label: "Abholung einer neu beantragten Zulassungsbescheinigung Teil II",
    shortLabel: "Abholung Fahrzeugbrief",
    subtitle: "Abholung des neu beantragten Fahrzeugbriefs",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/20269/index.html",
    maxVehicles: 2,
  },
  {
    id: "neu-eg-fgv",
    label: "Zulassung eines technisch veränderten Neufahrzeugs (§ 13 EG-FGV)",
    shortLabel: "Neufahrzeug § 13 EG-FGV",
    subtitle: "Erstzulassung eines technisch veränderten Neufahrzeugs",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/20259/index.html",
    maxVehicles: 2,
  },
];

export const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export const getService = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id) ?? SERVICES[0];

export const getServiceLabel = (id: ServiceId): string => getService(id).label;

export const POPULAR_SERVICES = SERVICES.filter((s) => s.popular);
export const MORE_SERVICES = SERVICES.filter((s) => !s.popular);

export const DEFAULT_MAX_VEHICLES = 3;
export const getMaxVehicles = (id: ServiceId | null | undefined): number =>
  (id && SERVICES.find((s) => s.id === id)?.maxVehicles) || DEFAULT_MAX_VEHICLES;

// ---- Mehrstädtigkeit -------------------------------------------------------
// Jede Stadt hat ihre eigene Dienstleistungsliste und eigene Script-Nummern.
// Köln nutzt unverändert die Liste oben.
import type { ServiceCategory } from "@/lib/cities";

export type CityService = {
  id: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  note?: string;
  infoUrl?: string;
  popular?: boolean;
  maxVehicles?: number;
  category: ServiceCategory;
  /** Mögliche Standorte (IDs aus cities.ts); leer = alle. */
  locations?: string[];
};

type BonnRow = { id: string; label: string; category: ServiceCategory; script: string; locations?: string[]; maxVehicles?: number; infoUrl?: string };
/** Bonner Dienstleistungen in Script-Reihenfolge 1–35. */
const BONN_ROWS: BonnRow[] = [
  { id: "umschreibung", label: "Umschreibung (Halterwechsel)", category: "kfz", script: "1", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Umschreibung-innerhalb-Bonns.php" },
  { id: "umschreibung-abmeldung", label: "Umschreibung inkl. Abmeldung", category: "kfz", script: "2", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Umschreibung-innerhalb-Bonns.php" },
  { id: "neuzulassung", label: "Neuzulassung (fabrikneu, deutsche Papiere)", category: "kfz", script: "3", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Neuzulassung-fabrikneues-Fahrzeug.php", locations: ["dlz"] },
  { id: "neuzulassung-abmeldung", label: "Neuzulassung inkl. Abmeldung", category: "kfz", script: "4", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Neuzulassung-fabrikneues-Fahrzeug.php", locations: ["dlz"] },
  { id: "neuzulassung-13-eg-fgv", label: "Neuzulassung mit §13 EG-FGV / Gutachten", category: "kfz", script: "5", locations: ["dlz"] },
  { id: "auslaendische-papiere", label: "Umschreibung/Neuzulassung mit ausländischen Papieren", category: "kfz", script: "6", locations: ["dlz"] },
  { id: "wiederzulassung", label: "Wiederzulassung auf bisherige Halter", category: "kfz", script: "7", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Wiederzulassung-auf-bisherige-Halterin-oder-Halter-in-Bonn.php", locations: ["dlz"] },
  { id: "umkennzeichnung", label: "Umkennzeichnung (Kennzeichenwechsel)", category: "kfz", script: "8" },
  { id: "technische-aenderung", label: "Technische Änderung", category: "kfz", script: "9", locations: ["dlz"] },
  { id: "sonderkennzeichen", label: "Historische, elektrische und Saisonkennzeichen", category: "kfz", script: "10", locations: ["dlz"] },
  { id: "kurzzeitkennzeichen", label: "Kurzzeitkennzeichen", category: "kfz", script: "11", locations: ["dlz"], maxVehicles: 1 },
  { id: "ausfuhrkennzeichen", label: "Ausfuhrkennzeichen (deutsche Papiere)", category: "kfz", script: "12", locations: ["dlz"], maxVehicles: 1 },
  { id: "abmeldung", label: "Abmeldung", category: "kfz", script: "13", infoUrl: "https://www.bonn.de/vv/produkte/fahrzeug-abmelden-kfz-ausserbetriebsetzung-verlust-zb-i.php" },
  { id: "abmeldung-verlust", label: "Abmeldung inkl. Verlustmeldung", category: "kfz", script: "14", infoUrl: "https://www.bonn.de/vv/produkte/fahrzeug-abmelden-kfz-ausserbetriebsetzung-verlust-zb-i.php", locations: ["dlz"], maxVehicles: 3 },
  { id: "anschriftenaenderung", label: "Anschriftenänderung", category: "kfz", script: "15" },
  { id: "namensaenderung", label: "Namensänderung in den Fahrzeugpapieren", category: "kfz", script: "16" },
  { id: "verlust-zb1", label: "Verlust Zulassungsbescheinigung Teil I", category: "kfz", script: "17" },
  { id: "verlust-zb2", label: "Verlust Zulassungsbescheinigung Teil II", category: "kfz", script: "18", locations: ["dlz"] },
  { id: "verlust-kennzeichen", label: "Verlust/Austausch Kennzeichen", category: "kfz", script: "19", locations: ["dlz"] },
  { id: "diebstahl", label: "Diebstahl Fahrzeug", category: "kfz", script: "20", infoUrl: "https://www.bonn.de/vv/produkte/Kfz-Diebstahl-Fahrzeug.php", locations: ["dlz"] },
  { id: "feinstaubplakette", label: "Feinstaubplakette / Neusiegelung", category: "kfz", script: "21" },
  { id: "fs-umtausch", label: "Umtausch Karten-/Papierführerschein", category: "fuehrerschein", script: "22", maxVehicles: 1 },
  { id: "fs-ersterteilung", label: "Ersterteilung Fahrerlaubnis", category: "fuehrerschein", script: "23", maxVehicles: 1 },
  { id: "fs-bf17", label: "Begleitetes Fahren ab 17", category: "fuehrerschein", script: "24", maxVehicles: 1 },
  { id: "fs-erweiterung", label: "Erweiterung Klassen A1, A2, A, B, BE, T, L", category: "fuehrerschein", script: "25", maxVehicles: 1 },
  { id: "fs-neu-name", label: "Neuer Führerschein wegen Namensänderung/Beschädigung", category: "fuehrerschein", script: "26", maxVehicles: 1 },
  { id: "fs-neu-verlust", label: "Neuer Führerschein wegen Verlust/Diebstahl", category: "fuehrerschein", script: "27", maxVehicles: 1 },
  { id: "fs-international", label: "Internationaler Führerschein", category: "fuehrerschein", script: "28", maxVehicles: 1 },
  { id: "fs-auflage", label: "Auflage/Schlüsselzahl, Begleitperson nachbenennen", category: "fuehrerschein", script: "29", maxVehicles: 1 },
  { id: "fs-ausland", label: "Umschreibung ausländischer Führerschein", category: "fuehrerschein", script: "30", infoUrl: "https://www.bonn.de/vv/produkte/Fuehrerschein-Umschreibung-auslaendischer-Fuehrerscheine.php", locations: ["dlz"], maxVehicles: 1 },
  { id: "fs-cd-erweiterung", label: "Erweiterung Klassen C/D", category: "fuehrerschein", script: "31", locations: ["dlz"], maxVehicles: 1 },
  { id: "fs-cd-verlaengerung", label: "Verlängerung Klassen C/D", category: "fuehrerschein", script: "32", locations: ["dlz"], maxVehicles: 1 },
  { id: "fs-fahrgast", label: "Fahrerlaubnis zur Fahrgastbeförderung", category: "fuehrerschein", script: "33", locations: ["dlz"], maxVehicles: 1 },
  { id: "fs-95", label: "Fahrerqualifizierungsnachweis (Schlüsselzahl 95)", category: "fuehrerschein", script: "34", locations: ["dlz"], maxVehicles: 1 },
  { id: "fs-fahrerkarte", label: "Fahrerkarte", category: "fuehrerschein", script: "35", locations: ["dlz"], maxVehicles: 1 },
];
export const BONN_DEFAULT_MAX_VEHICLES = 5;

export const SERVICES_BY_CITY: Record<string, CityService[]> = {
  koeln: SERVICES.map((s) => ({ ...s, category: "kfz" as const })),
  bonn: BONN_ROWS.map((r) => ({
    id: r.id,
    label: r.label,
    shortLabel: r.label,
    subtitle: "",
    category: r.category,
    locations: r.locations,
    maxVehicles: r.maxVehicles ?? BONN_DEFAULT_MAX_VEHICLES,
    ...(r.infoUrl ? { infoUrl: r.infoUrl } : {}),
  })),
};

export const getServices = (city: string): CityService[] => SERVICES_BY_CITY[city] ?? [];
export const getCityService = (city: string, id: string): CityService | undefined =>
  getServices(city).find((s) => s.id === id);
/** Kategorie einer gespeicherten Buchung (Label in bookings.service_type). */
export const categoryForLabel = (city: string | null | undefined, label: string | null | undefined): ServiceCategory =>
  getServices(city ?? "koeln").find((s) => s.label === label)?.category ?? "kfz";

/** Mögliche Standorte eines Anliegens (leer in der Liste = alle Standorte der Stadt). */
export function possibleLocations(service: CityService, allLocationIds: string[]): string[] {
  return service.locations && service.locations.length > 0 ? service.locations : allLocationIds;
}

/**
 * Standorte, die gespeichert werden. Finanziert/geleast → nur Hauptstandort.
 * "Egal wo" (chosen null) → alle möglichen; sonst Schnittmenge mit den möglichen.
 */
export function resolveLocations(opts: {
  possible: string[]; chosen: string[] | null; financed: boolean; mainLocation: string;
}): string[] | null {
  if (opts.financed) return opts.possible.includes(opts.mainLocation) ? [opts.mainLocation] : null;
  if (!opts.chosen) return opts.possible;
  const set = opts.possible.filter((l) => opts.chosen!.includes(l));
  return set.length > 0 ? set : null;
}

/** Script-Nummern pro Stadt, Schlüssel = gespeichertes Label (bookings.service_type). */
export const SCRIPT_SERVICE_MAP_BY_CITY: Record<string, Record<string, string>> = {
  koeln: {
    "Anmeldung Gebrauchtfahrzeug": "1",
    "Anmeldung Neufahrzeug": "2",
    "Kennzeichenwechsel": "3",
    "Technische Änderung": "4",
    "Wiederzulassung": "5",
    "H-Kennzeichen": "6",
    "Saisonkennzeichen": "7",
    "Kurzzeitkennzeichen": "8",
    "Ausfuhrkennzeichen": "9",
    "Ersatz Zulassungsbescheinigung Teil I": "10",
    "Abmeldung eines Fahrzeugs (Außerbetriebsetzung)": "11",
    "Anschriftenänderung in den Fahrzeugpapieren": "12",
    "Feinstaubplakette": "13",
    "Änderung des Familiennamens in Fahrzeugpapieren": "14",
    "Neusiegelung von Kennzeichen": "15",
    "Verlust der Zulassungsbescheinigung Teil II": "16",
    "Zulassung importierter Fahrzeuge": "17",
    "Abholung einer neu beantragten Zulassungsbescheinigung Teil II": "18",
    "Zulassung eines technisch veränderten Neufahrzeugs (§ 13 EG-FGV)": "19",
  },
  bonn: Object.fromEntries(BONN_ROWS.map((r) => [r.label, r.script])),
};
