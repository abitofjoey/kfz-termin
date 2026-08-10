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
  | "neusiegelung";

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
};

export const SERVICES: Service[] = [
  {
    id: "gebraucht",
    label: "Anmeldung Gebrauchtfahrzeug",
    shortLabel: "Gebrauchtfahrzeug",
    subtitle: "Umschreibung nach Zuzug oder bei Verkauf / Halterwechsel",
    note: "Ausgenommen ausländische Fahrzeuge",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00737/index.html",
    popular: true,
  },
  {
    id: "neu",
    label: "Anmeldung Neufahrzeug",
    shortLabel: "Neufahrzeug",
    subtitle: "Erstzulassung deines neuen Fahrzeugs",
    note: "Ausgenommen technisch veränderte Neufahrzeuge gem. § 13 EG-FGV",
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
  },
  {
    id: "abmeldung",
    label: "Abmeldung eines Fahrzeugs (Außerbetriebsetzung)",
    shortLabel: "Abmeldung",
    subtitle: "Außerbetriebsetzung deines Fahrzeugs",
    popular: true,
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
  {
    id: "familienname",
    label: "Änderung des Familiennamens in Fahrzeugpapieren",
    shortLabel: "Namensänderung",
    subtitle: "Neuer Familienname nach Heirat, Scheidung o. Ä.",
  },
  {
    id: "neusiegelung",
    label: "Neusiegelung von Kennzeichen",
    shortLabel: "Neusiegelung",
    subtitle: "Ersatz bei Beschädigung oder Unlesbarkeit des Kennzeichens",
  },
];

export const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export const getService = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id) ?? SERVICES[0];

export const getServiceLabel = (id: ServiceId): string => getService(id).label;

export const POPULAR_SERVICES = SERVICES.filter((s) => s.popular);
export const MORE_SERVICES = SERVICES.filter((s) => !s.popular);
