import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'

interface Props { bookingId?: string; firstName?: string; lastName?: string; serviceType?: string }

const NotPickedUpEmail = ({ bookingId, firstName, lastName, serviceType }: Props) => (
  <HealthLayout title="Buchung nicht abgeholt" notice="Diese bezahlte Buchung wurde seit über 30 Minuten nicht vom Pi abgeholt.">
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Service" value={serviceType} />
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: NotPickedUpEmail,
  subject: (d: Record<string, any>) => `Buchung nicht abgeholt: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'Buchung nicht abgeholt (intern)',
  to: 'info@kfz-termin.online',
  previewData: { bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann', serviceType: 'Anmeldung Gebrauchtfahrzeug' },
} satisfies TemplateEntry
