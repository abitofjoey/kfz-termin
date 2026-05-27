export type ServiceId =
  | "gebraucht"
  | "neu"
  | "kennzeichenwechsel"
  | "technische-aenderung"
  | "wiederzulassung"
  | "h-kennzeichen"
  | "saisonkennzeichen"
  | "kurzzeitkennzeichen"
  | "ausfuhrkennzeichen";

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
};

export const SERVICES: Service[] = [
  {
    id: "gebraucht",
    label: "Anmeldung Gebrauchtfahrzeug",
    shortLabel: "Gebrauchtfahrzeug",
    subtitle: "Umschreibung nach Zuzug oder bei Verkauf / Halterwechsel",
    note: "Ausgenommen ausländische Fahrzeuge",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00737/index.html",
  },
  {
    id: "neu",
    label: "Anmeldung Neufahrzeug",
    shortLabel: "Neufahrzeug",
    subtitle: "Erstzulassung deines neuen Fahrzeugs",
    note: "Ausgenommen technisch veränderte Neufahrzeuge gem. § 13 EG-FGV",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00729/index.html",
  },
  {
    id: "kennzeichenwechsel",
    label: "Kennzeichenwechsel",
    shortLabel: "Kennzeichenwechsel",
    subtitle: "Umkennzeichnung auf Wunsch",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00746/index.html",
  },
  {
    id: "technische-aenderung",
    label: "Technische Änderung",
    shortLabel: "Technische Änderung",
    subtitle: "Änderung der Fahrzeugklasse, Eintragung von Zubehörteilen",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00735/index.html",
  },
  {
    id: "wiederzulassung",
    label: "Wiederzulassung",
    shortLabel: "Wiederzulassung",
    subtitle: "Wiederzulassung eines Fahrzeugs auf dieselbe Person",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00740/index.html",
  },
  {
    id: "h-kennzeichen",
    label: "H-Kennzeichen",
    shortLabel: "H-Kennzeichen",
    subtitle: "Für historische Fahrzeuge – nur für Kölnerinnen und Kölner",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00726/index.html",
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
    id: "ausfuhrkennzeichen",
    label: "Ausfuhrkennzeichen",
    shortLabel: "Ausfuhrkennzeichen",
    subtitle: "Für die Ausfuhr eines Fahrzeugs ins Ausland",
    infoUrl: "https://www.stadt-koeln.de/service/produkte/00720/index.html",
  },
];

export const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export const getService = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id) ?? SERVICES[0];

export const getServiceLabel = (id: ServiceId): string => getService(id).label;
