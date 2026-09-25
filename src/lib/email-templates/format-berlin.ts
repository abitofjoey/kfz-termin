const TZ = 'Europe/Berlin'

function valid(iso?: string): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

/** "Dienstag, 06. Oktober 2026 um 08:20 Uhr" */
export function formatBerlinLong(iso?: string): string {
  const d = valid(iso)
  if (!d) return '—'
  const date = new Intl.DateTimeFormat('de-DE', {
    timeZone: TZ, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(d)
  return `${date} um ${formatBerlinTime(iso)} Uhr`
}

/** "06.10.2026, 08:20 Uhr" */
export function formatBerlinShort(iso?: string): string {
  const d = valid(iso)
  if (!d) return '—'
  const date = new Intl.DateTimeFormat('de-DE', {
    timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(d)
  return `${date}, ${formatBerlinTime(iso)} Uhr`
}

/** "HH:MM" */
export function formatBerlinTime(iso?: string, addHours = 0): string {
  const d = valid(iso)
  if (!d) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(d.getTime() + addHours * 3600_000))
}
