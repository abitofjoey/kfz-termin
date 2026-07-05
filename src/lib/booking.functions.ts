import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SERVICE_IDS, getServiceLabel } from "@/lib/services";

export const getCalendarBounds = createServerFn({ method: "GET" }).handler(
  async () => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
    });
    const parts = Object.fromEntries(
      fmt.formatToParts(new Date()).map((p) => [p.type, p.value]),
    );
    const berlinHour = Number(parts.hour);
    const todayISO = `${parts.year}-${parts.month}-${parts.day}`;

    const addDaysISO = (iso: string, days: number) => {
      const [y, m, d] = iso.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      dt.setUTCDate(dt.getUTCDate() + days);
      return dt.toISOString().slice(0, 10);
    };

    // Ab 14 Uhr Berlin-Zeit: frühester wählbarer Tag ist übermorgen.
    const minOffset = berlinHour >= 14 ? 2 : 1;
    return {
      todayISO,
      minDateISO: addDaysISO(todayISO, minOffset),
      maxDateISO: addDaysISO(todayISO, 14),
    };
  },
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
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => BookingInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = supabaseAdmin;

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
      })
      .select("id")
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return { ok: false as const, error: "Buchung konnte nicht gespeichert werden." };
    }

    return { ok: true as const, bookingId: row.id };
  });
