export const SCRIPT_FILES = { "kfz-termin.user.js": "user", "kfz-termin.meta.js": "meta" } as const;
export type ScriptKind = (typeof SCRIPT_FILES)[keyof typeof SCRIPT_FILES];

/** Liefert den Token nur, wenn er gesetzt und mindestens 32 Zeichen lang ist. */
export function validUpdateToken(secret: string | undefined | null): string | null {
  return secret && secret.length >= 32 ? secret : null;
}

/** Zeitkonstanter Vergleich (Länge wird über das längere Wort geprüft). */
export function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  const len = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export function extractMetaBlock(source: string): string | null {
  const start = source.indexOf("// ==UserScript==");
  if (start < 0) return null;
  const endMarker = "// ==/UserScript==";
  const end = source.indexOf(endMarker, start);
  if (end < 0) return null;
  return source.slice(start, end + endMarker.length) + "\n";
}

export function injectToken(source: string, token: string): string {
  return source.split("{{UPDATE_TOKEN}}").join(token);
}

export function normalizeScriptVersion(v: string | null): string | null {
  const t = v?.trim();
  return t ? t.slice(0, 32) : null;
}
