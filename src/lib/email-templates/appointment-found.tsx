import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
  Row, Column, Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { formatBerlinLong, formatBerlinTime } from './format-berlin'

const SITE_NAME = 'KFZ-Termin Köln'
const CONTACT_EMAIL = 'info@kfz-termin.online'
const LOCATION = 'Kfz-Zulassungsstelle, Max-Glomsda-Str. 4, 51105 Köln'
const CITY_URL = 'https://www.stadt-koeln.de/service/adressen/00205/index.html'

interface AppointmentFoundProps {
  salutation?: string
  firstName?: string
  lastName?: string
  serviceType?: string
  appointmentAt?: string
  foundAt?: string
}

const AppointmentFoundEmail = ({
  salutation, firstName, lastName, serviceType, appointmentAt, foundAt,
}: AppointmentFoundProps) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const deadline = formatBerlinTime(foundAt, 3)
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wir haben deinen Termin gefunden – jetzt bestätigen</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>{SITE_NAME}</Text>
          <Heading style={h1}>Termin gefunden!</Heading>
          <Hr style={topRule} />

          <Text style={text}>{fullName ? `Hallo ${fullName},` : 'Hallo,'}</Text>
          <Text style={text}>
            gute Nachrichten: Wir haben einen Termin bei der Kölner
            Zulassungsstelle für dich gefunden und auf deinen Namen reserviert.
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>Dein Termin</Text>
            <DataRow label="Datum und Uhrzeit" value={formatBerlinLong(appointmentAt)} />
            <DataRow label="Service" value={serviceType || '—'} />
            <DataRow label="Ort" value={LOCATION} last />
          </Section>

          <Section style={warnBox}>
            <Text style={warnTitle}>⚠️ Jetzt noch bestätigen – sonst verfällt der Termin</Text>
            <Text style={warnText}>
              Die Zulassungsstelle hat dir eine E-Mail mit einem
              Bestätigungslink geschickt. <strong>Bitte klicke innerhalb von
              3 Stunden auf diesen Link, also spätestens bis ca. {deadline} Uhr.</strong>{' '}
              Ohne Bestätigung verfällt der Termin unwiderruflich, und wir
              können ihn nicht wiederherstellen.
            </Text>
            <Text style={{ ...warnText, marginTop: '10px' }}>
              Keine E-Mail erhalten? Schau bitte auch in deinem Spam- oder Werbeordner nach.
            </Text>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>Zum Termin</Text>
            <Text style={infoText}>
              Bitte sei pünktlich, höchstens 10 Minuten vor deinem Termin,
              und checke dich am Eingang mit deiner Terminnummer am Terminal
              ein. Bei mehr als 30 Minuten Verspätung verfällt der Termin.
              Die Gebühren zahlst du vor Ort mit Karte.
              Welche Unterlagen du für dein Anliegen mitbringen musst, findest
              du auf der{' '}
              <Link href={CITY_URL} style={infoLink}>Seite der Kfz-Zulassungsstelle Köln</Link>.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>Fragen?</Text>
            <Text style={contactLine}>
              E-Mail: <Link href={`mailto:${CONTACT_EMAIL}`} style={link}>{CONTACT_EMAIL}</Link>
            </Text>
            <Text style={contactLine}>
              WhatsApp: <Link href="https://wa.me/4915153461798" style={link}>+49 151 53461798</Link>
            </Text>
            <Text style={contactLine}>
              Telefon: <Link href="tel:+4915153461798" style={link}>+49 151 53461798</Link>
            </Text>
            <Text style={cardFootnote}>Oder antworte einfach auf diese E-Mail.</Text>
          </Section>

          <Text style={footerHint}>Bei Fragen antworte einfach auf diese E-Mail.</Text>
          <Text style={footerEmail}>{CONTACT_EMAIL}</Text>
          <Text style={footer}>
            Herzliche Grüße<br />Dein Team von {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const DataRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <>
    <Row>
      <Column style={labelCol}><Text style={label1}>{label}</Text></Column>
      <Column style={valueCol}><Text style={value1}>{value}</Text></Column>
    </Row>
    {!last ? <Hr style={hr} /> : null}
  </>
)

export const template = {
  component: AppointmentFoundEmail,
  subject: 'Termin gefunden – bitte innerhalb von 3 Stunden bestätigen',
  displayName: 'Termin gefunden (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    appointmentAt: '2026-10-06T08:20:00+02:00',
    foundAt: '2026-10-01T14:03:12+02:00',
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
const infoLink = { color: '#1a4fa3', textDecoration: 'underline', fontWeight: 600 as const }
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
const warnBox = {
  backgroundColor: '#fef3c7', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', border: '1px solid #fde68a',
}
const warnTitle = { fontSize: '15px', fontWeight: 700 as const, color: '#78350f', margin: '0 0 8px' }
const warnText = { fontSize: '14px', color: '#78350f', lineHeight: '1.6', margin: 0 }
const contactLine = { fontSize: '14px', color: '#1a2540', margin: '0 0 6px' }
const link = { color: '#1a4fa3', textDecoration: 'underline' }
const footerHint = { fontSize: '14px', color: '#374151', margin: '24px 0 4px' }
const footerEmail = { fontSize: '14px', color: '#1a2540', margin: '0 0 24px', fontWeight: 500 as const }
const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }
