import eikeUrl from "@/assets/brand/eike.webp";
import eikeSmallUrl from "@/assets/brand/eike-120.webp";

export function Founder() {
  return (
    <section aria-labelledby="founder-heading" className="py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          <img
            src={eikeSmallUrl}
            srcSet={`${eikeSmallUrl} 1x, ${eikeUrl} 2x`}
            alt="Eike Hoffmann, Gründer von KFZ-Termin Köln"
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
            className="h-30 w-30 shrink-0 rounded-full object-cover"
            style={{ height: 120, width: 120 }}
          />

          <div className="text-center sm:text-left">
            <h2 id="founder-heading" className="text-xl font-bold">Wer steckt hinter KFZ-Termin.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hallo, ich bin Eike – Freelancer aus Köln im Bereich Online-Marketing und Digitales.
              Als wir kurzfristig ein Wohnmobil gekauft hatten und zwei Wochen später in den Urlaub
              fahren wollten, brauchte ich dringend einen Zulassungstermin. Allerdings gab es keinen
              passenden Termin. Neue Termine werden morgens freigeschaltet oder kommen tagsüber durch
              Absagen rein – und sind oft innerhalb von Minuten wieder weg. Ständig selbst
              nachzuschauen war keine Option. Also habe ich eine Lösung gebaut, die mir innerhalb
              weniger Tage einen Termin verschafft hat. Genau das steckt hinter KFZ-Termin Köln.
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
