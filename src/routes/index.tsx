import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Pricing } from "@/components/landing/Pricing";
import { BookingForm } from "@/components/landing/BookingForm";
import { InfoBlock } from "@/components/landing/InfoBlock";
import { Founder } from "@/components/landing/Founder";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { Toaster } from "@/components/ui/sonner";
import type { ServiceId } from "@/lib/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KFZ-Termin Köln – Wunschtermin bei der Zulassungsstelle" },
      {
        name: "description",
        content:
          "Kein passender Termin bei der Kölner Zulassungsstelle? Wir suchen automatisch täglich und buchen sobald ein Slot frei wird. 9,99€ mit Geld-zurück-Garantie.",
      },
      { property: "og:title", content: "KFZ-Termin Köln – Wunschtermin bei der Zulassungsstelle" },
      {
        property: "og:description",
        content:
          "Kein passender Termin bei der Kölner Zulassungsstelle? Wir suchen automatisch täglich und buchen sobald ein Slot frei wird. 9,99€ mit Geld-zurück-Garantie.",
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
        <Testimonials />
        <BookingForm preselected={preselected} />
        <InfoBlock />
        <Faq />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
