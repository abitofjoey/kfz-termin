import { describe, it, expect } from "vitest";
import { PortalCheckBody, portalSignature, decidePortalCheck, portalDailyLine, portalDailyNeedsMail } from "../portal-check";

const city = { slug: "bonn", name: "Bonn" };
const NOW = Date.parse("2026-11-11T18:00:00Z");

describe("portal-check", () => {
  it("signature sortiert, leer = ok", () => {
    expect(portalSignature([])).toBe("ok");
    expect(portalSignature(["b", "a"])).toBe("a\nb");
  });
  it("Grenzen 50 Einträge / 300 Zeichen", () => {
    const base = { city: "bonn", ok: false, bereiche: [] };
    expect(PortalCheckBody.safeParse({ ...base, findings: Array(50).fill("x") }).success).toBe(true);
    expect(PortalCheckBody.safeParse({ ...base, findings: Array(51).fill("x") }).success).toBe(false);
    expect(PortalCheckBody.safeParse({ ...base, findings: ["x".repeat(301)] }).success).toBe(false);
  });
  it("neuer Eintrag: Mail nur bei ok=false", () => {
    expect(decidePortalCheck(null, { ok: true, signature: "ok" })).toEqual({ changed: true, mail: null });
    expect(decidePortalCheck(null, { ok: false, signature: "a" })).toEqual({ changed: true, mail: "changed" });
  });
  it("unverändert: keine Mail", () => {
    expect(decidePortalCheck({ signature: "a" }, { ok: false, signature: "a" })).toEqual({ changed: false, mail: null });
  });
  it("geändert bzw. wieder ok", () => {
    expect(decidePortalCheck({ signature: "a" }, { ok: false, signature: "b" }).mail).toBe("changed");
    expect(decidePortalCheck({ signature: "a" }, { ok: true, signature: "ok" }).mail).toBe("recovered");
  });
  it("Tagesmail nur bei Abweichung oder über 48 h ohne Meldung", () => {
    const ok = portalDailyLine(city, { ok: true, findings: [], changed_at: "2026-11-10T00:00:00Z", last_check_at: "2026-11-11T17:00:00Z" }, NOW);
    expect(ok.state).toBe("ok");
    expect(portalDailyNeedsMail([ok])).toBe(false);
    const stale = portalDailyLine(city, { ok: true, findings: [], changed_at: "2026-11-01T00:00:00Z", last_check_at: "2026-11-09T17:59:00Z" }, NOW);
    expect(stale.state).toBe("keine_meldung");
    expect(portalDailyNeedsMail([ok, stale])).toBe(true);
    const bad = portalDailyLine(city, { ok: false, findings: ["a", "b"], changed_at: "2026-11-10T00:00:00Z", last_check_at: "2026-11-11T17:00:00Z" }, NOW);
    expect(bad).toMatchObject({ state: "abweichung", count: 2 });
    expect(portalDailyLine(city, null, NOW).state).toBe("keine_meldung");
  });
});
