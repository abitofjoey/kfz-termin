import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { cityOrDefault, type ServiceCategory } from "@/lib/cities";
import { categoryForLabel } from "@/lib/services";

/** Stadt und Kategorie einer Buchung (Altbuchungen: Köln/Kfz). */
export function rebookScope(b: { city: string | null; service_type: string }) {
  const city = cityOrDefault(b.city).slug;
  return { city, category: categoryForLabel(city, b.service_type) };
}

const TokenInput = z.object({ token: z.string().uuid() });
const WINDOW_MS = 48 * 3600_000;

type State =
  | { state: "invalid" }
  | { state: "used"; firstName: string; serviceType: string; selectedDates: string[] }
  | { state: "refunded" }
  | { state: "found" }
  | { state: "expired" }
  | { state: "choose"; firstName: string; serviceType: string; selectedDates: string[]; city: string; category: ServiceCategory };

async function loadByToken(token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("rebook_token", token)
    .maybeSingle();
  return data;
}

export const getRebookState = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = TokenInput.safeParse(d);
    return r.success ? r.data : { token: "" };
  })
  .handler(async ({ data }): Promise<State> => {
    if (!data.token) return { state: "invalid" };
    const b = await loadByToken(data.token);
    if (!b || !b.rebook_offered_at) return { state: "invalid" };
    const info = { firstName: b.first_name, serviceType: b.service_type, selectedDates: b.selected_dates };
    if (b.refund_claimed_at || b.refunded_at) return { state: "refunded" };
    if (b.search_result === "found") return { state: "found" };
    if (b.rebook_used_at) return { state: "used", ...info };
    if (Date.now() - new Date(b.rebook_offered_at).getTime() > WINDOW_MS) return { state: "expired" };
    return { state: "choose", ...info, ...rebookScope(b) };
  });

export const submitRebookDates = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    TokenInput.extend({ dates: z.array(z.string()).min(1).max(60) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { areDatesAllowed, isShortNoticeOnly, SHORT_NOTICE_ONLY_ERROR } = await import("@/lib/calendar-rules");
    const b = await loadByToken(data.token);
    if (!b) return { ok: false as const, error: "Dieser Link ist ungültig." };
    const scope = rebookScope(b);
    if (isShortNoticeOnly(data.dates, new Date(), scope.city, scope.category)) {
      return { ok: false as const, error: SHORT_NOTICE_ONLY_ERROR };
    }
    if (!areDatesAllowed(data.dates, new Date(), scope.city, scope.category)) {
      return { ok: false as const, error: "Bitte wähle nur Tage aus, die im Kalender freigegeben sind." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const dates = Array.from(new Set(data.dates)).sort();
    const { data: updated, error } = await supabaseAdmin
      .from("bookings")
      .update({
        selected_dates: dates,
        search_result: null,
        search_error: null,
        assigned_to_script: false,
        rebook_used_at: new Date().toISOString(),
      })
      .eq("id", b.id)
      .is("rebook_used_at", null)
      .is("refund_claimed_at", null)
      .is("refunded_at", null)
      .gte("rebook_offered_at", new Date(Date.now() - WINDOW_MS).toISOString())
      .select("id");
    if (error) {
      console.error("rebook: database error", error.code);
      return { ok: false as const, error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
    }
    if (!updated || updated.length === 0) {
      return { ok: false as const, error: "Dieses Angebot ist nicht mehr verfügbar." };
    }

    const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");
    const tpl = {
      bookingId: b.id,
      city: b.city,
      withdrawToken: b.withdraw_token,
      salutation: b.salutation,
      firstName: b.first_name,
      lastName: b.last_name,
      email: b.email,
      serviceType: b.service_type,
      selectedDates: dates,
    };
    try {
      const [c, i] = await Promise.all([
        sendTransactionalEmailServer({
          templateName: "search-rebook-confirmed",
          recipientEmail: b.email,
          idempotencyKey: `booking-rebook-confirmed-${b.id}`,
          templateData: tpl,
        }),
        sendTransactionalEmailServer({
          templateName: "search-rebook-internal",
          idempotencyKey: `booking-rebook-internal-${b.id}`,
          templateData: tpl,
        }),
      ]);
      if (!c.success) console.error("rebook: customer email not sent");
      if (!i.success) console.error("rebook: internal email not sent");
    } catch {
      console.error("rebook: email sending failed");
    }
    return { ok: true as const, selectedDates: dates };
  });

export const requestRebookRefund = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data }) => {
    const b = await loadByToken(data.token);
    if (!b || b.rebook_used_at) return { ok: false as const, error: "Dieses Angebot ist nicht mehr verfügbar." };
    const { refundBooking } = await import("@/lib/refund.server");
    const r = await refundBooking(b, "gewaehlt");
    if (r.skipped) return { ok: false as const, error: "Die Rückerstattung wurde bereits beantragt." };
    return { ok: true as const };
  });
