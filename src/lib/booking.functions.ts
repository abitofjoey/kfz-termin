import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const BookingInput = z.object({
  service_type: z.enum(["gebraucht", "neu"]),
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
  fin_1: z.string().trim().regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen"),
  selected_dates: z.array(z.string()).min(5).max(60),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => BookingInput.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(url, key);

    const serviceLabel =
      data.service_type === "gebraucht"
        ? "Anmeldung Gebrauchtfahrzeug"
        : "Anmeldung Neufahrzeug";

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
