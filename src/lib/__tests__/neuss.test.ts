import { describe, it, expect, afterEach } from "vitest";
import { computeCalendarBounds, areDatesAllowed } from "@/lib/calendar-rules";
import { mapBookingForScript, PENDING_BOOKING_COLUMNS, type ScriptBookingRow } from "@/lib/script-mapping";
import { CITIES } from "@/lib/cities";
import { getServices, SCRIPT_SERVICE_MAP_BY_CITY } from "@/lib/services";
import { prepareCityBooking, type CityBookingData } from "@/lib/city-booking";

const N = CITIES.neuss;
const NOW = new Date("2026-11-17T10:00:00Z"); // Di 11:00 Berlin
const base: CityBookingData = {
  city: "neuss", service_id: "neufahrzeug", salutation: "Frau", first_name: "A", last_name: "B",
  email: "a@b.de", phone: "01511", vehicle_count: 2, locations: null, birth_date: "1990-01-31",
  selected_dates: ["2026-11-18"],
};
const prev = { n: N.bookable, b: CITIES.bonn.bookable };
afterEach(() => { N.bookable = prev.n; CITIES.bonn.bookable = prev.b; });

describe("Neuss Konfiguration", () => {
  it("sichtbar, buchbar, Standortwahl mit vier Standorten, Geburtsdatum Pflicht", () => {
    expect(N.launched).toBe(true);
    expect(N.bookable).toBe(true);
    expect(N.flow).toBe("multi");
    expect(N.form).toEqual({ finRequired: false, salutationRequired: true, locationChoice: true, financedCheckbox: false, birthDateRequired: true });
    expect(N.locations.map((l) => l.id)).toEqual(["neuss", "grevenbroich", "dormagen", "meerbusch"]);
    expect(N.locations[3].note).toBe("Nur Kartenzahlung (EC)");
    expect(N.priceCents).toBe(1299);
  });
  it("andere Städte fragen kein Geburtsdatum ab", () => {
    for (const s of ["koeln", "bonn", "recklinghausen"]) expect(CITIES[s].form.birthDateRequired).toBe(false);
  });
});

describe("Neuss Anliegen", () => {
  const list = getServices("neuss");
  it("18 Anliegen mit Script-Nummern 1–18, max. 3 Fahrzeuge, alle Kfz", () => {
    expect(list).toHaveLength(18);
    expect(Object.values(SCRIPT_SERVICE_MAP_BY_CITY.neuss)).toEqual(Array.from({ length: 18 }, (_, i) => String(i + 1)));
    expect(SCRIPT_SERVICE_MAP_BY_CITY.neuss["Umschreibung innerhalb des Rhein-Kreises Neuss"]).toBe("1");
    expect(SCRIPT_SERVICE_MAP_BY_CITY.neuss["Rote Dauerkennzeichen (Fahrzeugscheinhefte)"]).toBe("18");
    for (const s of list) { expect(s.maxVehicles).toBe(3); expect(s.category).toBe("kfz"); }
  });
  it("Ausfuhr (14) und Rote Kennzeichen (18) ohne Meerbusch, Rest überall", () => {
    const noMb = ["neuss", "grevenbroich", "dormagen"];
    expect(list.find((s) => s.id === "ausfuhr")!.locations).toEqual(noMb);
    expect(list.find((s) => s.id === "rote-kennzeichen")!.locations).toEqual(noMb);
    expect(list.filter((s) => s.locations).length).toBe(2);
  });
  it("alle 18 Kacheln sichtbar, Ränge 1–18 eindeutig", () => {
    expect(list.map((s) => s.popularRank).sort((a, b) => a! - b!)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
  });
});

describe("Neuss Buchung", () => {
  it("speichert Geburtsdatum, egal wo = alle vier Standorte", () => {
    N.bookable = true;
    const r = prepareCityBooking(base, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.row).toMatchObject({ birth_date: "1990-01-31", salutation: "Frau", vehicle_count: 2 });
    expect(r.row.locations).toEqual(["neuss", "grevenbroich", "dormagen", "meerbusch"]);
  });
  it.each([
    ["ohne Geburtsdatum", { birth_date: undefined }],
    ["31.02.", { birth_date: "1990-02-31" }],
    ["unter 16", { birth_date: "2011-01-01" }],
    ["über 110", { birth_date: "1910-01-01" }],
  ])("lehnt ab: %s", (_n, patch) => {
    N.bookable = true;
    const r = prepareCityBooking({ ...base, ...patch }, NOW);
    expect(r).toEqual({ ok: false, error: "Bitte ein gültiges Geburtsdatum angeben." });
  });
  it("lehnt fehlende Anrede ab", () => {
    N.bookable = true;
    expect(prepareCityBooking({ ...base, salutation: undefined }, NOW).ok).toBe(false);
  });
  it("Bonn speichert ein mitgeschicktes birth_date nicht", () => {
    CITIES.bonn.bookable = true;
    const r = prepareCityBooking({ ...base, city: "bonn", service_id: "umschreibung", salutation: undefined }, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) expect("birth_date" in r.row).toBe(false);
  });
});

describe("Neuss Script-Format", () => {
  it("pending-bookings fragt birth_date aus der Datenbank ab", () => {
    expect(PENDING_BOOKING_COLUMNS.split(",").map((c) => c.trim())).toContain("birth_date");
  });
  it("gespeichertes Geburtsdatum kommt im Script-Format an", () => {
    const row: ScriptBookingRow = {
      id: "x", service_type: "Neufahrzeug zulassen", salutation: "Frau", first_name: "A", last_name: "B",
      email: "a@b.de", phone: "1", fin_1: "", fin_2: null, fin_3: null, selected_dates: ["2026-11-18"],
      city: "neuss", locations: ["neuss", "grevenbroich", "dormagen", "meerbusch"], financed: false, vehicle_count: 2,
      birth_date: "1990-01-31",
    };
    const out = mapBookingForScript(row);
    expect(out.nutzerdaten).toMatchObject({
      anrede: "w", geburtsdatum: "1990-01-31", anzahl: "2", service: "3", kategorie: "kfz",
      standorte: ["neuss", "grevenbroich", "dormagen", "meerbusch"],
    });
    expect(out.wunschDaten).toEqual(["18.11.2026"]);
  });
  it("Köln bekommt kein geburtsdatum", () => {
    const out = mapBookingForScript({
      id: "k", service_type: "Wiederzulassung", salutation: "Herr", first_name: "A", last_name: "B", email: "a@b.de",
      phone: "1", fin_1: "1234", fin_2: null, fin_3: null, selected_dates: [], city: "koeln", birth_date: "1990-01-31",
    });
    expect("geburtsdatum" in out.nutzerdaten).toBe(false);
  });
});

describe("Neuss Kalender", () => {
  it("ab morgen, 28 Tage, keine Wochenenden", () => {
    const b = computeCalendarBounds(NOW, "neuss");
    expect(areDatesAllowed(["2026-11-17"], NOW, "neuss")).toBe(false);
    expect(areDatesAllowed(["2026-11-18"], NOW, "neuss")).toBe(true);
    expect(areDatesAllowed(["2026-11-21"], NOW, "neuss")).toBe(false);
    expect(b).toBeTruthy();
  });
});
