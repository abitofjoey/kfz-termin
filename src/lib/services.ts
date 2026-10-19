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
