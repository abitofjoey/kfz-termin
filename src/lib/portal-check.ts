import { z } from "zod";

export const PortalCheckBody = z.object({
  city: z.string().min(1).max(50),
  ok: z.boolean(),
  findings: z.array(z.string().max(300)).max(50),
  bereiche: z.array(z.string().max(300)).max(50),
});

export function portalSignature(findings: string[]): string {
  return findings.length === 0 ? "ok" : [...findings].sort().join("\n");
}

export type PortalMail = "changed" | "recovered" | null;

/** Entscheidet, ob gespeichert (changed) und welche Mail verschickt wird. */
export function decidePortalCheck(
  prev: { signature: string } | null,
  next: { ok: boolean; signature: string },
): { changed: boolean; mail: PortalMail } {
  if (!prev) return { changed: true, mail: next.ok ? null : "changed" };
  if (prev.signature === next.signature) return { changed: false, mail: null };
  return { changed: true, mail: next.ok ? "recovered" : "changed" };
}

export const PORTAL_STALE_MS = 48 * 60 * 60 * 1000;

export type PortalDailyLine = { city: string; cityName: string; state: "ok" | "abweichung" | "keine_meldung"; count: number; since: string | null };

export function portalDailyLine(
  city: { slug: string; name: string },
  row: { ok: boolean; findings: unknown; changed_at: string; last_check_at: string } | null,
  now: number,
): PortalDailyLine {
  if (!row || now - new Date(row.last_check_at).getTime() > PORTAL_STALE_MS) {
    return { city: city.slug, cityName: city.name, state: "keine_meldung", count: 0, since: row?.last_check_at ?? null };
  }
  if (row.ok) return { city: city.slug, cityName: city.name, state: "ok", count: 0, since: null };
  const count = Array.isArray(row.findings) ? row.findings.length : 0;
  return { city: city.slug, cityName: city.name, state: "abweichung", count, since: row.changed_at };
}

export const portalDailyNeedsMail = (lines: PortalDailyLine[]) => lines.some((l) => l.state !== "ok");
