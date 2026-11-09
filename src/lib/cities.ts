import type { ComponentType } from "react";
import { KoelnLandmark } from "@/assets/landmarks/koeln";
import { BonnLandmark } from "@/assets/landmarks/bonn";

/** Firmenname – für alle Städte gleich. */
export const BRAND_NAME = "KFZ-Termin";

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
  /** Optional SVG component for currentColor rendering. */
  landmarkIcon?: ComponentType;
  adjective: string;
  authorityName: string;
  /** Kurzer Ortsname für Mails/Seiten, z.B. "Kfz-Zulassungsstelle, Max-Glomsda-Str. 4, 51105 Köln". */
  appointmentLocation: string;
  locations: CityLocation[];
  portalUrl: string;
  /** Infoseite der Stadt zur Zulassung (Mails). */
  infoUrl: string;
  /** Anzeigename der Marke (für alle Städte gleich). */
  siteName: string;
  /** Produktbeschreibung im Stripe-Checkout. */
  checkoutDescription: string;
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
    /** Behörde im Fließtext von Kundenmails, z.B. "Zulassungsstelle" (nach "der"/"die"). */
    authority: string;
    /** Pflicht, Aufrufnummer und Stornolink in Mails anzeigen. */
    showBookingReference: boolean;
    showCancelUrl: boolean;
  };
  /** Texte der Kundenseiten nach der Buchung. */
  pages: {
    /** Behörde im Fließtext, z.B. "Zulassungsstelle Köln". */
    authorityShort: string;
    /** Einleitung auf /buchung-erfolgreich; null = Standardtext mit mail.atAuthority-Adjektiv. */
    successIntro: string | null;
    /** Hinweisbox auf /buchung-erfolgreich; null = Standard-Box mit Bestätigungsfrist. */
    successNotice: string | null;
  };
  launched: boolean;
  bookable: boolean;
};

export const DEFAULT_CITY = "koeln";

/** Aktueller Preis in Köln (Cent). Einzige Stelle für den Kölner Preis. */
export const KOELN_PRICE_CENTS = 1299;
/** Zentraler Standardpreis für weitere Städte (Cent). */
export const CITY_PRICE_CENTS = KOELN_PRICE_CENTS;

/** Hauptstandort Bonn: einziger Standort für finanzierte/geleaste Fahrzeuge. */
export const BONN_MAIN_LOCATION = "dlz";
const BONN_LOCATIONS: CityLocation[] = [
  { id: "dlz", name: "Dienstleistungszentrum im Stadthaus", address: "Berliner Platz 2, 53111 Bonn" },
  { id: "hardtberg", name: "Bürgeramt Hardtberg", address: "Villemombler Str. 1, 53123 Bonn" },
  { id: "beuel", name: "Bürgeramt Beuel", address: "Friedrich-Breuer-Str. 65, 53225 Bonn" },
  { id: "godesberg", name: "Bürgeramt Bad Godesberg", address: "Kurfürstenallee 2-3, 53177 Bonn" },
];

export const CITIES: Record<string, CityConfig> = {
  koeln: {
    slug: "koeln",
    name: "Köln",
    landmarkIcon: KoelnLandmark,
    adjective: "Kölner",
    authorityName: "Kfz-Zulassungsstelle Köln",
    appointmentLocation: "Kfz-Zulassungsstelle, Max-Glomsda-Str. 4, 51105 Köln",
    locations: [
      { id: "max-glomsda", name: "Kfz-Zulassungsstelle Köln", address: "Max-Glomsda-Straße 4, 51105 Köln" },
    ],
    portalUrl:
      "https://termine.stadt-koeln.de/m/kfz-zulassung/extern/calendar/?uid=67523a04-37af-4131-9495-0a3566e0eb8b",
    infoUrl: "https://www.stadt-koeln.de/service/adressen/00205/index.html",
    siteName: BRAND_NAME,
    checkoutDescription: "KFZ-Termin – Terminservice bei der Zulassungsstelle Köln",
    calendar: {
      minOffsetDays: 1,
      afterCutoffOffsetDays: 2,
      cutoffHour: 14,
      windowDays: 14,
      allowWeekends: false,
      blockedDates: [],
    },
    searchHours: { from: 6, to: 20 },
    priceCents: KOELN_PRICE_CENTS,
    customerConfirmationHours: 3,
    form: { finRequired: true, salutationRequired: true, locationChoice: false, financedCheckbox: false },
    mail: { atAuthority: "bei der Kölner Zulassungsstelle", authority: "Zulassungsstelle", showBookingReference: false, showCancelUrl: false },
    pages: { authorityShort: "Zulassungsstelle Köln", successIntro: null, successNotice: null },
    launched: true,
    bookable: true,
  },
  bonn: {
    slug: "bonn",
    name: "Bonn",
    landmarkIcon: BonnLandmark,
    adjective: "Bonner",
    authorityName: "Stadt Bonn – Kfz-Zulassung und Führerscheinstelle",
    appointmentLocation: "Dienstleistungszentrum im Stadthaus, Berliner Platz 2, 53111 Bonn",
    locations: BONN_LOCATIONS,
    portalUrl:
      "https://termine.bonn.de/m/dlz/extern/calendar/?uid=b91bb67b-15cf-44df-ab0b-96ebe25c1ae3&lang=de",
    infoUrl: "https://www.bonn.de",
    siteName: BRAND_NAME,
    checkoutDescription: `${BRAND_NAME} – Terminservice bei der Stadt Bonn`,
    // Ab morgen, kein 14-Uhr-Cutoff (cutoffHour 24 wird nie erreicht).
    calendar: {
      minOffsetDays: 1,
      afterCutoffOffsetDays: 1,
      cutoffHour: 24,
      windowDays: 35,
      allowWeekends: false,
      blockedDates: [],
    },
    searchHours: { from: 0, to: 24 },
    priceCents: CITY_PRICE_CENTS,
    customerConfirmationHours: null,
    form: { finRequired: false, salutationRequired: false, locationChoice: true, financedCheckbox: true },
    categories: {
      fuehrerschein: {
        calendar: {
          minOffsetDays: 1,
          afterCutoffOffsetDays: 1,
          cutoffHour: 24,
          windowDays: 70,
          allowWeekends: false,
          blockedDates: [],
        },
      },
    },
    mail: { atAuthority: "bei der Stadt Bonn", authority: "Stadt Bonn", showBookingReference: true, showCancelUrl: true },
    pages: {
      authorityShort: "Stadt Bonn",
      successIntro:
        "Wir haben deine Zahlung erhalten und suchen ab sofort rund um die Uhr nach einem freien Termin bei der Stadt Bonn. Du erhältst in Kürze eine Bestätigungsmail.",
      successNotice:
        "Sobald wir einen Termin gebucht haben, bekommst du eine E-Mail von uns mit Datum, Uhrzeit, Standort und deiner Aufrufnummer. Du musst nichts mehr bestätigen. Zusätzlich schickt dir die Stadt Bonn eine eigene Bestätigung, die sich etwas verzögern kann. Bitte schau auch in deinen Ordnern Spam und Werbung nach.",
    },
    launched: true,
    bookable: true,
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
/** Städte, deren Pi-Script überwacht wird (auch versteckt, sobald buchbar). */
export const monitoredCities = bookableCities;
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
