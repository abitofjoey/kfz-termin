import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'

interface Props { bookingId?: string; firstName?: string; lastName?: string; serviceType?: string; reason?: string; customerSkipped?: boolean }

const ConfirmationFailedEmail = ({ bookingId, firstName, lastName, serviceType, reason, customerSkipped }: Props) => (
  <HealthLayout
    title="Bestätigungsmail nicht versendet"
    notice={customerSkipped
      ? 'Die Buchung ist bezahlt, aber die Bestätigung wurde nie als versendet markiert. Es liegt schon ein Suchergebnis vor, deshalb wurde keine Bestätigung mehr an den Kunden nachgeschickt.'
      : 'Die Buchung ist bezahlt, aber die Bestätigungsmails konnten auch beim Nachversuch nicht vollständig versendet werden.'}
  >
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Service" value={serviceType} />
    {reason ? <Row label="Grund" value={reason} /> : null}
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: ConfirmationFailedEmail,
  subject: (d: Record<string, any>) => `Bestätigungsmail nicht versendet: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'Bestätigungsmail nicht versendet (intern)',
  to: 'info@kfz-termin.online',
  previewData: { bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann', serviceType: 'Anmeldung Gebrauchtfahrzeug', reason: 'Empfängeradresse gesperrt (Bounce, Beschwerde oder Abmeldung)' },
} satisfies TemplateEntry
