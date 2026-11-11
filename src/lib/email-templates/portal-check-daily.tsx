import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { HealthLayout } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'
import type { PortalDailyLine } from '../portal-check'

export function portalLineText(l: PortalDailyLine): string {
  if (l.state === 'ok') return 'Portal-Check: ok'
  if (l.state === 'abweichung') return `Portal-Check: ${l.count} Abweichung(en) seit ${formatBerlinShort(l.since ?? undefined)}`
  return l.since ? `Portal-Check: seit ${formatBerlinShort(l.since)} keine Meldung` : 'Portal-Check: noch keine Meldung'
}

const Email = ({ lines = [] }: { lines?: PortalDailyLine[] }) => (
  <HealthLayout title="Portal-Check täglich" notice="Mindestens eine Stadt hat eine offene Abweichung oder seit über 48 Stunden keine Meldung.">
    {lines.map((l) => (
      <Text key={l.city} style={row}><strong>{l.cityName}:</strong> {portalLineText(l)}</Text>
    ))}
  </HealthLayout>
)

export const template = {
  component: Email,
  subject: 'Portal-Check täglich',
  displayName: 'Portal-Check täglich (intern)',
  to: 'info@kfz-termin.online',
  previewData: {
    lines: [
      { city: 'bonn', cityName: 'Bonn', state: 'abweichung', count: 2, since: '2026-11-10T09:00:00Z' },
      { city: 'koeln', cityName: 'Köln', state: 'ok', count: 0, since: null },
    ],
  },
} satisfies TemplateEntry

const row = { fontSize: '14px', color: '#1a2540', margin: '0 0 8px' }
