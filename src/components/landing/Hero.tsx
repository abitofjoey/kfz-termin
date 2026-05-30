import { Clock, ShieldCheck, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.18_0.04_258)] opacity-90" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium">
            <MapPin className="h-3.5 w-3.5" />
            Zulassungsstelle Köln
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Dein Wunschtermin bei der Kölner Zulassungsstelle –{" "}
            <span className="text-accent">automatisch gebucht.</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 sm:text-xl">
            Neue Termine sind oft innerhalb von Minuten vergeben – unser System
            prüft die Verfügbarkeit täglich von 7 bis 18 Uhr. Für nur 9,99 €,
            ohne Stress und ohne tägliches Nachschauen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#buchung"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-lg transition hover:bg-white/90"
            >
              Jetzt Termin sichern
            </a>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
            >
              So funktioniert's
            </a>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 text-sm text-white/80 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Suche täglich von 7 bis 18 Uhr
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Geld-zurück-Garantie
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Nur Zulassungsstelle Köln
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
