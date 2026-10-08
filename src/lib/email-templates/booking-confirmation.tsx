import {
  Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Hr,
  Row, Column,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'KFZ-Termin Köln'
const CONTACT_EMAIL = 'info@kfz-termin.online'
const OPERATOR_NAME = 'Eike Hoffmann'

interface BookingConfirmationProps {
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  finEnding?: string
  finEndings?: string[]
  notes?: string
  selectedDates?: string[]
}

const BookingConfirmationEmail = ({
  salutation,
  firstName,
  lastName,
  email,
  phone,
  serviceType,
  finEnding,
  finEndings,
  notes,
  selectedDates = [],
}: BookingConfirmationProps) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const fins = (finEndings && finEndings.length > 0)
    ? finEndings
    : (finEnding ? [finEnding] : [])
  const finLabel = fins.length > 1
    ? `FIN-Endungen (${fins.length} Fahrzeuge)`
    : 'FIN (letzte 4 Ziffern)'
  const finValue = fins.length > 0 ? fins.join(', ') : '—'
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Deine Buchung bei {SITE_NAME} ist bestätigt</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>{SITE_NAME}</Text>
          <Heading style={h1}>Buchungsbestätigung</Heading>
          <Hr style={topRule} />

          <Text style={text}>
            {fullName ? `Hallo ${fullName},` : 'Hallo,'}
          </Text>
          <Text style={text}>
            vielen Dank für deine Buchung. Deine Zahlung ist eingegangen und
            wir haben deinen Auftrag erhalten. Wir beginnen ab sofort mit der
            Terminsuche bei der Kölner Zulassungsstelle.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>🕐 So läuft es ab</Text>
            <Text style={infoText}>
              Sobald wir einen passenden Termin gefunden haben, bekommst du
              zwei E-Mails: eine von uns mit Datum und Uhrzeit und eine von
              der Zulassungsstelle mit einem Bestätigungslink.{" "}
              <strong>
                Du hast dann 3 Stunden Zeit, den Termin über diesen Link
                zu bestätigen
              </strong>{" "}
              – andernfalls verfällt er unwiderruflich.
            </Text>
            <Text style={infoText}>
              <strong>Wichtig:</strong> Schau in dieser Zeit bitte auch in
              deine Ordner Spam und Werbung. Automatische E-Mails landen dort
              manchmal.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Deine Angaben</Text>
            <DataRow label="Name" value={fullName || '—'} />
            <DataRow label="E-Mail" value={email || '—'} />
            <DataRow label="Telefon" value={phone || '—'} />
            <DataRow label="Service" value={serviceType || '—'} />
            <DataRow label={finLabel} value={finValue} />
            {notes ? <DataRow label="Anmerkungen" value={notes} last /> : null}
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Gewünschte Termine</Text>
            {selectedDates.length > 0 ? (
              selectedDates.map((d) => (
                <Text key={d} style={dateLine}>📅 {d}</Text>
              ))
            ) : (
              <Text style={dateLine}>—</Text>
            )}
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Zahlung</Text>
            <DataRow label="Betrag" value="9,99 €" />
            <DataRow
              label="Umsatzsteuer"
              value="Keine USt. gem. § 19 UStG"
              last
            />
            <Text style={cardFootnote}>
              Die Zahlungsquittung erhältst du separat per E-Mail von Stripe.
            </Text>
          </Section>

          <Section style={warnBox}>
            <Text style={warnTitle}>⚠️ Bitte prüfe deine Angaben</Text>
            <Text style={warnText}>
              Sollten Name, E-Mail oder eine der FIN nicht korrekt sein, kann die
              Bestätigung der Zulassungsstelle dich nicht erreichen. Antworte
              in diesem Fall einfach auf diese E-Mail.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Widerrufsbelehrung</Text>
            <Text style={text}>
              Du hast vor der Buchung ausdrücklich verlangt, dass wir vor Ablauf der Widerrufsfrist mit der Terminsuche beginnen, und bestätigt, dass dein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt.
            </Text>
            <Text style={legalTitle}>Widerrufsbelehrung</Text>
            <Text style={text}>für Verträge über die automatisierte Terminsuche und -buchung bei der Kfz-Zulassungsstelle Köln (kfz-termin.online)</Text>
            <Text style={text}><strong>Stand: Oktober 2026</strong></Text>
            <Text style={legalHeading}>Widerrufsrecht</Text>
            <Text style={text}>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</Text>
            <Text style={text}>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</Text>
            <Text style={text}>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</Text>
            <Text style={text}>Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />Telefon: 0151 53461798<br />E-Mail: <Link href={`mailto:${CONTACT_EMAIL}`} style={emailLink}>{CONTACT_EMAIL}</Link></Text>
            <Text style={text}>mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</Text>
            <Text style={text}>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</Text>
            <Text style={legalHeading}>Folgen des Widerrufs</Text>
            <Text style={text}>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</Text>
            <Text style={text}>Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</Text>
            <Text style={legalHeading}>Besondere Hinweise</Text>
            <Text style={text}>Ihr Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren (§ 356 Abs. 4 BGB).</Text>
            <Text style={text}>Die Dienstleistung ist vollständig erbracht, sobald wir in Ihrem Namen einen Termin bei der Kfz-Zulassungsstelle gebucht haben und Sie die Buchungs- bzw. Bestätigungs-E-Mail der Zulassungsstelle erhalten haben.</Text>

            <Section style={withdrawalForm}>
              <Text style={legalHeading}>Muster-Widerrufsformular</Text>
              <Text style={formText}>(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</Text>
              <Text style={formText}>An:<br />Eike Hoffmann<br />KFZ-Termin Köln<br />Longericher Str. 31<br />50739 Köln<br />E-Mail: {CONTACT_EMAIL}</Text>
              <Text style={formText}>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>Bestellt am (*) / erhalten am (*):</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>Name des/der Verbraucher(s):</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>Anschrift des/der Verbraucher(s):</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>Datum:</Text>
              <Text style={formLine}>________________________________________</Text>
              <Text style={formText}>(*) Unzutreffendes streichen.</Text>
            </Section>

            <Text style={contactLine}>
              Unsere AGB: <Link href="https://kfz-termin.online/agb" style={emailLink}>kfz-termin.online/agb</Link>
            </Text>
          </Section>

          <Text style={footerHint}>
            Bei Fragen antworte einfach auf diese E-Mail.
          </Text>
          <Text style={footerEmail}>{CONTACT_EMAIL}</Text>

          <Text style={footer}>
            Herzliche Grüße<br />Dein Team von {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const DataRow = ({
  label,
  value,
  last,
}: {
  label: string
  value: string
  last?: boolean
}) => (
  <>
    <Row>
      <Column style={labelCol}>
        <Text style={label1}>{label}</Text>
      </Column>
      <Column style={valueCol}>
        <Text style={value1}>{value}</Text>
      </Column>
    </Row>
    {!last ? <Hr style={hr} /> : null}
  </>
)

export const template = {
  component: BookingConfirmationEmail,
  subject: 'Deine Buchung bei KFZ-Termin Köln ist bestätigt',
  displayName: 'Buchungsbestätigung (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 151 12345678',
    serviceType: 'Gebrauchtwagen anmelden',
    finEndings: ['1234', '9X2P'],
    notes: 'Bitte möglichst vormittags.',
    selectedDates: ['Mo, 25.05.2026 – vormittags', 'Di, 26.05.2026 – nachmittags'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const eyebrow = {
  fontSize: '12px', fontWeight: 600 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 8px',
}
const h1 = { fontSize: '28px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 16px', letterSpacing: '-0.02em' }
const topRule = { borderColor: '#e5e7eb', margin: '0 0 24px' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }

const infoBox = {
  backgroundColor: '#eaf2ff', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', borderLeft: '3px solid #1a4fa3',
}
const infoTitle = { fontSize: '14px', fontWeight: 700 as const, color: '#1a4fa3', margin: '0 0 8px' }
const infoText = { fontSize: '14px', color: '#1a4fa3', lineHeight: '1.6', margin: 0 }

const card = {
  backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '20px 22px', margin: '20px 0',
  border: '1px solid #eceff3',
}
const cardTitle = {
  fontSize: '12px', fontWeight: 700 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 14px',
}
const cardFootnote = { fontSize: '13px', color: '#6b7280', margin: '14px 0 0', lineHeight: '1.5' }

const labelCol = { width: '40%', verticalAlign: 'top' as const, paddingRight: '12px' }
const valueCol = { width: '60%', verticalAlign: 'top' as const }
const label1 = { fontSize: '14px', color: '#6b7280', margin: '0', lineHeight: '1.5' }
const value1 = { fontSize: '14px', color: '#1a2540', margin: '0', fontWeight: 500 as const, lineHeight: '1.5' }
const hr = { borderColor: '#e5e7eb', margin: '10px 0' }

const dateLine = { fontSize: '14px', color: '#1a2540', margin: '0 0 8px', fontWeight: 500 as const }

const warnBox = {
  backgroundColor: '#fef3c7', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', border: '1px solid #fde68a',
}
const warnTitle = { fontSize: '14px', fontWeight: 700 as const, color: '#78350f', margin: '0 0 8px' }
const warnText = { fontSize: '14px', color: '#78350f', lineHeight: '1.6', margin: 0 }

const contactLine = { fontSize: '14px', color: '#1a2540', margin: '8px 0 0' }
const legalTitle = { fontSize: '18px', fontWeight: 700 as const, color: '#1a2540', margin: '24px 0 8px' }
const legalHeading = { fontSize: '15px', fontWeight: 700 as const, color: '#1a2540', margin: '18px 0 8px' }
const withdrawalForm = { backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '16px', margin: '20px 0' }
const formText = { fontSize: '13px', color: '#374151', lineHeight: '1.55', margin: '0 0 12px' }
const formLine = { fontSize: '13px', color: '#374151', lineHeight: '1.4', margin: '0 0 12px', wordBreak: 'break-all' as const }
const emailLink = { color: '#1a4fa3', textDecoration: 'underline' }

const footerHint = { fontSize: '14px', color: '#374151', margin: '24px 0 4px' }
const footerEmail = { fontSize: '14px', color: '#1a2540', margin: '0 0 24px', fontWeight: 500 as const }
const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }
