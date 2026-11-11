import { createFileRoute } from "@tanstack/react-router";
import { getCity } from "@/lib/cities";
import { PortalCheckBody, portalSignature, decidePortalCheck } from "@/lib/portal-check";

export const Route = createFileRoute("/api/internal/portal-check")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("portal check: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }
        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        let raw: unknown;
        try {
          raw = JSON.parse(await request.text());
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = PortalCheckBody.safeParse(raw);
        if (!parsed.success) return Response.json({ error: "Invalid body" }, { status: 400 });
        const { city, ok, findings } = parsed.data;
        if (!getCity(city)) return Response.json({ error: "Unknown city" }, { status: 400 });

        const versionHeader = request.headers.get("x-script-version");
        const scriptVersion = versionHeader ? versionHeader.trim().slice(0, 50) || null : null;
        const signature = portalSignature(findings);
        const now = new Date().toISOString();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: prev, error: readErr } = await supabaseAdmin
          .from("portal_checks").select("signature").eq("city", city).maybeSingle();
        if (readErr) {
          console.error("portal check: read error", readErr.code);
          return Response.json({ error: "Database error" }, { status: 500 });
        }

        const decision = decidePortalCheck(prev ?? null, { ok, signature });
        const versionPatch = scriptVersion ? { script_version: scriptVersion } : {};
        const { error: writeErr } = decision.changed
          ? await supabaseAdmin.from("portal_checks").upsert({
              city, ok, signature, findings, changed_at: now, last_check_at: now, ...versionPatch,
            })
          : await supabaseAdmin.from("portal_checks").update({ last_check_at: now, ...versionPatch }).eq("city", city);
        if (writeErr) {
          console.error("portal check: write error", writeErr.code);
          return Response.json({ error: "Database error" }, { status: 500 });
        }

        if (decision.mail) {
          try {
            const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
            const name = decision.mail === "changed" ? "portal-check-changed-internal" : "portal-check-recovered-internal";
            await sendTemplateEmail(name, "info@kfz-termin.online", {
              idempotencyKey: `${name}-${city}-${now}`,
              templateData: { city, findings, changedAt: now, scriptVersion },
            });
          } catch (e) {
            console.error("portal check: mail failed", e instanceof Error ? e.message : "unknown");
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});
