import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render } from "@react-email/components";
import { computeCalendarBounds, areDatesAllowed } from "@/lib/calendar-rules";
import { mapBookingForScript } from "@/lib/script-mapping";
import { CITIES, launchedCities, monitoredCities } from "@/lib/cities";
import { getServices, SCRIPT_SERVICE_MAP_BY_CITY } from "@/lib/services";
import { prepareCityBooking, type CityBookingData } from "@/lib/city-booking";
import { buildCalendarEvent } from "@/lib/calendar";
import { TEMPLATES } from "@/lib/email-templates/registry";

const R = CITIES.recklinghausen;
const AFTER_CUTOFF = new Date("2026-11-05T14:00:00Z"); // Do 15:00 Berlin
const base: CityBookingData = {
  city: "recklinghausen", service_id: "anmelden", salutation: "Frau", first_name: "A", last_name: "B",
  email: "a@b.de", phone: "01511", vehicle_count: 2, locations: null, selected_dates: ["2026-11-06"],
};
const prev = R.bookable;
afterEach(() => { R.bookable = prev; });

describe("Recklinghausen Konfiguration", () => {
  it("startet verborgen und nicht buchbar", () => {
    expect(R.launched).toBe(false);
    expect(R.bookable).toBe(false);
    expect(launchedCities().map((c) => c.slug)).not.toContain("recklinghausen");
    expect(monitoredCities().map((c) => c.slug)).not.toContain("recklinghausen");
  });
  it("Bonner Ablauf, ein Standort, keine Standortwahl, Preis 12,99 €", () => {
    expect(R.flow).toBe("multi");
    expect(R.form.locationChoice).toBe(false);
    expect(R.locations.map((l) => l.id)).toEqual(["marl"]);
    expect(R.priceCents).toBe(1299);
    expect(CITIES.bonn.flow).toBe("multi");
    expect(CITIES.koeln.flow).toBe("single");
  });
});

describe("Recklinghausen Anliegen", () => {
  const expected: [string, string, number][] = [
    ["Anmelden von Fahrzeugen", "1", 3],
    ["Sonstige Änderungen", "2", 4],
    ["Kurzzeitkennzeichen", "3", 2],
    ["Unbedenklichkeitsbescheinigung", "4", 3],
    ["Importfahrzeuge", "5", 2],
    ["Ersatz Zulassungsbescheinigung Teil II", "6", 2],
    ["Fahrzeugscheinheft rotes Kennzeichen", "7", 4],
    ["Aushändigung ZB II nach Aufbietung", "8", 4],
  ];
  it("8 Kfz-Anliegen mit Script-Nummern 1–8 und Höchstzahl", () => {
    const list = getServices("recklinghausen");
    expect(list).toHaveLength(8);
    for (const [label, nr, max] of expected) {
      expect(SCRIPT_SERVICE_MAP_BY_CITY.recklinghausen[label]).toBe(nr);
      const s = list.find((x) => x.label === label)!;
      expect(s.maxVehicles).toBe(max);
      expect(s.category).toBe("kfz");
    }
  });
  it("nur ein Bereich (kein Kfz/Führerschein-Umschalter)", () => {
    expect(new Set(getServices("recklinghausen").map((s) => s.category)).size).toBe(1);
  });
  it("keine Abmeldung", () => {
    expect(getServices("recklinghausen").some((s) => /abmeld/i.test(s.label))).toBe(false);
  });
});

describe("Recklinghausen Script-Format", () => {
  it("Bonner Format mit Anrede, Anzahl, Standort marl, Kategorie kfz", () => {
    const out = mapBookingForScript({
      id: "x", service_type: "Anmelden von Fahrzeugen", salutation: "Frau", first_name: "A", last_name: "B",
      email: "a@b.de", phone: "1", fin_1: "", fin_2: null, fin_3: null, selected_dates: ["2026-11-06"],
      city: "recklinghausen", locations: ["marl"], financed: false, vehicle_count: 3,
    });
    expect(out.nutzerdaten).toMatchObject({ anrede: "w", anzahl: "3", service: "1", standorte: ["marl"], kategorie: "kfz" });
    expect(out.wunschDaten).toEqual(["06.11.2026"]);
  });
});

describe("Recklinghausen Kalender", () => {
  it("ab morgen auch nach 14 Uhr, 28 Tage", () => {
    const b = computeCalendarBounds(AFTER_CUTOFF, "recklinghausen", "kfz");
    expect(b.minDateISO).toBe("2026-11-06");
    expect(b.maxDateISO).toBe("2026-12-03");
  });
  it("keine Wochenenden", () => {
    expect(areDatesAllowed(["2026-11-07"], AFTER_CUTOFF, "recklinghausen", "kfz")).toBe(false);
    expect(areDatesAllowed(["2026-11-09"], AFTER_CUTOFF, "recklinghausen", "kfz")).toBe(true);
  });
});

describe("Recklinghausen Buchung", () => {
  it("speichert Anrede und Standort marl", () => {
    R.bookable = true;
    const r = prepareCityBooking(base, AFTER_CUTOFF);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.row.salutation).toBe("Frau");
      expect(r.row.locations).toEqual(["marl"]);
      expect(r.row.vehicle_count).toBe(2);
    }
  });
  it("lehnt fehlende Anrede ab", () => {
    R.bookable = true;
    expect(prepareCityBooking({ ...base, salutation: undefined }, AFTER_CUTOFF).ok).toBe(false);
  });
  it("lehnt andere Anrede-Werte ab", () => {
    R.bookable = true;
    for (const s of ["Dr.", "herr", "", "m"]) {
      expect(prepareCityBooking({ ...base, salutation: s }, AFTER_CUTOFF).ok).toBe(false);
    }
  });
  it("Bonn übernimmt keine Anrede", () => {
    const p = CITIES.bonn.bookable; CITIES.bonn.bookable = true;
    const r = prepareCityBooking({ ...base, city: "bonn", service_id: "umschreibung", salutation: "Herr" }, AFTER_CUTOFF);
    CITIES.bonn.bookable = p;
    expect(r.ok && r.row.salutation).toBe("");
  });
});

describe("Recklinghausen Texte", () => {
  const props = { city: "recklinghausen", firstName: "A", serviceType: "Anmelden von Fahrzeugen", appointmentAt: "2026-11-20T09:00:00Z", bookingReference: "T1001", cancelUrl: "https://x/c", bookedLocation: "marl" };
  it("Terminmail nutzt Terminnummer und Kreis, nicht 'Stadt Recklinghausen'", async () => {
    const html = await render(React.createElement(TEMPLATES["appointment-found"].component, props));
    expect(html).toContain("Terminnummer");
    expect(html).toContain("Seite des Kreises Recklinghausen");
    expect(html).toContain("Terminnummer T1001 eingeben");
    expect(html).not.toContain("Aufrufnummer");
    expect(html).not.toContain("Stadt Recklinghausen");
  });
  it("Kein-Termin-Mail und Bestätigung ohne 'Stadt Recklinghausen'", async () => {
    for (const name of ["search-not-found", "booking-confirmation", "withdrawn-found"]) {
      const t = TEMPLATES[name];
      const html = await render(React.createElement(t.component, { ...(t.previewData ?? {}), city: "recklinghausen", searchError: "email_limit" }));
      expect(html, name).not.toContain("Stadt Recklinghausen");
      expect(html, name).not.toContain("Aufrufnummer");
    }
  });
  it("Kalendereintrag mit Terminnummer und Zulassungsstelle Marl", () => {
    const e = buildCalendarEvent({ id: "1", city: "recklinghausen", serviceType: "Kurzzeitkennzeichen", appointmentAt: "2026-11-20T09:00:00Z", bookedLocation: "marl", bookingReference: "T1001", cancelUrl: "u" } as never);
    expect(e.title).toBe("Kfz-Termin: Kurzzeitkennzeichen (Zulassungsstelle Marl)");
    expect(e.description).toContain("Terminnummer: T1001.");
    expect(e.location).toBe("Zulassung Marl, Stettiner Str. 10, 45770 Marl");
  });
});
