import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB – KFZ-Termin Köln" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen von KFZ-Termin Köln." },
      { property: "og:title", content: "AGB – KFZ-Termin Köln" },
      { property: "og:description", content: "Allgemeine Geschäftsbedingungen von KFZ-Termin Köln." },
      { property: "og:url", content: "https://kfz-termin.online/agb" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://kfz-termin.online/agb" }],
  }),
  component: () => (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p><strong>KFZ-Termin Köln · kfz-termin.online · Stand: Oktober 2026</strong></p>

      <section>
        <h2 className="text-lg font-semibold">Anbieter</h2>
        <p className="mt-2">
          Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />
          E-Mail: <a className="text-accent underline" href="mailto:info@kfz-termin.online">info@kfz-termin.online</a><br />
          Telefon/WhatsApp: 0151 53461798
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 1 Geltungsbereich</h2>
        <p className="mt-2">(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Eike Hoffmann (nachfolgend „Anbieter“) und dem Kunden über die Nutzung des Dienstes „KFZ-Termin Köln“ unter kfz-termin.online. Sie gelten auch, wenn der Kunde über eine Anzeige auf Kleinanzeigen auf den Dienst aufmerksam geworden ist.</p>
        <p className="mt-2">(2) Abweichende Bedingungen des Kunden werden nicht Vertragsbestandteil.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 2 Leistungsbeschreibung</h2>
        <p className="mt-2">(1) Der Anbieter stellt einen Service zur automatisierten Terminsuche bei der Zulassungsstelle der Stadt Köln zur Verfügung. Der Anbieter sucht im Auftrag des Kunden nach einem möglichen freien Termin im vom Kunden gewünschten Zeitraum und bucht diesen mit den vom Kunden bereitgestellten Daten in dessen Namen. Der Anbieter ist von den Terminen des Zulassungsportals abhängig und kann nur solche Termine buchen, die von dem Zulassungsportal auch tatsächlich freigegeben wurden.</p>
        <p className="mt-2">(2) Nach erfolgreicher Terminbuchung sendet der Anbieter dem Kunden eine Erinnerung per E-Mail an die im Formular angegebene E-Mail-Adresse.</p>
        <p className="mt-2">(3) Sollte die Zulassungsstelle keine Termine freigeben, die vom Kunden ausgewählt wurden, so ist der Anbieter von der Buchungspflicht befreit. Der Anbieter weist ausdrücklich darauf hin, dass insbesondere bei kurzfristigen Terminen die Wahrscheinlichkeit einer Buchung deutlich sinkt und der Anbieter eine Buchung nicht garantieren kann.</p>
        <p className="mt-2">(4) Die Wahrnehmung des Termins erfolgt durch den Kunden selbst. Der Anbieter ist weder mit der Stadt Köln noch mit der dortigen Zulassungsstelle geschäftlich oder rechtlich verbunden. Die Terminvergabe durch die Stadt Köln ist kostenlos. Das Entgelt nach § 4 wird ausschließlich für die Suche und Buchung des Termins erhoben.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 3 Vertragsschluss</h2>
        <p className="mt-2">(1) Die Darstellung des Dienstes auf der Website und in Anzeigen stellt kein verbindliches Angebot dar.</p>
        <p className="mt-2">(2) Der Vertrag kommt zustande, indem der Kunde das Buchungsformular ausfüllt, die Zahlungspflicht durch Klick auf den entsprechenden Button bestätigt und die Zahlung erfolgreich abschließt. Der Kunde erhält anschließend eine Bestätigung per E-Mail.</p>
        <p className="mt-2">(3) Über Nachrichten auf Kleinanzeigen werden keine Verträge geschlossen.</p>
        <p className="mt-2">(4) Eingabefehler kann der Kunde vor Abschluss der Zahlung korrigieren. Vertragssprache ist Deutsch.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 4 Preise und Zahlung</h2>
        <p className="mt-2">(1) Der Preis für die Terminbuchung beträgt 9,99 € pro Auftrag (Pauschalpreis). Der Preis ist ein Endpreis. Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.</p>
        <p className="mt-2">(2) Der Preis ist mit Vertragsschluss sofort fällig. Die Zahlung erfolgt über die angebotenen Zahlungsarten über Stripe.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 5 Mitwirkungspflichten des Kunden</h2>
        <p className="mt-2">(1) Der Kunde verpflichtet sich, alle für die Terminbuchung erforderlichen Daten vollständig und korrekt anzugeben.</p>
        <p className="mt-2">(2) Die Zulassungsstelle verlangt, dass ein gebuchter Termin innerhalb einer Frist bestätigt wird. Diese Frist beträgt derzeit drei Stunden. Der Kunde ist dafür verantwortlich, die Bestätigung rechtzeitig vorzunehmen.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 6 Leistungsumfang, keine Erfolgsgarantie</h2>
        <p className="mt-2">(1) Der Anbieter schuldet die sorgfältige Bemühung, einen Termin im vom Kunden angegebenen Zeitraum zu finden, nicht jedoch einen bestimmten Erfolg. Eine Garantie für die Verfügbarkeit eines Termins wird nicht übernommen. Sollte innerhalb des vom Kunden gewählten Zeitraums kein Termin gefunden werden können, erhält der Kunde auf Anfrage den gezahlten Betrag vollständig zurückerstattet (Geld-zurück-Garantie).</p>
        <p className="mt-2">(2) Die Dienstleistung gilt als vollständig erbracht, sobald der Anbieter im Namen des Kunden einen Termin bei der Kfz-Zulassungsstelle gebucht und der Kunde eine Buchungs- bzw. Bestätigungs-E-Mail der Zulassungsstelle erhalten hat. Ob der Kunde den gebuchten Termin anschließend wahrnimmt oder eine zusätzliche Bestätigung innerhalb der Wahrnehmungsfrist abgibt, ist für die Leistungserbringung unerheblich.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 7 Widerrufsrecht für Verbraucher</h2>
        <p className="mt-2">(1) Die Einzelheiten zum Widerrufsrecht ergeben sich aus der gesonderten <Link to="/widerrufsbelehrung" className="text-accent underline">Widerrufsbelehrung</Link> samt Muster-Widerrufsformular.</p>
        <p className="mt-2">(2) Der Anbieter beginnt vor Ablauf der Widerrufsfrist nur dann mit der Dienstleistung, wenn der Kunde im Buchungsformular ausdrücklich folgende Erklärung abgibt:</p>
        <p className="mt-2 border-l-2 border-accent pl-4 italic">„Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB).“</p>
        <p className="mt-2">(3) Mit dieser Zustimmung und der vollständigen Erbringung der Dienstleistung durch den Anbieter erlischt das Widerrufsrecht des Kunden gemäß § 356 Abs. 4 BGB.</p>
        <p className="mt-2">(4) Widerruft der Kunde den Vertrag nach Erteilung der Zustimmung gemäß Abs. 2, bevor die Dienstleistung vollständig erbracht wurde, ist er gemäß § 357a Abs. 2 BGB verpflichtet, für die bis zum Zugang der Widerrufserklärung anteilig bereits erbrachten Leistungen einen angemessenen Betrag zu zahlen.</p>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li><strong>Widerruf vor Beginn der Terminsuche:</strong> vollständige Rückerstattung des gezahlten Betrags.</li>
          <li><strong>Widerruf während laufender Suche (noch kein Termin gebucht):</strong> Rückerstattung abzüglich eines angemessenen Betrags für die bis zum Widerruf bereits erbrachte Sucharbeit. Dieser Betrag wird zeitanteilig im Verhältnis zum vereinbarten Gesamtpreis und zum bis dahin betriebenen Aufwand bemessen.</li>
          <li><strong>Widerruf nach vollständiger Erbringung:</strong> Das Widerrufsrecht ist erloschen; eine Rückerstattung erfolgt nicht.</li>
        </ul>
        <p className="mt-2">(5) Rückzahlungen erfolgen unverzüglich, spätestens binnen vierzehn Tagen, über das ursprünglich verwendete Zahlungsmittel.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 8 Haftung</h2>
        <p className="mt-2">Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vertragstypischen, vorhersehbaren Schaden, maximal auf den Gegenwert der erbrachten Leistung. Eine Haftung für entgangene Termine oder mittelbare Folgeschäden ist im Rahmen der gesetzlichen Möglichkeiten ausgeschlossen.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 9 Verbraucherstreitbeilegung</h2>
        <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 10 Schlussbestimmungen</h2>
        <p className="mt-2">(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl nur, soweit dadurch der Schutz zwingender Bestimmungen des Staates des gewöhnlichen Aufenthalts des Verbrauchers nicht entzogen wird.</p>
        <p className="mt-2">(2) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
      </section>
    </LegalPage>
  ),
});