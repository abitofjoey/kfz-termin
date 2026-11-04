import { internalPrefix } from '../cities'

export const isInternalTemplate = (name: string) =>
  name.endsWith('-internal') || name === 'booking-internal-notification'

/** Betreff mit Stadt-Präfix für interne Mails; Kundenmails bleiben unverändert. */
export function finalSubject(templateName: string, subject: string, city?: string | null) {
  return isInternalTemplate(templateName) ? internalPrefix(city) + subject : subject
}
