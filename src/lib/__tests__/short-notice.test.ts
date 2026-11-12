import { describe, expect, it } from "vitest";
import { areDatesAllowed, computeCalendarBounds, isShortNoticeOnly } from "@/lib/calendar-rules";

const TUE_15 = new Date("2026-11-17T14:00:00Z"); // Di 15:00 Berlin
const TUE_10 = new Date("2026-11-17T09:00:00Z"); // Di 10:00 Berlin
const FRI_15 = new Date("2026-11-13T14:00:00Z"); // Fr 15:00 Berlin

describe("Köln: kurzfristiger Tag nach 14 Uhr", () => {
  it("Dienstag 15 Uhr: morgen ist kurzfristig, minDate übermorgen", () => {
    const b = computeCalendarBounds(TUE_15, "koeln");
    expect(b.shortNoticeDateISO).toBe("2026-11-18");
    expect(b.minDateISO).toBe("2026-11-19");
  });
  it("kurzfristiger Tag nur zusammen mit weiterem Tag", () => {
    expect(areDatesAllowed(["2026-11-18"], TUE_15, "koeln")).toBe(false);
    expect(areDatesAllowed(["2026-11-18", "2026-11-19"], TUE_15, "koeln")).toBe(true);
    expect(areDatesAllowed(["2026-11-19"], TUE_15, "koeln")).toBe(true);
    expect(isShortNoticeOnly(["2026-11-18"], TUE_15, "koeln")).toBe(true);
  });
  it("10 Uhr: kein kurzfristiger Tag, morgen normal erlaubt", () => {
    expect(computeCalendarBounds(TUE_10, "koeln").shortNoticeDateISO).toBeNull();
    expect(areDatesAllowed(["2026-11-18"], TUE_10, "koeln")).toBe(true);
  });
  it("Freitag 15 Uhr: kein kurzfristiger Tag", () => {
    expect(computeCalendarBounds(FRI_15, "koeln").shortNoticeDateISO).toBeNull();
  });
  it("Bonn und Recklinghausen: nie kurzfristiger Tag", () => {
    for (const c of ["bonn", "recklinghausen"]) for (const t of [TUE_15, TUE_10, FRI_15]) {
      expect(computeCalendarBounds(t, c).shortNoticeDateISO).toBeNull();
    }
  });
});
