import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB – KFZ-Termin Köln" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen von KFZ-Termin Köln." },
    ],
  }),
  component: () => (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <section>
        <h2 className="text-lg font-semibold">§ 1 Geltungsbereich</h2>
        <p className="mt-2">
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Eike
          Hoffmann (nachfolgend „Anbieter") und dem Kunden über die Nutzung des Dienstes
          „KFZ-Termin Köln" unter kfz-termin.online. Abweichende Bedingungen des Kunden werden
          nicht anerkannt.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 2 Leistungsbeschreibung</h2>
        <p className="mt-2">
          Der Anbieter stellt einen Service zur automatisierten Terminsuche bei der
          Zulassungsstelle der Stadt Köln zur Verfügung. Der Anbieter sucht im Auftrag des Kunden
          nach einem freien Termin im vom Kunden gewünschten Zeitraum und nimmt diesen mit den
          vom Kunden bereitgestellten Daten in dessen Namen wahr. Der Anbieter ist weder mit der
          Stadt Köln noch mit der dortigen Zulassungsstelle geschäftlich oder rechtlich verbunden.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 3 Vertragsschluss</h2>
        <p className="mt-2">
          Der Vertrag kommt zustande, indem der Kunde das Buchungsformular ausfüllt, die
          Zahlungspflicht durch Klick auf den entsprechenden Button bestätigt und die Zahlung
          erfolgreich abschließt. Der Kunde erhält anschließend eine Bestätigung per E-Mail.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 4 Preise und Zahlung</h2>
        <p className="mt-2">
          Der Preis für die Terminbuchung beträgt 19,00 € pro Auftrag (Pauschalpreis). Der Preis
          ist mit Vertragsschluss sofort fällig. Die Zahlung erfolgt über den Zahlungsdienstleister
          Stripe. Es gelten zusätzlich die AGB von Stripe. Gemäß § 19 UStG wird keine
          Umsatzsteuer ausgewiesen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 5 Mitwirkungspflichten des Kunden</h2>
        <p className="mt-2">
          Der Kunde verpflichtet sich, alle für die Terminbuchung erforderlichen Daten (z. B.
          Name, Kontaktdaten, gewünschter Zeitraum, Anliegen) vollständig und korrekt anzugeben.
          Für die Folgen unrichtiger oder unvollständiger Angaben übernimmt der Anbieter keine
          Haftung.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 6 Leistungsumfang, keine Erfolgsgarantie</h2>
        <p className="mt-2">
          Der Anbieter schuldet die sorgfältige Bemühung, einen Termin im gewünschten Zeitraum zu
          finden, nicht jedoch einen bestimmten Erfolg. Eine Garantie für die Verfügbarkeit eines
          Termins oder einen Termin innerhalb eines bestimmten Zeitraums wird nicht übernommen,
          da die Verfügbarkeit allein von der Stadt Köln abhängt. Sollte innerhalb von 30 Tagen
          kein Termin gefunden werden können, erhält der Kunde den gezahlten Betrag auf Wunsch
          vollständig zurückerstattet.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 7 Widerrufsrecht für Verbraucher</h2>
        <p className="mt-2">
          <strong>Widerrufsbelehrung.</strong> Sie haben das Recht, binnen vierzehn Tagen ohne
          Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
          Tage ab dem Tag des Vertragsschlusses. Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
          (Eike Hoffmann, E-Mail: eike@jeh-digital.de) mittels einer eindeutigen Erklärung (z. B.
          per E-Mail) über Ihren Entschluss informieren.
        </p>
        <p className="mt-2">
          <strong>Vorzeitiges Erlöschen des Widerrufsrechts.</strong> Das Widerrufsrecht erlischt
          bei einem Vertrag über die Erbringung von Dienstleistungen, wenn der Anbieter die
          Dienstleistung vollständig erbracht hat und mit der Ausführung erst begonnen hat,
          nachdem der Kunde dazu seine ausdrückliche Zustimmung gegeben und gleichzeitig seine
          Kenntnis davon bestätigt hat, dass er sein Widerrufsrecht bei vollständiger
          Vertragserfüllung verliert. Der Kunde stimmt im Rahmen der Bestellung ausdrücklich zu,
          dass der Anbieter mit der Ausführung der Dienstleistung vor Ablauf der Widerrufsfrist
          beginnt.
        </p>
        <p className="mt-2">
          <strong>Folgen des Widerrufs.</strong> Im Falle eines wirksamen Widerrufs werden die
          gezahlten Beträge unverzüglich, spätestens binnen vierzehn Tagen, zurückerstattet. Hat
          der Kunde verlangt, dass die Dienstleistung während der Widerrufsfrist beginnt, schuldet
          er einen angemessenen Betrag für die bereits erbrachte Leistung.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 8 Haftung</h2>
        <p className="mt-2">
          Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden
          aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leichter
          Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten
          (Kardinalpflichten) und begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Eine
          Haftung für entgangene Termine oder mittelbare Folgeschäden ist im Rahmen der
          gesetzlichen Möglichkeiten ausgeschlossen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 9 Datenschutz</h2>
        <p className="mt-2">
          Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
          <a className="text-accent underline" href="/datenschutz">Datenschutzerklärung</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 10 Schlussbestimmungen</h2>
        <p className="mt-2">
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der
          übrigen Bestimmungen unberührt.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Stand: Mai 2026</p>
      </section>
    </LegalPage>
  ),
});
