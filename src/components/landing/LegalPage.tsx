import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Info } from "lucide-react";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <div className="mt-8 flex items-start gap-3 rounded-md border border-warning-border bg-warning p-4 text-sm text-warning-foreground">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{children}</p>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-sm text-accent underline">
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
