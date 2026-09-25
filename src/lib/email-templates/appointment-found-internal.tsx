import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { formatBerlinShort } from './format-berlin'

interface Props {
  bookingId?: string
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  appointmentAt?: string
  foundAt?: string
}

const AppointmentFoundInternalEmail = ({
  bookingId, salutation, firstName, lastName, email, phone, serviceType, appointmentAt, foundAt,
}: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Termin gefunden: {fullName || '—'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Termin gefunden</Heading>
          <Section style={card}>
            <Row label="Name" value={fullName} />
            <Row label="E-Mail" value={email} />
            <Row label="Telefon" value={phone} />
            <Row label="Service" value={serviceType} />
            <Hr style={hr} />
            <Row label="Gebuchter Termin" value={formatBerlinShort(appointmentAt)} />
            <Row label="Gebucht um" value={formatBerlinShort(foundAt)} />
            <Hr style={hr} />
            <Row label="Buchungs-ID" value={bookingId} mono />
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
  component: AppointmentFoundInternalEmail,
  subject: (d: Record<string, any>) =>
    `Termin gefunden: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'} – ${formatBerlinShort(d.appointmentAt)}`,
  displayName: 'Termin gefunden (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    bookingId: '00000000-0000-0000-0000-000000000000',
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 170 1234567',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    appointmentAt: '2026-10-06T08:20:00+02:00',
    foundAt: '2026-10-01T14:03:12+02:00',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 20px', letterSpacing: '-0.02em' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px' }
const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#374151' }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
