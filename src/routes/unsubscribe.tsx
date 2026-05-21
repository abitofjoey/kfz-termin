import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/unsubscribe')({
  validateSearch: z.object({ token: z.string().optional() }),
  component: UnsubscribePage,
})

type Status = 'loading' | 'ready' | 'already' | 'invalid' | 'success' | 'submitting' | 'error'

function UnsubscribePage() {
  const { token } = useSearch({ from: '/unsubscribe' })
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        if (r.ok && data.valid) setStatus('ready')
        else if (data.alreadyUsed) setStatus('already')
        else setStatus('invalid')
      })
      .catch(() => setStatus('invalid'))
  }, [token])

  const confirm = async () => {
    if (!token) return
    setStatus('submitting')
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      setStatus(r.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          E-Mails abmelden
        </h1>
        {status === 'loading' && <p className="mt-4 text-sm text-muted-foreground">Wird geprüft…</p>}
        {status === 'invalid' && <p className="mt-4 text-sm text-destructive">Dieser Abmelde-Link ist ungültig oder abgelaufen.</p>}
        {status === 'already' && <p className="mt-4 text-sm text-muted-foreground">Sie sind bereits abgemeldet.</p>}
        {status === 'ready' && (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Möchten Sie sich von zukünftigen E-Mails von KFZ-Termin Köln abmelden?
            </p>
            <button onClick={confirm} className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Abmeldung bestätigen
            </button>
          </>
        )}
        {status === 'submitting' && <p className="mt-4 text-sm text-muted-foreground">Wird verarbeitet…</p>}
        {status === 'success' && <p className="mt-4 text-sm text-foreground">Sie wurden erfolgreich abgemeldet.</p>}
        {status === 'error' && <p className="mt-4 text-sm text-destructive">Etwas ist schiefgegangen. Bitte später erneut versuchen.</p>}
      </div>
    </main>
  )
}
