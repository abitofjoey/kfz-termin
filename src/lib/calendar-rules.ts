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
  const minOffset = berlinHour >= rules.cutoffHour ? rules.afterCutoffOffsetDays : rules.minOffsetDays;
  return {
    todayISO,
    minDateISO: addDaysISO(todayISO, minOffset),
    maxDateISO: addDaysISO(todayISO, rules.windowDays - 1 + minOffset),
    blockedDatesISO: rules.blockedDates,
  };
}

/** Prüft YYYY-MM-DD-Daten gegen dieselben Regeln wie der Kalender. */
export function areDatesAllowed(
  dates: string[],
  now: Date = new Date(),
  city: string = DEFAULT_CITY,
  category: ServiceCategory = "kfz",
): boolean {
  const rules = rulesFor(city, category);
  const b = computeCalendarBounds(now, city, category);
  return dates.every((d) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
    if (d < b.minDateISO || d > b.maxDateISO) return false;
    if (rules.blockedDates.includes(d)) return false;
    if (rules.allowWeekends) return true;
    const [y, m, day] = d.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
    return wd !== 0 && wd !== 6;
  });
}
