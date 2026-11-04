import { describe, it, expect } from "vitest";
import { computeCalendarBounds, areDatesAllowed } from "@/lib/calendar-rules";
import { mapBookingForScript } from "@/lib/script-mapping";
import { cityOrDefault, CITIES, launchedCities, isBookableCity } from "@/lib/cities";
import { finalSubject } from "@/lib/email-templates/subject";

const row = {
  id: "b1", service_type: "Zulassung importierter Fahrzeuge", salutation: "Frau",
  first_name: "Anna", last_name: "Muster", email: "a@x.de", phone: "0151",
  fin_1: "AB12", fin_2: "CD34", fin_3: null, selected_dates: ["2026-11-20", "2026-11-23"],
};

describe("Köln bleibt unverändert", () => {
  it("Script-Format für Köln ist exakt das bisherige", () => {
    expect(mapBookingForScript(row)).toEqual({
      bookingId: "b1",
      nutzerdaten: {
        anrede: "w", vorname: "Anna", nachname: "Muster", email: "a@x.de", telefon: "0151",
        fin: "AB12", fin2: "CD34", fin3: "", anzahl: "2", service: "17",
      },
      wunschDaten: ["20.11.2026", "23.11.2026"],
    });
  });
  it("unbekannter Service ergibt serviceUnklar", () => {
    expect(mapBookingForScript({ ...row, service_type: "x" }).nutzerdaten).toHaveProperty("serviceUnklar", true);
  });
  it("ohne Stadt gilt Köln", () => {
    expect(cityOrDefault(undefined).slug).toBe("koeln");
  });
  it("vor 14 Uhr ab morgen, Fenster 14 Tage", () => {
    const b = computeCalendarBounds(new Date("2026-11-04T12:59:00Z")); // 13:59 Berlin
    expect(b.minDateISO).toBe("2026-11-05");
    expect(b.maxDateISO).toBe("2026-11-18");
  });
  it("ab 14 Uhr ab übermorgen", () => {
    const b = computeCalendarBounds(new Date("2026-11-04T13:00:00Z")); // 14:00 Berlin
    expect(b.minDateISO).toBe("2026-11-06");
    expect(b.maxDateISO).toBe("2026-11-19");
  });
  it("keine Wochenenden", () => {
    const now = new Date("2026-11-04T08:00:00Z");
    expect(areDatesAllowed(["2026-11-07"], now)).toBe(false);
    expect(areDatesAllowed(["2026-11-09"], now)).toBe(true);
  });
});

describe("Schalter", () => {
  it("Köln sichtbar und buchbar, Bonn weder noch", () => {
    expect(CITIES.koeln.launched && CITIES.koeln.bookable).toBe(true);
    expect(CITIES.bonn.launched || CITIES.bonn.bookable).toBe(false);
    expect(launchedCities().map((c) => c.slug)).toEqual(["koeln"]);
    expect(isBookableCity("bonn")).toBe(false);
  });
  it("interne Mails mit [Köln], Kundenmails ohne", () => {
    expect(finalSubject("pi-down-internal", "Pi meldet sich nicht")).toBe("[Köln] Pi meldet sich nicht");
    expect(finalSubject("appointment-found", "Termin gefunden")).toBe("Termin gefunden");
  });
});
