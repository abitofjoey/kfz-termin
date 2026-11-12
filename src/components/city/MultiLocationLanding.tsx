import { lazy, Suspense, useEffect, useState } from "react";
import { InfoBlock } from "@/components/landing/InfoBlock";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Faq } from "@/components/landing/Faq";
import { Founder } from "@/components/landing/Founder";
import { ServicePricing, type PricingGroup } from "@/components/landing/Pricing";
import type { FormPreselect } from "@/components/city/CityBookingForm";
import { getServices, type CityService } from "@/lib/services";
import type { ServiceCategory } from "@/lib/cities";
import { Footer } from "@/components/landing/Footer";
import { getCity } from "@/lib/cities";
import { formatPrice } from "@/lib/price";
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
  const [preselect, setPreselect] = useState<FormPreselect | null>(null);

  const all = getServices(slug);
  const groups: PricingGroup[] = (["kfz", "fuehrerschein"] as const).filter((k) => all.some((s) => s.category === k)).map((k) => {
    const list = all.filter((s) => s.category === k);
    return {
      key: k,
      label: k === "kfz" ? "Kfz-Zulassung" : "Führerschein",
      popular: list.filter((s) => s.popularRank).sort((a, b) => a.popularRank! - b.popularRank!),
      more: list.filter((s) => !s.popularRank),
    };
  });
  const byId = new Map(all.map((s) => [s.id, s] as const));
  const handleSelect = (id: string, groupKey: string) => {
    setPreselect({ category: groupKey as ServiceCategory, serviceId: id, nonce: Date.now() });
    document.getElementById("buchung")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        <Hero content={content.hero} city={city} />

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
            {multi.honestNote ? <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">{multi.honestNote}</p> : null}
          </div>
        </section>

        <ServicePricing
          groups={groups}
          cityName={city.name}
          price={formatPrice(city.priceCents)}
          subtitle={multi.servicesSubtitle ?? ""}
          features={(item) => multi.pricingFeatures?.(byId.get(item.id) as CityService) ?? []}
          onSelect={handleSelect}
        />

        <Founder />

        {ready ? (
          <Suspense fallback={<div className="h-[900px]" aria-hidden="true" />}>
            <CityBookingForm city={slug} preselect={preselect} submitNotice={multi.bookingNotice} />
          </Suspense>
        ) : (
          <section id="buchung" className="py-20"><div className="mx-auto h-[900px] max-w-3xl" aria-hidden="true" /></section>
        )}

        {content.info ? <InfoBlock content={content.info} /> : null}

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
