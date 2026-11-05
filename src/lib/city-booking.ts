import { z } from "zod";
import { areDatesAllowed } from "@/lib/calendar-rules";
import { getCity, BONN_MAIN_LOCATION } from "@/lib/cities";
import { getCityService, possibleLocations, resolveLocations } from "@/lib/services";

// ---- Städte mit Standortwahl (z.B. Bonn) ----------------------------------
// Eigener Pfad, damit der Kölner Ablauf oben unverändert bleibt.
export const CityBookingInput = z.object({
  city: z.string().max(40),
  service_id: z.string().max(60),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
  vehicle_count: z.number().int().min(1).max(10).optional(),
  /** null = "Egal wo". */
  locations: z.array(z.string().max(40)).max(10).nullable(),
  financed: z.boolean().optional(),
  selected_dates: z.array(z.string()).min(1).max(60),
});

export type CityBookingData = z.infer<typeof CityBookingInput>;

/** Reine Prüfung + Aufbereitung, testbar ohne Datenbank. */
export function prepareCityBooking(data: CityBookingData, now: Date = new Date()) {
  const city = getCity(data.city);
  if (!city || !city.bookable) {
    return { ok: false as const, error: "Für diese Stadt sind noch keine Buchungen möglich." };
  }
  const service = getCityService(city.slug, data.service_id);
  if (!service) return { ok: false as const, error: "Bitte Dienstleistung wählen." };
  if (!areDatesAllowed(data.selected_dates, now, city.slug, service.category)) {
    return { ok: false as const, error: "Bitte wähle nur Tage aus, die im Kalender freigegeben sind." };
  }
  const isKfz = service.category === "kfz";
  const max = service.maxVehicles ?? 1;
  const vehicles = isKfz ? data.vehicle_count ?? 1 : 1;
  if (vehicles > max) {
    return { ok: false as const, error: `Für dieses Anliegen sind höchstens ${max} Fahrzeuge pro Termin möglich.` };
  }
  const financed = isKfz && city.form.financedCheckbox ? !!data.financed : false;
  const possible = possibleLocations(service, city.locations.map((l) => l.id));
  const locations = resolveLocations({
    possible,
    chosen: data.locations,
    financed,
    mainLocation: BONN_MAIN_LOCATION,
  });
  if (!locations) return { ok: false as const, error: "Bitte wähle mindestens einen möglichen Standort." };
  return {
    ok: true as const,
    row: {
      service_type: service.label,
      salutation: "",
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      fin_1: "",
      fin_2: null,
      fin_3: null,
      selected_dates: Array.from(new Set(data.selected_dates)).sort(),
      status: "open",
      paid: false,
      city: city.slug,
      locations,
      financed,
      vehicle_count: vehicles,
      amount_cents: city.priceCents,
    },
  };
}

