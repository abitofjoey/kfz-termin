// Gemeinsame Bausteine der Kundenmails – Werte identisch mit appointment-found.tsx.
import { Link, Section, Text } from '@react-email/components'

export const SITE_NAME = 'KFZ-Termin Köln'
export const CONTACT_EMAIL = 'info@kfz-termin.online'
export const SITE_URL = 'https://kfz-termin.online'

const TZ = 'Europe/Berlin'

/** "Dienstag, 06.10.2026" aus YYYY-MM-DD */
export function formatDayLong(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12))
  const wd = new Intl.DateTimeFormat('de-DE', { weekday: 'long', timeZone: 'UTC' }).format(d)
  return `${wd}, ${m[3]}.${m[2]}.${m[1]}`
}

/** "Donnerstag, 15.10.2026 um 17:46 Uhr" (Europe/Berlin) */
export function formatDeadline(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const wd = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, weekday: 'long' }).format(d)
  const date = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  const time = new Intl.DateTimeFormat('de-DE', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  return `${wd}, ${date} um ${time} Uhr`
}

export const ContactCard = () => (
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
)

export const MailFooter = () => (
  <>
    <Text style={footerHint}>Bei Fragen antworte einfach auf diese E-Mail.</Text>
    <Text style={footerEmail}>{CONTACT_EMAIL}</Text>
    <Text style={footer}>
      Herzliche Grüße<br />Dein Team von {SITE_NAME}
    </Text>
  </>
)

export const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
export const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
export const eyebrow = {
  fontSize: '12px', fontWeight: 600 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 8px',
}
export const h1 = { fontSize: '28px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 16px', letterSpacing: '-0.02em' }
export const topRule = { borderColor: '#e5e7eb', margin: '0 0 24px' }
export const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
export const infoBox = {
  backgroundColor: '#eaf2ff', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', borderLeft: '3px solid #1a4fa3',
}
export const infoTitle = { fontSize: '14px', fontWeight: 700 as const, color: '#1a4fa3', margin: '0 0 8px' }
export const infoText = { fontSize: '14px', color: '#1a4fa3', lineHeight: '1.6', margin: 0 }
export const card = {
  backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '20px 22px', margin: '20px 0',
  border: '1px solid #eceff3',
}
export const cardTitle = {
  fontSize: '12px', fontWeight: 700 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 14px',
}
export const cardFootnote = { fontSize: '13px', color: '#6b7280', margin: '14px 0 0', lineHeight: '1.5' }
export const value1 = { fontSize: '14px', color: '#1a2540', margin: '0 0 6px', fontWeight: 500 as const, lineHeight: '1.5' }
export const contactLine = { fontSize: '14px', color: '#1a2540', margin: '0 0 6px' }
export const link = { color: '#1a4fa3', textDecoration: 'underline' }
export const highlight = {
  backgroundColor: '#fef3c7', borderRadius: '8px', padding: '12px 14px',
  fontSize: '14px', color: '#78350f', lineHeight: '1.6', margin: '14px 0 0', fontWeight: 600 as const,
}
export const button = {
  backgroundColor: '#1a4fa3', color: '#ffffff', borderRadius: '8px', padding: '14px 22px',
  fontSize: '15px', fontWeight: 700 as const, textDecoration: 'none', display: 'inline-block',
}
export const footerHint = { fontSize: '14px', color: '#374151', margin: '24px 0 4px' }
export const footerEmail = { fontSize: '14px', color: '#1a2540', margin: '0 0 24px', fontWeight: 500 as const }
export const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }
