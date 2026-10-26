import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { bookingNumber, formatDayLong } from './customer-email-parts'

interface Props {
  bookingId?: string; firstName?: string; lastName?: string; serviceType?: string
  oldDates?: string[]; newDates?: string[]
}

const list = (d?: string[]) => (d && d.length ? d.map(formatDayLong).join(', ') : '—')

const DatesUpdatedInternal = ({ bookingId, firstName, lastName, serviceType, oldDates, newDates }: Props) => (
  <HealthLayout
    title="Wunschtermine geändert"
    notice="Die Wunschtermine wurden über das Pi-Script geändert. Der Kunde wurde per Mail informiert."
  >
    <Row label="Name" value={[firstName, lastName].filter(Boolean).join(' ')} />
    <Row label="Buchungsnummer" value={bookingNumber(bookingId)} />
    <Row label="Service" value={serviceType} />
    <Row label="Bisherige Wunschtermine" value={list(oldDates)} />
    <Row label="Neue Wunschtermine" value={list(newDates)} />
    <Row label="Buchungs-ID" value={bookingId} mono />
  </HealthLayout>
)

export const template = {
  component: DatesUpdatedInternal,
  subject: (d: Record<string, any>) =>
    `Wunschtermine geändert: ${[d.firstName, d.lastName].filter(Boolean).join(' ') || 'Unbekannt'}`,
  displayName: 'Wunschtermine geändert (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    bookingId: '00000000-0000-0000-0000-000000000000', firstName: 'Max', lastName: 'Mustermann',
    serviceType: 'Anmeldung Gebrauchtfahrzeug', oldDates: ['2026-11-19'], newDates: ['2026-11-20', '2026-11-23'],
  },
} satisfies TemplateEntry
