import { describe, it, expect } from "vitest";
import { sendConfirmationMails, retryFoundMail, failureReason, compareVersions, parseUserScriptVersion, versionLagAction, type SendFn } from "../mail-retry";

// Fake mail API that burns a key even when the attempt fails (worst case).
function fakeApi(failFirst: boolean) {
  const used = new Set<string>();
  const delivered: string[] = [];
  let fail = failFirst;
  const send: SendFn = async (p) => {
    const key = p.idempotencyKey!;
    if (used.has(key)) return { success: true }; // deduped, nothing delivered
    used.add(key);
    if (fail) return { success: false, error: "boom" };
    delivered.push(key);
    return { success: true };
  };
  return { send, delivered, ok: () => { fail = false; } };
}
const booking = { id: "b1", email: "k@example.com" };

describe("confirmation mails", () => {
  it("ok only when both mails succeed", async () => {
    const send: SendFn = async (p) => ({ success: p.templateName !== "booking-internal-notification" });
    expect((await sendConfirmationMails(send, booking, {})).ok).toBe(false);
    const all: SendFn = async () => ({ success: true });
    expect((await sendConfirmationMails(all, booking, {})).ok).toBe(true);
  });
  it("retry after failed first attempt is really delivered", async () => {
    const api = fakeApi(true);
    expect((await sendConfirmationMails(api.send, booking, {})).ok).toBe(false);
    api.ok();
    const r = await sendConfirmationMails(api.send, booking, {}, { retry: true });
    expect(r.ok).toBe(true);
    expect(api.delivered).toEqual(["booking-confirm-b1-retry", "booking-internal-b1-retry"]);
  });
  it("skipCustomer sends no customer mail and is never ok", async () => {
    const names: string[] = [];
    const send: SendFn = async (p) => { names.push(p.templateName); return { success: true }; };
    const r = await sendConfirmationMails(send, booking, {}, { retry: true, skipCustomer: true });
    expect(names).toEqual(["booking-internal-notification"]);
    expect(r.ok).toBe(false);
  });
  it("suppression reason is reported", () => {
    expect(failureReason({ success: false, reason: "email_suppressed" })).toMatch(/gesperrt/);
  });
});

describe("found mail retry", () => {
  it("retry after failed first attempt is really delivered", async () => {
    const api = fakeApi(true);
    const b = { id: "b2", email: "k@example.com", appointment_at: "2026-11-20T08:30:00Z", found_at: "2026-11-17T08:00:00Z" };
    const firstKey = `booking-found-b2-${new Date(b.appointment_at).toISOString()}`;
    await api.send({ templateName: "appointment-found", idempotencyKey: firstKey });
    api.ok();
    expect((await retryFoundMail(api.send, b)).success).toBe(true);
    expect(api.delivered).toEqual([`${firstKey}-retry`]);
  });
});

describe("version lag", () => {
  const H = 3600_000;
  const now = Date.parse("2026-11-17T20:00:00Z");
  const fresh = new Date(now - 10 * 60_000).toISOString();
  it("compares numerically", () => {
    expect(compareVersions("40.4", "40.10")).toBe(-1);
    expect(compareVersions("41", "40.9")).toBe(1);
    expect(compareVersions("40.4", "40.4")).toBe(0);
  });
  it("parses @version", () => {
    expect(parseUserScriptVersion("// ==UserScript==\n// @name x\n// @version      40.5\n// ==/UserScript==")).toBe("40.5");
  });
  it("records first deviation, alerts only after 12h", () => {
    const a = versionLagAction({ now, lastPollAt: fresh, cityVersion: "40.4", currentVersion: "40.5", existing: null });
    expect(a.kind).toBe("upsert");
    const existing = { city: "bonn", script_version: "40.4", current_version: "40.5", first_seen_at: new Date(now - 11 * H).toISOString(), alert_sent_at: null };
    expect(versionLagAction({ now, lastPollAt: fresh, cityVersion: "40.4", currentVersion: "40.5", existing }).kind).toBe("none");
    expect(versionLagAction({ now, lastPollAt: fresh, cityVersion: "40.4", currentVersion: "40.5", existing: { ...existing, first_seen_at: new Date(now - 13 * H).toISOString() } }).kind).toBe("alert");
    expect(versionLagAction({ now, lastPollAt: fresh, cityVersion: "40.4", currentVersion: "40.5", existing: { ...existing, first_seen_at: new Date(now - 13 * H).toISOString(), alert_sent_at: "x" } }).kind).toBe("none");
  });
  it("heartbeat older than 2h: ignore and delete open entry", () => {
    const old = new Date(now - 3 * H).toISOString();
    const existing = { city: "bonn", script_version: "40.4", current_version: "40.5", first_seen_at: new Date(now - 13 * H).toISOString(), alert_sent_at: null };
    expect(versionLagAction({ now, lastPollAt: old, cityVersion: "40.4", currentVersion: "40.5", existing }).kind).toBe("delete");
    expect(versionLagAction({ now, lastPollAt: old, cityVersion: "40.4", currentVersion: "40.5", existing: null }).kind).toBe("none");
  });
  it("caught up: delete entry", () => {
    const existing = { city: "bonn", script_version: "40.4", current_version: "40.5", first_seen_at: fresh, alert_sent_at: null };
    expect(versionLagAction({ now, lastPollAt: fresh, cityVersion: "40.5", currentVersion: "40.5", existing }).kind).toBe("delete");
  });
});
