import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

const DailyStatusPiEmail = ({ lastPollAt }: { lastPollAt?: string | null }) => (
  <HealthLayout title="Zwischenmails heute nicht versendet" notice="Der Pi hat sich in den letzten 60 Minuten nicht gemeldet. Deshalb wurden heute keine abendlichen Zwischenmails an Kunden verschickt.">
    <Row label="Letzte Abfrage" value={lastPollAt ? formatBerlinShort(lastPollAt) : 'nie'} />
  </HealthLayout>
)

export const template = {
  component: DailyStatusPiEmail,
  subject: (d: Record<string, any>) =>
    `Zwischenmails heute nicht versendet – Pi hat sich zuletzt um ${d.lastPollAt ? formatBerlinShort(d.lastPollAt) : 'nie'} gemeldet`,
  displayName: 'Zwischenmails nicht versendet (intern)',
  to: 'info@kfz-termin.online',
  previewData: { lastPollAt: '2026-10-28T17:20:00Z' },
} satisfies TemplateEntry
