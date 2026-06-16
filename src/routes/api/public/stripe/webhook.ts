import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

export const Route = createFileRoute("/api/public/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripeKey || !webhookSecret) {
          console.error("Stripe webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
          return new Response("Server misconfigured", { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return new Response("Missing stripe-signature header", { status: 400 });
        }

        // Stripe-Signaturprüfung erfordert den exakten Raw-Body.
        const rawBody = await request.text();

        const stripe = new Stripe(stripeKey);

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            rawBody,
            signature,
            webhookSecret,
          );
        } catch (err) {
          console.error("Stripe webhook signature verification failed", err);
          return new Response("Invalid signature", { status: 400 });
        }

        try {
          if (
            event.type === "checkout.session.completed" ||
            event.type === "checkout.session.async_payment_succeeded"
          ) {
            const session = event.data.object as Stripe.Checkout.Session;
            const bookingId = session.metadata?.booking_id;
            const isPaid = session.payment_status === "paid";

            if (isPaid && bookingId) {
              const { finalizePaidBooking } = await import(
                "@/lib/booking-finalize.server"
              );
              await finalizePaidBooking(bookingId);
            } else {
              console.log("Stripe webhook: event ignored", {
                type: event.type,
                bookingId,
                payment_status: session.payment_status,
              });
            }
          }
        } catch (err) {
          console.error("Stripe webhook: handler error", err);
          // 200 zurückgeben, damit Stripe nicht endlos retried — Fehler ist im Log.
          // Bei echten transient-fails würde 500 Retry triggern; das hier ist eine
          // bewusste Idempotenz-Strategie, da Mailversand bereits idempotent ist.
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
