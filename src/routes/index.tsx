import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, CalendarCheck, Search, MailCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Founder } from "@/components/landing/Founder";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq, type FaqItem } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { launchedCities, DEFAULT_CITY } from "@/lib/cities";

const SITE = "https://kfz-termin.online";
const TITLE = "KFZ-Termin – Dein Wunschtermin bei der Zulassungsstelle, automatisch gebucht";
const DESCRIPTION =
  "Wir suchen und buchen deinen Termin bei der Kfz-Zulassungsstelle – derzeit in Köln. 9,99 € mit Geld-zurück-Garantie.";

/** Alte Köln-Anker von der Startseite (z.B. /#buchung) wandern nach /koeln. */
export const LEGACY_HASHES = ["buchung", "preise", "ablauf", "faq"];

const homeFaq: FaqItem[] = [
  {
    q: "Für welche Städte gibt es den Service?",
    a: "Aktuell für die Kfz-Zulassungsstelle Köln. Weitere Städte folgen.",
  },
  {
    q: "Was kostet der Service?",
    a: "9,99 € einmalig. Wird in deinem Zeitraum kein Termin frei, kannst du einmalig neue Wunschtermine wählen oder bekommst den vollen Betrag zurück.",
  },
  {
    q: "Wie läuft die Buchung ab?",
    a: "Du wählst deine Stadt, dein Anliegen und die Tage, an denen du Zeit hast. Wir suchen täglich nach freien Terminen und buchen automatisch den ersten passenden.",
  },
  {
    q: "Wie erfahre ich, dass ein Termin gefunden wurde?",
    a: "Du bekommst von uns eine E-Mail mit Datum und Uhrzeit. Je nach Stadt kommt zusätzlich eine E-Mail der Zulassungsstelle, die du bestätigen musst.",
  },
];

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
          "@type": "Organization",
          name: "KFZ-Termin",
          url: SITE,
          email: "info@kfz-termin.online",
        }),
      },
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
          offers: { "@type": "Offer", price: "9.99", priceCurrency: "EUR" },
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

  const cities = launchedCities();
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
        <section aria-labelledby="home-hero" className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <h1 id="home-hero" className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Dein Wunschtermin bei der Zulassungsstelle –{" "}
              <span className="text-accent">automatisch gebucht</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Wir suchen täglich nach freien Terminen bei der Kfz-Zulassungsstelle und buchen
              automatisch, sobald einer an deinen Wunschtagen frei wird – derzeit für die
              Zulassungsstelle Köln.
            </p>
          </div>
        </section>

        <section id="staedte" aria-labelledby="staedte-heading" className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="staedte-heading" className="text-3xl font-bold">Wähle deine Stadt</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <a
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="group flex items-center justify-between rounded-2xl border-2 border-border bg-card p-6 shadow-sm transition hover:border-primary"
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-accent" />
                    <span>
                      <span className="block text-xl font-bold">{c.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        Termin bei der Zulassungsstelle {c.name}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Weitere Städte folgen.</p>
          </div>
        </section>

        <section id="so-funktionierts" aria-labelledby="sf-heading" className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="sf-heading" className="text-3xl font-bold">So funktioniert's</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: CalendarCheck, t: "Wunschtage wählen", d: "Stadt, Anliegen und die Tage, an denen du Zeit hast." },
                { icon: Search, t: "Wir suchen", d: "Unser System prüft täglich die freien Termine der Zulassungsstelle." },
                { icon: MailCheck, t: "Termin per E-Mail", d: "Sobald ein Termin passt, buchen wir ihn und informieren dich." },
              ].map((s, i) => (
                <li key={s.t} className="rounded-2xl border border-border bg-card p-6">
                  <s.icon className="h-6 w-6 text-accent" />
                  <p className="mt-3 font-semibold">{i + 1}. {s.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="preis" aria-labelledby="preis-heading" className="py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 id="preis-heading" className="text-3xl font-bold">9,99 € pro Termin</h2>
            <p className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Geld-zurück-Garantie, wenn kein Termin gefunden wird.
            </p>
          </div>
        </section>

        <Founder />
        <Testimonials title="Kundenstimmen aus Köln" />

        <div id="haeufige-fragen">
          <Faq items={homeFaq} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
