import type { TemplateEntry } from './registry'
import { HealthLayout, Row } from './health-internal-parts'
import { formatBerlinShort } from './format-berlin'
import { Text } from '@react-email/components'

type Candidate = { number: string; name: string; service: string; status: string }

interface Props {
  name?: string
  email?: string
  contractReference?: string | null
  source?: 'link' | 'formular'
  outcome?: string
  receivedAt?: string
  bookingNumber?: string | null
  bookingId?: string | null
  serviceType?: string | null
  refundStatus?: string | null
  candidates?: Candidate[]
  withdrawalId?: string
}

const OUTCOME_TEXT: Record<string, string> = {
  erstattet: 'Suche beendet, volle Erstattung ausgelöst',
  manuell: 'Keine eindeutige Zuordnung – bitte manuell bearbeiten',
  bereits_erstattet: 'Erstattung war bereits beantragt/erfolgt',
  termin_gefunden: 'Termin bereits gefunden – nicht automatisch bearbeitet',
}

const WithdrawalInternalEmail = (p: Props) => (
  <HealthLayout title="Widerruf eingegangen" notice={OUTCOME_TEXT[p.outcome ?? ''] ?? p.outcome ?? '—'}>
    <Row label="Name" value={p.name} />
    <Row label="E-Mail" value={p.email} />
    <Row label="Angaben zur Buchung" value={p.contractReference ?? undefined} />
    <Row label="Quelle" value={p.source === 'link' ? 'Persönlicher Link' : 'Formular'} />
    <Row label="Eingang" value={formatBerlinShort(p.receivedAt)} />
    <Row
      label="Zugeordnete Buchung"
      value={p.bookingNumber ? `${p.bookingNumber}${p.serviceType ? ` · ${p.serviceType}` : ''}` : 'keine eindeutige Zuordnung'}
    />
    {p.refundStatus ? <Row label="Erstattung" value={p.refundStatus} /> : null}
    {p.outcome === 'manuell' ? (
      p.candidates && p.candidates.length > 0 ? (
        <>
          <Row label="Kandidaten" value={`${p.candidates.length} Buchung(en) mit dieser E-Mail`} />
          {p.candidates.map((c, i) => (
            <Text key={i} style={{ fontSize: '13px', color: '#1a2540', margin: '0 0 4px' }}>
              {c.number} · {c.name} · {c.service} · {c.status}
            </Text>
          ))}
        </>
      ) : (
        <Row label="Kandidaten" value="keine Buchung mit dieser E-Mail gefunden" />
      )
    ) : null}
    <Row label="Buchungs-ID" value={p.bookingId ?? undefined} mono />
    <Row label="Widerruf-ID" value={p.withdrawalId} mono />
  </HealthLayout>
)

export const template = {
  component: WithdrawalInternalEmail,
  to: 'info@kfz-termin.online',
  subject: (d: Record<string, any>) => `Widerruf (${d.outcome ?? '—'}): ${d.name ?? '—'}`,
  displayName: 'Widerruf (intern)',
  previewData: {
    name: 'Max Mustermann', email: 'max@example.com', contractReference: '45A1000A', source: 'formular',
    outcome: 'manuell', receivedAt: '2026-10-19T20:57:00Z', bookingNumber: null, bookingId: null,
    candidates: [{ number: '45A1000A', name: 'Max Mustermann', service: 'Anmeldung Gebrauchtfahrzeug', status: 'Suche läuft' }],
    withdrawalId: '00000000-0000-0000-0000-000000000000',
  },
} satisfies TemplateEntry
