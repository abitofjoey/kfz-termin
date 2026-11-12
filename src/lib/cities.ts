import type { ComponentType } from "react";
import { KoelnLandmark } from "@/assets/landmarks/koeln";
import { BonnLandmark } from "@/assets/landmarks/bonn";
import { RecklinghausenLandmark } from "@/assets/landmarks/recklinghausen";

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
  /** Ablauf: "single" = Kölner Ablauf (Kunde bestätigt), "multi" = Bonner Ablauf (Script-Format, Standort-/Nummernzeilen). */
  flow: "single" | "multi";
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
    /** Ablauf "multi": Bezeichnung der Nummer, z.B. "Aufrufnummer". */
    referenceLabel?: string;
    /** Ablauf "multi": "So läuft dein Termin ab" – {nummer} = " <Nummer>" oder leer, **fett**. */
    onSiteSteps?: string[];
    /** Ablauf "multi": Hinweis auf die eigene Bestätigung der Behörde (**fett**). */
    cityConfirmationNote?: string;
    /** Ablauf "multi": Linktext zur Infoseite, z.B. "Seite der Stadt Bonn". */
    infoLinkLabel?: string;
    /** Ablauf "multi": Check-in-Hinweis im Kalendereintrag. */
    calendarCheckIn?: string;
    /** Genitiv der Behörde in Fließtexten, z.B. "der Stadt" (Standard). */
    authorityOf?: string;
  };
  /** Texte der Kundenseiten nach der Buchung. */
  pages: {
    /** Behörde im Fließtext, z.B. "Zulassungsstelle Köln". */
    authorityShort: string;
    /** Einleitung auf /buchung-erfolgreich; null = Standardtext mit mail.atAuthority-Adjektiv. */
    successIntro: string | null;
    /** Hinweisbox auf /buchung-erfolgreich; null = Standard-Box mit Bestätigungsfrist. */
    successNotice: string | null;
    /** Infolink der Service-Karte, z.B. "beim Kreis Recklinghausen" (Standard "bei der Stadt <Name>"). */
    infoAt?: string;
    /** Kurzlabel des Infolinks, z.B. "Kreis Recklinghausen" (Standard "Stadt <Name>"). */
    infoShort?: string;
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
    flow: "single",
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
    flow: "multi",
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
    mail: {
      atAuthority: "bei der Stadt Bonn",
      authority: "Stadt Bonn",
      showBookingReference: true,
      showCancelUrl: true,
      referenceLabel: "Aufrufnummer",
      onSiteSteps: [
        "**Sei pünktlich:** Der Termin verfällt, wenn du nicht rechtzeitig da bist.",
        "Melde dich vor Ort am Check-in-Terminal an: frühestens 15 Minuten vor und spätestens 5 Minuten nach Beginn. Dafür scannst du den QR-Code aus der Mail der Stadt oder gibst deine Aufrufnummer{nummer} ein. Ohne Anmeldung am Terminal wirst du nicht aufgerufen.",
        "Danach im Wartebereich warten, bis deine Nummer auf der Anzeigetafel erscheint, und zum angezeigten Schalter gehen.",
        "Es wird nur das gebuchte Anliegen bearbeitet.",
        "Gebühren kannst du mit EC- oder Kreditkarte zahlen, auch Apple Pay und Google Pay.",
      ],
      cityConfirmationNote:
        "**Hinweis:** Die Stadt Bonn schickt dir zusätzlich eine eigene Bestätigung mit QR-Code. Sie kann sich etwas verzögern – deine Aufrufnummer aus dieser Mail reicht für den Check-in.",
      infoLinkLabel: "Seite der Stadt Bonn",
      calendarCheckIn: "Check-in am Terminal 15 Min. vorher bis 5 Min. nach Beginn.",
    },
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
  recklinghausen: {
    slug: "recklinghausen",
    name: "Recklinghausen",
    landmarkIcon: RecklinghausenLandmark,
    adjective: "Recklinghäuser",
    authorityName: "Kreis Recklinghausen – Straßenverkehrsamt, Zulassungsstelle Marl",
    appointmentLocation: "Zulassung Marl, Stettiner Str. 10, 45770 Marl",
    locations: [{ id: "marl", name: "Zulassung Marl", address: "Stettiner Str. 10, 45770 Marl" }],
    portalUrl:
      "https://terminvergabe.kreis-re.de/m/zulassung/extern/calendar/?uid=2dceea2a-91a4-49c7-8c4b-48ba42b167a8",
    infoUrl: "https://www.kreis-re.de/strassenverkehrsamt",
    siteName: BRAND_NAME,
    checkoutDescription: `${BRAND_NAME} – Terminservice bei der Zulassungsstelle Marl (Kreis Recklinghausen)`,
    calendar: {
      minOffsetDays: 1,
      afterCutoffOffsetDays: 1,
      cutoffHour: 24,
      windowDays: 28,
      allowWeekends: false,
      blockedDates: [],
    },
    searchHours: { from: 0, to: 24 },
    priceCents: CITY_PRICE_CENTS,
    customerConfirmationHours: null,
    flow: "multi",
    form: { finRequired: false, salutationRequired: true, locationChoice: false, financedCheckbox: false },
    mail: {
      atAuthority: "bei der Zulassungsstelle Marl (Kreis Recklinghausen)",
      authority: "Zulassungsstelle",
      showBookingReference: true,
      showCancelUrl: true,
      referenceLabel: "Terminnummer",
      onSiteSteps: [
        "Sei pünktlich – plane etwas Puffer für Anfahrt und Parken ein.",
        "Melde dich vor Ort am Check-in-Terminal an, frühestens 10 Minuten vor Beginn. Dafür scannst du den QR-Code aus der Mail des Kreises oder gibst deine Terminnummer{nummer} ein. Ohne Anmeldung am Terminal wirst du nicht aufgerufen.",
        "Danach im Warteraum warten, bis deine Terminnummer aufgerufen wird, und zum angezeigten Schalter gehen.",
        "Es wird nur das gebuchte Anliegen für die angegebene Person bearbeitet.",
        "Gebühren zahlst du nur bargeldlos – mit EC-/Debitkarte oder Kreditkarte. Barzahlung ist nicht möglich.",
      ],
      cityConfirmationNote:
        "**Hinweis:** Der Kreis Recklinghausen schickt dir zusätzlich eine eigene Bestätigung mit QR-Code. Bitte bring sie zum Termin mit (ausgedruckt oder auf dem Handy). Deine Terminnummer aus dieser Mail reicht für den Check-in.",
      infoLinkLabel: "Seite des Kreises Recklinghausen",
      calendarCheckIn: "Check-in am Terminal frühestens 10 Min. vor Beginn.",
      authorityOf: "des Kreises",
    },
    pages: {
      authorityShort: "Zulassungsstelle Marl",
      infoAt: "beim Kreis Recklinghausen",
      infoShort: "Kreis Recklinghausen",
      successIntro:
        "Wir haben deine Zahlung erhalten und suchen ab sofort rund um die Uhr nach einem freien Termin bei der Zulassungsstelle Marl. Du erhältst in Kürze eine Bestätigungsmail.",
      successNotice:
        "Sobald wir einen Termin gebucht haben, bekommst du eine E-Mail von uns mit Datum, Uhrzeit und deiner Terminnummer. Du musst nichts mehr bestätigen. Zusätzlich schickt dir der Kreis Recklinghausen eine eigene Bestätigung mit QR-Code – bitte bring sie zum Termin mit. Schau auch in deinen Ordnern Spam und Werbung nach.",
    },
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
/** Behörde im Fließtext nach "die"/"zur" (Ablauf "multi": aus pages.authorityShort, z.B. "Stadt Bonn"). */
export const authorityShortOf = (c: CityConfig) => c.pages.authorityShort;
/** Genitiv der Behörde, z.B. "der Stadt" / "des Kreises". */
export const authorityOf = (c: CityConfig) => c.mail.authorityOf ?? "der Stadt";
/** Nummern-Bezeichnung in Mails/Kalender (Standard "Aufrufnummer"). */
export const referenceLabelOf = (c: CityConfig) => c.mail.referenceLabel ?? "Aufrufnummer";

export const internalPrefix = (slug: string | null | undefined) => `[${cityOrDefault(slug).name}] `;
