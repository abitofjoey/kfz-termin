import { createFileRoute } from "@tanstack/react-router";

// Einmaliger Admin-Endpoint, um eine bezahlte Buchung nachträglich zu finalisieren
// (paid=true setzen + Bestätigungs- und interne Mail versenden).
// Wird über invoke-server-function mit LOVABLE_API_KEY als Bearer aufgerufen.
// Idempotent dank `confirmation_sent_at`-Flag in finalizePaidBooking.

export const Route = createFileRoute("/api/public/admin/finalize-booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "Server misconfigured" },
            { status: 500 },
          );
        }

        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace(/^Bearer\s+/i, "");
        if (token !== apiKey) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body: { bookingId?: string };
        try {
          body = (await request.json()) as { bookingId?: string };
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const bookingId = body.bookingId;
        if (!bookingId || typeof bookingId !== "string") {
          return Response.json(
            { error: "bookingId (string) required" },
            { status: 400 },
          );
        }

        try {
          const { finalizePaidBooking } = await import(
            "@/lib/booking-finalize.server"
          );
          await finalizePaidBooking(bookingId);
          return Response.json({ ok: true, bookingId });
        } catch (err) {
          console.error("admin/finalize-booking failed", err);
          return Response.json(
            { error: "Finalize failed", detail: String(err) },
            { status: 500 },
          );
        }
      },
    },
  },
});
