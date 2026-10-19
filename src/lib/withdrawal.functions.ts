import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RATE_LIMIT_PER_HOUR = 5;

function bookingNumber(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

export type WithdrawalPrefill =
  | { valid: false }
  | {
      valid: true;
      name: string;
      email: string;
      bookingNumber: string;
      serviceType: string;
      selectedDates: string[];
    };

export const getWithdrawalPrefill = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const r = z.object({ token: z.string().uuid() }).safeParse(d);
    return r.success ? r.data : { token: "" };
  })
  .handler(async ({ data }): Promise<WithdrawalPrefill> => {
    if (!data.token) return { valid: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("bookings")
      .select("id, first_name, last_name, email, service_type, selected_dates, anonymized_at")
      .eq("withdraw_token", data.token)
      .maybeSingle();
    if (!b || b.anonymized_at) return { valid: false };
    return {
      valid: true,
      name: `${b.first_name} ${b.last_name}`.trim(),
      email: b.email,
      bookingNumber: bookingNumber(b.id),
      serviceType: b.service_type,
      selectedDates: (b.selected_dates ?? []).map(formatDay),
    };
  });

const SubmitInput = z.object({
  token: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  contractReference: z.string().trim().max(500).optional(),
  website: z.string().max(200).optional(), // Honeypot
});

type Outcome = "erstattet" | "manuell" | "bereits_erstattet" | "termin_gefunden";

type SubmitResult = { ok: true; receivedAt: string } | { ok: false; error: string };

function candidateStatus(b: {
  search_result: string | null;
  refund_claimed_at: string | null;
  refunded_at: string | null;
}): string {
  if (b.refunded_at) return "erstattet";
  if (b.refund_claimed_at) return "Erstattung beantragt";
  if (b.search_result === "found") return "Termin gefunden";
  if (b.search_result === "withdrawn") return "widerrufen";
  if (b.search_result === "not_found") return "kein Termin (Angebotsphase)";
  return "Suche läuft";
}

export const submitWithdrawal = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SubmitInput.parse(d))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const nowIso = new Date().toISOString();
    // Honeypot ausgefüllt: scheinbar erfolgreich, nichts speichern.
    if (data.website) return { ok: true, receivedAt: nowIso };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendTransactionalEmailServer } = await import("@/lib/email/send.server");

    const { count, error: countError } = await supabaseAdmin
      .from("withdrawals")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", new Date(Date.now() - 3600_000).toISOString());
    if (countError) {
      console.error("withdrawal: database error (rate limit)", countError.code);
      return { ok: false, error: "Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib uns an info@kfz-termin.online." };
    }
    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, error: "Für diese E-Mail-Adresse sind gerade zu viele Widerrufe eingegangen. Bitte versuche es in einer Stunde erneut oder schreib uns an info@kfz-termin.online." };
    }

    // Buchung zum Token laden (falls vorhanden)
    let tokenBooking: Awaited<ReturnType<typeof loadBooking>> = null;
    async function loadBooking(col: "withdraw_token" | "id", value: string) {
      const { data: b } = await supabaseAdmin.from("bookings").select("*").eq(col, value).maybeSingle();
      return b;
    }
    if (data.token) tokenBooking = await loadBooking("withdraw_token", data.token);

    const contractReference = data.contractReference || null;
    const { data: row, error: insertError } = await supabaseAdmin
      .from("withdrawals")
      .insert({
        name: data.name,
        email: data.email,
        contract_reference: contractReference,
        booking_id: tokenBooking?.id ?? null,
        source: tokenBooking ? "link" : "formular",
      })
      .select("id, created_at")
      .single();
    if (insertError || !row) {
      console.error("withdrawal: database error (insert)", insertError?.code);
      return { ok: false, error: "Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib uns an info@kfz-termin.online." };
    }
    const receivedAt = row.created_at;

    // b) Eingangsbestätigung an die eingegebene Adresse
    try {
      const r = await sendTransactionalEmailServer({
        templateName: "withdrawal-received",
        recipientEmail: data.email,
        idempotencyKey: `withdrawal-received-${row.id}`,
        templateData: {
          bookingId: tokenBooking?.id ?? null,
          name: data.name,
          email: data.email,
          contractReference,
          bookingSummary: tokenBooking
            ? [
                bookingNumber(tokenBooking.id),
                tokenBooking.service_type,
                (tokenBooking.selected_dates ?? []).map(formatDay).join(", "),
              ].filter(Boolean).join(" · ")
            : null,
          receivedAt,
        },
      });
      if (!r.success) console.error("withdrawal: receipt email not sent");
    } catch {
      console.error("withdrawal: receipt email failed");
    }

    // c) Zuordnung
    let booking = tokenBooking;
    let candidates: { number: string; name: string; service: string; status: string }[] = [];
    if (!booking) {
      const escaped = data.email.replace(/[\\%_]/g, (c) => `\\${c}`);
      const { data: list, error: listError } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .ilike("email", escaped)
        .eq("paid", true)
        .is("anonymized_at", null);
      if (listError) console.error("withdrawal: database error (match)", listError.code);
      const all = list ?? [];
      candidates = all.map((b) => ({
        number: bookingNumber(b.id),
        name: `${b.first_name} ${b.last_name}`.trim(),
        service: b.service_type,
        status: candidateStatus(b),
      }));
      const nameLower = data.name.toLowerCase();
      const numMatch = /\b([0-9a-f]{8})\b/i.exec(contractReference ?? "");
      const hits = all.filter((b) => {
        const ln = b.last_name.trim().toLowerCase();
        if (!ln || !nameLower.includes(ln)) return false;
        if (numMatch && !b.id.toLowerCase().startsWith(numMatch[1].toLowerCase())) return false;
        return true;
      });
      if (hits.length === 1) booking = hits[0];
    }

    // d) Bearbeitung
    let outcome: Outcome = "manuell";
    let refundStatus: string | null = null;

    const resolveAfterMiss = async (id: string): Promise<Outcome> => {
      const fresh = await loadBooking("id", id);
      return fresh?.search_result === "found" ? "termin_gefunden" : "manuell";
    };

    if (booking && booking.paid) {
      if (booking.search_result === "found") {
        outcome = "termin_gefunden";
      } else if (booking.refund_claimed_at || booking.refunded_at) {
        outcome = "bereits_erstattet";
      } else if (booking.search_result === null || booking.search_result === "not_found") {
        let q = supabaseAdmin
          .from("bookings")
          .update(
            booking.search_result === null
              ? { search_result: "withdrawn", withdrawn_at: nowIso }
              : { withdrawn_at: nowIso },
          )
          .eq("id", booking.id)
          .is("refund_claimed_at", null)
          .is("refunded_at", null);
        q = booking.search_result === null ? q.is("search_result", null) : q.eq("search_result", "not_found");
        const { data: upd, error: updError } = await q.select("id");
        if (updError) {
          console.error("withdrawal: database error (mark)", updError.code);
          outcome = "manuell";
        } else if (!upd || upd.length === 0) {
          outcome = await resolveAfterMiss(booking.id);
        } else {
          const { refundBooking } = await import("@/lib/refund.server");
          const r = await refundBooking(booking, "widerruf");
          if (r.skipped) {
            outcome = "bereits_erstattet";
          } else {
            outcome = "erstattet";
            refundStatus = r.refundStatus;
          }
        }
      } else {
        outcome = "manuell";
      }
    }

    const { error: doneError } = await supabaseAdmin
      .from("withdrawals")
      .update({ outcome, booking_id: booking?.id ?? null, processed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (doneError) console.error("withdrawal: database error (outcome)", doneError.code);

    // e) Interne Mail
    try {
      const r = await sendTransactionalEmailServer({
        templateName: "withdrawal-internal",
        idempotencyKey: `withdrawal-internal-${row.id}`,
        templateData: {
          name: data.name,
          email: data.email,
          contractReference,
          source: tokenBooking ? "link" : "formular",
          outcome,
          receivedAt,
          bookingNumber: booking ? bookingNumber(booking.id) : null,
          bookingId: booking?.id ?? null,
          serviceType: booking?.service_type ?? null,
          refundStatus,
          candidates,
          withdrawalId: row.id,
        },
      });
      if (!r.success) console.error("withdrawal: internal email not sent");
    } catch {
      console.error("withdrawal: internal email failed");
    }

    return { ok: true, receivedAt };
  });
