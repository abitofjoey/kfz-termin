import { Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'

const n = (d: Record<string, any>) => (Array.isArray(d.findings) ? d.findings.length : 0)

const Email = ({ findings = [], changedAt, scriptVersion }: { findings?: string[]; changedAt?: string; scriptVersion?: string | null }) => (
  <HealthLayout title="Terminseite geändert" notice="Bitte Script/Website prüfen lassen (Claude Bescheid geben). Suchen und Buchen laufen unverändert weiter.">
    <Text style={label}>Abweichungen</Text>
    <ul style={list}>
      {findings.map((f, i) => <li key={i} style={item}>{f}</li>)}
    </ul>
    <Row label="Festgestellt" value={formatBerlinShort(changedAt)} />
    <Row label="Script-Version" value={scriptVersion ?? undefined} />
  </HealthLayout>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Terminseite geändert – ${n(d)} Abweichung(en)`,
  displayName: 'Portal-Check: Terminseite geändert (intern)',
  to: 'info@kfz-termin.online',
  previewData: { city: 'bonn', findings: ['Button „Weiter" nicht gefunden', 'Standortauswahl fehlt'], changedAt: '2026-11-11T16:00:00Z', scriptVersion: '40.3' },
} satisfies TemplateEntry

const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '0 0 4px' }
const list = { margin: '0 0 8px', paddingLeft: '18px' }
const item = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
