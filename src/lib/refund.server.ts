import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalEmailServer } from "@/lib/email/send.server";

export type RefundAnlass = "direkt" | "gewaehlt" | "frist" | "widerruf";
export type RefundStatus = "refunded" | "already" | "failed" | "disabled";

export const REBOOK_WINDOW_MS = 48 * 3600_000;

type BookingRow = {
  id: string;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_type: string;
  selected_dates: string[];
  stripe_session_id: string | null;
  search_error: string | null;
};

/**
 * Beansprucht die Buchung atomar, löst die volle Stripe-Erstattung aus und
 * verschickt Kunden- und interne Mail. Wirft nie.
 */
export async function refundBooking(
  booking: BookingRow,
  anlass: RefundAnlass,
): Promise<
  | { skipped: true }
  | { skipped: false; refundStatus: RefundStatus; emailSent: boolean }
> {
  const now = new Date();
  let claim = supabaseAdmin
    .from("bookings")
    .update({ refund_claimed_at: now.toISOString() })
    .eq("id", booking.id)
    .is("refund_claimed_at", null)
    .is("refunded_at", null);
  if (anlass === "gewaehlt" || anlass === "frist") {
    claim = claim.is("rebook_used_at", null);
  }
  if (anlass === "frist") {
    claim = claim
      .eq("search_result", "not_found")
      .lt("rebook_offered_at", new Date(now.getTime() - REBOOK_WINDOW_MS).toISOString());
  }
  const { data: claimed, error: claimError } = await claim.select("id");
  if (claimError) {
    console.error("refund: database error (claim)", claimError.code);
    return { skipped: true };
  }
  if (!claimed || claimed.length === 0) return { skipped: true };

  let refundStatus: RefundStatus;
  let stripeRefundId: string | null = null;
  let refundError: string | null = null;

  if (process.env["AUTO_REFUND"] === "off") {
    refundStatus = "disabled";
  } else if (!booking.stripe_session_id) {
    refundStatus = "failed";
    refundError = "keine Stripe-Session";
  } else {
    try {
      const key = process.env["STRIPE_SECRET_KEY"];
      if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert.");
      const stripe = new Stripe(key);
      const session = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);
      const pi = session.payment_intent;
      const paymentIntent = typeof pi === "string" ? pi : pi?.id;
      if (!paymentIntent) throw new Error("Kein payment_intent in der Checkout-Session");
      const refund = await stripe.refunds.create(
        { payment_intent: paymentIntent },
        { idempotencyKey: `refund-${booking.id}` },
      );
      stripeRefundId = refund.id;
      refundStatus = "refunded";
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === "charge_already_refunded") {
        refundStatus = "already";
      } else {
        refundStatus = "failed";
        refundError = (e instanceof Error ? e.message : String(e)).slice(0, 500);
      }
    }
  }

  const update: { refunded_at?: string; stripe_refund_id?: string; refund_error?: string } = {};
  if (refundStatus === "refunded" || refundStatus === "already") {
    update.refunded_at = new Date().toISOString();
  }
  if (stripeRefundId) update.stripe_refund_id = stripeRefundId;
  if (refundError) update.refund_error = refundError;
  if (Object.keys(update).length > 0) {
    const { error } = await supabaseAdmin.from("bookings").update(update).eq("id", booking.id);
    if (error) console.error("refund: database error (result)", error.code);
  }
  console.log("refund: status", refundStatus, anlass);

  const base = {
    bookingId: booking.id,
    salutation: booking.salutation,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    serviceType: booking.service_type,
    selectedDates: booking.selected_dates,
    stripeSessionId: booking.stripe_session_id,
    anlass,
  };

  let emailSent = false;
  try {
    const customer = await sendTransactionalEmailServer({
      templateName: "search-not-found",
      recipientEmail: booking.email,
      idempotencyKey: `booking-notfound-${booking.id}`,
      templateData: {
        ...base,
        refundOk: refundStatus === "refunded" || refundStatus === "already",
        searchError: booking.search_error,
      },
    });
    emailSent = customer.success;
    if (customer.success) {
      await supabaseAdmin
        .from("bookings")
        .update({ result_notified_at: new Date().toISOString() })
        .eq("id", booking.id);
    } else {
      console.error("refund: customer email not sent");
    }
  } catch {
    console.error("refund: customer email failed");
  }

  try {
    const internal = await sendTransactionalEmailServer({
      templateName: "search-not-found-internal",
      idempotencyKey: `booking-notfound-internal-${booking.id}-refund`,
      templateData: { ...base, refundStatus, stripeRefundId, refundError },
    });
    if (!internal.success) console.error("refund: internal email not sent");
  } catch {
    console.error("refund: internal email failed");
  }

  return { skipped: false, refundStatus, emailSent };
}
