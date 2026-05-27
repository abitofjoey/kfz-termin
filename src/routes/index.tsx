import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Pricing } from "@/components/landing/Pricing";
import { BookingForm } from "@/components/landing/BookingForm";
import { InfoBlock } from "@/components/landing/InfoBlock";
import { Founder } from "@/components/landing/Founder";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";
import type { ServiceId } from "@/lib/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KFZ-Termin Köln – Schneller Termin bei der Zulassungsstelle" },
      {
        name: "description",
        content:
          "Automatische Terminsuche bei der Kölner Zulassungsstelle – täglich von 7 bis 18 Uhr. Geld-zurück-Garantie. Ab 19 €.",
      },
      { property: "og:title", content: "KFZ-Termin Köln – Schneller Termin bei der Zulassungsstelle" },
      {
        property: "og:description",
        content:
          "Wir finden täglich von 7 bis 18 Uhr einen freien Termin bei der Kölner Zulassungsstelle – schnell, zuverlässig und ohne Stress.",
      },
      { property: "og:url", content: "https://kfz-termin.online/" },
    ],
    links: [{ rel: "canonical", href: "https://kfz-termin.online/" }],
  }),
  component: Index,
});

function Index() {
  const [preselected, setPreselected] = useState<ServiceId | null>(null);

  const handleSelect = (service: ServiceId) => {
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
        <Founder />
        <BookingForm preselected={preselected} />
        <InfoBlock />
        <Faq />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
