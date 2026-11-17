import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalEmailServer } from "@/lib/email/send.server";
import { sendConfirmationMails, type ConfirmationResult } from "@/lib/mail-retry";

/**
 * Marks a booking as paid and sends both confirmation emails (customer + internal).
 * Idempotent: safe to call multiple times. Uses `confirmation_sent_at` to ensure
 * emails are sent only once, and the email queue's idempotencyKey as a second safeguard.
 *
 * Called from two places:
 *  - Success page (confirmCheckoutSession) — for immediate UX feedback
 *  - Stripe webhook (checkout.session.completed) — authoritative trigger
 */
export class BookingPaidUpdateError extends Error {
  constructor(message: string) {
    super(`finalizePaidBooking: failed to mark booking as paid: ${message}`);
    this.name = "BookingPaidUpdateError";
  }
}

export async function finalizePaidBooking(
  bookingId: string,
  opts: { retry?: boolean } = {},
): Promise<ConfirmationResult | null> {
  // Mark as paid (no-op if already paid)
  const { error: updateError } = await supabaseAdmin
    .from("bookings")
    .update({ paid: true, status: "paid" })
    .eq("id", bookingId);
  if (updateError) {
    // Werfen, damit der Stripe-Webhook mit 500 antwortet und Stripe erneut zustellt.
    throw new BookingPaidUpdateError(updateError.message);
  }

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    console.error("finalizePaidBooking: booking not found", { bookingId, error });
    return null;
  }

  if (booking.confirmation_sent_at) {
    // Already sent — nothing to do.
    return null;
  }

  const templateData = buildConfirmationData(booking);

  try {
    const result = await sendConfirmationMails(sendTransactionalEmailServer, booking, templateData, {
      retry: opts.retry,
    });
    if (result.ok) {
      await supabaseAdmin
        .from("bookings")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("id", booking.id);
    } else {
      console.error("finalizePaidBooking: confirmation emails not fully sent");
    }
    return result;
  } catch (e) {
    console.error("finalizePaidBooking: failed to send confirmation emails", e instanceof Error ? e.message : "unknown");
    // Don't rethrow — Stripe webhook should still ack so it doesn't retry forever.
    return { ok: false, customer: null, internal: { success: false, error: "exception" } };
  }
}

export function buildConfirmationData(booking: any) {
  return {
    bookingId: booking.id,
    city: booking.city,
    withdrawToken: booking.withdraw_token,
    salutation: booking.salutation,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    serviceType: booking.service_type,
    finEndings: [booking.fin_1, booking.fin_2, booking.fin_3].filter(
      (v: unknown): v is string => !!v,
    ),
    notes: booking.notes ?? undefined,
    selectedDates: booking.selected_dates ?? [],
    stripeSessionId: booking.stripe_session_id ?? undefined,
    amountCents: booking.amount_cents ?? undefined,
    createdAt: booking.created_at,
    locations: booking.locations ?? null,
    financed: booking.financed,
    vehicleCount: booking.vehicle_count ?? null,
  };
}
