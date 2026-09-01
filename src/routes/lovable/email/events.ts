import { createEmailWebhookHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'

// Reacts to terminal email outcomes (bounce, complaint, unsubscribe) by keeping
// the app's own notification tables in sync. Lovable enforces suppression at
// send time — these rows are a convenience view, never a send gate.

async function recordOutcome(params: {
  recipient: string
  reason: 'bounce' | 'complaint' | 'unsubscribe'
  status: 'bounced' | 'complained' | 'suppressed'
  message: string
  messageId?: string | null
  eventId: string
}) {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const email = params.recipient.toLowerCase()

  const { error: suppressError } = await supabaseAdmin
    .from('suppressed_emails')
    .upsert({ email, reason: params.reason, metadata: null }, { onConflict: 'email' })

  if (suppressError) {
    console.error('Failed to upsert suppressed email', {
      error: { code: suppressError.code, message: suppressError.message },
      event_id: params.eventId,
    })
    throw new Error('Failed to write suppression')
  }

  const { error: insertError } = await supabaseAdmin.from('email_send_log').insert({
    message_id: params.messageId ?? null,
    template_name: 'system',
    recipient_email: email,
    status: params.status,
    error_message: params.message,
    metadata: null,
  })

  if (insertError) {
    // Non-fatal — the suppression record is already stored.
    console.warn('Failed to insert email_send_log', {
      error: { code: insertError.code, message: insertError.message },
      event_id: params.eventId,
    })
  }
}

export const Route = createFileRoute("/lovable/email/events")({
  server: {
    handlers: {
      POST: ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY']
        if (!apiKey) {
          console.error('Missing required environment variables')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const handler = createEmailWebhookHandler({
          apiKey,
          on: {
            'email.bounced': async (event) => {
              await recordOutcome({
                recipient: event.data.recipient,
                reason: 'bounce',
                status: 'bounced',
                message: 'Permanent bounce — email address is invalid or rejected',
                messageId: event.data.message_id,
                eventId: event.event_id,
              })
            },
            'email.complaint': async (event) => {
              await recordOutcome({
                recipient: event.data.recipient,
                reason: 'complaint',
                status: 'complained',
                message: 'Spam complaint — recipient marked email as spam',
                messageId: event.data.message_id,
                eventId: event.event_id,
              })
            },
            'email.unsubscribed': async (event) => {
              await recordOutcome({
                recipient: event.data.recipient,
                reason: 'unsubscribe',
                status: 'suppressed',
                message: 'Recipient unsubscribed',
                messageId: event.data.message_id,
                eventId: event.event_id,
              })
            },
          },
        })
        return handler(request)
      },
    },
  },
})
