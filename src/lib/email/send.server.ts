import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const REPLY_TO = 'buchung@kfz-termin.online'

async function logSend(params: {
  templateName: string
  recipientEmail: string
  status: 'sent' | 'suppressed' | 'failed'
  errorMessage?: string
}) {
  const { error } = await supabaseAdmin.from('email_send_log').insert({
    message_id: null,
    template_name: params.templateName,
    recipient_email: params.recipientEmail,
    status: params.status,
    error_message: params.errorMessage ?? null,
  })
  if (error) {
    console.error('Failed to write email_send_log', {
      code: error.code,
      message: error.message,
    })
  }
}

/**
 * Sends a registered template through Lovable's managed email delivery and
 * keeps the app's own send log in sync. Suppression, retries and unsubscribe
 * handling are enforced by Lovable.
 */
export async function sendTransactionalEmailServer(params: {
  templateName: string
  recipientEmail?: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}): Promise<{ success: boolean; reason?: string; error?: string }> {
  const { templateName, recipientEmail, templateData = {} } = params

  try {
    const result = await sendTemplateEmail(templateName, recipientEmail ?? '', {
      templateData,
      idempotencyKey: params.idempotencyKey,
      replyTo: REPLY_TO,
    })

    if (!result.sent) {
      await logSend({
        templateName,
        recipientEmail: recipientEmail ?? '',
        status: 'suppressed',
      })
      return { success: false, reason: 'email_suppressed' }
    }

    await logSend({
      templateName,
      recipientEmail: recipientEmail ?? '',
      status: 'sent',
    })
    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    await logSend({
      templateName,
      recipientEmail: recipientEmail ?? '',
      status: 'failed',
      errorMessage: message,
    })
    return { success: false, error: message }
  }
}
