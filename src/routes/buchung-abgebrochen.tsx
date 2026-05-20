import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/buchung-abgebrochen")({
  head: () => ({
    meta: [{ title: "Buchung abgebrochen – KFZ-Termin Köln" }],
  }),
  component: CancelPage,
});

function CancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <XCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          Bezahlung abgebrochen
        </h1>
        <p className="mt-4 text-muted-foreground">
          Sie haben den Bezahlvorgang abgebrochen. Es wurde nichts berechnet.
          Sie können den Vorgang jederzeit erneut starten.
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
