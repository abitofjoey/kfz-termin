import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";


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
      const { finalizePaidBooking } = await import("@/lib/booking-finalize.server");
      await finalizePaidBooking(bookingId);
    }

    return { ok: true as const, paid: isPaid };
  });
