import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { cityOrDefault } from '../cities'

interface Props { city?: string; scriptVersion?: string; currentVersion?: string; firstSeenAt?: string }

const fmt = (iso?: string) => iso ? new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) + ' Uhr' : undefined

const VersionLagEmail = ({ city, scriptVersion, currentVersion, firstSeenAt }: Props) => (
  <HealthLayout title="Script nicht aktualisiert" notice={`${cityOrDefault(city).name} läuft seit über 12 Stunden auf einer älteren Script-Version.`}>
    <Row label="Läuft auf" value={scriptVersion} />
    <Row label="Aktuell" value={currentVersion} />
    <Row label="Abweichung seit" value={fmt(firstSeenAt)} />
  </HealthLayout>
)

export const template = {
  component: VersionLagEmail,
  subject: (d: Record<string, any>) => `${cityOrDefault(d.city).name} läuft noch auf Version ${d.scriptVersion} (aktuell ${d.currentVersion})`,
  displayName: 'Script-Version veraltet (intern)',
  to: 'info@kfz-termin.online',
  previewData: { city: 'bonn', scriptVersion: '40.4', currentVersion: '40.5', firstSeenAt: '2026-11-17T08:00:00.000Z' },
} satisfies TemplateEntry
