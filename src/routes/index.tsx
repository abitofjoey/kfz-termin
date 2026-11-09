import { formatPrice } from "@/lib/price";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { HomeHero, HomeTimeline, HomeReasons, HomeReviews, HomeFounder, HomeMissingCity, HomeFaq, HomeClosing, homeFaqItems } from "@/components/home/HomeSections";
import { launchedCities, DEFAULT_CITY, cityOrDefault } from "@/lib/cities";

const SITE = "https://kfz-termin.online";
const TITLE = "KFZ-Termin – Wunschtermin bei der Zulassungsstelle, automatisch gebucht";
const DESCRIPTION = `Wir suchen laufend freie Termine bei der Zulassungsstelle und buchen automatisch an deinen Wunschtagen. ${formatPrice(cityOrDefault(undefined).priceCents)} mit Geld-zurück-Garantie. Derzeit für: ${launchedCities().map((c) => c.name).join(", ")}.`;

/** Alte Köln-Anker von der Startseite (z.B. /#buchung) wandern nach /koeln. */
export const LEGACY_HASHES = ["buchung", "preise", "ablauf", "faq"];

const homeFaq = homeFaqItems();

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "KFZ-Termin – Logo" },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "KFZ-Termin",
          url: SITE,
          description: "Automatisierte Terminsuche und -buchung bei der Kfz-Zulassungsstelle.",
          provider: { "@type": "Organization", name: "KFZ-Termin", url: SITE },
          areaServed: launchedCities().map((c) => ({ "@type": "City", name: c.name })),
          offers: { "@type": "Offer", price: (cityOrDefault(undefined).priceCents / 100).toFixed(2), priceCurrency: "EUR" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaq.map((i) => ({
            "@type": "Question",
            name: i.q,
            acceptedAnswer: { "@type": "Answer", text: i.a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  // Alte Links wie /#buchung führen zur Kölner Seite mit demselben Anker.
  useEffect(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (LEGACY_HASHES.includes(h)) window.location.replace(`/${DEFAULT_CITY}#${h}`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Zum Inhalt springen
      </a>
      <Header home />
      <main id="inhalt">
        <HomeHero />
        <HomeTimeline />
        <HomeReasons />
        <HomeReviews />
        <HomeFounder />
        <HomeMissingCity />
        <HomeFaq />
        <HomeClosing />
      </main>
      <Footer />
    </div>
  );
}
