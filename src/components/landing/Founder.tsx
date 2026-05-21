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
            <h2 className="text-xl font-bold">Wer steckt hinter KFZ-Termin.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hallo, ich bin Eike – Freelancer aus Köln im Bereich Online-Marketing und Digitales.
              Als wir kurzfristig ein Wohnmobil gekauft hatten und zwei Wochen später in den Urlaub
              fahren wollten, brauchte ich dringend einen Zulassungstermin. Allerdings gab es keinen
              passenden Termin. Neue Termine werden morgens freigeschaltet oder kommen tagsüber durch
              Absagen rein – und sind oft innerhalb von Minuten wieder weg. Ständig selbst
              nachzuschauen war keine Option. Also habe ich selbst eine Lösung gebaut, die mir
              innerhalb weniger Tage einen Termin für die kommende Woche verschafft hat. Genau das
              steckt hinter KFZ-Termin Köln.
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
