import { Check, RefreshCw, CalendarCheck, ShieldCheck, Star, MessageCircle, Mail } from "lucide-react";
import { CityCards } from "./CityCards";
import { testimonials } from "@/components/landing/Testimonials";
import { launchedCities } from "@/lib/cities";
import eikeUrl from "@/assets/brand/eike.webp";
import eikeSmallUrl from "@/assets/brand/eike-120.webp";

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero" className="bg-secondary/40">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
        <h1 id="home-hero" className="text-3xl font-bold leading-tight sm:text-5xl">
          Termin bei der Zulassungsstelle? Wir suchen ihn für dich.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Du wählst deine Stadt, dein Anliegen und die Tage, an denen du Zeit hast. Wir prüfen
          laufend, ob an diesen Tagen ein Termin frei wird, und buchen ihn automatisch für dich.
        </p>
        <div id="stadt-waehlen" className="mt-10 scroll-mt-24">
          <h2 className="mb-4 text-xl font-semibold">Für welche Stadt suchst du einen Termin?</h2>
          <CityCards />
          <p className="mt-3 text-sm text-muted-foreground">Weitere Städte folgen.</p>
        </div>
        <ul className="mt-8 flex flex-col gap-2 text-sm font-medium sm:flex-row sm:flex-wrap sm:gap-6">
          {["9,99 € pro Auftrag", "Geld zurück, wenn kein Termin frei wird", "Kein Konto nötig"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const steps = [
  { t: "Stadt wählen", d: "Wähle die Stadt, in der du deinen Termin brauchst." },
  { t: "Formular ausfüllen", d: "Anliegen, deine Daten und die Tage, an denen du Zeit hast. Danach bezahlst du einmalig 9,99 €." },
  { t: "Termin per E-Mail", d: "Wir suchen automatisch, bis an einem deiner Wunschtage ein Termin frei wird. Dann buchen wir ihn, und du bekommst die Bestätigung per E-Mail." },
];

export function HomeTimeline() {
  return (
    <section aria-labelledby="sf-heading" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="sf-heading" className="text-3xl font-bold">So funktioniert's</h2>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3">
          <span aria-hidden="true" className="absolute left-6 top-6 bottom-6 w-0.5 bg-border md:left-[16.66%] md:right-[16.66%] md:top-6 md:bottom-auto md:h-0.5 md:w-auto" />
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-lg font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const reasons = [
  { icon: RefreshCw, t: "Kein ständiges Neuladen", d: "Freie Termine tauchen oft nur kurz auf, zum Beispiel durch Absagen. Unser System schaut laufend nach, damit du es nicht musst." },
  { icon: CalendarCheck, t: "Nur deine Wunschtage", d: "Wir buchen ausschließlich an Tagen, die du vorher ausgewählt hast." },
  { icon: ShieldCheck, t: "Geld-zurück-Garantie", d: "Wird an keinem deiner Wunschtage ein Termin frei, bekommst du die 9,99 € zurück." },
];

export function HomeReasons() {
  return (
    <section aria-labelledby="why-heading" className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="why-heading" className="text-3xl font-bold">Warum KFZ-Termin?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.t} className="rounded-2xl border border-border bg-card p-6">
              <r.icon className="h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">{r.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeReviews() {
  return (
    <section aria-labelledby="reviews-heading" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="reviews-heading" className="text-3xl font-bold">Kundenstimmen aus Köln</h2>
        <p className="mt-2 text-sm text-muted-foreground">Echte Google-Rezensionen von Kundinnen und Kunden.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <figure key={t.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              <div className="flex gap-0.5" role="img" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed">„{t.quote}"</blockquote>
              <figcaption className="text-sm font-semibold">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFounder() {
  return (
    <section aria-labelledby="founder-heading" className="bg-secondary/40 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 sm:flex-row sm:items-start">
        <img
          src={eikeSmallUrl}
          srcSet={`${eikeSmallUrl} 1x, ${eikeUrl} 2x`}
          alt="Eike Hoffmann, Gründer von KFZ-Termin"
          width={120}
          height={120}
          loading="lazy"
          decoding="async"
          className="shrink-0 rounded-full object-cover"
          style={{ height: 120, width: 120 }}
        />
        <div className="text-center sm:text-left">
          <h2 id="founder-heading" className="text-2xl font-bold">Wer steckt dahinter?</h2>
          <p className="mt-3 text-muted-foreground">
            Hallo, ich bin Eike, Freelancer aus Köln. Als ich selbst dringend einen Zulassungstermin
            brauchte und keinen bekam, habe ich ein System gebaut, das freie Termine automatisch
            findet und bucht. Daraus ist KFZ-Termin entstanden.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Eike Hoffmann ·{" "}
            <a href="https://jeh-digital.de" target="_blank" rel="noopener noreferrer" className="hover:underline">
              jeh-digital.de
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

const WA = "https://wa.me/4915153461798?text=" + encodeURIComponent("Hallo, ich bräuchte einen Termin in: ");
const MAIL = "mailto:info@kfz-termin.online?subject=" + encodeURIComponent("Neue Stadt");

export function HomeMissingCity() {
  return (
    <section aria-labelledby="missing-heading" className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
          <h2 id="missing-heading" className="text-2xl font-bold sm:text-3xl">Deine Stadt fehlt?</h2>
          <p className="mt-3 max-w-2xl opacity-90">
            Wir bauen den Service Stadt für Stadt aus. Schreib uns, wo du einen Termin brauchst – so
            sehen wir, wo es sich lohnt.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-accent-foreground hover:opacity-90">
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> WhatsApp
            </a>
            <a href={MAIL} className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/40 px-5 py-3 font-semibold hover:bg-primary-foreground/10">
              <Mail className="h-5 w-5" aria-hidden="true" /> E-Mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export type HomeFaqItem = { q: string; a: string; link?: { href: string; label: string } };

export function homeFaqItems(): HomeFaqItem[] {
  const names = launchedCities().map((c) => c.name).join(", ");
  return [
    { q: "Für welche Städte gibt es den Service?", a: `${names}. Weitere Städte folgen.` },
    { q: "Was kostet der Service?", a: "Einmalig 9,99 € pro Auftrag. Wird an keinem deiner Wunschtage ein Termin frei, bekommst du dein Geld zurück." },
    { q: "Wie bucht ihr den Termin?", a: "Über das offizielle Terminportal der jeweiligen Stadt, mit deinen Angaben – so, als würdest du selbst buchen." },
    { q: "Muss ich den Termin noch bestätigen?", a: "Das hängt von der Stadt ab. Was genau gilt, steht auf der jeweiligen Stadtseite und in unserer E-Mail." },
    { q: "Was passiert, wenn kein Termin frei wird?", a: "Du kannst neue Wunschtage wählen oder bekommst die 9,99 € zurück." },
    { q: "Was passiert mit meinen Daten?", a: "Wir nutzen sie nur für deine Terminbuchung und löschen sie danach. Details stehen in der Datenschutzerklärung.", link: { href: "/datenschutz", label: "Zur Datenschutzerklärung" } },
  ];
}

export function HomeFaq() {
  return (
    <section id="haeufige-fragen" aria-labelledby="faq-heading" className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 id="faq-heading" className="text-3xl font-bold">Häufige Fragen</h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
          {homeFaqItems().map((i) => (
            <details key={i.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {i.q}
                  <span className="text-xl text-primary transition group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">
                {i.a}
                {i.link ? (
                  <>
                    {" "}
                    <a href={i.link.href} className="font-medium text-primary underline">{i.link.label}</a>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeClosing() {
  return (
    <section aria-labelledby="closing-heading" className="py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 id="closing-heading" className="mb-6 text-2xl font-bold sm:text-3xl">Für welche Stadt suchst du einen Termin?</h2>
        <CityCards />
      </div>
    </section>
  );
}
