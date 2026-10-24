import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/internal/heartbeat")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("heartbeat: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }
        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("script_heartbeat")
          .select("last_poll_at")
          .eq("city", "koeln")
          .maybeSingle();

        if (error) {
          console.error("heartbeat: read error", error.code);
          return new Response("Database error", { status: 500 });
        }
        if (!data) return new Response("Not found", { status: 404 });

        const lastPollAt = new Date(data.last_poll_at);
        const ageSeconds = Math.floor((Date.now() - lastPollAt.getTime()) / 1000);
        return Response.json({ lastPollAt: lastPollAt.toISOString(), ageSeconds });
      },
    },
  },
});
