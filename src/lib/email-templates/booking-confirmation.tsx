import {
  Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Hr,
  Row, Column,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BookingNumberLine, WithdrawLinkLine } from './customer-email-parts'
import { formatDayLong, locationsText } from './customer-email-parts'

import { cityOrDefault, referenceLabelOf, authorityOf } from '../cities'
import { WITHDRAWAL_SCOPE, WITHDRAWAL_STAND, WITHDRAWAL_COMPLETED } from '../../content/legal/withdrawal'
import { formatPrice, vatMailValue } from '../price'
const CONTACT_EMAIL = 'info@kfz-termin.online'

interface BookingConfirmationProps {
  bookingId?: string
  withdrawToken?: string | null
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
  city?: string | null
  locations?: string[] | null
  financed?: boolean | null
  vehicleCount?: number | null
  /** Tatsächlich berechneter Betrag dieser Buchung (Cent). */
  amountCents?: number | null
  /** Buchungszeitpunkt – bestimmt den USt-Hinweis. */
  createdAt?: string | null
}

const BookingConfirmationEmail = ({ bookingId, withdrawToken,
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
  city,
  locations,
  vehicleCount,
  amountCents,
  createdAt,
}: BookingConfirmationProps) => {
  const c = cityOrDefault(city)
  const SITE_NAME = c.siteName
  const hours = c.customerConfirmationHours
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
          <BookingNumberLine bookingId={bookingId} />

          <Text style={text}>
            {firstName ? `Hallo ${firstName},` : 'Hallo,'}
          </Text>
          <Text style={text}>
            {`vielen Dank für deine Buchung. Deine Zahlung ist eingegangen und wir haben deinen Auftrag erhalten. Wir beginnen ab sofort mit der Terminsuche ${c.mail.atAuthority}.`}
          </Text>

          {hours == null ? (
          <Section style={infoBox}>
            <Text style={infoTitle}>🕐 So läuft es ab</Text>
            <Text style={infoText}>
              {`Sobald wir einen passenden Termin gebucht haben, bekommst du eine E-Mail von uns mit Datum, Uhrzeit, Standort und ${referenceLabelOf(c)}. Du musst den Termin nicht mehr bestätigen.`}
            </Text>
            <Text style={infoText}>
              Wir suchen rund um die Uhr. Behalte an deinen Wunschtagen dein E-Mail-Postfach im Blick.
            </Text>
            <Text style={infoText}>
              Wird an deinen Wunschtagen kein Termin frei, bekommst du von uns
              eine E-Mail: Du kannst dann einmalig neue Wunschtermine wählen
              oder dir den vollen Betrag erstatten lassen.
            </Text>
          </Section>
          ) : (
          <Section style={infoBox}>
            <Text style={infoTitle}>🕐 So läuft es ab</Text>
            <Text style={infoText}>
              Sobald wir einen passenden Termin gefunden haben, bekommst du
              zwei E-Mails: eine von uns mit Datum und Uhrzeit und eine von
              der {c.mail.authority} mit einem Bestätigungslink.{" "}
              {hours != null ? (
                <>
                  <strong>
                    {`Du hast dann ${hours} Stunden Zeit, den Termin über diesen Link zu bestätigen`}
                  </strong>{" "}
                  – andernfalls verfällt er unwiderruflich.
                </>
              ) : (
                <strong>Der Termin ist dann sofort verbindlich gebucht.</strong>
              )}
            </Text>
            <Text style={infoText}>
              <strong>Wichtig:</strong> Schau in dieser Zeit bitte auch in
              deine Ordner Spam und Werbung. Automatische E-Mails landen dort
              manchmal.
            </Text>
            <Text style={infoText}>
              Wird an deinen Wunschtagen kein Termin frei, bekommst du von uns
              eine E-Mail: Du kannst dann einmalig neue Wunschtermine wählen
              oder dir den vollen Betrag erstatten lassen.
            </Text>
          </Section>
          )}

          <Section style={card}>
            <Text style={cardTitle}>Deine Angaben</Text>
            <DataRow label="Name" value={fullName || '—'} />
            <DataRow label="E-Mail" value={email || '—'} />
            <DataRow label="Telefon" value={phone || '—'} />
            <DataRow label="Service" value={serviceType || '—'} />
            {c.form.finRequired ? (
              <DataRow label={finLabel} value={finValue} />
            ) : (
              <>
                {vehicleCount && vehicleCount > 1 ? <DataRow label="Fahrzeuge" value={String(vehicleCount)} /> : null}
                <DataRow label="Standorte" value={locationsText(c, locations)} />
              </>
            )}
            {notes ? <DataRow label="Anmerkungen" value={notes} last /> : null}
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Deine Wunschtermine</Text>
            {selectedDates.length > 0 ? (
              selectedDates.map((d) => (
                <Text key={d} style={dateLine}>📅 {formatDayLong(d)}</Text>
              ))
            ) : (
              <Text style={dateLine}>—</Text>
            )}
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Zahlung</Text>
            <DataRow label="Betrag" value={formatPrice(amountCents ?? 999)} />
            <DataRow
              label="Umsatzsteuer"
              value={vatMailValue(createdAt ? new Date(createdAt) : new Date())}
              last
            />
            <Text style={cardFootnote}>
              Die Zahlungsquittung erhältst du separat per E-Mail von Stripe.
            </Text>
          </Section>

          <Section style={warnBox}>
            <Text style={warnTitle}>⚠️ Bitte prüfe deine Angaben</Text>
            <Text style={warnText}>
              {c.form.finRequired ? (<>
              Sollten Name, E-Mail oder eine der FIN nicht korrekt sein, kann die
              Bestätigung der {c.mail.authority} dich nicht erreichen. Antworte
              in diesem Fall einfach auf diese E-Mail.</>) : (<>
              Sollten Name oder E-Mail nicht korrekt sein, erreicht dich die
              Bestätigung {authorityOf(c)} nicht. Antworte in diesem Fall einfach auf
              diese E-Mail.</>)}
            </Text>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Widerrufsbelehrung</Text>
            <Text style={text}>
              Du hast vor der Buchung ausdrücklich verlangt, dass wir vor Ablauf der Widerrufsfrist mit der Terminsuche beginnen, und bestätigt, dass dein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt.
            </Text>
            <Text style={text}>
              Den Widerruf kannst du auch online über die Funktion „Vertrag widerrufen“ unter{' '}
              <Link href="https://kfz-termin.online/widerruf" style={emailLink}>https://kfz-termin.online/widerruf</Link>{' '}
              erklären.
            </Text>
          </Section>

          <WithdrawLinkLine withdrawToken={withdrawToken} />

          <Text style={footerHint}>
            Bei Fragen antworte einfach auf diese E-Mail.
          </Text>
          <Text style={footerEmail}>{CONTACT_EMAIL}</Text>

          <Text style={footer}>
            Herzliche Grüße<br />Dein Team von {SITE_NAME}
          </Text>

          <Hr style={legalRule} />
          <Section>
            <Text style={legalSectionTitle}>Rechtliche Pflichtangaben</Text>
            <Text style={legalSmallHeading}>Widerrufsbelehrung</Text>
            <Text style={legalText}>{WITHDRAWAL_SCOPE}</Text>
            <Text style={legalText}><strong>{WITHDRAWAL_STAND}</strong></Text>
            <Text style={legalSmallHeading}>Widerrufsrecht</Text>
            <Text style={legalText}>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</Text>
            <Text style={legalText}>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</Text>
            <Text style={legalText}>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</Text>
            <Text style={legalText}>Eike Hoffmann<br />KFZ-Termin<br />Longericher Str. 31<br />50739 Köln<br />Telefon: 0151 53461798<br />E-Mail: <Link href={`mailto:${CONTACT_EMAIL}`} style={legalLink}>{CONTACT_EMAIL}</Link></Text>
            <Text style={legalText}>mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</Text>
            <Text style={legalText}>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</Text>
            <Text style={legalSmallHeading}>Folgen des Widerrufs</Text>
            <Text style={legalText}>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</Text>
            <Text style={legalText}>Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</Text>
            <Text style={legalSmallHeading}>Besondere Hinweise</Text>
            <Text style={legalText}>Ihr Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren (§ 356 Abs. 4 BGB).</Text>
            <Text style={legalText}>{WITHDRAWAL_COMPLETED}</Text>

            <Section>
              <Text style={legalSmallHeading}>Muster-Widerrufsformular</Text>
              <Text style={legalText}>(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</Text>
              <Text style={legalText}>An:<br />Eike Hoffmann<br />KFZ-Termin<br />Longericher Str. 31<br />50739 Köln<br />E-Mail: {CONTACT_EMAIL}</Text>
              <Text style={legalText}>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>Bestellt am (*) / erhalten am (*):</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>Name des/der Verbraucher(s):</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>Anschrift des/der Verbraucher(s):</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>Datum:</Text>
              <Text style={legalText}>________________________________________</Text>
              <Text style={legalText}>(*) Unzutreffendes streichen.</Text>
            </Section>

            <Text style={legalText}>
              Unsere AGB: <Link href="https://kfz-termin.online/agb" style={legalLink}>kfz-termin.online/agb</Link>
            </Text>
          </Section>
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
  subject: (d: Record<string, any>) => `Deine Buchung bei ${cityOrDefault(d.city).siteName} ist bestätigt`,
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
    selectedDates: ['2026-10-06', '2026-10-07'],
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
const emailLink = { color: '#1a4fa3', textDecoration: 'underline' }

const footerHint = { fontSize: '14px', color: '#374151', margin: '24px 0 4px' }
const footerEmail = { fontSize: '14px', color: '#1a2540', margin: '0 0 24px', fontWeight: 500 as const }
const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }

const legalText = { fontSize: '12px', lineHeight: '1.5', color: '#6b7280', margin: '0 0 8px' }
const legalSmallHeading = { fontSize: '12px', fontWeight: 700 as const, color: '#6b7280', margin: '12px 0 6px' }
const legalSectionTitle = { fontSize: '12px', fontWeight: 700 as const, color: '#6b7280', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const legalLink = { color: '#6b7280', textDecoration: 'underline' }
const legalRule = { borderColor: '#e5e7eb', margin: '32px 0 16px' }
