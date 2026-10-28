import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const MIN = 60 * 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const BodySchema = z
  .object({
    dryRun: z.boolean().optional(),
    date: z.string().regex(DATE_RE).optional(),
  })
  .refine((b) => !b.date || b.dryRun === true, { message: "date only allowed with dryRun" });

function berlinDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(d);
}

function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000);
}

export const Route = createFileRoute("/api/internal/daily-status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("daily status: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }
        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        let raw: unknown = {};
        try {
          const text = await request.text();
          raw = text ? JSON.parse(text) : {};
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) return Response.json({ error: "Invalid body" }, { status: 400 });
        const dryRun = parsed.data.dryRun === true;
        const today = parsed.data.date ?? berlinDate(new Date());

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");

        // Pi check
        const { data: hb, error: hbErr } = await supabaseAdmin
          .from("script_heartbeat").select("last_poll_at").eq("city", "koeln").maybeSingle();
        if (hbErr) console.error("daily status: heartbeat read error", hbErr.code);
        const lastPoll = hb?.last_poll_at ?? null;
        if (!lastPoll || Date.now() - new Date(lastPoll).getTime() > 60 * MIN) {
          if (!dryRun) {
            try {
              await sendTemplateEmail("daily-status-pi-internal", "info@kfz-termin.online", {
                idempotencyKey: `daily-status-pi-${today}`,
                templateData: { lastPollAt: lastPoll },
              });
            } catch (e) {
              console.error("daily status: pi mail failed", e instanceof Error ? e.message : "unknown");
            }
          }
          return Response.json({ ok: true, date: today, candidates: 0, sent: 0, piDown: true });
        }

        const { data: rows, error } = await supabaseAdmin
          .from("bookings")
          .select("id, email, first_name, service_type, selected_dates, confirmation_sent_at, rebook_used_at, email_changed_at, last_status_mail_at")
          .eq("paid", true).eq("assigned_to_script", true)
          .is("search_result", null).is("search_error", null).is("withdrawn_at", null)
          .is("refund_claimed_at", null).is("refunded_at", null).is("anonymized_at", null)
          .limit(500);
        if (error) {
          console.error("daily status: bookings read error", error.code);
          return Response.json({ error: "Database error" }, { status: 500 });
        }

        let candidates = 0;
        let sent = 0;
        const list: { bookingNumber: string; variant: string; remainingDates: string[] }[] = [];

        for (const b of rows ?? []) {
          const dates = (b.selected_dates ?? []).map((d: string) => d.slice(0, 10));
          const remaining = [...new Set(dates.filter((d) => d > today))].sort();
          if (remaining.length === 0) continue;
          candidates++;

          let variant: "wunschtag" | "zwischenstand" | null = null;
          if (dates.includes(today)) variant = "wunschtag";
          else {
            const contacts = [b.confirmation_sent_at, b.rebook_used_at, b.email_changed_at, b.last_status_mail_at]
              .filter(Boolean).map((t) => new Date(t as string).getTime());
            if (contacts.length) {
              const last = berlinDate(new Date(Math.max(...contacts)));
              if (dayDiff(today, last) >= 3) variant = "zwischenstand";
            }
          }
          if (!variant) continue;

          if (dryRun) {
            list.push({ bookingNumber: b.id.slice(0, 8).toUpperCase(), variant, remainingDates: remaining });
            continue;
          }

          try {
            const res = await sendTemplateEmail("search-daily-status", b.email, {
              idempotencyKey: `daily-status-${b.id}-${today}`,
              templateData: {
                bookingId: b.id, firstName: b.first_name, serviceType: b.service_type,
                variant, today, remainingDates: remaining,
              },
            });
            if (res.sent) {
              sent++;
              const { error: uErr } = await supabaseAdmin
                .from("bookings").update({ last_status_mail_at: new Date().toISOString() }).eq("id", b.id);
              if (uErr) console.error("daily status: update error", uErr.code);
            }
          } catch (e) {
            console.error("daily status: mail failed", e instanceof Error ? e.message : "unknown");
          }
        }

        return Response.json(dryRun ? { ok: true, date: today, candidates, sent: 0, dryRun: true, list } : { ok: true, date: today, candidates, sent });
      },
    },
  },
});
