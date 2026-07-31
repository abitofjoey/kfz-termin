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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Automatisierte Terminbuchung Kfz-Zulassungsstelle Köln",
          serviceType: "Terminvermittlung Kfz-Zulassung",
          description:
            "Automatisierte Terminsuche und Buchung bei der Kfz-Zulassungsstelle der Stadt Köln. Tägliche Suche von 7 bis 20 Uhr im Namen des Kunden, Geld-zurück-Garantie wenn kein Termin gefunden wird.",
          url: "https://kfz-termin.online/",
          provider: {
            "@type": "Organization",
            name: "KFZ-Termin Köln",
            url: "https://kfz-termin.online",
            email: "info@kfz-termin.online",
          },
          areaServed: {
            "@type": "City",
            name: "Köln",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Köln",
              addressCountry: "DE",
            },
          },
          termsOfService: "https://kfz-termin.online/agb",
          offers: {
            "@type": "Offer",
            price: "9.99",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: "https://kfz-termin.online/#buchung",
            category: "Einmalige Servicegebühr",
          },
        }),
      },
    ],
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
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt">
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
