import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
  Row, Column, Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BookingNumberLine, locationText } from './customer-email-parts'
import { formatBerlinLong, formatBerlinTime } from './format-berlin'
import { cityOrDefault, referenceLabelOf } from '../cities'
import { InlineBold } from '../../components/landing/InlineBold'
import { getServices } from '../services'
import { buildCalendarEvent, calendarIcsUrl, googleCalendarUrl } from '../calendar'

const CONTACT_EMAIL = 'info@kfz-termin.online'
const REVIEW_URL = 'https://g.page/r/CQtnwHapR1yhEBM/review'

interface AppointmentFoundProps {
  bookingId?: string
  withdrawToken?: string | null
  salutation?: string
  firstName?: string
  lastName?: string
  serviceType?: string
  appointmentAt?: string
  foundAt?: string
  city?: string | null
  bookedLocation?: string | null
  bookingReference?: string | null
  cancelUrl?: string | null
  calendarToken?: string | null
}

const AppointmentFoundEmail = ({ bookingId,
  salutation, firstName, lastName, serviceType, appointmentAt, foundAt,
  city, bookedLocation, bookingReference, cancelUrl, calendarToken,
}: AppointmentFoundProps) => {
  const cal = appointmentAt ? (
    <CalendarLinks
      googleUrl={googleCalendarUrl(buildCalendarEvent({ id: bookingId ?? '', city, serviceType, appointmentAt, bookedLocation, bookingReference, cancelUrl }))}
      icsUrl={calendarToken ? calendarIcsUrl(calendarToken) : null}
    />
  ) : null
  const c = cityOrDefault(city)
  const SITE_NAME = c.siteName
  const LOCATION = bookedLocation || c.appointmentLocation
  const CITY_URL = c.infoUrl
  const hours = c.customerConfirmationHours
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const deadline = formatBerlinTime(foundAt, hours ?? 0)
  if (hours == null) {
    return (
      <Html lang="de" dir="ltr">
        <Head />
        <Preview>{`Dein Termin in ${c.name} ist gebucht`}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Text style={eyebrow}>{SITE_NAME}</Text>
            <Heading style={h1}>Termin gebucht!</Heading>
            <Hr style={topRule} />
            <BookingNumberLine bookingId={bookingId} />

            <Text style={text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
            <Text style={text}>
              {`gute Nachrichten: Wir haben einen Termin ${c.mail.atAuthority} für dich gebucht.`}
            </Text>

            <Section style={card}>
              <Text style={cardTitle}>Dein Termin</Text>
              <DataRow label="Datum und Uhrzeit" value={formatBerlinLong(appointmentAt)} />
              <DataRow label="Service" value={serviceType || '—'} />
              <DataRow label="Standort" value={locationText(c, bookedLocation)} last={!bookingReference} />
              {bookingReference ? <DataRow label={referenceLabelOf(c)} value={bookingReference} last /> : null}
            </Section>

            {bookingReference ? (
              <Text style={text}>
                Mit dieser Nummer meldest du dich vor Ort am Check-in-Terminal an.
              </Text>
            ) : null}

            {cal}

            <Section style={card}>
              <Text style={cardTitle}>So läuft dein Termin ab</Text>
              {(c.mail.onSiteSteps ?? []).map((step, i) => (
                <Text key={i} style={text}>
                  <InlineBold text={`• ${step.replace('{nummer}', bookingReference ? ` ${bookingReference}` : '')}`} />
                </Text>
              ))}
              {getServices(c.slug).find((s) => s.label === serviceType)?.category === 'fuehrerschein' ? (
                <Text style={text}>• Fotos kannst du vor Ort an den Selbsterfassungsgeräten machen oder ein ausgedrucktes Foto von einem zertifizierten Fotografen mitbringen. Für den internationalen Führerschein und die Fahrerkarte werden nur ausgedruckte Fotos angenommen.</Text>
              ) : null}
              {c.mail.cityConfirmationNote ? (
                <Text style={text}>
                  <InlineBold text={c.mail.cityConfirmationNote} />
                </Text>
              ) : null}
            </Section>

            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>Du musst nichts mehr bestätigen.</strong>{' '}
                Welche Unterlagen du für dein Anliegen mitbringen musst, findest du auf der{' '}
                <Link href={getServices(c.slug).find((s) => s.label === serviceType)?.infoUrl || CITY_URL} style={infoLink}>{c.mail.infoLinkLabel ?? `Seite der Stadt ${c.name}`}</Link>.
              </Text>
            </Section>

            {cancelUrl ? (
              <Text style={text}>
                Falls du doch nicht kannst, storniere bitte über diesen Link, damit der Termin wieder frei wird:{' '}
                <Link href={cancelUrl} style={link}>Termin stornieren</Link>
              </Text>
            ) : null}

            <Text style={text}>
              Wir freuen uns über deine Bewertung bei Google:{' '}
              <Link href={REVIEW_URL} style={link}>Jetzt bewerten</Link>
            </Text>

            <ContactBlock />

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
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wir haben deinen Termin gefunden – jetzt bestätigen</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>{SITE_NAME}</Text>
          <Heading style={h1}>Termin gefunden!</Heading>
          <Hr style={topRule} />
          <BookingNumberLine bookingId={bookingId} />

          <Text style={text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
          <Text style={text}>
            {`gute Nachrichten: Wir haben einen Termin ${c.mail.atAuthority} für dich gefunden und auf deinen Namen reserviert.`}
          </Text>

          <Section style={card}>
            <Text style={cardTitle}>Dein Termin</Text>
            <DataRow label="Datum und Uhrzeit" value={formatBerlinLong(appointmentAt)} />
            <DataRow label="Service" value={serviceType || '—'} />
            <DataRow label="Ort" value={LOCATION} last={!(c.mail.showBookingReference && bookingReference)} />
            {c.mail.showBookingReference && bookingReference ? (
              <DataRow label={referenceLabelOf(c)} value={bookingReference} last />
            ) : null}
          </Section>

          {cal}

          {hours != null ? (
          <Section style={warnBox}>
            <Text style={warnTitle}>⚠️ Jetzt noch bestätigen – sonst verfällt der Termin</Text>
            <Text style={warnText}>
              Die {c.mail.authority} hat dir eine E-Mail mit einem
              Bestätigungslink geschickt. <strong>{`Bitte klicke innerhalb von ${hours} Stunden auf diesen Link, also spätestens bis ca. `}{deadline} Uhr.</strong>{' '}
              Ohne Bestätigung verfällt der Termin unwiderruflich, und wir
              können ihn nicht wiederherstellen.
            </Text>
            <Text style={{ ...warnText, marginTop: '10px' }}>
              Keine E-Mail erhalten? Schau bitte auch in deinem Spam- oder Werbeordner nach.
            </Text>
          </Section>
          ) : null}
          {c.mail.showCancelUrl && cancelUrl ? (
            <Text style={text}>
              Termin absagen: <Link href={cancelUrl} style={link}>Stornolink der Stadt</Link>
            </Text>
          ) : null}

          <Section style={infoBox}>
            <Text style={infoTitle}>Zum Termin</Text>
            <Text style={infoText}>
              Bitte sei pünktlich, höchstens 10 Minuten vor deinem Termin,
              und checke dich am Eingang mit deiner Terminnummer am Terminal
              ein. Bei mehr als 30 Minuten Verspätung verfällt der Termin.
              Die Gebühren zahlst du vor Ort mit Karte.
              Welche Unterlagen du für dein Anliegen mitbringen musst, findest
              du auf der{' '}
              <Link href={CITY_URL} style={infoLink}>{`Seite der ${c.authorityName}`}</Link>.
            </Text>
          </Section>

          <Text style={text}>
            Wir freuen uns über deine Bewertung bei Google:{' '}
            <Link href={REVIEW_URL} style={link}>Jetzt bewerten</Link>
          </Text>

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

const ContactBlock = () => (
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
  </Section>
)

const DataRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <>
    <Row>
      <Column style={labelCol}><Text style={label1}>{label}</Text></Column>
      <Column style={valueCol}><Text style={value1}>{value}</Text></Column>
    </Row>
    {!last ? <Hr style={hr} /> : null}
  </>
)

const CalendarLinks = ({ googleUrl, icsUrl }: { googleUrl: string; icsUrl: string | null }) => (
  <Section style={{ margin: '0 0 24px' }}>
    <Link href={googleUrl} style={calButton}>In Google Kalender eintragen</Link>
    {icsUrl ? (
      <Text style={{ fontSize: '14px', color: '#374151', margin: '12px 0 0' }}>
        <Link href={icsUrl} style={link}>Für Apple-Kalender/Outlook (.ics)</Link>
      </Text>
    ) : null}
  </Section>
)

const calButton = {
  display: 'inline-block', backgroundColor: '#1a2540', color: '#ffffff', fontSize: '14px',
  fontWeight: 600 as const, padding: '10px 18px', borderRadius: '8px', textDecoration: 'none',
}

export const template = {
  component: AppointmentFoundEmail,
  subject: (d: Record<string, any>) => {
    const c = cityOrDefault(d.city)
    const h = c.customerConfirmationHours
    return h != null ? `Termin gefunden – bitte innerhalb von ${h} Stunden bestätigen` : `Dein Termin in ${c.name} ist gebucht`
  },
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
