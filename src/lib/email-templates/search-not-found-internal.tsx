import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  bookingId?: string
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceType?: string
  selectedDates?: string[]
  stripeSessionId?: string
  refundStatus?: 'offered' | 'refunded' | 'already' | 'failed' | 'disabled'
  stripeRefundId?: string | null
  refundError?: string | null
  anlass?: 'direkt' | 'gewaehlt' | 'frist' | 'widerruf'
  deadline?: string
}

const formatDate = (d: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : d
}

const formatDeadline = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d) + ' Uhr'
}

const ANLASS_TEXT: Record<string, string> = {
  direkt: 'direkt',
  gewaehlt: 'vom Kunden gewählt',
  frist: 'Frist abgelaufen',
  widerruf: 'Widerruf des Kunden',
}

function noticeText(p: Props): string {
  switch (p.refundStatus) {
    case 'offered':
      return `Der Kunde kann bis ${formatDeadline(p.deadline)} neue Termine wählen. Danach wird automatisch erstattet. Keine Aktion nötig.`
    case 'refunded':
      return `Rückerstattung automatisch über Stripe ausgelöst. Refund-ID: ${p.stripeRefundId || '—'}`
    case 'already':
      return 'Die Zahlung war bereits erstattet. Keine Aktion nötig.'
    case 'failed':
      return `Automatische Rückerstattung fehlgeschlagen: ${p.refundError || '—'}. Bitte im Stripe-Dashboard erstatten.`
    case 'disabled':
      return 'Automatische Rückerstattung abgeschaltet (AUTO_REFUND=off). Bitte im Stripe-Dashboard erstatten.'
    default:
      return 'Für diese Buchung wurde im Zeitraum der Wunschtermine kein Termin gefunden. Bitte die Rückerstattung im Stripe-Dashboard veranlassen.'
  }
}

const SearchNotFoundInternalEmail = (props: Props) => {
  const { bookingId, salutation, firstName, lastName, email, phone, serviceType, selectedDates, stripeSessionId, anlass } = props
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const dates = (selectedDates ?? []).map(formatDate)
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Kein Termin gefunden: {fullName || '—'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Kein Termin gefunden</Heading>
          <Text style={notice}>{noticeText(props)}</Text>
          {anlass ? <Text style={notice}>Anlass: {ANLASS_TEXT[anlass] ?? anlass}</Text> : null}
          <Section style={card}>
            <Row label="Name" value={fullName} />
            <Row label="E-Mail" value={email} />
            <Row label="Telefon" value={phone} />
            <Row label="Service" value={serviceType} />
            <Hr style={hr} />
            <Text style={label}>Wunschtermine</Text>
            {dates.length > 0
              ? dates.map((d, i) => <Text key={i} style={value}>• {d}</Text>)
              : <Text style={value}>—</Text>}
            <Hr style={hr} />
            <Row label="Buchungs-ID" value={bookingId} mono />
            <Row label="Stripe-Session-ID" value={stripeSessionId} mono />
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
  component: SearchNotFoundInternalEmail,
  subject: (d: Record<string, any>) => {
    const name = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'
    switch (d.refundStatus) {
      case 'offered': return `Kein Termin gefunden – Angebot neue Termine: ${name}`
      case 'refunded':
      case 'already': return `Erstattet (${ANLASS_TEXT[d.anlass] ?? d.anlass ?? '—'}): ${name}`
      case 'failed':
      case 'disabled': return `BITTE MANUELL ERSTATTEN: ${name}`
      default: return `Kein Termin gefunden – Rückerstattung: ${name}`
    }
  },
  displayName: 'Kein Termin gefunden (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    bookingId: '00000000-0000-0000-0000-000000000000',
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 170 1234567',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    selectedDates: ['2026-10-06', '2026-10-07', '2026-10-08'],
    stripeSessionId: 'cs_test_a1B2c3D4e5F6',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 20px', letterSpacing: '-0.02em' }
const notice = { fontSize: '14px', color: '#1a2540', lineHeight: '1.5', margin: '0 0 16px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px' }
const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#374151' }
const hr = { borderColor: '#e5e7eb', margin: '12px 0' }
