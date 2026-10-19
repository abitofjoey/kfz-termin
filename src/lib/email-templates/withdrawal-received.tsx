import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'
import { formatBerlinLong } from './format-berlin'

interface Props {
  bookingId?: string | null
  name?: string
  email?: string
  contractReference?: string | null
  bookingSummary?: string | null
  receivedAt?: string
}

const WithdrawalReceivedEmail = ({ bookingId, name, email, contractReference, bookingSummary, receivedAt }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Wir haben deinen Widerruf erhalten</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>{s.SITE_NAME}</Text>
        <Heading style={s.h1}>Eingangsbestätigung deines Widerrufs</Heading>
        <Hr style={s.topRule} />
        <s.BookingNumberLine bookingId={bookingId} />

        <Text style={s.text}>Hallo,</Text>
        <Text style={s.text}>
          wir bestätigen dir hiermit den Eingang deiner Widerrufserklärung am {formatBerlinLong(receivedAt)}.
          Wir bearbeiten sie jetzt und melden uns bei dir.
        </Text>

        <Section style={s.card}>
          <Text style={s.cardTitle}>Inhalt deiner Erklärung</Text>
          <Text style={s.value1}>Ich widerrufe hiermit den von mir abgeschlossenen Vertrag.</Text>
          <Text style={s.contactLine}>Name: {name || '—'}</Text>
          <Text style={s.contactLine}>E-Mail: {email || '—'}</Text>
          {bookingSummary ? <Text style={s.contactLine}>Buchung: {bookingSummary}</Text> : null}
          {contractReference ? <Text style={s.contactLine}>Angaben zur Buchung: {contractReference}</Text> : null}
          <Text style={s.cardFootnote}>Eingegangen am {formatBerlinLong(receivedAt)}</Text>
        </Section>

        <s.ContactCard />
        <s.MailFooter />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WithdrawalReceivedEmail,
  subject: 'Eingangsbestätigung deines Widerrufs',
  displayName: 'Widerruf – Eingangsbestätigung (Kunde)',
  previewData: {
    bookingId: '45a1000a-e1c9-4635-8ebc-3b2aa4f53cd5',
    name: 'Max Mustermann',
    email: 'max@example.com',
    contractReference: null,
    bookingSummary: '45A1000A · Anmeldung Gebrauchtfahrzeug · Freitag, 20.11.2026',
    receivedAt: '2026-10-19T20:57:00Z',
  },
} satisfies TemplateEntry
