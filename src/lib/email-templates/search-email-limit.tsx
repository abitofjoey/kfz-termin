import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'
import { BookingNumberLine, WithdrawLinkLine } from './customer-email-parts'
import { button } from './customer-email-parts'

const SITE_NAME = 'KFZ-Termin Köln'
const CONTACT_EMAIL = 'info@kfz-termin.online'
const SITE_URL = 'https://kfz-termin.online'

interface Props {
  bookingId?: string
  withdrawToken?: string | null
  salutation?: string
  firstName?: string
  lastName?: string
  email?: string
  emailChangeToken?: string | null
}

const SearchEmailLimitEmail = ({ bookingId, withdrawToken, salutation, firstName, lastName, email, emailChangeToken }: Props) => {
  const fullName = [salutation, firstName, lastName].filter(Boolean).join(' ')
  return (
    <Html lang="de" dir="ltr">
      <Head />
      <Preview>Die Zulassungsstelle lässt für deine Adresse keine weitere Buchung zu</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>{SITE_NAME}</Text>
          <Heading style={h1}>Wir brauchen kurz deine Hilfe</Heading>
          <Hr style={topRule} />
          <BookingNumberLine bookingId={bookingId} />

          <Text style={text}>{firstName ? `Hallo ${firstName},` : 'Hallo,'}</Text>
          <Text style={text}>
            wir hatten bereits einen passenden Termin für dich gefunden, konnten
            ihn aber nicht buchen: Die Zulassungsstelle Köln lässt für deine
            E-Mail-Adresse {email || 'deine Adresse'} aktuell keine weitere Buchung zu. Das passiert,
            wenn mit dieser Adresse bereits ein Termin bei der Zulassungsstelle
            besteht.
          </Text>

          <Section style={warnBox}>
            <Text style={warnTitle}>So geht es weiter</Text>
            <Text style={warnText}>
              Antworte einfach auf diese E-Mail mit einer anderen E-Mail-Adresse,
              auf die du Zugriff hast. An diese Adresse schickt die Zulassungsstelle
              später auch den Bestätigungslink.
            </Text>
            <Text style={{ ...warnText, marginTop: '10px' }}>
              Alternativ kannst du deinen bestehenden Termin bei der
              Zulassungsstelle stornieren und uns kurz Bescheid geben.
            </Text>
            <Text style={{ ...warnText, marginTop: '10px' }}>
              Sobald wir von dir hören, suchen wir sofort weiter.
            </Text>
          </Section>

          {emailChangeToken ? (
            <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
              <Button href={`${SITE_URL}/email-aendern?token=${emailChangeToken}`} style={button}>
                Andere E-Mail-Adresse eintragen
              </Button>
              <Text style={{ ...text, fontSize: '13px', margin: '16px 0 0' }}>
                <Link href={`${SITE_URL}/email-aendern?token=${emailChangeToken}&aktion=storniert`} style={link}>
                  Ich habe meinen bestehenden Termin bei der Zulassungsstelle storniert – mit dieser Adresse weitersuchen
                </Link>
              </Text>
            </Section>
          ) : null}

          <Section style={infoBox}>
            <Text style={infoText}>
              Deine Wunschtermine bleiben bestehen. Hören wir bis zum Ende deines
              Wunschzeitraums nichts von dir, erstatten wir dir den vollen Betrag.
            </Text>
          </Section>

          <WithdrawLinkLine withdrawToken={withdrawToken} />

          <Section style={card}>
            <Text style={cardTitle}>Fragen?</Text>
            <Text style={contactLine}>
              E-Mail: <Link href={`mailto:${CONTACT_EMAIL}`} style={link}>{CONTACT_EMAIL}</Link>
            </Text>
            <Text style={contactLine}>
              WhatsApp: <Link href="https://wa.me/4915153461798" style={link}>+49 151 53461798</Link>
            </Text>
            <Text style={contactLine}>
              Telefon: <Link href="tel:+4915153461798" style={link}>+49 151 53461798</Link>
            </Text>
            <Text style={cardFootnote}>Oder antworte einfach auf diese E-Mail.</Text>
          </Section>

          <Text style={footerHint}>Bei Fragen antworte einfach auf diese E-Mail.</Text>
          <Text style={footerEmail}>{CONTACT_EMAIL}</Text>
          <Text style={footer}>
            Herzliche Grüße<br />Dein Team von {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SearchEmailLimitEmail,
  subject: 'Wichtig: Bitte nenne uns eine andere E-Mail-Adresse',
  displayName: 'E-Mail-Limit der Stadt (Kunde)',
  previewData: {
    salutation: 'Herr',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const eyebrow = {
  fontSize: '12px', fontWeight: 600 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 8px',
}
const h1 = { fontSize: '28px', fontWeight: 700 as const, color: '#1a2540', margin: '0 0 16px', letterSpacing: '-0.02em' }
const topRule = { borderColor: '#e5e7eb', margin: '0 0 24px' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }
const infoBox = {
  backgroundColor: '#eaf2ff', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', borderLeft: '3px solid #1a4fa3',
}
const infoText = { fontSize: '14px', color: '#1a4fa3', lineHeight: '1.6', margin: 0 }
const card = {
  backgroundColor: '#f7f8fa', borderRadius: '10px', padding: '20px 22px', margin: '20px 0',
  border: '1px solid #eceff3',
}
const cardTitle = {
  fontSize: '12px', fontWeight: 700 as const, color: '#6b7280',
  textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 14px',
}
const cardFootnote = { fontSize: '13px', color: '#6b7280', margin: '14px 0 0', lineHeight: '1.5' }
const warnBox = {
  backgroundColor: '#fef3c7', borderRadius: '10px', padding: '18px 22px',
  margin: '20px 0', border: '1px solid #fde68a',
}
const warnTitle = { fontSize: '15px', fontWeight: 700 as const, color: '#78350f', margin: '0 0 8px' }
const warnText = { fontSize: '14px', color: '#78350f', lineHeight: '1.6', margin: 0 }
const contactLine = { fontSize: '14px', color: '#1a2540', margin: '0 0 6px' }
const link = { color: '#1a4fa3', textDecoration: 'underline' }
const footerHint = { fontSize: '14px', color: '#374151', margin: '24px 0 4px' }
const footerEmail = { fontSize: '14px', color: '#1a2540', margin: '0 0 24px', fontWeight: 500 as const }
const footer = { fontSize: '14px', color: '#6b7280', margin: '24px 0 0' }
