import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalEmailServer } from "@/lib/email/send.server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert.");
  return new Stripe(key);
}

function getOrigin() {
  const req = getRequest();
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ bookingId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("id, email, service_type, paid")
      .eq("id", data.bookingId)
      .single();

    if (error || !booking) {
      return { ok: false as const, error: "Buchung nicht gefunden." };
    }
    if (booking.paid) {
      return { ok: false as const, error: "Buchung wurde bereits bezahlt." };
    }

    const origin = getOrigin();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Keine payment_method_types setzen → Stripe Checkout zeigt automatisch
      // alle im Dashboard aktivierten Zahlungsarten (Karte, PayPal, Klarna,
      // Apple/Google Pay, Sofort, Giropay, …) passend zu Gerät und Land.
      customer_email: booking.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: 999,
            product_data: {
              name: booking.service_type,
              description: "KFZ-Termin Köln – Terminservice bei der Zulassungsstelle",
            },
          },
        },
      ],
      metadata: { booking_id: booking.id },
      // Stripe sendet automatisch eine Zahlungsquittung (sofern in den
      // Stripe Email-Settings "Successful payments" aktiviert).
      payment_intent_data: { receipt_email: booking.email } as any,
      success_url: `${origin}/buchung-erfolgreich?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/buchung-abgebrochen`,
    });

    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return { ok: true as const, url: session.url };
  });

export const confirmCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ sessionId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);

    const bookingId = session.metadata?.booking_id;
    const isPaid = session.payment_status === "paid";

    if (isPaid && bookingId) {
      // Mark as paid
      await supabaseAdmin
        .from("bookings")
        .update({ paid: true, status: "paid" })
        .eq("id", bookingId);

      // Load full booking to send confirmation emails (idempotent)
      const { data: booking } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (booking && !booking.confirmation_sent_at) {
        const templateData = {
          bookingId: booking.id,
          salutation: booking.salutation,
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          phone: booking.phone,
          serviceType: booking.service_type,
          finEndings: [booking.fin_1, booking.fin_2, booking.fin_3].filter((v): v is string => !!v),
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
          console.error("Failed to send booking confirmation emails", e);
        }
      }
    }

    return { ok: true as const, paid: isPaid };
  });
