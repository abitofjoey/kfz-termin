import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface BookingInternalProps {
  bookingId?: string
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  finEnding?: string
  notes?: string
  selectedDates?: string[]
  stripeSessionId?: string
}

const BookingInternalNotificationEmail = ({
  bookingId,
  salutation,
  firstName,
  lastName,
  email,
  phone,
  serviceType,
  finEnding,
  notes,
  selectedDates = [],
  stripeSessionId,
}: BookingInternalProps) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Neue Buchung: {fullName || '—'} – {serviceType || ''}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Neue Buchung eingegangen</Heading>
          <Text style={paid}>✓ Zahlung erfolgreich (Stripe)</Text>

          <Section style={card}>
            <Row label="Service" value={serviceType} />
            <Hr style={hr} />
            <Row label="Name" value={fullName} />
            <Row label="E-Mail" value={email} />
            <Row label="Telefon" value={phone} />
            <Hr style={hr} />
            <Row label="FIN (letzte Ziffern)" value={finEnding} />
            <Text style={label}>Gewünschte Termine</Text>
            {selectedDates.length > 0
              ? selectedDates.map((d) => <Text key={d} style={value}>• {d}</Text>)
              : <Text style={value}>—</Text>}
            {notes ? (
              <>
                <Hr style={hr} />
                <Row label="Notizen" value={notes} />
              </>
            ) : null}
            <Hr style={hr} />
            <Row label="Buchungs-ID" value={bookingId} mono />
            <Row label="Stripe Session" value={stripeSessionId} mono />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label: l, value: v, mono }: { label: string; value?: string; mono?: boolean }) => (
  <>
    <Text style={label}>{l}</Text>
    <Text style={{ ...value, ...(mono ? monoStyle : {}) }}>{v || '—'}</Text>
  </>
)

export const template = {
  component: BookingInternalNotificationEmail,
  subject: (d: Record<string, any>) =>
    `Neue Buchung: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'} – ${d.serviceType || ''}`.trim(),
  displayName: 'Buchungs-Benachrichtigung (intern)',
  to: 'j.eikehoffmann@gmail.com',
  previewData: {
    bookingId: '00000000-0000-0000-0000-000000000000',
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 170 1234567',
    serviceType: 'Gebrauchtwagen anmelden',
    finEnding: '1234',
    selectedDates: ['Mo, 25.05.2026 vormittags'],
    stripeSessionId: 'cs_test_a1b2c3',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 8px', letterSpacing: '-0.02em' }
const paid = { fontSize: '13px', color: '#0d7a5f', fontWeight: 600 as const, margin: '0 0 20px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px' }
const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#374151' }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
