import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

type Props = { status?: string; changedAt?: string }

const ApiStatusEmail = ({ status, changedAt }: Props) =>
  status === 'notbetrieb' ? (
    <HealthLayout
      title="Schnittstelle gestört – Notbetrieb aktiv"
      notice="Das Pi-Script meldet eine gestörte Schnittstelle der Stadt und arbeitet im Notbetrieb."
    >
      <Row label="Gemeldet" value={formatBerlinShort(changedAt)} />
    </HealthLayout>
  ) : (
    <HealthLayout
      title="Schnittstelle wieder in Ordnung"
      notice="Das Pi-Script meldet die Schnittstelle der Stadt wieder als in Ordnung."
    >
      <Row label="Gemeldet" value={formatBerlinShort(changedAt)} />
    </HealthLayout>
  )

export const template = {
  component: ApiStatusEmail,
  subject: (d: Record<string, any>) =>
    d.status === 'notbetrieb'
      ? 'Schnittstelle gestört – Notbetrieb aktiv'
      : 'Schnittstelle wieder in Ordnung',
  displayName: 'Schnittstelle Status (intern)',
  to: 'info@kfz-termin.online',
  previewData: { status: 'notbetrieb', changedAt: '2026-11-05T19:50:00Z', city: 'bonn' },
} satisfies TemplateEntry
