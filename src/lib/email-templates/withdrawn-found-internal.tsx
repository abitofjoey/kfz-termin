import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

interface Props {
  bookingId?: string
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  serviceType?: string
  appointmentAt?: string
  foundAt?: string
  withdrawnAt?: string | null
}

const WithdrawnFoundInternalEmail = (p: Props) => (
  <HealthLayout
    title="Warnung: Termin nach Widerruf gemeldet"
    notice="Das Script hat für eine widerrufene Buchung einen Termin gemeldet. Der Zustand wurde nicht geändert, die Kundin/der Kunde wurde informiert, den Bestätigungslink nicht anzuklicken."
  >
    <Row label="Name" value={[p.salutation, p.firstName, p.lastName].filter(Boolean).join(' ')} />
    <Row label="E-Mail" value={p.email} />
    <Row label="Service" value={p.serviceType} />
    <Row label="Gebuchter Termin" value={formatBerlinShort(p.appointmentAt)} />
    <Row label="Gebucht um" value={formatBerlinShort(p.foundAt)} />
    <Row label="Widerrufen am" value={formatBerlinShort(p.withdrawnAt ?? undefined)} />
    <Row label="Buchungs-ID" value={p.bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: WithdrawnFoundInternalEmail,
  to: 'info@kfz-termin.online',
  subject: (d: Record<string, any>) => `Warnung: Termin nach Widerruf – ${[d.firstName, d.lastName].filter(Boolean).join(' ') || '—'}`,
  displayName: 'Termin nach Widerruf (intern)',
  previewData: { bookingId: '45a1000a-e1c9-4635-8ebc-3b2aa4f53cd5', firstName: 'Max', lastName: 'Mustermann', appointmentAt: '2026-11-20T07:20:00Z', foundAt: '2026-11-19T10:00:00Z', withdrawnAt: '2026-11-19T09:58:00Z' },
} satisfies TemplateEntry
