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
        <p className="mt-2">
          (4) Nach erfolgreicher Terminbuchung sendet der Anbieter dem Kunden eine Erinnerung
          per E-Mail und SMS an die im Formular angegebenen Kontaktdaten. Dies dient
          ausschließlich dazu, den Kunden rechtzeitig auf die erforderliche Bestätigung des
          Termins bei der Kfz-Zulassungsstelle hinzuweisen.
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
          Der Anbieter schuldet die sorgfältige Bemühung, einen Termin im vom
          Kunden angegebenen Zeitraum zu finden, nicht jedoch einen bestimmten
          Erfolg. Eine Garantie für die Verfügbarkeit eines Termins wird nicht
          übernommen, da die Verfügbarkeit allein von der Stadt Köln abhängt.
          Sollte innerhalb des vom Kunden gewählten Zeitraums kein Termin
          gefunden werden können, erhält der Kunde den gezahlten Betrag
          vollständig zurückerstattet (Geld-zurück-Garantie).
        </p>
        <p className="mt-2">
          <strong>Vollständige Leistungserbringung.</strong> Die Dienstleistung gilt als
          vollständig erbracht, sobald der Anbieter im Namen des Kunden einen Termin bei der
          Kfz-Zulassungsstelle gebucht und eine Buchungs- bzw. Bestätigungs-E-Mail der
          Zulassungsstelle erhalten hat. Ob der Kunde den gebuchten Termin anschließend
          wahrnimmt oder eine zusätzliche Bestätigung innerhalb der Wahrnehmungsfrist abgibt,
          ist für die Leistungserbringung unerheblich.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">§ 7 Widerrufsrecht für Verbraucher</h2>
        <p className="mt-2">
          <strong>Widerrufsbelehrung.</strong> Du hast das Recht, binnen vierzehn Tagen ohne
          Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
          Tage ab dem Tag des Vertragsschlusses. Um dein Widerrufsrecht auszuüben, musst du uns
          (Eike Hoffmann, E-Mail: info@kfz-termin.online) mittels einer eindeutigen Erklärung (z. B.
          per E-Mail) über deinen Entschluss informieren.
        </p>
        <p className="mt-2">
          <strong>Vorzeitiger Beginn der Dienstleistung und Erlöschen des Widerrufsrechts
          (§ 356 Abs. 4 BGB).</strong> Da die automatisierte Terminsuche zeitkritisch ist und der
          Kunde regelmäßig einen möglichst schnellen Termin wünscht, beginnt der Anbieter mit der
          Ausführung der Dienstleistung bereits vor Ablauf der Widerrufsfrist. Hierzu muss der
          Kunde im Buchungsformular vor Vertragsschluss durch Setzen eines Häkchens ausdrücklich
          die folgende Erklärung abgeben:
        </p>
        <p className="mt-2 pl-4 border-l-2 border-accent italic">
          „Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der
          Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung
          der Leistung erlischt (§ 356 Abs. 4 BGB)."
        </p>
        <p className="mt-2">
          Mit dieser Zustimmung und der vollständigen Erbringung der Dienstleistung durch den
          Anbieter erlischt das Widerrufsrecht des Kunden gemäß § 356 Abs. 4 BGB. Solange die
          Dienstleistung noch nicht vollständig erbracht ist, bleibt das Widerrufsrecht bestehen.
        </p>
        <p className="mt-2">
          <strong>Folgen des Widerrufs.</strong> Im Falle eines wirksamen Widerrufs werden die
          gezahlten Beträge unverzüglich, spätestens binnen vierzehn Tagen, zurückerstattet.
          Im Einzelnen gilt:
        </p>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>
            <strong>Widerruf vor Beginn der Terminsuche:</strong> vollständige Rückerstattung
            des gezahlten Betrags.
          </li>
          <li>
            <strong>Widerruf während laufender Suche (noch kein Termin gebucht):</strong>{" "}
            Rückerstattung abzüglich eines angemessenen Betrags für die bis zum Widerruf
            bereits erbrachte Sucharbeit (§ 357a Abs. 2 BGB). Dieser Betrag wird zeitanteilig
            im Verhältnis zum vereinbarten Gesamtpreis und zum bis dahin betriebenen Aufwand
            bemessen.
          </li>
          <li>
            <strong>Widerruf nach vollständiger Erbringung</strong> (Termin gebucht und
            Bestätigungs-E-Mail der Zulassungsstelle vorhanden, vgl. § 6): Das Widerrufsrecht
            ist gemäß § 356 Abs. 4 BGB erloschen; eine Rückerstattung erfolgt nicht.
          </li>
        </ul>
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
