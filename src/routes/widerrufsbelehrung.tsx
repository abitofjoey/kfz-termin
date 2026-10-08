import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/widerrufsbelehrung")({
  head: () => ({
    meta: [
      { title: "Widerrufsbelehrung – KFZ-Termin Köln" },
      { name: "description", content: "Widerrufsbelehrung und Muster-Widerrufsformular von KFZ-Termin Köln." },
      { property: "og:title", content: "Widerrufsbelehrung – KFZ-Termin Köln" },
      { property: "og:description", content: "Widerrufsbelehrung und Muster-Widerrufsformular von KFZ-Termin Köln." },
      { property: "og:url", content: "https://kfz-termin.online/widerrufsbelehrung" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://kfz-termin.online/widerrufsbelehrung" }],
  }),
  component: () => (
    <LegalPage title="Widerrufsbelehrung">
      <p><strong>für Verträge über die automatisierte Terminsuche und -buchung bei der Kfz-Zulassungsstelle Köln (kfz-termin.online)</strong></p>
      <p><strong>Stand: Oktober 2026</strong></p>

      <section>
        <h2 className="text-lg font-semibold">Widerrufsrecht</h2>
        <p className="mt-2">Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p className="mt-2">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
        <p className="mt-2">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <p className="mt-2 pl-4">Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />Telefon: 0151 53461798<br />E-Mail: <a className="text-accent underline" href="mailto:info@kfz-termin.online">info@kfz-termin.online</a></p>
        <p className="mt-2">mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
        <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Folgen des Widerrufs</h2>
        <p className="mt-2">Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
        <p className="mt-2">Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Besondere Hinweise</h2>
        <p className="mt-2">Ihr Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren (§ 356 Abs. 4 BGB).</p>
        <p className="mt-2">Die Dienstleistung ist vollständig erbracht, sobald wir in Ihrem Namen einen Termin bei der Kfz-Zulassungsstelle gebucht haben und Sie die Buchungs- bzw. Bestätigungs-E-Mail der Zulassungsstelle erhalten haben.</p>
      </section>

      <section className="rounded-md border border-border bg-muted p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Muster-Widerrufsformular</h2>
        <p className="mt-2">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
        <p className="mt-4">An:<br />Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />E-Mail: <a className="text-accent underline" href="mailto:info@kfz-termin.online">info@kfz-termin.online</a></p>
        <p className="mt-4">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">Bestellt am (*) / erhalten am (*):</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">Name des/der Verbraucher(s):</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">Anschrift des/der Verbraucher(s):</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">Datum:</p>
        <p className="mt-3 break-all">____________________________________________________________</p>
        <p className="mt-4">(*) Unzutreffendes streichen.</p>
      </section>
    </LegalPage>
  ),
});