// Gemeinsame Kalenderregeln (Europe/Berlin) für Buchung und neue Wunschtermine.
// Die Regeln kommen aus der Stadt-Konfiguration (src/lib/cities.ts).
import { cityOrDefault, settingsFor, DEFAULT_CITY, type ServiceCategory } from "@/lib/cities";

/** Köln-Sperrtage (Abwärtskompatibilität). Pflege in cities.ts. */
export const BLOCKED_DATES: string[] = cityOrDefault(DEFAULT_CITY).calendar.blockedDates;

function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function isWeekend(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return wd === 0 || wd === 6;
}

export const SHORT_NOTICE_ONLY_ERROR =
  "Für morgen ist die Chance gering – bitte wähle mindestens einen weiteren Wunschtag.";

function rulesFor(city: string, category: ServiceCategory = "kfz") {
  return settingsFor(cityOrDefault(city), category).calendar;
}

export function computeCalendarBounds(
  now: Date = new Date(),
  city: string = DEFAULT_CITY,
  category: ServiceCategory = "kfz",
) {
  const rules = rulesFor(city, category);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const berlinHour = Number(parts.hour);
  const todayISO = `${parts.year}-${parts.month}-${parts.day}`;

  // Ab cutoffHour verschiebt sich der früheste Tag; maxDate wandert mit,
  // damit das buchbare Fenster konstant bleibt.
  const afterCutoff = berlinHour >= rules.cutoffHour;
  const minOffset = afterCutoff ? rules.afterCutoffOffsetDays : rules.minOffsetDays;
  let shortNoticeDateISO: string | null = null;
  if (rules.shortNoticeAfterCutoff && afterCutoff && rules.afterCutoffOffsetDays > rules.minOffsetDays) {
    const d = addDaysISO(todayISO, rules.minOffsetDays);
    if (!rules.blockedDates.includes(d) && (rules.allowWeekends || !isWeekend(d))) shortNoticeDateISO = d;
  }
  return {
    todayISO,
    minDateISO: addDaysISO(todayISO, minOffset),
    maxDateISO: addDaysISO(todayISO, rules.windowDays - 1 + minOffset),
    blockedDatesISO: rules.blockedDates,
    shortNoticeDateISO,
  };
}

/** Prüft YYYY-MM-DD-Daten gegen dieselben Regeln wie der Kalender.
 *  Der kurzfristige Tag zählt nur zusammen mit mindestens einem weiteren erlaubten Tag. */
export function areDatesAllowed(
  dates: string[],
  now: Date = new Date(),
  city: string = DEFAULT_CITY,
  category: ServiceCategory = "kfz",
): boolean {
  const rules = rulesFor(city, category);
  const b = computeCalendarBounds(now, city, category);
  const regular = (d: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
    if (d < b.minDateISO || d > b.maxDateISO) return false;
    if (rules.blockedDates.includes(d)) return false;
    return rules.allowWeekends || !isWeekend(d);
  };
  const short = b.shortNoticeDateISO;
  const others = dates.filter((d) => d !== short);
  if (others.length === 0) return false;
  return others.every(regular);
}

/** true, wenn ausschließlich der kurzfristige Tag gewählt ist. */
export function isShortNoticeOnly(
  dates: string[],
  now: Date = new Date(),
  city: string = DEFAULT_CITY,
  category: ServiceCategory = "kfz",
): boolean {
  const short = computeCalendarBounds(now, city, category).shortNoticeDateISO;
  return !!short && dates.length > 0 && dates.every((d) => d === short);
}
