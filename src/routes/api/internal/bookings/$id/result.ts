import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const isoDate = z.string().refine((v) => !isNaN(Date.parse(v)), "invalid date");

const BodySchema = z.discriminatedUnion("result", [
  z.object({
    result: z.literal("found"),
    appointmentAt: isoDate,
    bookedAt: isoDate,
  }),
  z.object({
    result: z.literal("not_found"),
  }),
]);

export const Route = createFileRoute("/api/internal/bookings/$id/result")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("booking result: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid body", { status: 400 });
        }
        const body = parsed.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: booking, error: loadError } = await supabaseAdmin
          .from("bookings")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        if (loadError) {
          console.error("booking result: database error (load)", loadError.code);
          return new Response("Database error", { status: 500 });
        }
        if (!booking || !booking.paid) {
          return new Response("Not found", { status: 404 });
        }

        if (body.result === "not_found") {
          const { data: nfUpdated, error: nfError } = await supabaseAdmin
            .from("bookings")
            .update({ search_result: "not_found" })
            .eq("id", params.id)
            .is("search_result", null)
            .select("id");

          if (nfError) {
            console.error("booking result: database error (update not_found)", nfError.code);
            return new Response("Database error", { status: 500 });
          }
          if (!nfUpdated || nfUpdated.length === 0) {
            return Response.json({ ok: true, alreadyRecorded: true });
          }

          const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");
          let nfEmailSent = false;
          try {
            const internal = await sendTransactionalEmailServer({
              templateName: "search-not-found-internal",
              idempotencyKey: `booking-notfound-internal-${booking.id}`,
              templateData: {
                bookingId: booking.id,
                salutation: booking.salutation,
                firstName: booking.first_name,
                lastName: booking.last_name,
                email: booking.email,
                phone: booking.phone,
                serviceType: booking.service_type,
                selectedDates: booking.selected_dates,
                stripeSessionId: booking.stripe_session_id,
              },
            });
            nfEmailSent = internal.success;
            if (!internal.success) console.error("booking result: not_found internal email not sent");
          } catch {
            console.error("booking result: not_found email sending failed");
          }
          return Response.json({ ok: true, emailSent: nfEmailSent });
        }

        const appointmentAt = new Date(body.appointmentAt).toISOString();
        const foundAt = new Date(body.bookedAt).toISOString();


        const { data: updated, error: updateError } = await supabaseAdmin
          .from("bookings")
          .update({
            search_result: "found",
            appointment_at: appointmentAt,
            found_at: foundAt,
          })
          .eq("id", params.id)
          .is("search_result", null)
          .select("id");

        if (updateError) {
          console.error("booking result: database error (update)", updateError.code);
          return new Response("Database error", { status: 500 });
        }
        if (!updated || updated.length === 0) {
          return Response.json({ ok: true, alreadyRecorded: true });
        }

        const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");

        const templateData = {
          bookingId: booking.id,
          salutation: booking.salutation,
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          phone: booking.phone,
          serviceType: booking.service_type,
          appointmentAt,
          foundAt,
        };

        let emailSent = false;
        try {
          const [customer, internal] = await Promise.all([
            sendTransactionalEmailServer({
              templateName: "appointment-found",
              recipientEmail: booking.email,
              idempotencyKey: `booking-found-${booking.id}`,
              templateData,
            }),
            sendTransactionalEmailServer({
              templateName: "appointment-found-internal",
              idempotencyKey: `booking-found-internal-${booking.id}`,
              templateData,
            }),
          ]);
          emailSent = customer.success;
          if (!customer.success) console.error("booking result: customer email not sent");
          if (!internal.success) console.error("booking result: internal email not sent");

          if (emailSent) {
            await supabaseAdmin
              .from("bookings")
              .update({ result_notified_at: new Date().toISOString() })
              .eq("id", booking.id);
          }
        } catch {
          console.error("booking result: email sending failed");
        }

        return Response.json({ ok: true, emailSent });
      },
    },
  },
});
