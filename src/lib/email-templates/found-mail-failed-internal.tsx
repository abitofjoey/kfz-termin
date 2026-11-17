import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'

interface Props { bookingId?: string; firstName?: string; lastName?: string; serviceType?: string; appointmentAt?: string; reason?: string }

const fmt = (iso?: string) => iso ? new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) + ' Uhr' : undefined

const FoundMailFailedEmail = ({ bookingId, firstName, lastName, serviceType, appointmentAt, reason }: Props) => (
  <HealthLayout title="Terminmail nicht versendet" notice="Ein Termin wurde gebucht, aber die Kundenmail „Termin gebucht“ konnte auch beim Nachversuch nicht versendet werden. Bitte den Kunden direkt informieren.">
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Service" value={serviceType} />
    <Row label="Termin" value={fmt(appointmentAt)} />
    {reason ? <Row label="Grund" value={reason} /> : null}
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: FoundMailFailedEmail,
  subject: (d: Record<string, any>) => `Terminmail nicht versendet: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'Terminmail nicht versendet (intern)',
  to: 'info@kfz-termin.online',
  previewData: { bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann', serviceType: 'Anmeldung Gebrauchtfahrzeug', appointmentAt: '2026-11-20T08:30:00.000Z', reason: 'Unbekannter Fehler' },
} satisfies TemplateEntry
