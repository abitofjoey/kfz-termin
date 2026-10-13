// Gemeinsame Kalenderregeln (Europe/Berlin) für Buchung und neue Wunschtermine.

// Einmalig gesperrte Tage (z.B. Schließtage der Zulassungsstelle).
// Nach dem Tag einfach wieder entfernen.
export const BLOCKED_DATES: string[] = [];

function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function computeCalendarBounds(now: Date = new Date()) {
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

  // Ab 14 Uhr Berlin-Zeit: frühester wählbarer Tag ist übermorgen.
  // maxDate wird mitverschoben, damit das buchbare Fenster konstant 14 Tage bleibt.
  const minOffset = berlinHour >= 14 ? 2 : 1;
  return {
    todayISO,
    minDateISO: addDaysISO(todayISO, minOffset),
    maxDateISO: addDaysISO(todayISO, 13 + minOffset),
    blockedDatesISO: BLOCKED_DATES,
  };
}

/** Prüft YYYY-MM-DD-Daten gegen dieselben Regeln wie der Kalender. */
export function areDatesAllowed(dates: string[], now: Date = new Date()): boolean {
  const b = computeCalendarBounds(now);
  return dates.every((d) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
    if (d < b.minDateISO || d > b.maxDateISO) return false;
    if (BLOCKED_DATES.includes(d)) return false;
    const [y, m, day] = d.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
    return wd !== 0 && wd !== 6;
  });
}
