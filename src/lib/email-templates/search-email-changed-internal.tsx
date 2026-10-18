import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'

interface Props {
  bookingId?: string; firstName?: string; lastName?: string; serviceType?: string
  oldEmail?: string; newEmail?: string; storniert?: boolean
}

const EmailChangedInternal = ({ bookingId, firstName, lastName, serviceType, oldEmail, newEmail, storniert }: Props) => (
  <HealthLayout
    title={storniert ? 'Termin storniert – Suche läuft weiter' : 'E-Mail-Adresse geändert'}
    notice={storniert
      ? 'Der Kunde hat seinen bestehenden Termin storniert. Die Buchung wird mit der bisherigen Adresse erneut ans Script gegeben.'
      : 'Der Kunde hat eine neue E-Mail-Adresse eingetragen. Die Buchung wird erneut ans Script gegeben.'}
  >
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Service" value={serviceType} />
    <Row label="Alte Adresse" value={oldEmail} />
    <Row label="Neue Adresse" value={storniert ? 'storniert, gleiche Adresse' : newEmail} />
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: EmailChangedInternal,
  subject: (d: Record<string, any>) =>
    `${d.storniert ? 'Termin storniert' : 'E-Mail geändert'}: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'E-Mail-Adresse geändert (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann',
    serviceType: 'Anmeldung Gebrauchtfahrzeug', oldEmail: 'max@example.com', newEmail: 'max.neu@example.com', storniert: false,
  },
} satisfies TemplateEntry
