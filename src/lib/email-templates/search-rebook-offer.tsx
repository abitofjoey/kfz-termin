import { Body, Button, Container, Head, Heading, Html, Hr, Link, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './customer-email-parts'

interface Props {
  salutation?: string
  firstName?: string
  lastName?: string
  rebookToken?: string
  deadline?: string
}

const SearchRebookOfferEmail = ({ salutation, firstName, lastName, rebookToken, deadline }: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  const url = `${s.SITE_URL}/termine-aendern?t=${rebookToken ?? ''}`
  const refundUrl = `${url}&aktion=erstattung`
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Wähle neue Wunschtermine oder lass dir dein Geld erstatten</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Text style={s.eyebrow}>{s.SITE_NAME}</Text>
          <Heading style={s.h1}>Leider kein Termin frei geworden</Heading>
          <Hr style={s.topRule} />

          <Text style={s.text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
          <Text style={s.text}>
            leider ist im Zeitraum deiner Wunschtermine keiner der gewünschten
            Termine bei der Kölner Zulassungsstelle frei geworden. Das tut uns leid.
            Du hast zwei Möglichkeiten:
          </Text>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Andere Termine wählen</Text>
            <Text style={s.text}>
              Wähle einfach neue Wunschtage aus, wir suchen sofort weiter. Du musst nichts erneut bezahlen.
            </Text>
            <Button href={url} style={s.button}>Neue Termine wählen</Button>
            <Text style={s.cardFootnote}>
              Tipp: Je mehr Tage du auswählst, desto höher ist die Chance, dass einer davon frei wird.
            </Text>
          </Section>

          <Section style={s.card}>
            <Text style={s.cardTitle}>Lieber dein Geld zurück?</Text>
            <Text style={s.contactLine}>Kein Problem, das geht mit einem Klick.</Text>
            <Text style={s.contactLine}>
              <Link href={refundUrl} style={s.link}>Rückerstattung anfordern</Link>
            </Text>
          </Section>

          <Section style={s.infoBox}>
            <Text style={s.infoText}>
              Wenn wir bis {s.formatDeadline(deadline)} nichts von dir hören, erstatten wir dir
              automatisch den vollen Betrag. Du musst dafür nichts tun.
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
  component: SearchRebookOfferEmail,
  subject: 'Leider kein Termin frei geworden – möchtest du andere Tage probieren?',
  displayName: 'Kein Termin – Angebot neue Termine (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    rebookToken: '00000000-0000-0000-0000-000000000000',
    deadline: '2026-10-15T15:46:00Z',
  },
} satisfies TemplateEntry
