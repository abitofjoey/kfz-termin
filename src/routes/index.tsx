import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Pricing } from "@/components/landing/Pricing";
import { BookingForm } from "@/components/landing/BookingForm";
import { InfoBlock } from "@/components/landing/InfoBlock";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KFZ-Termin Köln – Schneller Termin bei der Zulassungsstelle" },
      {
        name: "description",
        content:
          "Automatische Terminsuche bei der Kölner Zulassungsstelle – ohne wochenlange Wartezeit. Geld-zurück-Garantie. Ab 19 €.",
      },
      { property: "og:title", content: "KFZ-Termin Köln" },
      {
        property: "og:description",
        content:
          "Wir finden automatisch einen freien Termin bei der Kölner Zulassungsstelle – schnell, zuverlässig und ohne Stress.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [preselected, setPreselected] = useState<"gebraucht" | "neu" | null>(
    null,
  );

  const handleSelect = (service: "gebraucht" | "neu") => {
    setPreselected(service);
    requestAnimationFrame(() => {
      document.getElementById("buchung")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Steps />
        <Pricing onSelect={handleSelect} />
        <BookingForm preselected={preselected} />
        <Faq />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
