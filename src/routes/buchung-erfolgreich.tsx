import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/buchung-erfolgreich")({
  head: () => ({
    meta: [{ title: "Buchung erfolgreich – KFZ-Termin Köln" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          Vielen Dank für Ihre Buchung!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Wir haben Ihre Anfrage erhalten und beginnen sofort mit der Suche
          nach einem freien Termin bei der Kölner Zulassungsstelle. Sie
          erhalten in Kürze eine Bestätigungsmail.
        </p>

        <div className="mt-8 flex items-start gap-3 rounded-md border border-warning-border bg-warning p-4 text-left text-sm text-warning-foreground">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>
            <strong>Wichtig:</strong> Sobald wir einen Termin gefunden haben,
            erhalten Sie eine E-Mail der Zulassungsstelle Köln mit einem
            Bestätigungslink. Diesen müssen Sie <strong>innerhalb von 1 Stunde </strong>
            anklicken – sonst verfällt der Termin unwiderruflich.
          </p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-block text-sm text-accent underline"
        >
          ← Zurück zur Startseite
        </Link>
      </main>
      <Footer />
    </div>
  );
}
