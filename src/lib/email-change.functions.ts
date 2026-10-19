import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TokenInput = z.object({ token: z.string().uuid() });

type State =
  | { state: "invalid" }
  | { state: "refunded" }
  | { state: "found" }
  | { state: "done"; email: string }
  | { state: "expired" }
  | { state: "form"; firstName: string; maskedEmail: string };

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}

async function loadByToken(token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("email_change_token", token)
    .maybeSingle();
  return data;
}

export const getEmailChangeState = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = TokenInput.safeParse(d);
    return r.success ? r.data : { token: "" };
  })
  .handler(async ({ data }): Promise<State> => {
    if (!data.token) return { state: "invalid" };
    const b = await loadByToken(data.token);
    if (!b) return { state: "invalid" };
    if (b.refund_claimed_at || b.refunded_at) return { state: "refunded" };
    if (b.search_result === "found") return { state: "found" };
    if (b.search_error !== "email_limit") return { state: "done", email: b.email };
    const dates = (b.selected_dates ?? []).map((d) => d.slice(0, 10));
    const today = berlinToday();
    if (b.search_result === "not_found" || dates.length === 0 || dates.every((d) => d < today)) {
      return { state: "expired" };
    }
    return { state: "form", firstName: b.first_name, maskedEmail: maskEmail(b.email) };
  });

const SubmitInput = z.union([
  TokenInput.extend({
    newEmail: z.string().trim().toLowerCase().email().max(255),
    storniert: z.literal(false).optional(),
  }),
  TokenInput.extend({ storniert: z.literal(true), newEmail: z.undefined().optional() }),
]);

export const submitEmailChange = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SubmitInput.parse(d))
  .handler(async ({ data }) => {
    const invalid = { ok: false as const, error: "Dieser Link ist nicht mehr gültig." };
    const b = await loadByToken(data.token);
    if (!b) return invalid;

    const oldEmail = b.email;
    const newEmail = data.storniert ? oldEmail : data.newEmail!;
    if (!data.storniert && newEmail === oldEmail.trim().toLowerCase()) {
      return { ok: false as const, error: "Bitte gib eine andere E-Mail-Adresse als die bisherige an." };
    }

    const changedAt = new Date().toISOString();
    const update: {
      search_error: null; search_error_at: null; assigned_to_script: boolean; email_changed_at: string; email?: string;
    } = { search_error: null, search_error_at: null, assigned_to_script: false, email_changed_at: changedAt };
    if (!data.storniert) update.email = newEmail;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin
      .from("bookings")
      .update(update)
      .eq("email_change_token", data.token)
      .eq("search_error", "email_limit")
      .is("search_result", null)
      .is("refund_claimed_at", null)
      .is("refunded_at", null)
      .select("id");
    if (error) {
      console.error("email change: database error", error.code);
      return { ok: false as const, error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
    }
    if (!updated || updated.length === 0) return invalid;

    const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");
    const tpl = {
      bookingId: b.id,
      withdrawToken: b.withdraw_token,
      salutation: b.salutation,
      firstName: b.first_name,
      lastName: b.last_name,
      serviceType: b.service_type,
      selectedDates: b.selected_dates,
      oldEmail,
      newEmail,
      storniert: !!data.storniert,
      email: newEmail,
    };
    try {
      const [c, i] = await Promise.all([
        sendTransactionalEmailServer({
          templateName: "search-email-changed",
          recipientEmail: newEmail,
          idempotencyKey: `booking-email-changed-${b.id}-${changedAt}`,
          templateData: tpl,
        }),
        sendTransactionalEmailServer({
          templateName: "search-email-changed-internal",
          idempotencyKey: `booking-email-changed-internal-${b.id}-${changedAt}`,
          templateData: tpl,
        }),
      ]);
      if (!c.success) console.error("email change: customer email not sent");
      if (!i.success) console.error("email change: internal email not sent");
    } catch {
      console.error("email change: email sending failed");
    }
    return { ok: true as const, email: newEmail };
  });
