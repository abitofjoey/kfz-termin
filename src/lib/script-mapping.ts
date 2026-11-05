// Abbildung einer Buchung auf das Format, das das Pi-Script erwartet.
// Für Köln muss die Ausgabe exakt dem bisherigen Format entsprechen.
import { SCRIPT_SERVICE_MAP_BY_CITY, categoryForLabel } from "@/lib/services";
import { cityOrDefault } from "@/lib/cities";

export type ScriptBookingRow = {
  id: string;
  service_type: string;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  fin_1: string;
  fin_2: string | null;
  fin_3: string | null;
  selected_dates: string[];
  city?: string | null;
  locations?: string[] | null;
  financed?: boolean | null;
  vehicle_count?: number | null;
};

const SALUTATION_MAP: Record<string, string> = { Herr: "m", Frau: "w", Divers: "d" };

function countNonEmptyFins(row: ScriptBookingRow): string {
  const fins = [row.fin_1, row.fin_2, row.fin_3].filter(
    (fin): fin is string => typeof fin === "string" && fin.trim().length > 0,
  );
  return String(fins.length);
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

export function mapBookingForScript(row: ScriptBookingRow) {
  const city = cityOrDefault(row.city);
  const map = SCRIPT_SERVICE_MAP_BY_CITY[city.slug] ?? {};
  const number = map[row.service_type];
  const service = number ? { service: number } : { serviceUnklar: true as const };
  if (city.form.locationChoice) {
    // Städte mit Standortwahl (z.B. Bonn): keine Anrede/FIN, Zusatzfelder.
    const kategorie = categoryForLabel(city.slug, row.service_type);
    return {
      bookingId: row.id,
      nutzerdaten: {
        anrede: row.salutation ? SALUTATION_MAP[row.salutation] ?? "" : "",
        vorname: row.first_name,
        nachname: row.last_name,
        email: row.email,
        telefon: row.phone,
        fin: row.fin_1 ?? "",
        fin2: row.fin_2 ?? "",
        fin3: row.fin_3 ?? "",
        anzahl: kategorie === "fuehrerschein" ? "1" : String(row.vehicle_count ?? 1),
        ...service,
        standorte: row.locations ?? [],
        finanziert: !!row.financed,
        kategorie,
      },
      wunschDaten: row.selected_dates.map(formatDate),
    };
  }
  return {
    bookingId: row.id,
    nutzerdaten: {
      anrede: SALUTATION_MAP[row.salutation] ?? "m",
      vorname: row.first_name,
      nachname: row.last_name,
      email: row.email,
      telefon: row.phone,
      fin: row.fin_1,
      fin2: row.fin_2 ?? "",
      fin3: row.fin_3 ?? "",
      anzahl: countNonEmptyFins(row),
      ...service,
    },
    wunschDaten: row.selected_dates.map(formatDate),
  };
}
