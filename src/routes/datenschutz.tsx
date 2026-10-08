import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – KFZ-Termin Köln" },
      { name: "description", content: "Datenschutzerklärung von KFZ-Termin Köln." },
      { property: "og:title", content: "Datenschutz – KFZ-Termin Köln" },
      { property: "og:description", content: "Datenschutzerklärung von KFZ-Termin Köln." },
      { property: "og:url", content: "https://kfz-termin.online/datenschutz" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://kfz-termin.online/datenschutz" }],
  }),
  component: () => (
    <LegalPage title="Datenschutzerklärung">
      <p><strong>KFZ-Termin Köln · kfz-termin.online und Anzeigen auf Kleinanzeigen · Stand: Oktober 2026</strong></p>

      <section>
        <h2 className="text-lg font-semibold">1. Verantwortlicher</h2>
        <p className="mt-2">Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
        <p className="mt-2">Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />E-Mail: <a className="text-accent underline" href="mailto:info@kfz-termin.online">info@kfz-termin.online</a><br />Telefon: 0151 53461798</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">2. Allgemeines zur Datenverarbeitung</h2>
        <p className="mt-2">Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Leistungen erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers oder auf Grundlage einer gesetzlichen Erlaubnis.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">3. Kontaktaufnahme über Kleinanzeigen</h2>
        <p className="mt-2">Wenn du über Kleinanzeigen Kontakt mit uns aufnimmst, verarbeiten wir deinen dort verwendeten Nutzernamen, den Inhalt deiner Nachricht sowie gegebenenfalls von dir mitgeteilte Kontaktdaten. Die Verarbeitung erfolgt zur Anbahnung oder Durchführung eines Vertrags gemäß Art. 6 Abs. 1 lit. b DSGVO oder zur Beantwortung sonstiger Anfragen auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p className="mt-2">Für die Verarbeitung auf der Plattform Kleinanzeigen ist der Plattformbetreiber eigenständig verantwortlich. Weitere Informationen findest du in der <a className="text-accent underline" href="https://themen.kleinanzeigen.de/datenschutzerklaerung" target="_blank" rel="noreferrer">Datenschutzerklärung von Kleinanzeigen</a>. Die Buchung erfolgt ausschließlich über kfz-termin.online.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">4. Bereitstellung der Website und Server-Logfiles</h2>
        <p className="mt-2">Beim Aufruf unserer Website werden technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, User-Agent) verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren und stabilen Bereitstellung).</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">5. Hosting</h2>
        <p className="mt-2">Diese Website wird auf der Infrastruktur von Lovable (inkl. Lovable Cloud) gehostet. Anbieter ist Lovable AB, Schweden. Hierbei werden die unter Abschnitt 4 genannten Daten verarbeitet sowie die im Buchungsprozess eingegebenen Daten in einer Datenbank gespeichert. Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">6. Buchung eines Termins</h2>
        <p className="mt-2">Im Rahmen der Buchung erheben wir die zur Vertragsdurchführung erforderlichen Daten (z. B. Name, E-Mail-Adresse, ggf. Telefonnummer, gewünschter Zeitraum, Anliegen, Fahrzeugdaten). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung nicht mehr erforderlich sind, vorbehaltlich gesetzlicher Aufbewahrungspflichten (insb. § 147 AO, § 257 HGB).</p>
        <p className="mt-2">Die Telefonnummer übermitteln wir an die Stadt Köln (Abschnitt 7), weil das Buchungsportal sie verlangt, und nutzen sie für Rückfragen zu deinem Auftrag. Eine Weitergabe an sonstige Dritte erfolgt nicht. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Zur Speicherdauer siehe Abschnitt 17.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">7. Automatisierte Terminbuchung bei der Kölner Zulassungsstelle</h2>
        <p className="mt-2">Kern unseres Dienstes ist die automatisierte Suche und Buchung eines freien Termins im Online-Portal der Stadt Köln (Zulassungsstelle) in deinem Namen. Hierzu übermitteln wir Vor- und Nachname, E-Mail-Adresse, Telefonnummer, Anliegen sowie die letzten vier Stellen der Fahrzeug-Identifikationsnummer (FIN) an die Stadt Köln als eigenständig Verantwortliche. Rechtsgrundlage für die Übermittlung ist Art. 6 Abs. 1 lit. b DSGVO. Ohne diese Übermittlung kann der Dienst nicht erbracht werden.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">8. Zahlungsabwicklung über Stripe</h2>
        <p className="mt-2">Für die Zahlungsabwicklung nutzen wir Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland. Bei einer Zahlung werden die für die Zahlung erforderlichen Daten direkt an Stripe übermittelt. Stripe ist eigenverantwortlich für die Zahlungsverarbeitung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Weitere Informationen: <a className="text-accent underline" href="https://stripe.com/de/privacy" target="_blank" rel="noreferrer">stripe.com/de/privacy</a>.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">9. E-Mail-Versand und Kontakt per E-Mail</h2>
        <p className="mt-2">Zur Versendung von Buchungsbestätigungen und transaktionalen E-Mails (Absender: <a className="text-accent underline" href="mailto:buchung@kfz-termin.online">buchung@kfz-termin.online</a>) verarbeiten wir deine E-Mail-Adresse sowie die zur Buchung gehörenden Daten. Für allgemeine Anfragen erreichst du uns unter <a className="text-accent underline" href="mailto:info@kfz-termin.online">info@kfz-termin.online</a>. Für den E-Mail-Versand nutzen wir den verwalteten E-Mail-Dienst von Lovable Labs AB, Regeringsgatan 25, 111 53 Stockholm, Schweden. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO und im Rahmen einer Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">10. Kontaktaufnahme via WhatsApp</h2>
        <p className="mt-2">Auf unserer Website findest du einen Button, der einen Chat über WhatsApp mit uns startet. Anbieter ist WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. Wir verarbeiten deine über WhatsApp übermittelten Nachrichten und Kontaktdaten zur Beantwortung deiner Anfrage (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Weitere Informationen: <a className="text-accent underline" href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noreferrer">whatsapp.com/legal/privacy-policy-eea</a>. Bitte beachte, dass Daten gegebenenfalls in Drittländer übertragen werden.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">11. Cookies &amp; Einwilligung</h2>
        <p className="mt-2">Wir setzen technisch notwendige Cookies bzw. lokalen Speicher ein, die für den Betrieb der Website und der Buchungsfunktion erforderlich sind (§ 25 Abs. 2 Nr. 2 TDDDG). Analyse- und Marketing-Dienste verwenden wir nur mit deiner Einwilligung gemäß § 25 Abs. 1 TDDDG. Beim ersten Besuch fragen wir dich über ein Consent-Banner nach deiner Einwilligung. Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern oder widerrufen.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">12. Google Tag Manager</h2>
        <p className="mt-2">Bei erteilter Einwilligung setzen wir den Google Tag Manager der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, ein. Container-ID: GTM-KJPNQMXH. Beim Laden des Skripts kann deine IP-Adresse an Google übermittelt werden; die Übertragung kann auch in die USA erfolgen. Google LLC ist nach dem EU-US Data Privacy Framework zertifiziert; ergänzend bestehen Standardvertragsklauseln. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO bzw. § 25 Abs. 1 TDDDG.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">13. Google Analytics 4</h2>
        <p className="mt-2">Bei erteilter Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Mess-ID: G-NQXH96FZW3. Google Analytics verwendet Cookies zur Analyse der Benutzung der Website. Wir nutzen die IP-Anonymisierung. Daten können an Server von Google in den USA übertragen werden; Google LLC ist nach dem EU-US Data Privacy Framework zertifiziert, ergänzend bestehen Standardvertragsklauseln. Die Speicherung beträgt maximal 14 Monate. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">14. Hotjar</h2>
        <p className="mt-2">Bei erteilter Einwilligung nutzen wir Hotjar, einen Dienst der Hotjar Ltd., Level 2, St Julians Business Centre, 3, Elia Zammit Street, St Julians STJ 1000, Malta. Site-ID: 6719467. Hotjar setzt Cookies mit dem Präfix <code>_hj*</code> und erfasst Nutzungsverhalten. Tastatureingaben in Eingabefelder werden unterdrückt. Die Verarbeitung erfolgt innerhalb der EU. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">15. Google Ads – Conversion-Import aus Google Analytics 4</h2>
        <p className="mt-2">Für die Messung unserer Werbeanzeigen bei Google Ads importieren wir Conversions direkt aus Google Analytics 4 (Mess-ID G-NQXH96FZW3). Auf unserer Website wird dafür kein eigenes Google Ads Conversion-Tag eingesetzt. Die Verarbeitung erfolgt nur mit deiner Marketing-Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">16. Deine Rechte</h2>
        <p className="mt-2">Dir stehen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht zum Widerruf erteilter Einwilligungen zu. Zudem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen: <a className="text-accent underline" href="https://www.ldi.nrw.de" target="_blank" rel="noreferrer">www.ldi.nrw.de</a>.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">17. Speicherdauer</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li><strong>FIN, Telefonnummer, Wunschtermine und Notizen:</strong> Anonymisierung 90 Tage nach dem spätesten Wunschtermin.</li>
          <li><strong>Rechnungs- und Zahlungsdaten:</strong> Aufbewahrung für 10 Jahre gemäß § 147 AO / § 257 HGB.</li>
          <li><strong>Widerrufserklärungen:</strong> zusammen mit den Buchungsdaten bis zum Ablauf der Verjährungsfristen.</li>
          <li><strong>Kleinanzeigen-Nachrichten:</strong> Löschung nach Abschluss der Anfrage bzw. Vertragsabwicklung, sofern keine gesetzlichen Pflichten entgegenstehen.</li>
          <li><strong>Unsubscribe-Sperrliste:</strong> solange erforderlich, um den Widerspruch dauerhaft zu beachten.</li>
          <li><strong>Server-Logfiles und Analyse-Cookies:</strong> siehe die jeweiligen Abschnitte oben.</li>
        </ul>
      </section>
    </LegalPage>
  ),
});