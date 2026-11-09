import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'
import { cityOrDefault } from '../cities'

interface Props {
  bookingId?: string
  withdrawToken?: string | null
  salutation?: string
  firstName?: string
  lastName?: string
  serviceType?: string
  selectedDates?: string[]
  city?: string | null
}

const SearchRebookConfirmedEmail = ({ bookingId, withdrawToken, salutation, firstName, lastName, serviceType, selectedDates, city }: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wir suchen ab sofort für deine neuen Wunschtermine weiter</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Text style={s.eyebrow}>{cityOrDefault(city).siteName}</Text>
          <Heading style={s.h1}>Deine neuen Wunschtermine sind gespeichert</Heading>
          <Hr style={s.topRule} />
          <s.BookingNumberLine bookingId={bookingId} />

          <Text style={s.text}>
            {firstName ? `Hallo ${firstName},` : 'Hallo,'} danke! Wir suchen ab sofort für deine neuen Wunschtermine weiter:
          </Text>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Deine Wunschtermine</Text>
            {(selectedDates ?? []).map((d, i) => (
              <Text key={i} style={s.value1}>{s.formatDayLong(d)}</Text>
            ))}
            <Text style={s.cardFootnote}>Service: {serviceType || '—'}</Text>
          </Section>

          <Section style={s.infoBox}>
            {s.isInstant(city) ? (
              <Text style={s.infoText}>{s.INSTANT_INFO}</Text>
            ) : (
            <Text style={s.infoText}>
              Sobald wir einen Termin gefunden haben, bekommst du wie gewohnt eine E-Mail von uns und
              eine von der {s.authority(city)}. Den Bestätigungslink der {s.authority(city)} musst du dann
              innerhalb von {s.confirmHours(city)} Stunden anklicken. Bitte schau dann auch in deine Ordner Spam und Werbung.
            </Text>
            )}
          </Section>

          <s.WithdrawLinkLine withdrawToken={withdrawToken} />

          <s.ContactCard />
          <s.MailFooter siteName={cityOrDefault(city).siteName} />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SearchRebookConfirmedEmail,
  subject: 'Deine neuen Wunschtermine sind gespeichert',
  displayName: 'Neue Wunschtermine gespeichert (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    selectedDates: ['2026-10-19', '2026-10-20'],
  },
} satisfies TemplateEntry
