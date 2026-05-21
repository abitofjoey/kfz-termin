import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'KFZ-Termin Köln'

interface BookingConfirmationProps {
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  finEnding?: string
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
  notes,
  selectedDates = [],
}: BookingConfirmationProps) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Ihre Buchung bei {SITE_NAME} ist bestätigt</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Buchungsbestätigung</Heading>
          <Text style={text}>
            {fullName ? `Hallo ${fullName},` : 'Hallo,'}
          </Text>
          <Text style={text}>
            vielen Dank für Ihre Buchung bei {SITE_NAME}. Wir haben Ihre Anfrage
            erhalten und Ihre Zahlung wurde erfolgreich verarbeitet.
          </Text>

          <Section style={card}>
            <Text style={label}>Name</Text>
            <Text style={value}>{fullName || '—'}</Text>

            <Hr style={hr} />

            <Text style={label}>E-Mail</Text>
            <Text style={value}>{email || '—'}</Text>

            <Hr style={hr} />

            <Text style={label}>Telefon</Text>
            <Text style={value}>{phone || '—'}</Text>

            <Hr style={hr} />

            <Text style={label}>Service</Text>
            <Text style={value}>{serviceType || '—'}</Text>

            <Hr style={hr} />

            <Text style={label}>FIN (letzte Ziffern)</Text>
            <Text style={value}>{finEnding || '—'}</Text>

            {notes ? (
              <>
                <Hr style={hr} />
                <Text style={label}>Anmerkungen</Text>
                <Text style={value}>{notes}</Text>
              </>
            ) : null}

            <Hr style={hr} />

            <Text style={label}>Gewünschte Termine</Text>
            {selectedDates.length > 0 ? (
              selectedDates.map((d) => (
                <Text key={d} style={value}>• {d}</Text>
              ))
            ) : (
              <Text style={value}>—</Text>
            )}
          </Section>

          <Text style={warnHint}>
            <strong>Bitte prüfen Sie Ihre Angaben.</strong> Sollten Name,
            E-Mail oder FIN nicht korrekt sein, kann die Bestätigung der
            Zulassungsstelle Sie nicht erreichen oder Ihre Zulassung vor Ort
            abgewiesen werden. Antworten Sie in diesem Fall einfach auf diese
            E-Mail.
          </Text>

          <Text style={text}>
            Wir suchen jetzt für Sie nach einem passenden Termin bei der Kölner
            Zulassungsstelle. Sobald wir einen Termin reserviert haben,
            erhalten Sie innerhalb einer Stunde eine separate
            Bestätigungs-E-Mail der Zulassungsstelle.
          </Text>

          <Text style={footerHint}>
            Sie haben noch Fragen? Antworten Sie einfach auf diese E-Mail –
            wir helfen Ihnen gerne weiter.
          </Text>

          <Text style={footer}>Herzliche Grüße<br />Ihr Team von {SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BookingConfirmationEmail,
  subject: 'Ihre Buchung bei KFZ-Termin Köln ist bestätigt',
  displayName: 'Buchungsbestätigung (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 151 12345678',
    serviceType: 'Gebrauchtwagen anmelden',
    finEnding: '1234',
    notes: 'Bitte möglichst vormittags.',
    selectedDates: ['Mo, 25.05.2026 vormittags', 'Di, 26.05.2026 nachmittags'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 24px', letterSpacing: '-0.02em' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px', margin: '24px 0' }
const label = { fontSize: '12px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '0 0 4px' }
const value = { fontSize: '15px', color: '#1a2540', margin: '0 0 12px', fontWeight: 500 as const }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
const footerHint = { fontSize: '14px', color: '#374151', backgroundColor: '#eef2ff', padding: '12px 16px', borderRadius: '6px', margin: '24px 0 16px' }
const warnHint = { fontSize: '14px', color: '#78350f', backgroundColor: '#fef3c7', padding: '12px 16px', borderRadius: '6px', margin: '20px 0 16px', lineHeight: '1.6' }
const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }
