import { createFileRoute } from "@tanstack/react-router";
import { monitoredCities, DEFAULT_CITY } from "@/lib/cities";

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

        // a/b) Heartbeat – pro aktiver Stadt. Köln behält seine bisherigen Mail-Schlüssel.
        let piAlert: "down" | "recovered" | null = null;
        const piAlerts: Record<string, "down" | "recovered"> = {};
        for (const c of monitoredCities()) {
          const sfx = c.slug === DEFAULT_CITY ? "" : `-${c.slug}`;
          const { data: hb, error: hbErr } = await supabaseAdmin
            .from("script_heartbeat").select("*").eq("city", c.slug).maybeSingle();
          if (hbErr) console.error("health check: heartbeat read error", hbErr.code);
          if (!hb) continue;
          const age = now - new Date(hb.last_poll_at).getTime();
          if (age > 30 * MIN && !hb.alert_sent_at) {
            const ok = await send("pi-down-internal", `health-pi-down-${hb.last_poll_at}${sfx}`, { lastPollAt: hb.last_poll_at, city: c.slug });
            if (ok) {
              await supabaseAdmin.from("script_heartbeat").update({ alert_sent_at: new Date().toISOString() }).eq("city", c.slug);
              piAlerts[c.slug] = "down";
            }
          } else if (age < 5 * MIN && hb.alert_sent_at) {
            const ok = await send("pi-recovered-internal", `health-pi-recovered-${hb.alert_sent_at}${sfx}`, { lastPollAt: hb.last_poll_at, city: c.slug });
            if (ok) {
              await supabaseAdmin.from("script_heartbeat").update({ alert_sent_at: null }).eq("city", c.slug);
              piAlerts[c.slug] = "recovered";
            }
          }
        }
        piAlert = piAlerts[DEFAULT_CITY] ?? null;

        const run = (rebookUsedAt: string | null) => rebookUsedAt ?? "erst";
        const hasDates = (d: string[] | null) => Array.isArray(d) && d.length > 0;

        // c) Not picked up
        let notPickedUp = 0;
        const { data: pending, error: pErr } = await supabaseAdmin
          .from("bookings")
          .select("id, city, first_name, last_name, service_type, selected_dates, created_at, confirmation_sent_at, rebook_used_at, email_changed_at")
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
            bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type, city: b.city,
          });
          if (ok) notPickedUp++;
        }

        // d) Stuck without result
        let stuck = 0;
        const today = berlinToday();
        const { data: assigned, error: aErr } = await supabaseAdmin
          .from("bookings")
          .select("id, city, first_name, last_name, service_type, selected_dates, rebook_used_at")
          .eq("paid", true).eq("assigned_to_script", true).is("search_result", null).is("refund_claimed_at", null)
          .gte("created_at", CUTOFF_CREATED).limit(200);
        if (aErr) console.error("health check: assigned read error", aErr.code);
        for (const b of assigned ?? []) {
          if (!hasDates(b.selected_dates)) continue;
          const lastDate = [...b.selected_dates].map((d) => d.slice(0, 10)).sort().at(-1)!;
          if (addDays(lastDate, 2) >= today) continue;
          const ok = await send("booking-stuck-internal", `health-stuck-${b.id}-${run(b.rebook_used_at)}`, {
            bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type, lastDate, city: b.city,
          });
          if (ok) stuck++;
        }

        const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");
        const { retryFoundMail, failureReason } = await import("@/lib/mail-retry");
        const windowStart = new Date(now - 3 * 24 * 60 * MIN).toISOString();
        const windowEnd = new Date(now - 15 * MIN).toISOString();

        // e) Bezahlt, aber Bestätigung nie als versendet markiert
        let confirmRetried = 0;
        let confirmFailed = 0;
        const { data: unconfirmed, error: uErr } = await supabaseAdmin
          .from("bookings")
          .select("id, city, first_name, last_name, service_type, search_result")
          .eq("paid", true).is("confirmation_sent_at", null)
          .gte("created_at", windowStart).lte("created_at", windowEnd).limit(50);
        if (uErr) console.error("health check: unconfirmed read error", uErr.code);
        for (const b of unconfirmed ?? []) {
          const base = { bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type, city: b.city };
          if (b.search_result) {
            // Schon ein Ergebnis → keine Bestätigung mehr an den Kunden.
            if (await send("confirmation-failed-internal", `health-confirm-failed-${b.id}`, { ...base, customerSkipped: true })) confirmFailed++;
            continue;
          }
          const { finalizePaidBooking } = await import("@/lib/booking-finalize.server");
          const r = await finalizePaidBooking(b.id, { retry: true });
          confirmRetried++;
          if (r && !r.ok) {
            const reason = failureReason(r.customer) ?? failureReason(r.internal) ?? "Unbekannter Fehler";
            if (await send("confirmation-failed-internal", `health-confirm-failed-${b.id}`, { ...base, reason })) confirmFailed++;
          }
        }

        // f) Termin gefunden, Kundenmail nie als versendet markiert
        let foundRetried = 0;
        let foundFailed = 0;
        const { data: unnotified, error: nErr } = await supabaseAdmin
          .from("bookings")
          .select("id, city, salutation, first_name, last_name, email, phone, service_type, appointment_at, found_at, booked_location, booking_reference, cancel_url, calendar_token")
          .eq("search_result", "found").is("result_notified_at", null)
          .not("appointment_at", "is", null).not("found_at", "is", null)
          .gte("found_at", windowStart).lte("found_at", windowEnd).limit(50);
        if (nErr) console.error("health check: unnotified read error", nErr.code);
        for (const b of unnotified ?? []) {
          const r = await retryFoundMail(sendTransactionalEmailServer, b);
          foundRetried++;
          if (r.success) {
            await supabaseAdmin.from("bookings").update({ result_notified_at: new Date().toISOString() }).eq("id", b.id);
          } else {
            const appointmentAt = new Date(b.appointment_at as string).toISOString();
            const ok = await send("found-mail-failed-internal", `health-found-failed-${b.id}-${appointmentAt}`, {
              bookingId: b.id, firstName: b.first_name, lastName: b.last_name, serviceType: b.service_type, city: b.city,
              appointmentAt, reason: failureReason(r),
            });
            if (ok) foundFailed++;
          }
        }

        // g) Script-Version je Stadt
        let versionAlerts = 0;
        try {
          const { parseUserScriptVersion, versionLagAction } = await import("@/lib/mail-retry");
          let currentVersion: string | null = null;
          const { data: file } = await supabaseAdmin.storage.from("script-releases").download("kfz-termin.user.js");
          if (file) currentVersion = parseUserScriptVersion(await file.text());
          const { data: beats } = await supabaseAdmin.from("script_heartbeat").select("city, last_poll_at, script_version");
          const { data: lags } = await supabaseAdmin.from("script_version_lag").select("*");
          for (const hb of beats ?? []) {
            const existing = (lags ?? []).find((l) => l.city === hb.city) ?? null;
            const a = versionLagAction({ now, lastPollAt: hb.last_poll_at, cityVersion: hb.script_version, currentVersion, existing });
            if (a.kind === "delete") await supabaseAdmin.from("script_version_lag").delete().eq("city", hb.city);
            else if (a.kind === "upsert") await supabaseAdmin.from("script_version_lag").upsert({ city: hb.city, ...a.row });
            else if (a.kind === "alert") {
              const ok = await send("script-version-lag-internal", `health-version-lag-${hb.city}-${a.row.script_version}-${a.row.current_version}`, {
                city: hb.city, scriptVersion: a.row.script_version, currentVersion: a.row.current_version, firstSeenAt: a.row.first_seen_at,
              });
              await supabaseAdmin.from("script_version_lag").upsert({ city: hb.city, ...a.row, alert_sent_at: ok ? new Date().toISOString() : null });
              if (ok) versionAlerts++;
            }
          }
        } catch {
          console.error("health check: version check failed");
        }

        return Response.json({ ok: true, piAlert, piAlerts, notPickedUp, stuck, confirmRetried, confirmFailed, foundRetried, foundFailed, versionAlerts });
      },
    },
  },
});
