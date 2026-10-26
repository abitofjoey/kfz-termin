import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'

interface Props {
  bookingId?: string
  withdrawToken?: string | null
  firstName?: string
  serviceType?: string
  selectedDates?: string[]
}

const SearchDatesUpdatedEmail = ({ bookingId, withdrawToken, firstName, serviceType, selectedDates }: Props) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Deine Wunschtermine wurden aktualisiert</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>{s.SITE_NAME}</Text>
        <Heading style={s.h1}>Deine Wunschtermine wurden aktualisiert</Heading>
        <Hr style={s.topRule} />
        <s.BookingNumberLine bookingId={bookingId} />

        <Text style={s.text}>
          {firstName ? `Hallo ${firstName},` : 'Hallo,'} wir haben deine Wunschtermine aktualisiert und suchen
          ab sofort für diese Tage weiter:
        </Text>

        <Section style={s.card}>
          <Text style={s.cardTitle}>Deine Wunschtermine</Text>
          {(selectedDates ?? []).map((d, i) => (
            <Text key={i} style={s.value1}>{s.formatDayLong(d)}</Text>
          ))}
          <Text style={s.cardFootnote}>Service: {serviceType || '—'}</Text>
        </Section>

        <s.WithdrawLinkLine withdrawToken={withdrawToken} />

        <s.ContactCard />
        <s.MailFooter />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SearchDatesUpdatedEmail,
  subject: 'Deine Wunschtermine wurden aktualisiert',
  displayName: 'Wunschtermine aktualisiert (Kunde)',
  previewData: {
    firstName: 'Max',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    selectedDates: ['2026-11-19', '2026-11-20'],
  },
} satisfies TemplateEntry
