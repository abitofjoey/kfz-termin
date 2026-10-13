import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  reason?: 'email_limit' | 'booking_failed'
  bookingId?: string
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  fins?: string[]
  selectedDates?: string[]
  stripeSessionId?: string
}

const formatDate = (d: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : d
}

const NOTICES = {
  email_limit:
    'Die Stadt lässt für die E-Mail-Adresse des Kunden keine weitere Buchung zu. Der Kunde wurde per Mail gebeten, eine andere Adresse zu nennen oder seinen bestehenden Termin zu stornieren. Der Auftrag ist zurückgestellt.',
  booking_failed:
    'Das Buchungsformular der Stadt hat die Daten dreimal abgelehnt. Bitte Kundendaten prüfen (z.B. FIN, Telefon). Der Auftrag ist zurückgestellt. Der Kunde wurde nicht informiert.',
}

const SearchErrorInternalEmail = ({
  reason, bookingId, salutation, firstName, lastName, email, phone, serviceType, fins, selectedDates, stripeSessionId,
}: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const dates = (selectedDates ?? []).map(formatDate)
  const finList = (fins ?? []).filter(Boolean)
  const id = bookingId || '<id>'
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>{reason === 'booking_failed' ? 'Buchung gescheitert' : 'E-Mail-Limit der Stadt'}: {fullName || '—'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{reason === 'booking_failed' ? 'Buchung gescheitert' : 'E-Mail-Limit der Stadt'}</Heading>
          <Text style={notice}>{NOTICES[reason ?? 'email_limit']}</Text>
          <Section style={card}>
            <Row label="Name" value={fullName} />
            <Row label="E-Mail" value={email} />
            <Row label="Telefon" value={phone} />
            <Row label="Service" value={serviceType} />
            <Row label={finList.length > 1 ? 'FINs' : 'FIN'} value={finList.join(', ')} mono />
            <Hr style={hr} />
            <Text style={label}>Wunschtermine</Text>
            {dates.length > 0
              ? dates.map((d, i) => <Text key={i} style={value}>• {d}</Text>)
              : <Text style={value}>—</Text>}
            <Hr style={hr} />
            <Row label="Buchungs-ID" value={bookingId} mono />
            <Row label="Stripe-Session-ID" value={stripeSessionId} mono />
          </Section>

          <Section style={resumeBox}>
            <Text style={resumeTitle}>Auftrag wieder aufnehmen</Text>
            <Text style={label}>Neue E-Mail-Adresse:</Text>
            <Text style={code}>
              {`update public.bookings set email = 'NEUE_ADRESSE', assigned_to_script = false where id = '${id}';`}
            </Text>
            <Text style={label}>Gleiche Adresse (z.B. Kunde hat alten Termin storniert):</Text>
            <Text style={code}>
              {`update public.bookings set assigned_to_script = false where id = '${id}';`}
            </Text>
            <Text style={notice}>
              Diese Zeile in Lovable ausführen lassen. Der Pi übernimmt den Auftrag innerhalb einer Minute neu.
            </Text>
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
  component: SearchErrorInternalEmail,
  subject: (d: Record<string, any>) => {
    const name = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'
    return d.reason === 'booking_failed'
      ? `Buchung gescheitert: ${name}`
      : `E-Mail-Limit der Stadt: ${name}`
  },
  displayName: 'Suchfehler (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    reason: 'email_limit',
    bookingId: '00000000-0000-0000-0000-000000000000',
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 170 1234567',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    fins: ['1234'],
    selectedDates: ['2026-10-06', '2026-10-07'],
    stripeSessionId: 'cs_test_a1B2c3D4e5F6',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 20px', letterSpacing: '-0.02em' }
const notice = { fontSize: '14px', color: '#1a2540', lineHeight: '1.5', margin: '12px 0 16px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px' }
const resumeBox = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px', marginTop: '20px', border: '1px solid #e5e7eb' }
const resumeTitle = { fontSize: '15px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 8px' }
const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#374151' }
const code = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#1a2540', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 10px', margin: '0 0 8px', wordBreak: 'break-all' as const }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
