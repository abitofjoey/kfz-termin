import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

const PiDownEmail = ({ lastPollAt }: { lastPollAt?: string }) => (
  <HealthLayout title="Pi meldet sich nicht" notice="Der Pi hat seit über 30 Minuten keine Aufträge mehr abgefragt. Prüfen: Strom, Internet, VNC auf 100.121.9.74:5901">
    <Row label="Letzte Abfrage" value={formatBerlinShort(lastPollAt)} />
  </HealthLayout>
)

export const template = {
  component: PiDownEmail,
  subject: 'Pi meldet sich nicht',
  displayName: 'Pi meldet sich nicht (intern)',
  to: 'info@kfz-termin.online',
  previewData: { lastPollAt: '2026-10-14T08:20:00Z' },
} satisfies TemplateEntry
