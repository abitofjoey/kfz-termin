import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalEmailServer } from "@/lib/email/send.server";

/**
 * Marks a booking as paid and sends both confirmation emails (customer + internal).
 * Idempotent: safe to call multiple times. Uses `confirmation_sent_at` to ensure
 * emails are sent only once, and the email queue's idempotencyKey as a second safeguard.
 *
 * Called from two places:
 *  - Success page (confirmCheckoutSession) — for immediate UX feedback
 *  - Stripe webhook (checkout.session.completed) — authoritative trigger
 */
export async function finalizePaidBooking(bookingId: string): Promise<void> {
  // Mark as paid (no-op if already paid)
  await supabaseAdmin
    .from("bookings")
    .update({ paid: true, status: "paid" })
    .eq("id", bookingId);

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    console.error("finalizePaidBooking: booking not found", { bookingId, error });
    return;
  }

  if (booking.confirmation_sent_at) {
    // Already sent — nothing to do.
    return;
  }

  const templateData = {
    bookingId: booking.id,
    salutation: booking.salutation,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    serviceType: booking.service_type,
    finEndings: [booking.fin_1, booking.fin_2, booking.fin_3].filter(
      (v): v is string => !!v,
    ),
    notes: booking.notes ?? undefined,
    selectedDates: booking.selected_dates ?? [],
    stripeSessionId: booking.stripe_session_id ?? undefined,
  };

  try {
    await Promise.all([
      sendTransactionalEmailServer({
        templateName: "booking-confirmation",
        recipientEmail: booking.email,
        idempotencyKey: `booking-confirm-${booking.id}`,
        templateData,
      }),
      sendTransactionalEmailServer({
        templateName: "booking-internal-notification",
        idempotencyKey: `booking-internal-${booking.id}`,
        templateData,
      }),
    ]);

    await supabaseAdmin
      .from("bookings")
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq("id", booking.id);
  } catch (e) {
    console.error("finalizePaidBooking: failed to send confirmation emails", e);
    // Don't rethrow — Stripe webhook should still ack so it doesn't retry forever.
  }
}
