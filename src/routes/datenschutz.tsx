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
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://kfz-termin.online/datenschutz" }],
  }),
  component: () => (
    <LegalPage title="Datenschutzerklärung">
      <section>
        <h2 className="text-lg font-semibold">1. Verantwortlicher</h2>
        <p className="mt-2">
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
          Eike Hoffmann<br />
          Longericher Str. 31<br />
          50739 Köln<br />
          E-Mail:{" "}
          <a className="text-accent underline" href="mailto:eike@jeh-digital.de">
            eike@jeh-digital.de
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">2. Allgemeines zur Datenverarbeitung</h2>
        <p className="mt-2">
          Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
          Bereitstellung einer funktionsfähigen Website sowie unserer Leistungen erforderlich ist.
          Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers oder auf Grundlage
          einer gesetzlichen Erlaubnis.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">3. Bereitstellung der Website und Server-Logfiles</h2>
        <p className="mt-2">
          Beim Aufruf unserer Website werden technisch notwendige Daten (z. B. IP-Adresse, Datum
          und Uhrzeit des Zugriffs, aufgerufene Seite, User-Agent) verarbeitet. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren und stabilen
          Bereitstellung).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">4. Hosting</h2>
        <p className="mt-2">
          Diese Website wird auf der Infrastruktur von Lovable (inkl. Lovable Cloud) gehostet.
          Anbieter ist Lovable AB, Schweden. Hierbei werden die unter Punkt 3 genannten Daten
          verarbeitet sowie die im Buchungsprozess eingegebenen Daten in einer Datenbank
          gespeichert. Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung gemäß
          Art. 28 DSGVO.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">5. Buchung eines Termins</h2>
        <p className="mt-2">
          Im Rahmen der Buchung erheben wir die zur Vertragsdurchführung erforderlichen Daten
          (z. B. Name, E-Mail-Adresse, ggf. Telefonnummer, gewünschter Zeitraum, Anliegen,
          Fahrzeugdaten). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die
          Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung nicht
          mehr erforderlich sind, vorbehaltlich gesetzlicher Aufbewahrungspflichten (insb. § 147
          AO, § 257 HGB).
        </p>
        <p className="mt-2">
          Die Telefonnummer wird ausschließlich genutzt, um den Kunden per SMS über einen
          gefundenen Termin zu informieren und rechtzeitig an die erforderliche Bestätigung des
          Termins zu erinnern. Eine Weitergabe der Telefonnummer an Dritte erfolgt nicht.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">6. Zahlungsabwicklung über Stripe</h2>
        <p className="mt-2">
          Für die Zahlungsabwicklung nutzen wir Stripe Payments Europe, Ltd., 1 Grand Canal
          Street Lower, Grand Canal Dock, Dublin, Irland. Bei einer Zahlung werden die für die
          Zahlung erforderlichen Daten (z. B. Name, E-Mail-Adresse, Zahlungsinformationen) direkt
          an Stripe übermittelt. Stripe ist eigenverantwortlich für die Zahlungsverarbeitung.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Weitere Informationen:{" "}
          <a
            className="text-accent underline"
            href="https://stripe.com/de/privacy"
            target="_blank"
            rel="noreferrer"
          >
            stripe.com/de/privacy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">7. E-Mail-Versand</h2>
        <p className="mt-2">
          Zur Versendung von Buchungsbestätigungen und transaktionalen E-Mails (Absender:
          buchung@kfz-termin.online) verarbeiten wir deine E-Mail-Adresse sowie die zur Buchung
          gehörenden Daten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Für allgemeine
          Anfragen erreichst du uns unter info@kfz-termin.online.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">8. Kontaktaufnahme via WhatsApp</h2>
        <p className="mt-2">
          Auf unserer Website findest du einen Button, der einen Chat über WhatsApp mit uns
          startet. Sofern du diese Funktion nutzt, wirst du auf den Dienst WhatsApp Ireland
          Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland, weitergeleitet.
          Die Datenverarbeitung im WhatsApp-Chat erfolgt durch WhatsApp/Meta nach deren
          Datenschutzbestimmungen. Wir verarbeiten deine über WhatsApp übermittelten Nachrichten
          und Kontaktdaten ausschließlich zur Beantwortung deiner Anfrage (Art. 6 Abs. 1 lit. b
          bzw. lit. f DSGVO). Weitere Informationen:{" "}
          <a
            className="text-accent underline"
            href="https://www.whatsapp.com/legal/privacy-policy-eea"
            target="_blank"
            rel="noreferrer"
          >
            whatsapp.com/legal/privacy-policy-eea
          </a>
          . Bitte beachte, dass WhatsApp-Nachrichten ggf. in Drittländer übertragen werden
          können.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">9. Cookies & Einwilligung</h2>
        <p className="mt-2">
          Wir setzen technisch notwendige Cookies bzw. lokalen Speicher ein, die für den Betrieb
          der Website und der Buchungsfunktion erforderlich sind (Rechtsgrundlage § 25 Abs. 2 Nr. 2
          TDDDG i. V. m. Art. 6 Abs. 1 lit. f DSGVO). Darüber hinaus verwenden wir Analyse- und
          Marketing-Dienste ausschließlich auf Grundlage deiner Einwilligung gemäß § 25 Abs. 1
          TDDDG i. V. m. Art. 6 Abs. 1 lit. a DSGVO. Beim ersten Besuch der Website fragen wir dich
          über ein Consent-Banner nach deiner Einwilligung. Du kannst deine Auswahl jederzeit über
          den Link „Cookie-Einstellungen" im Footer ändern oder widerrufen. Die Rechtmäßigkeit der
          bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">10. Google Tag Manager</h2>
        <p className="mt-2">
          Bei erteilter Einwilligung in die Kategorie „Analyse" oder „Marketing" setzen wir den
          Google Tag Manager (GTM) der Google Ireland Limited, Gordon House, Barrow Street,
          Dublin 4, Irland, ein. Container-ID: GTM-KJPNQMXH. Der Google Tag Manager dient
          ausschließlich der zentralen Verwaltung der von uns eingesetzten Tags (z. B. Google
          Analytics 4) und setzt selbst keine Cookies, die personenbezogene Daten speichern. Beim
          Laden des Skripts wird jedoch deine IP-Adresse an Google übermittelt; die Übertragung
          kann auch in die USA erfolgen. Google LLC ist nach dem EU-US Data Privacy Framework
          zertifiziert; ergänzend bestehen Standardvertragsklauseln gemäß Art. 46 DSGVO.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO bzw. § 25 Abs. 1 TDDDG. Widerruf jederzeit
          über die Cookie-Einstellungen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">11. Google Analytics 4</h2>
        <p className="mt-2">
          Bei erteilter Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der
          Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Mess-ID:
          G-NQXH96FZW3. Google Analytics verwendet Cookies (z. B. <code>_ga</code>, <code>_ga_*</code>),
          die eine Analyse der Benutzung der Website ermöglichen. Wir nutzen die IP-Anonymisierung,
          sodass deine IP-Adresse vor jeder weiteren Verarbeitung gekürzt wird.
          Die Daten werden u. a. an Server von Google in den USA übertragen; Google LLC ist nach dem
          EU-US Data Privacy Framework zertifiziert. Ergänzend bestehen Standardvertragsklauseln
          gemäß Art. 46 DSGVO. Speicherdauer der Analyse-Cookies max. 14 Monate. Rechtsgrundlage:
          Art. 6 Abs. 1 lit. a DSGVO. Widerruf jederzeit über die Cookie-Einstellungen oder per
          Browser-Add-on:{" "}
          <a
            className="text-accent underline"
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noreferrer"
          >
            tools.google.com/dlpage/gaoptout
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">12. Hotjar</h2>
        <p className="mt-2">
          Bei erteilter Einwilligung nutzen wir Hotjar, einen Analyse-Dienst der Hotjar Ltd., Level
          2, St Julians Business Centre, 3, Elia Zammit Street, St Julians STJ 1000, Malta
          (Site-ID 6719467). Hotjar erfasst Nutzungsverhalten (Mausbewegungen, Klicks, Scrolltiefe)
          und erstellt daraus Heatmaps und pseudonymisierte Session-Aufzeichnungen, um die
          Benutzerfreundlichkeit zu verbessern. Es werden Cookies mit dem Präfix <code>_hj*</code>
          gesetzt. Tastatureingaben in Eingabefelder werden standardmäßig unterdrückt. Die
          Verarbeitung erfolgt innerhalb der EU. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
          Widerruf jederzeit über die Cookie-Einstellungen oder hier:{" "}
          <a
            className="text-accent underline"
            href="https://www.hotjar.com/legal/compliance/opt-out"
            target="_blank"
            rel="noreferrer"
          >
            hotjar.com/legal/compliance/opt-out
          </a>
          . Weitere Informationen:{" "}
          <a
            className="text-accent underline"
            href="https://www.hotjar.com/legal/policies/privacy"
            target="_blank"
            rel="noreferrer"
          >
            hotjar.com/legal/policies/privacy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">13. Google Ads – Conversion-Import aus Google Analytics 4</h2>
        <p className="mt-2">
          Für die Messung unserer Werbeanzeigen bei Google Ads importieren wir Conversions
          direkt aus Google Analytics 4 (Mess-ID G-NQXH96FZW3). Auf unserer Website wird dafür
          kein eigenes Google Ads Conversion-Tag eingesetzt. Die erforderlichen Daten zur
          Erfolgsmessung stammen aus den unter § 11 genannten Google Analytics 4-Cookies und
          werden ausschließlich auf Grundlage deiner Einwilligung in die Kategorie
          „Marketing" verarbeitet (Art. 6 Abs. 1 lit. a DSGVO). Widerruf jederzeit über die
          Cookie-Einstellungen.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">14. Deine Rechte</h2>
        <p className="mt-2">
          Dir stehen folgende Rechte zu: Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
          (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertrag-
          barkeit (Art. 20), Widerspruch (Art. 21) sowie das Recht zum Widerruf erteilter
          Einwilligungen (Art. 7 Abs. 3). Zudem hast du das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">14. Speicherdauer</h2>
        <p className="mt-2">
          Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt und
          keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Abrechnungsrelevante Daten
          werden bis zu 10 Jahre aufbewahrt (§ 147 AO).
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Stand: Mai 2026</p>
      </section>
    </LegalPage>
  ),
});
