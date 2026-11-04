import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Pricing } from "@/components/landing/Pricing";
import { InfoBlock } from "@/components/landing/InfoBlock";
import { Founder } from "@/components/landing/Founder";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import type { ServiceId } from "@/lib/services";
import { getCity } from "@/lib/cities";
import type { CityContent } from "@/content/cities";

// Gemeinsame Vorlage für alle Stadtseiten. Inhalte kommen aus
// src/content/cities/<stadt>.ts, Regeln aus src/lib/cities.ts.

// Formular und Toaster liegen unter dem Sichtbereich bzw. werden erst nach
// Interaktion gebraucht – daher erst bei Bedarf nachladen.
const importBookingForm = () => import("@/components/landing/BookingForm");
const BookingForm = lazy(() =>
  importBookingForm().then((m) => ({ default: m.BookingForm })),
);
const Toaster = lazy(() =>
  import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
);

function BookingFormPlaceholder() {
  return (
    <section
      id="buchung"
      aria-labelledby="buchung-heading"
      className="bg-background py-20"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="buchung-heading" className="text-3xl font-bold sm:text-4xl">
            Jetzt Termin buchen
          </h2>
          <p className="mt-4 text-muted-foreground">
            Fülle das Formular aus – wir kümmern uns um den Rest.
          </p>
        </div>
        <div
          className="mt-10 h-[900px] rounded-2xl border border-border bg-card shadow-sm"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export function CityLanding({ city, content }: { city: string; content: CityContent }) {
  const [preselected, setPreselected] = useState<ServiceId | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const pendingScroll = useRef(false);

  const activate = useCallback(() => {
    setShowForm(true);
    setShowToaster(true);
  }, []);

  // Erste Nutzerinteraktion (Scroll/Pointer/Tastatur) oder Leerlauf lädt das
  // Formular nach, damit es beim Erreichen des Abschnitts schon bereit ist.
  useEffect(() => {
    if (showForm) return;
    const onFirst = () => activate();
    const opts = { once: true, passive: true } as const;
    window.addEventListener("scroll", onFirst, opts);
    window.addEventListener("pointerdown", onFirst, opts);
    window.addEventListener("keydown", onFirst, opts);
    const timer = window.setTimeout(onFirst, 2500);
    return () => {
      window.removeEventListener("scroll", onFirst);
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
      clearTimeout(timer);
    };

  }, [showForm, activate]);

  // Nach dem Laden des Formulars zum Abschnitt scrollen, falls angefordert.
  useEffect(() => {
    if (!showForm || !pendingScroll.current) return;
    pendingScroll.current = false;
    requestAnimationFrame(() => {
      document.getElementById("buchung")?.scrollIntoView({ behavior: "smooth" });
    });
  }, [showForm, preselected]);

  const handleSelect = (service: ServiceId) => {
    setPreselected(service);
    pendingScroll.current = true;
    activate();
    if (showForm) {
      pendingScroll.current = false;
      requestAnimationFrame(() => {
        document.getElementById("buchung")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Zum Inhalt springen
      </a>
      <Header city={city} />
      <main id="inhalt">
        <Hero content={content.hero} />
        <Steps />
        <Pricing onSelect={handleSelect} />
        <Founder />
        <Testimonials />
        {!getCity(city)?.bookable ? (
          <section id="buchung" className="bg-background py-20">
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Bald buchbar</h2>
              <p className="mt-4 text-muted-foreground">
                Für {getCity(city)?.name} nehmen wir noch keine Buchungen an.
              </p>
            </div>
          </section>
        ) : showForm ? (
          <Suspense fallback={<BookingFormPlaceholder />}>
            <BookingForm preselected={preselected} city={city} />
          </Suspense>
        ) : (
          <BookingFormPlaceholder />
        )}
        <InfoBlock content={content.info} />
        <Faq items={content.faq} />
      </main>
      <Footer city={getCity(city)?.name} />
      {showToaster ? (
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      ) : null}
    </div>
  );

}
