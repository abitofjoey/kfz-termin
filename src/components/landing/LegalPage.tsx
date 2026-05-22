import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

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
        <div className="legal-prose mt-8 space-y-6 text-sm leading-relaxed text-foreground">
          {children}
        </div>
        <div className="mt-12">
          <Link to="/" className="text-sm text-accent underline">
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
