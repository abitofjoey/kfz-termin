import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Kalenderdatei zu einer Buchung mit gefundenem Termin. Zugriff nur über den
// eigenen, geheimen Kalender-Schlüssel (nicht Buchungs-ID, nicht Widerruf/Termine-Token).
export const Route = createFileRoute("/kalender/{$token}.ics")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const notFound = () => new Response("Not found", { status: 404 });
        const parsed = z.string().uuid().safeParse(params.token);
        if (!parsed.success) return notFound();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: b, error } = await supabaseAdmin
          .from("bookings")
          .select("id, city, service_type, appointment_at, booked_location, booking_reference, cancel_url, search_result, withdrawn_at, anonymized_at")
          .eq("calendar_token", parsed.data)
          .maybeSingle();
        if (error) {
          console.error("calendar: database error", error.code);
          return new Response("Error", { status: 500 });
        }
        if (!b || b.search_result !== "found" || !b.appointment_at || b.withdrawn_at || b.anonymized_at) return notFound();
        const { buildCalendarEvent, buildIcs } = await import("@/lib/calendar");
        const ics = buildIcs(
          buildCalendarEvent({
            id: b.id,
            city: b.city,
            serviceType: b.service_type,
            appointmentAt: b.appointment_at,
            bookedLocation: b.booked_location,
            bookingReference: b.booking_reference,
            cancelUrl: b.cancel_url,
          }),
        );
        return new Response(ics, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="kfz-termin.ics"',
            "Cache-Control": "private, no-store",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
