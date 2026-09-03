import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/internal/pending-bookings/$id/ack")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("pending-bookings ack: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error } = await supabaseAdmin
          .from("bookings")
          .update({
            assigned_to_script: true,
            assigned_to_script_at: new Date().toISOString(),
          })
          .eq("id", params.id)
          .eq("assigned_to_script", false);

        if (error) {
          console.error("pending-bookings ack: database error", error);
          return new Response("Database error", { status: 500 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
