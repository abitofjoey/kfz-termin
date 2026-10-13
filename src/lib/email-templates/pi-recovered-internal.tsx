import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

const PiRecoveredEmail = ({ lastPollAt }: { lastPollAt?: string }) => (
  <HealthLayout title="Pi wieder erreichbar" notice="Der Pi fragt wieder Aufträge ab.">
    <Row label="Letzte Abfrage" value={formatBerlinShort(lastPollAt)} />
  </HealthLayout>
)

export const template = {
  component: PiRecoveredEmail,
  subject: 'Pi wieder erreichbar',
  displayName: 'Pi wieder erreichbar (intern)',
  to: 'info@kfz-termin.online',
  previewData: { lastPollAt: '2026-10-14T09:05:00Z' },
} satisfies TemplateEntry
