import type { TemplateEntry } from './registry'
import { HealthLayout, Row, formatDate } from './health-internal-parts'

interface Props { bookingId?: string; firstName?: string; lastName?: string; serviceType?: string; lastDate?: string }

const StuckEmail = ({ bookingId, firstName, lastName, serviceType, lastDate }: Props) => (
  <HealthLayout title="Auftrag ohne Ergebnis" notice="Der letzte Wunschtag ist mehr als 2 Tage vorbei, aber der Pi hat kein Ergebnis gemeldet.">
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Service" value={serviceType} />
    <Row label="Letzter Wunschtag" value={formatDate(lastDate)} />
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: StuckEmail,
  subject: (d: Record<string, any>) => `Auftrag ohne Ergebnis: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'Auftrag ohne Ergebnis (intern)',
  to: 'info@kfz-termin.online',
  previewData: { bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann', serviceType: 'Anmeldung Gebrauchtfahrzeug', lastDate: '2026-10-16' },
} satisfies TemplateEntry
