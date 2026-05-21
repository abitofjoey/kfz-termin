import * as React from 'react'
import { render } from '@react-email/components'
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'KFZ-Termin Köln'
const SENDER_DOMAIN = 'notify.kfz-termin.online'
// Absender: nutzt die verifizierte Subdomain für garantierte Zustellung.
// Antworten landen ebenfalls hier (bzw. an die Reply-To-Adresse).
const FROM_ADDRESS = `${SITE_NAME} <buchung@${SENDER_DOMAIN}>`

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function sendTransactionalEmailServer(params: {
  templateName: string
  recipientEmail?: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}): Promise<{ success: boolean; reason?: string; error?: string }> {
  const { templateName, recipientEmail, templateData = {} } = params
  const template = TEMPLATES[templateName]
  if (!template) return { success: false, error: `Template '${templateName}' not found` }

  const effectiveRecipient = template.to || recipientEmail
  if (!effectiveRecipient) return { success: false, error: 'recipientEmail required' }

  const messageId = crypto.randomUUID()
  const idempotencyKey = params.idempotencyKey || messageId
  const normalizedEmail = effectiveRecipient.toLowerCase()

  // Suppression check
  const { data: suppressed } = await supabaseAdmin
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (suppressed) {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'suppressed',
    })
    return { success: false, reason: 'email_suppressed' }
  }

  // Unsubscribe token (get or create)
  let unsubscribeToken: string
  const { data: existingToken } = await supabaseAdmin
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else {
    unsubscribeToken = generateToken()
    await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    const { data: stored } = await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token
  }

  // Render
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const plainText = await render(element, { plainText: true })
  const resolvedSubject =
    typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: effectiveRecipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabaseAdmin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: effectiveRecipient,
      from: FROM_ADDRESS,
      reply_to: 'buchung@kfz-termin.online',
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: effectiveRecipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return { success: false, error: 'Failed to enqueue email' }
  }

  return { success: true }
}
