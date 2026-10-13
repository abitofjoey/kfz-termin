import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { ReactNode } from 'react'

export const formatDate = (d?: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d ?? '')
  return m ? `${m[3]}.${m[2]}.${m[1]}` : d || '—'
}

export const HealthLayout = ({ title, notice, children }: { title: string; notice: string; children?: ReactNode }) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{title}</Heading>
        <Text style={noticeStyle}>{notice}</Text>
        {children ? <Section style={card}>{children}</Section> : null}
      </Container>
    </Body>
  </Html>
)

export const Row = ({ label: l, value: v, mono }: { label: string; value?: string; mono?: boolean }) => (
  <>
    <Text style={label}>{l}</Text>
    <Text style={{ ...value, ...(mono ? monoStyle : {}) }}>{v || '—'}</Text>
  </>
)

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 20px', letterSpacing: '-0.02em' }
const noticeStyle = { fontSize: '14px', color: '#1a2540', lineHeight: '1.5', margin: '12px 0 16px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '20px 22px' }
const label = { fontSize: '11px', fontWeight: 600 as const, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.06em', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a2540', margin: '0 0 4px' }
const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#374151' }
