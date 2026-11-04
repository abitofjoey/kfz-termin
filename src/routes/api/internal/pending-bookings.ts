import { createFileRoute } from "@tanstack/react-router";
import { getCity, DEFAULT_CITY } from "@/lib/cities";
import { mapBookingForScript, type ScriptBookingRow } from "@/lib/script-mapping";

export const Route = createFileRoute("/api/internal/pending-bookings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("pending-bookings: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const cityParam = new URL(request.url).searchParams.get("city");
        const city = cityParam ?? DEFAULT_CITY;
        if (!getCity(city)?.bookable) {
          return new Response("Unknown city", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        try {
          const { error: hbError } = await supabaseAdmin
            .from("script_heartbeat")
            .upsert({ city, last_poll_at: new Date().toISOString() }, { onConflict: "city" });
          if (hbError) console.error("pending-bookings: heartbeat error", hbError.code);
        } catch (e) {
          console.error("pending-bookings: heartbeat failed", e instanceof Error ? e.message : "unknown");
        }

        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("*")
          .eq("city", city)
          .eq("paid", true)
          .eq("assigned_to_script", false)
          .is("search_result", null)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("pending-bookings: database error", error);
          return new Response("Database error", { status: 500 });
        }

        let withdrawn: string[] = [];
        try {
          const since = new Date(Date.now() - 14 * 24 * 3600_000).toISOString();
          const { data: wd, error: wdError } = await supabaseAdmin
            .from("bookings")
            .select("id")
            .eq("city", city)
            .gte("withdrawn_at", since);
          if (wdError) console.error("pending-bookings: withdrawn query error", wdError.code);
          else withdrawn = (wd ?? []).map((r) => r.id);
        } catch {
          console.error("pending-bookings: withdrawn query failed");
        }

        return Response.json({
          bookings: (data ?? []).map((row) => mapBookingForScript(row as unknown as ScriptBookingRow)),
          withdrawn,
        });
      },
    },
  },
});
