import { createFileRoute } from "@tanstack/react-router";

const MIN = 60 * 1000;
const CUTOFF_CREATED = "2026-10-14T00:00:00+02:00";

function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const Route = createFileRoute("/api/internal/health/check")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("health check: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }
        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
        const now = Date.now();

        const send = async (template: string, key: string, templateData: Record<string, unknown>) => {
          try {
            await sendTemplateEmail(template, "info@kfz-termin.online", { idempotencyKey: key, templateData });
            return true;
          } catch (e) {
            console.error(`health check: mail ${template} failed`, e instanceof Error ? e.message : "unknown");
            return false;
          }
        };

        // a/b) Heartbeat
        let piAlert: "down" | "recovered" | null = null;
        const { data: hb, error: hbErr } = await supabaseAdmin
          .from("script_heartbeat").select("*").eq("city", "koeln").maybeSingle();
        if (hbErr) console.error("health check: heartbeat read error", hbErr.code);
        if (hb) {
          const age = now - new Date(hb.last_poll_at).getTime();
          if (age > 30 * MIN && !hb.alert_sent_at) {
            const ok = await send("pi-down-internal", `health-pi-down-${hb.last_poll_at}`, { lastPollAt: hb.last_poll_at });
            if (ok) {
              await supabaseAdmin.from("script_heartbeat").update({ alert_sent_at: new Date().toISOString() }).eq("city", "koeln");
              piAlert = "down";
            }
          } else if (age < 5 * MIN && hb.alert_sent_at) {
            const ok = await send("pi-recovered-internal", `health-pi-recovered-${hb.alert_sent_at}`, { lastPollAt: hb.last_poll_at });
            if (ok) {
              await supabaseAdmin.from("script_heartbeat").update({ alert_sent_at: null }).eq("city", "koeln");
              piAlert = "recovered";
            }
          }
        }

        const run = (rebookUsedAt: string | null) => rebookUsedAt ?? "erst";
        const hasDates = (d: string[] | null) => Array.isArray(d) && d.length > 0;

        // c) Not picked up
        let notPickedUp = 0;
        const { data: pending, error: pErr } = await supabaseAdmin
          .from("bookings")
          .select("id, first_name, last_name, service_type, selected_dates, created_at, confirmation_sent_at, rebook_used_at, email_changed_at")
          .eq("paid", true).eq("assigned_to_script", false).is("search_result", null)
          .gte("created_at", CUTOFF_CREATED).limit(100);
        if (pErr) console.error("health check: pending read error", pErr.code);
        for (const b of pending ?? []) {
          if (!hasDates(b.selected_dates)) continue;
          const times = [b.confirmation_sent_at, b.rebook_used_at, b.email_changed_at].filter(Boolean).map((t) => new Date(t as string).getTime());
          const released = times.length ? Math.max(...times) : new Date(b.created_at).getTime();
          if (now - released <= 30 * MIN) continue;
          const npKey = `health-notpickedup-${b.id}-${run(b.rebook_used_at)}${b.email_changed_at ? `-${b.email_changed_at}` : ""}`;
          const ok = await send("booking-not-picked-up-internal", npKey, {
            bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type,
          });
          if (ok) notPickedUp++;
        }

        // d) Stuck without result
        let stuck = 0;
        const today = berlinToday();
        const { data: assigned, error: aErr } = await supabaseAdmin
          .from("bookings")
          .select("id, first_name, last_name, service_type, selected_dates, rebook_used_at")
          .eq("paid", true).eq("assigned_to_script", true).is("search_result", null).is("refund_claimed_at", null)
          .gte("created_at", CUTOFF_CREATED).limit(200);
        if (aErr) console.error("health check: assigned read error", aErr.code);
        for (const b of assigned ?? []) {
          if (!hasDates(b.selected_dates)) continue;
          const lastDate = [...b.selected_dates].map((d) => d.slice(0, 10)).sort().at(-1)!;
          if (addDays(lastDate, 2) >= today) continue;
          const ok = await send("booking-stuck-internal", `health-stuck-${b.id}-${run(b.rebook_used_at)}`, {
            bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type, lastDate,
          });
          if (ok) stuck++;
        }

        return Response.json({ ok: true, piAlert, notPickedUp, stuck });
      },
    },
  },
});
