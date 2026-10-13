import { Body, Container, Head, Heading, Html, Hr, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'

interface Props {
  salutation?: string
  firstName?: string
  lastName?: string
  serviceType?: string
  selectedDates?: string[]
  refundOk?: boolean
  anlass?: 'direkt' | 'gewaehlt' | 'frist'
  searchError?: string | null
}

function intro(anlass: Props['anlass'], searchError: Props['searchError']): string {
  if (anlass === 'frist') {
    return 'da wir innerhalb von 48 Stunden keine neuen Wunschtermine von dir erhalten haben, erstatten wir dir den vollen Betrag.'
  }
  if (anlass === 'gewaehlt') return 'wie gewünscht erstatten wir dir den vollen Betrag.'
  if (searchError === 'email_limit') {
    return 'leider konnten wir im Zeitraum deiner Wunschtermine keinen Termin für dich buchen, da die Zulassungsstelle für deine E-Mail-Adresse keine weitere Buchung zugelassen hat. Das tut uns leid.'
  }
  return 'leider ist auch im Zeitraum deiner neuen Wunschtermine keiner der gewünschten Termine frei geworden. Das tut uns leid.'
}

const SearchNotFoundEmail = ({
  salutation, firstName, lastName, serviceType, selectedDates, refundOk, anlass, searchError,
}: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wir erstatten dir den vollen Betrag</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Text style={s.eyebrow}>{s.SITE_NAME}</Text>
          <Heading style={s.h1}>Deine Rückerstattung</Heading>
          <Hr style={s.topRule} />

          <Text style={s.text}>
            {fullName ? `Hallo ${fullName},` : 'Hallo,'} {intro(anlass, searchError)}
          </Text>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Deine Wunschtermine</Text>
            {(selectedDates ?? []).map((d, i) => (
              <Text key={i} style={s.value1}>{s.formatDayLong(d)}</Text>
            ))}
            <Text style={s.cardFootnote}>Service: {serviceType || '—'}</Text>
          </Section>

          <Section style={s.infoBox}>
            <Text style={s.infoTitle}>Deine Rückerstattung</Text>
            <Text style={s.infoText}>
              {refundOk
                ? 'Wir haben die Rückerstattung des vollen Betrags bereits beantragt. Je nach Zahlungsart und Bank dauert es etwa 5 bis 10 Werktage, bis das Geld wieder bei dir ist. Du musst dafür nichts weiter tun.'
                : 'Wir erstatten dir den vollen Betrag. Die Rückerstattung veranlassen wir in den nächsten Tagen. Du musst dafür nichts weiter tun.'}
            </Text>
          </Section>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Neuer Versuch?</Text>
            <Text style={s.contactLine}>
              Du kannst auch an anderen Tagen zur Zulassungsstelle? Dann buche einfach erneut auf{' '}
              <Link href={s.SITE_URL} style={s.link}>kfz-termin.online</Link>.
            </Text>
            <Text style={s.highlight}>
              Tipp: Wähle möglichst mehrere Wunschtermine aus. Je mehr Tage du angibst, desto höher ist die Chance, dass einer davon frei wird.
            </Text>
          </Section>

          <s.ContactCard />
          <s.MailFooter />
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SearchNotFoundEmail,
  subject: 'Deine Rückerstattung ist beantragt',
  displayName: 'Rückerstattung (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    serviceType: 'Anmeldung Gebrauchtfahrzeug',
    selectedDates: ['2026-10-06', '2026-10-07'],
    refundOk: true,
    anlass: 'frist',
    searchError: null,
  },
} satisfies TemplateEntry
