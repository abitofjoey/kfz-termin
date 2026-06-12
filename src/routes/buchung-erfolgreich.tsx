import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2, XCircle } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useServerFn } from "@tanstack/react-start";
import { confirmCheckoutSession } from "@/lib/stripe.functions";

export const Route = createFileRoute("/buchung-erfolgreich")({
  head: () => ({
    meta: [
      { title: "Buchung erfolgreich – KFZ-Termin Köln" },
      { name: "description", content: "Deine Buchung bei KFZ-Termin Köln war erfolgreich. Wir beginnen sofort mit der automatischen Terminsuche." },
      { property: "og:title", content: "Buchung erfolgreich – KFZ-Termin Köln" },
      { property: "og:description", content: "Vielen Dank! Deine Zahlung wurde bestätigt und unsere automatische Terminsuche bei der Kölner Zulassungsstelle läuft bereits." },
      { property: "og:url", content: "https://kfz-termin.online/buchung-erfolgreich" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { session_id } = Route.useSearch();
  const confirm = useServerFn(confirmCheckoutSession);
  const [state, setState] = useState<"loading" | "paid" | "unpaid" | "error">(
    session_id ? "loading" : "paid",
  );

  useEffect(() => {
    if (!session_id) return;
    confirm({ data: { sessionId: session_id } })
      .then((r) => {
        setState(r.paid ? "paid" : "unpaid");

        if (r.paid && typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "purchase", {
            transaction_id: session_id,
            value: 9.99,
            currency: "EUR",
          });
        }
      })
      .catch(() => setState("error"));
  }, [session_id, confirm]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Zahlung wird bestätigt…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (state !== "paid") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <XCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-6 text-3xl font-bold">Zahlung nicht bestätigt</h1>
          <p className="mt-4 text-muted-foreground">
            Wir konnten deine Zahlung noch nicht bestätigen. Bitte versuche
            es erneut oder kontaktiere uns.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Zurück zur Startseite
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          Vielen Dank für deine Buchung!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Wir haben deine Zahlung erhalten und beginnen sofort mit der Suche
          nach einem freien Termin bei der Kölner Zulassungsstelle. Du
          erhältst in Kürze eine Bestätigungsmail.
        </p>

        <div className="mt-8 flex items-start gap-3 rounded-md border border-warning-border bg-warning p-4 text-left text-sm text-warning-foreground">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            <strong>Wichtig:</strong> Sobald wir einen Termin gefunden haben,
            erhältst du eine E-Mail der Zulassungsstelle Köln mit einem
            Bestätigungslink. Diesen musst du <strong>innerhalb von 3 Stunden </strong>
            anklicken – sonst verfällt der Termin unwiderruflich.
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Zahlungsquittung erhältst du separat per E-Mail von Stripe.
        </p>

        <Link to="/" className="mt-8 inline-block text-sm text-accent underline">
          ← Zurück zur Startseite
        </Link>
      </main>
      <Footer />
    </div>
  );
}
