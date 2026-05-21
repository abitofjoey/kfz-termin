export function Founder() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          <img
            src="https://jeh-digital.de/wp-content/uploads/2025/03/Eike-Hoffmann_Smile2.jpg"
            alt="Eike Hoffmann, Gründer von KFZ-Termin Köln"
            width={120}
            height={120}
            loading="lazy"
            className="h-30 w-30 shrink-0 rounded-full object-cover"
            style={{ height: 120, width: 120 }}
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">Warum ich diesen Service gebaut habe</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hallo, ich bin Eike – Freelancer aus Köln im Bereich Online-Marketing und Digitales.
              Als wir kurzfristig ein Wohnmobil gekauft hatten und zwei Wochen später in den Urlaub
              fahren wollten, brauchte ich dringend einen Zulassungstermin. Kein passender Slot war
              frei. Ich wusste, dass morgens manchmal neue Termine reinkommen – aber jeden Morgen
              manuell F5 zu drücken war keine echte Lösung. Also habe ich mir ein Tool gebaut, das
              das automatisch für mich übernimmt. Ein paar Tage später hatte ich einen Termin für
              die nächste Woche. Genau dieses Tool steckt hinter KFZ-Termin Köln.
            </p>
            <p className="mt-4 text-sm">
              <a
                href="https://jeh-digital.de/kfz-termin-automatisch-buchen-mit-ki/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mehr über das Projekt lesen →
              </a>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Eike Hoffmann · Freelancer ·{" "}
              <a
                href="https://jeh-digital.de"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                jeh-digital.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
