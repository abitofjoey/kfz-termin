import { Body, Container, Head, Heading, Html, Hr, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'
import { cityOrDefault } from '../cities'
import { formatBerlinLong } from './format-berlin'

interface Props {
  bookingId?: string
  firstName?: string
  appointmentAt?: string
  city?: string | null
  cancelUrl?: string | null
}

const WithdrawnFoundEmail = ({ bookingId, firstName, appointmentAt, city, cancelUrl }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Du musst nichts tun</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>{cityOrDefault(city).siteName}</Text>
        <Heading style={s.h1}>Termin kurz vor deinem Widerruf</Heading>
        <Hr style={s.topRule} />
        <s.BookingNumberLine bookingId={bookingId} />
        <Text style={s.text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
        {s.isInstant(city) ? (
          <Text style={s.text}>
            Wir hatten kurz vor deinem Widerruf noch einen Termin gebucht. Bitte storniere ihn über diesen
            Link, damit der Termin wieder frei wird:{' '}
            {cancelUrl ? <Link href={cancelUrl} style={s.link}>Termin stornieren</Link> : `Den Stornolink findest du in der Bestätigung ${authorityOf(cityOrDefault(city))}.`}
          </Text>
        ) : (
        <Text style={s.text}>
          Wir hatten kurz vor deinem Widerruf noch einen Termin gefunden. Du musst nichts tun – klicke den
          Bestätigungslink der {s.authority(city)} einfach nicht an, dann verfällt der Termin nach {s.confirmHours(city)} Stunden.
        </Text>
        )}
        <Section style={s.card}>
          <Text style={s.cardTitle}>Betroffener Termin</Text>
          <Text style={s.value1}>{formatBerlinLong(appointmentAt)}</Text>
        </Section>
        <s.ContactCard />
        <s.MailFooter siteName={cityOrDefault(city).siteName} />
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
