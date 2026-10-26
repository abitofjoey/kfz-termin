import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ymd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "invalid date");

const BodySchema = z.object({
  selectedDates: z.array(ymd).min(1).max(60),
});

export const Route = createFileRoute("/api/internal/bookings/$id/dates")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("booking dates: SCRIPT_API_KEY not configured");
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
        const newDates = Array.from(new Set(parsed.data.selectedDates)).sort();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: booking, error: loadError } = await supabaseAdmin
          .from("bookings")
          .select("id, paid, email, first_name, service_type, selected_dates, withdraw_token, search_result, withdrawn_at, refund_claimed_at, refunded_at")
          .eq("id", params.id)
          .maybeSingle();
        if (loadError) {
          console.error("booking dates: database error (load)", loadError.code);
          return new Response("Database error", { status: 500 });
        }
        if (!booking || !booking.paid) {
          return new Response("Not found", { status: 404 });
        }

        if (booking.search_result || booking.withdrawn_at || booking.refund_claimed_at || booking.refunded_at) {
          return Response.json({ ok: true, ignored: true });
        }

        const oldDates = [...(booking.selected_dates ?? [])].sort();
        if (oldDates.length === newDates.length && oldDates.every((d, i) => d === newDates[i])) {
          return Response.json({ ok: true, changed: false });
        }

        const { data: updated, error: updError } = await supabaseAdmin
          .from("bookings")
          .update({ selected_dates: newDates })
          .eq("id", params.id)
          .eq("paid", true)
          .is("search_result", null)
          .is("withdrawn_at", null)
          .is("refund_claimed_at", null)
          .is("refunded_at", null)
          .select("id");
        if (updError) {
          console.error("booking dates: database error (update)", updError.code);
          return new Response("Database error", { status: 500 });
        }
        if (!updated || updated.length === 0) {
          return Response.json({ ok: true, ignored: true });
        }

        try {
          const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");
          const res = await sendTransactionalEmailServer({
            templateName: "search-dates-updated",
            recipientEmail: booking.email,
            idempotencyKey: `booking-dates-updated-${booking.id}-${oldDates.join(",")}->${newDates.join(",")}`,
            templateData: {
              bookingId: booking.id,
              withdrawToken: booking.withdraw_token,
              firstName: booking.first_name,
              serviceType: booking.service_type,
              selectedDates: newDates,
            },
          });
          if (!res.success) console.error("booking dates: customer mail not sent");
        } catch {
          console.error("booking dates: customer mail failed");
        }

        return Response.json({ ok: true, changed: true });
      },
    },
  },
});
