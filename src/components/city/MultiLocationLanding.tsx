import { lazy, Suspense, useEffect, useState } from "react";
import { MapPin, Info } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { getCity } from "@/lib/cities";
import { formatPrice, vatShortNote } from "@/lib/price";
import type { CityContent } from "@/content/cities";

const CityBookingForm = lazy(() =>
  import("@/components/city/CityBookingForm").then((m) => ({ default: m.CityBookingForm })),
);
const Toaster = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

/** Stadtseite für Städte mit mehreren Standorten (z.B. Bonn). Ohne Kundenstimmen. */
export function MultiLocationLanding({ city: slug, content }: { city: string; content: CityContent }) {
  const city = getCity(slug)!;
  const multi = content.multi!;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Zum Inhalt springen
      </a>
      <Header city={slug} />
      <main id="inhalt">
        <Hero content={content.hero} />

        <section id="ablauf" aria-labelledby="ablauf-heading" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 id="ablauf-heading" className="text-center text-3xl font-bold sm:text-4xl">So funktioniert's</h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {multi.steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="mx-auto mt-8 flex max-w-3xl items-start gap-2 rounded-md border border-border bg-muted/50 p-4 text-sm">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              <p>{multi.honestNote}</p>
            </div>
          </div>
        </section>

        <section id="preise" aria-labelledby="preise-heading" className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 id="preise-heading" className="text-3xl font-bold sm:text-4xl">Preis</h2>
            <p className="mt-4 text-4xl font-bold text-primary">{formatPrice(city.priceCents)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pro Termin, einmalig ({vatShortNote()}). Geld-zurück-Garantie, wenn an deinen Wunschtagen kein Termin frei wird.
            </p>
          </div>
        </section>

        {ready ? (
          <Suspense fallback={<div className="h-[900px]" aria-hidden="true" />}>
            <CityBookingForm city={slug} bookingNotice={multi.bookingNotice} />
          </Suspense>
        ) : (
          <section id="buchung" className="py-20"><div className="mx-auto h-[900px] max-w-3xl" aria-hidden="true" /></section>
        )}

        <section aria-labelledby="standorte-heading" className="py-12">
          <div className="mx-auto max-w-3xl px-4">
            <div className="rounded-2xl border border-border bg-muted/50 p-8">
              <h2 id="standorte-heading" className="text-xl font-bold">{multi.locationsTitle}</h2>
              <ul className="mt-6 space-y-3 text-sm">
                {city.locations.map((l) => (
                  <li key={l.id} className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="font-semibold">{l.name}</span>
                      <span className="block text-muted-foreground">{l.address}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">{multi.locationsNote}</p>
            </div>
          </div>
        </section>

        <Faq items={content.faq} />
      </main>
      <Footer city={city.name} />
      {ready ? (
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      ) : null}
    </div>
  );
}
