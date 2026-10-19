import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'
import { formatBerlinLong } from './format-berlin'

interface Props {
  bookingId?: string
  firstName?: string
  appointmentAt?: string
}

const WithdrawnFoundEmail = ({ bookingId, firstName, appointmentAt }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Du musst nichts tun</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>{s.SITE_NAME}</Text>
        <Heading style={s.h1}>Termin kurz vor deinem Widerruf</Heading>
        <Hr style={s.topRule} />
        <s.BookingNumberLine bookingId={bookingId} />
        <Text style={s.text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
        <Text style={s.text}>
          Wir hatten kurz vor deinem Widerruf noch einen Termin gefunden. Du musst nichts tun – klicke den
          Bestätigungslink der Zulassungsstelle einfach nicht an, dann verfällt der Termin nach 3 Stunden.
        </Text>
        <Section style={s.card}>
          <Text style={s.cardTitle}>Betroffener Termin</Text>
          <Text style={s.value1}>{formatBerlinLong(appointmentAt)}</Text>
        </Section>
        <s.ContactCard />
        <s.MailFooter />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WithdrawnFoundEmail,
  subject: 'Du musst nichts tun – Termin verfällt automatisch',
  displayName: 'Termin kurz vor Widerruf (Kunde)',
  previewData: { bookingId: '45a1000a-e1c9-4635-8ebc-3b2aa4f53cd5', firstName: 'Max', appointmentAt: '2026-11-20T07:20:00Z' },
} satisfies TemplateEntry
