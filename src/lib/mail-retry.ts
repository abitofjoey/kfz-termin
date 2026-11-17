// Pure helpers for health-check mail retries and script version warnings.

export type SendFn = (p: {
  templateName: string
  recipientEmail?: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}) => Promise<{ success: boolean; reason?: string; error?: string }>

export type ConfirmationResult = {
  ok: boolean
  customer: { success: boolean; reason?: string; error?: string } | null
  internal: { success: boolean; reason?: string; error?: string }
}

/**
 * Sends customer + internal confirmation. The managed mail API may treat a key
 * as used even after a failed attempt, so retries use their own "-retry" keys.
 * skipCustomer: booking already has a search result → no customer mail.
 */
export async function sendConfirmationMails(
  send: SendFn,
  booking: { id: string; email: string },
  templateData: Record<string, any>,
  opts: { retry?: boolean; skipCustomer?: boolean } = {},
): Promise<ConfirmationResult> {
  const sfx = opts.retry ? "-retry" : ""
  const [customer, internal] = await Promise.all([
    opts.skipCustomer
      ? Promise.resolve(null)
      : send({
          templateName: "booking-confirmation",
          recipientEmail: booking.email,
          idempotencyKey: `booking-confirm-${booking.id}${sfx}`,
          templateData,
        }),
    send({
      templateName: "booking-internal-notification",
      idempotencyKey: `booking-internal-${booking.id}${sfx}`,
      templateData,
    }),
  ])
  return { ok: !opts.skipCustomer && !!customer?.success && internal.success, customer, internal }
}

export function failureReason(r: { success: boolean; reason?: string; error?: string } | null | undefined): string | null {
  if (!r || r.success) return null
  if (r.reason === "email_suppressed") return "Empfängeradresse gesperrt (Bounce, Beschwerde oder Abmeldung)"
  return r.error ? r.error.slice(0, 300) : "Unbekannter Fehler"
}

export function foundMailData(b: Record<string, any>) {
  return {
    bookingId: b.id,
    city: b.city,
    salutation: b.salutation,
    firstName: b.first_name,
    lastName: b.last_name,
    email: b.email,
    phone: b.phone,
    serviceType: b.service_type,
    appointmentAt: new Date(b.appointment_at).toISOString(),
    foundAt: new Date(b.found_at).toISOString(),
    bookedLocation: b.booked_location ?? null,
    bookingReference: b.booking_reference ?? null,
    cancelUrl: b.cancel_url ?? null,
    calendarToken: b.calendar_token,
  }
}

/** Retries the "Termin gebucht" customer mail with its own retry key. */
export async function retryFoundMail(send: SendFn, b: Record<string, any>) {
  const data = foundMailData(b)
  return send({
    templateName: "appointment-found",
    recipientEmail: b.email,
    idempotencyKey: `booking-found-${b.id}-${data.appointmentAt}-retry`,
    templateData: data,
  })
}

export function parseUserScriptVersion(source: string): string | null {
  const m = source.match(/^\s*\/\/\s*@version\s+(\S+)/m)
  return m ? m[1].slice(0, 32) : null
}

/** Numeric dotted compare: -1 if a<b, 0 equal, 1 if a>b. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(/[.\-]/), pb = b.split(/[.\-]/)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? "0", y = pb[i] ?? "0"
    const nx = Number(x), ny = Number(y)
    if (!Number.isNaN(nx) && !Number.isNaN(ny)) {
      if (nx !== ny) return nx < ny ? -1 : 1
    } else if (x !== y) return x < y ? -1 : 1
  }
  return 0
}

export type LagRow = { city: string; script_version: string; current_version: string; first_seen_at: string; alert_sent_at: string | null }
export type LagAction =
  | { kind: "delete" }
  | { kind: "none" }
  | { kind: "upsert"; row: Omit<LagRow, "city"> }
  | { kind: "alert"; row: Omit<LagRow, "city"> }

const HOUR = 3600_000

export function versionLagAction(p: {
  now: number
  lastPollAt: string
  cityVersion: string | null
  currentVersion: string | null
  existing: LagRow | null
}): LagAction {
  const fresh = p.now - new Date(p.lastPollAt).getTime() < 2 * HOUR
  if (!fresh || !p.currentVersion || !p.cityVersion) return p.existing ? { kind: "delete" } : { kind: "none" }
  if (compareVersions(p.cityVersion, p.currentVersion) >= 0) return p.existing ? { kind: "delete" } : { kind: "none" }
  const same = p.existing && p.existing.script_version === p.cityVersion && p.existing.current_version === p.currentVersion
  const row = same
    ? { script_version: p.existing!.script_version, current_version: p.existing!.current_version, first_seen_at: p.existing!.first_seen_at, alert_sent_at: p.existing!.alert_sent_at }
    : { script_version: p.cityVersion, current_version: p.currentVersion, first_seen_at: new Date(p.now).toISOString(), alert_sent_at: null }
  if (!row.alert_sent_at && p.now - new Date(row.first_seen_at).getTime() > 12 * HOUR) return { kind: "alert", row }
  return same ? { kind: "none" } : { kind: "upsert", row }
}
