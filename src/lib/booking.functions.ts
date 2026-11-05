import { createServerFn } from "@tanstack/react-start";
import { CityBookingInput, prepareCityBooking } from "@/lib/city-booking";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SERVICE_IDS, getServiceLabel, getMaxVehicles } from "@/lib/services";
import { computeCalendarBounds } from "@/lib/calendar-rules";
import { DEFAULT_CITY, getCity, isBookableCity } from "@/lib/cities";

export const getCalendarBounds = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({
        city: z.string().max(40).optional(),
        category: z.enum(["kfz", "fuehrerschein"]).optional(),
      })
      .optional()
      .parse(data),
  )
  .handler(async ({ data }) =>
    computeCalendarBounds(new Date(), data?.city ?? DEFAULT_CITY, data?.category ?? "kfz"),
  );

const BookingInput = z.object({
  service_type: z.enum(SERVICE_IDS),
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
  fin_1: z.string().trim().regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen"),
  fin_2: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen")
    .optional()
    .or(z.literal("")),
  fin_3: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen")
    .optional()
    .or(z.literal("")),
  selected_dates: z.array(z.string()).min(1).max(60),
  city: z.string().max(40).optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => BookingInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = supabaseAdmin;

    const city = data.city ?? DEFAULT_CITY;
    if (!isBookableCity(city)) {
      return { ok: false as const, error: "Für diese Stadt sind noch keine Buchungen möglich." };
    }
    const blockedDates = getCity(city)!.calendar.blockedDates;
    const blocked = data.selected_dates.filter((d) => blockedDates.includes(d));
    if (blocked.length > 0) {
      return {
        ok: false as const,
        error:
          "An einem der gewählten Tage ist die Zulassungsstelle geschlossen. Bitte entferne diesen Tag aus deiner Auswahl.",
      };
    }

    if (data.fin_3 && getMaxVehicles(data.service_type) < 3) {
      return {
        ok: false as const,
        error: "Für dieses Anliegen sind bei der Stadt höchstens 2 Fahrzeuge pro Termin möglich. Bitte entferne das dritte Fahrzeug.",
      };
    }

    const serviceLabel = getServiceLabel(data.service_type);

    const { data: row, error } = await supabase
      .from("bookings")
      .insert({
        service_type: serviceLabel,
        salutation: data.salutation,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        fin_1: data.fin_1.toUpperCase(),
        fin_2: data.fin_2 ? data.fin_2.toUpperCase() : null,
        fin_3: data.fin_3 ? data.fin_3.toUpperCase() : null,
        selected_dates: data.selected_dates,
        status: "open",
        paid: false,
        city,
        // Preis serverseitig aus der Stadt-Konfiguration, nie vom Client.
        amount_cents: getCity(city)!.priceCents,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return { ok: false as const, error: "Buchung konnte nicht gespeichert werden." };
    }

    return { ok: true as const, bookingId: row.id };
  });


export const createCityBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CityBookingInput.parse(data))
  .handler(async ({ data }) => {
    const prepared = prepareCityBooking(data);
    if (!prepared.ok) return prepared;
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert(prepared.row)
      .select("id")
      .single();
    if (error) {
      console.error("City booking insert error:", error.code);
      return { ok: false as const, error: "Buchung konnte nicht gespeichert werden." };
    }
    return { ok: true as const, bookingId: row.id };
  });
