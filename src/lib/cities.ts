// Zentrale Stadt-Konfiguration. Eine neue Stadt entsteht durch einen Eintrag
// hier, eine Inhaltsdatei unter src/content/cities/ und eine Dienstleistungsliste
// in src/lib/services.ts – ohne neuen Seiten- oder Schnittstellen-Code.

export type ServiceCategory = "kfz" | "fuehrerschein";

export type CalendarRules = {
  /** Frühester Tag in Tagen ab heute (vor cutoffHour). */
  minOffsetDays: number;
  /** Frühester Tag ab cutoffHour (Europe/Berlin). */
  afterCutoffOffsetDays: number;
  cutoffHour: number;
  /** Länge des buchbaren Fensters in Tagen. */
  windowDays: number;
  allowWeekends: boolean;
  /** Einmalig gesperrte Tage (YYYY-MM-DD). */
  blockedDates: string[];
};

export type CategorySettings = {
  calendar: CalendarRules;
  searchHours: { from: number; to: number };
  priceCents: number;
  /** Stunden zur Bestätigung beim Amt; null = sofort verbindlich. */
  customerConfirmationHours: number | null;
};

export type CityLocation = { id: string; name: string; address: string };

export type CityConfig = CategorySettings & {
  slug: string;
  name: string;
  adjective: string;
  authorityName: string;
  /** Kurzer Ortsname für Mails/Seiten, z.B. "Kfz-Zulassungsstelle, Max-Glomsda-Str. 4, 51105 Köln". */
  appointmentLocation: string;
  locations: CityLocation[];
  portalUrl: string;
  /** Infoseite der Stadt zur Zulassung (Mails). */
  infoUrl: string;
  /** Anzeigename der Marke, z.B. "KFZ-Termin Köln". */
  siteName: string;
  form: {
    finRequired: boolean;
    salutationRequired: boolean;
    locationChoice: boolean;
    financedCheckbox: boolean;
  };
  /** Überschreibungen pro Kategorie (später z.B. Führerschein). */
  categories?: Partial<Record<ServiceCategory, Partial<CategorySettings>>>;
  mail: {
    /** Text "bei der Kölner Zulassungsstelle". */
    atAuthority: string;
    /** Pflicht, Aufrufnummer und Stornolink in Mails anzeigen. */
    showBookingReference: boolean;
    showCancelUrl: boolean;
  };
  launched: boolean;
  bookable: boolean;
};

export const DEFAULT_CITY = "koeln";

export const CITIES: Record<string, CityConfig> = {
  koeln: {
    slug: "koeln",
    name: "Köln",
    adjective: "Kölner",
    authorityName: "Kfz-Zulassungsstelle Köln",
    appointmentLocation: "Kfz-Zulassungsstelle, Max-Glomsda-Str. 4, 51105 Köln",
    locations: [
      { id: "max-glomsda", name: "Kfz-Zulassungsstelle Köln", address: "Max-Glomsda-Straße 4, 51105 Köln" },
    ],
    portalUrl:
      "https://termine.stadt-koeln.de/m/kfz-zulassung/extern/calendar/?uid=67523a04-37af-4131-9495-0a3566e0eb8b",
    infoUrl: "https://www.stadt-koeln.de/service/adressen/00205/index.html",
    siteName: "KFZ-Termin Köln",
    calendar: {
      minOffsetDays: 1,
      afterCutoffOffsetDays: 2,
      cutoffHour: 14,
      windowDays: 14,
      allowWeekends: false,
      blockedDates: [],
    },
    searchHours: { from: 6, to: 20 },
    priceCents: 999,
    customerConfirmationHours: 3,
    form: { finRequired: true, salutationRequired: true, locationChoice: false, financedCheckbox: false },
    mail: { atAuthority: "bei der Kölner Zulassungsstelle", showBookingReference: false, showCancelUrl: false },
    launched: true,
    bookable: true,
  },
  bonn: {
    slug: "bonn",
    name: "Bonn",
    adjective: "Bonner",
    authorityName: "Kfz-Zulassungsstelle Bonn",
    appointmentLocation: "Kfz-Zulassungsstelle Bonn",
    locations: [],
    portalUrl: "",
    infoUrl: "",
    siteName: "KFZ-Termin Bonn",
    calendar: {
      minOffsetDays: 1,
      afterCutoffOffsetDays: 2,
      cutoffHour: 14,
      windowDays: 14,
      allowWeekends: false,
      blockedDates: [],
    },
    searchHours: { from: 6, to: 20 },
    priceCents: 999,
    customerConfirmationHours: null,
    form: { finRequired: false, salutationRequired: false, locationChoice: true, financedCheckbox: true },
    mail: { atAuthority: "bei der Bonner Zulassungsstelle", showBookingReference: true, showCancelUrl: true },
    launched: false,
    bookable: false,
  },
};

export function getCity(slug: string | null | undefined): CityConfig | undefined {
  return slug ? CITIES[slug] : undefined;
}

/** Stadt der Buchung; unbekannt oder leer = Köln (alle Altbuchungen). */
export function cityOrDefault(slug: string | null | undefined): CityConfig {
  return getCity(slug) ?? CITIES[DEFAULT_CITY];
}

export const launchedCities = () => Object.values(CITIES).filter((c) => c.launched);
export const bookableCities = () => Object.values(CITIES).filter((c) => c.bookable);
export const isBookableCity = (slug: string) => !!getCity(slug)?.bookable;

/** Einstellungen für eine Kategorie, mit Stadt-Standard als Rückfall. */
export function settingsFor(city: CityConfig, category: ServiceCategory = "kfz"): CategorySettings {
  const o = city.categories?.[category] ?? {};
  return {
    calendar: o.calendar ?? city.calendar,
    searchHours: o.searchHours ?? city.searchHours,
    priceCents: o.priceCents ?? city.priceCents,
    customerConfirmationHours:
      o.customerConfirmationHours !== undefined ? o.customerConfirmationHours : city.customerConfirmationHours,
  };
}

/** Präfix für interne Mails, z.B. "[Köln] ". */
export const internalPrefix = (slug: string | null | undefined) => `[${cityOrDefault(slug).name}] `;
