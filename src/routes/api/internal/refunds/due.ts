import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/internal/refunds/due")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("refunds due: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }
        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { refundBooking, REBOOK_WINDOW_MS } = await import("@/lib/refund.server");

        const cutoff = new Date(Date.now() - REBOOK_WINDOW_MS).toISOString();
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("*")
          .eq("search_result", "not_found")
          .lt("rebook_offered_at", cutoff)
          .is("rebook_used_at", null)
          .is("refund_claimed_at", null)
          .is("refunded_at", null)
          .limit(50);
        if (error) {
          console.error("refunds due: database error", error.code);
          return new Response("Database error", { status: 500 });
        }

        let processed = 0;
        for (const booking of data ?? []) {
          const r = await refundBooking(booking, "frist");
          if (!r.skipped) processed++;
        }
        return Response.json({ ok: true, processed });
      },
    },
  },
});
