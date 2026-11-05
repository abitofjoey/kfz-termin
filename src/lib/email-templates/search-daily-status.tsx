import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'
import { cityOrDefault } from '../cities'

interface Props {
  bookingId?: string
  firstName?: string
  serviceType?: string
  variant?: 'wunschtag' | 'zwischenstand'
  today?: string
  remainingDates?: string[]
  city?: string | null
}

const SUBJECT_WUNSCHTAG = 'Heute kein freier Termin – wir suchen morgen weiter'
const SUBJECT_ZWISCHENSTAND = 'Zwischenstand: Wir suchen weiter für dich'

const SearchDailyStatusEmail = ({ bookingId, firstName, serviceType, variant, today, remainingDates, city }: Props) => {
  const isDay = variant === 'wunschtag'
  const title = isDay ? SUBJECT_WUNSCHTAG : SUBJECT_ZWISCHENSTAND
  const greeting = firstName ? `Hallo ${firstName},` : 'Hallo,'
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>{title}</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Text style={s.eyebrow}>{cityOrDefault(city).siteName}</Text>
          <Heading style={s.h1}>{title}</Heading>
          <Hr style={s.topRule} />
          <s.BookingNumberLine bookingId={bookingId} />

          <Text style={s.text}>
            {greeting}{' '}
            {s.isInstant(city)
              ? isDay
                ? `für heute, ${today ? s.formatDayLong(today) : 'deinen Wunschtag'}, ist ${cityOrDefault(city).mail.atAuthority} leider kein passender Termin frei geworden. Wir suchen rund um die Uhr automatisch weiter – für deine übrigen Wunschtermine:`
                : 'kurzer Zwischenstand: Bisher ist für deine Wunschtermine leider noch kein passender Termin frei geworden. Wir suchen rund um die Uhr automatisch weiter – für diese Tage:'
              : isDay
              ? `für heute, ${today ? s.formatDayLong(today) : 'deinen Wunschtag'}, ist bei der Zulassungsstelle leider kein passender Termin frei geworden. Wir suchen morgen ab 6:00 Uhr automatisch weiter – für deine übrigen Wunschtermine:`
              : 'kurzer Zwischenstand: Bisher ist für deine Wunschtermine leider noch kein passender Termin frei geworden. Wir suchen täglich von 6:00 bis 20:00 Uhr automatisch weiter – für diese Tage:'}
          </Text>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Deine übrigen Wunschtermine</Text>
            {(remainingDates ?? []).map((d, i) => (
              <Text key={i} style={s.value1}>{s.formatDayLong(d)}</Text>
            ))}
            <Text style={s.cardFootnote}>Service: {serviceType || '—'}</Text>
          </Section>

          <Section style={s.infoBox}>
            {s.isInstant(city) ? (
              <Text style={s.infoText}>{s.INSTANT_INFO}</Text>
            ) : (
            <Text style={s.infoText}>
              Sobald wir einen Termin gebucht haben, bekommst du sofort eine E-Mail von uns und den
              Bestätigungslink der Zulassungsstelle. Bitte schau dann auch in deinen Spam-Ordner.
            </Text>
            )}
          </Section>

          <s.ContactCard />
          <s.MailFooter siteName={cityOrDefault(city).siteName} />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SearchDailyStatusEmail,
  subject: (d: Record<string, any>) => (d.variant === 'wunschtag' ? SUBJECT_WUNSCHTAG : SUBJECT_ZWISCHENSTAND),
  displayName: 'Abendlicher Zwischenstand (Kunde)',
  previewData: {
    firstName: 'Max',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    variant: 'wunschtag',
    today: '2026-10-28',
    remainingDates: ['2026-10-29', '2026-10-30'],
  },
} satisfies TemplateEntry
