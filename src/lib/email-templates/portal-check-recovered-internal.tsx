import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

const Email = ({ changedAt }: { changedAt?: string }) => (
  <HealthLayout title="Terminseite wieder wie erwartet" notice="Der Portal-Check meldet keine Abweichungen mehr.">
    <Row label="Seit" value={formatBerlinShort(changedAt)} />
  </HealthLayout>
)

export const template = {
  component: Email,
  subject: 'Terminseite wieder wie erwartet',
  displayName: 'Portal-Check: wieder wie erwartet (intern)',
  to: 'info@kfz-termin.online',
  previewData: { city: 'bonn', changedAt: '2026-11-11T16:00:00Z' },
} satisfies TemplateEntry
