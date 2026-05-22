import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – KFZ-Termin Köln" },
      { name: "description", content: "Impressum von KFZ-Termin Köln." },
    ],
  }),
  component: () => (
    <LegalPage title="Impressum">
      <section>
        <h2 className="text-lg font-semibold">Angaben gemäß § 5 DDG</h2>
        <p className="mt-2">
          Eike Hoffmann<br />
          Longericher Str. 31<br />
          50739 Köln<br />
          Deutschland
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Kontakt</h2>
        <p className="mt-2">
          E-Mail:{" "}
          <a className="text-accent underline" href="mailto:eike@jeh-digital.de">
            eike@jeh-digital.de
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Umsatzsteuer</h2>
        <p className="mt-2">
          Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="mt-2">
          Eike Hoffmann, Anschrift wie oben.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Streitschlichtung</h2>
        <p className="mt-2">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            className="text-accent underline"
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Haftung für Inhalte</h2>
        <p className="mt-2">
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Haftung für Links</h2>
        <p className="mt-2">
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
          übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
          Betreiber der Seiten verantwortlich.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Urheberrecht</h2>
        <p className="mt-2">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>
    </LegalPage>
  ),
});
