import { describe, it, expect } from "vitest";
import { buildCalendarEvent, buildIcs, googleCalendarUrl, icsEscape, icsFold } from "@/lib/calendar";

const NOW = new Date("2026-10-01T12:00:00Z");
const koeln = buildCalendarEvent({ id: "b1", city: "koeln", serviceType: "Anmeldung Gebrauchtfahrzeug", appointmentAt: "2026-10-06T08:20:00+02:00" });

describe("Kalender", () => {
  it("Sommerzeit: 08:20 Berlin → 06:20Z, Dauer 30 Min.", () => {
    const ics = buildIcs(koeln, NOW);
    expect(ics).toContain("DTSTART:20261006T062000Z\r\n");
    expect(ics).toContain("DTEND:20261006T065000Z\r\n");
  });
  it("Winterzeit: 08:20 Berlin → 07:20Z", () => {
    const ev = buildCalendarEvent({ id: "b2", city: "koeln", serviceType: "X", appointmentAt: "2027-01-12T08:20:00+01:00" });
    expect(buildIcs(ev, NOW)).toContain("DTSTART:20270112T072000Z");
  });
  it("UID, DTSTAMP, Erinnerungen 1 Tag und 2 Stunden vorher", () => {
    const ics = buildIcs(koeln, NOW);
    expect(ics).toContain("UID:b1@kfz-termin.online");
    expect(ics).toContain("DTSTAMP:20261001T120000Z");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics).toContain("TRIGGER:-PT2H");
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(2);
  });
  it("Köln: Titel, Behördenadresse, Frist aus Konfiguration", () => {
    expect(koeln.title).toBe("Kfz-Termin: Anmeldung Gebrauchtfahrzeug (Stadt Köln)");
    expect(koeln.location).toContain("Max-Glomsda-Str. 4, 51105 Köln");
    expect(koeln.description).toContain("innerhalb von 3 Stunden anklicken");
    expect(koeln.description).toContain("Unterlagen: https://www.stadt-koeln.de");
  });
  it("Bonn Führerschein: Titel, Standortadresse, Aufrufnummer, Stornolink", () => {
    const ev = buildCalendarEvent({ id: "b3", city: "bonn", serviceType: "Umschreibung ausländischer Führerscheine", appointmentAt: "2026-11-20T09:00:00Z", bookedLocation: "beuel", bookingReference: "B456", cancelUrl: "https://termine.bonn.de/c" });
    expect(ev.title).toMatch(/^(Führerschein|Kfz)-Termin: .* \(Stadt Bonn\)$/);
    expect(ev.location).toBe("Bürgeramt Beuel, Friedrich-Breuer-Str. 65, 53225 Bonn");
    expect(ev.description).toContain("Aufrufnummer: B456. Check-in am Terminal 15 Min. vorher bis 5 Min. nach Beginn. Stornieren: https://termine.bonn.de/c");
  });
  it("Bonn: Führerschein-Anliegen ergibt Führerschein-Termin", async () => {
    const { getServices } = await import("@/lib/services");
    const fs = getServices("bonn").find((s) => s.category === "fuehrerschein")!;
    const ev = buildCalendarEvent({ id: "b4", city: "bonn", serviceType: fs.label, appointmentAt: "2026-11-20T09:00:00Z" });
    expect(ev.title).toBe(`Führerschein-Termin: ${fs.label} (Stadt Bonn)`);
  });
  it("Escaping von Komma, Semikolon, Backslash, Zeilenumbruch", () => {
    expect(icsEscape("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
  });
  it("Faltung nach 75 Oktetten, Umlaute bleiben ganz", () => {
    const folded = icsFold("DESCRIPTION:" + "ä".repeat(100));
    const enc = new TextEncoder();
    for (const l of folded.split("\r\n")) expect(enc.encode(l).length).toBeLessThanOrEqual(75);
    expect(folded.replace(/\r\n /g, "")).toBe("DESCRIPTION:" + "ä".repeat(100));
    const ics = buildIcs(koeln, NOW);
    for (const l of ics.split("\r\n")) expect(enc.encode(l).length).toBeLessThanOrEqual(75);
  });
  it("Google-Link: UTC mit Z, kodiert", () => {
    const u = new URL(googleCalendarUrl(koeln));
    expect(u.searchParams.get("dates")).toBe("20261006T062000Z/20261006T065000Z");
    expect(u.searchParams.get("text")).toBe(koeln.title);
    expect(u.searchParams.get("location")).toBe(koeln.location);
    expect(googleCalendarUrl(koeln)).not.toMatch(/ /);
  });
});
