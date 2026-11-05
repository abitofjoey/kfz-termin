import { describe, it, expect } from "vitest";
import { computeCalendarBounds, areDatesAllowed } from "@/lib/calendar-rules";
import { mapBookingForScript } from "@/lib/script-mapping";
import { CITIES, launchedCities, monitoredCities } from "@/lib/cities";
import { getServices, getCityService, possibleLocations, SCRIPT_SERVICE_MAP_BY_CITY } from "@/lib/services";
import { prepareCityBooking, type CityBookingData } from "@/lib/city-booking";
import { rebookScope } from "@/lib/rebook.functions";
import { checkoutDescription } from "@/lib/checkout-amount";

const ALL = ["dlz", "hardtberg", "beuel", "godesberg"];
// 05.11.2026 15:00 Berlin (nach 14 Uhr) – Donnerstag
const AFTER_CUTOFF = new Date("2026-11-05T14:00:00Z");
const bonnBookable = () => {
  const prev = CITIES.bonn.bookable;
  CITIES.bonn.bookable = true;
  return () => (CITIES.bonn.bookable = prev);
};
const bonnNotBookable = () => {
  const prev = CITIES.bonn.bookable;
  CITIES.bonn.bookable = false;
  return () => (CITIES.bonn.bookable = prev);
};
const base: CityBookingData = {
  city: "bonn", service_id: "umschreibung", first_name: "A", last_name: "B", email: "a@b.de",
  phone: "01511", vehicle_count: 1, locations: null, financed: false, selected_dates: ["2026-11-06"],
};

describe("Bonn Kalender", () => {
  it("Kfz: ab morgen auch nach 14 Uhr, 35 Tage", () => {
    const b = computeCalendarBounds(AFTER_CUTOFF, "bonn", "kfz");
    expect(b.minDateISO).toBe("2026-11-06");
    expect(b.maxDateISO).toBe("2026-12-10");
  });
  it("Führerschein: 70 Tage", () => {
    const b = computeCalendarBounds(AFTER_CUTOFF, "bonn", "fuehrerschein");
    expect(b.minDateISO).toBe("2026-11-06");
    expect(b.maxDateISO).toBe("2027-01-14");
  });
  it("keine Wochenenden, Fenstergrenze je Kategorie", () => {
    expect(areDatesAllowed(["2026-11-07"], AFTER_CUTOFF, "bonn", "kfz")).toBe(false);
    expect(areDatesAllowed(["2027-01-14"], AFTER_CUTOFF, "bonn", "kfz")).toBe(false);
    expect(areDatesAllowed(["2027-01-14"], AFTER_CUTOFF, "bonn", "fuehrerschein")).toBe(true);
  });
  it("Köln unverändert: ab 14 Uhr übermorgen, 14 Tage", () => {
    const b = computeCalendarBounds(AFTER_CUTOFF);
    expect(b.minDateISO).toBe("2026-11-07");
    expect(b.maxDateISO).toBe("2026-11-20");
  });
});

describe("Termine ändern nach Stadt/Kategorie", () => {
  it("Bonner Führerschein-Buchung nutzt 70-Tage-Fenster", () => {
    const s = rebookScope({ city: "bonn", service_type: "Internationaler Führerschein" });
    expect(s).toEqual({ city: "bonn", category: "fuehrerschein" });
    expect(areDatesAllowed(["2027-01-14"], AFTER_CUTOFF, s.city, s.category)).toBe(true);
  });
  it("Altbuchung ohne Stadt = Köln/Kfz", () => {
    const s = rebookScope({ city: null, service_type: "Anmeldung Gebrauchtfahrzeug" });
    expect(s).toEqual({ city: "koeln", category: "kfz" });
    expect(areDatesAllowed(["2026-11-06"], AFTER_CUTOFF, s.city, s.category)).toBe(false);
  });
});

describe("Bonn Dienstleistungen und Standorte", () => {
  it("35 Anliegen mit Script-Nummern 1–35", () => {
    expect(getServices("bonn")).toHaveLength(35);
    expect(SCRIPT_SERVICE_MAP_BY_CITY.bonn["Umschreibung (Halterwechsel)"]).toBe("1");
    expect(SCRIPT_SERVICE_MAP_BY_CITY.bonn["Fahrerkarte"]).toBe("35");
  });
  it("Standort-Filter je Dienstleistung", () => {
    expect(possibleLocations(getCityService("bonn", "umschreibung")!, ALL)).toEqual(ALL);
    expect(possibleLocations(getCityService("bonn", "neuzulassung")!, ALL)).toEqual(["dlz"]);
    expect(possibleLocations(getCityService("bonn", "fs-ausland")!, ALL)).toEqual(["dlz"]);
  });
  it("Höchstzahl Fahrzeuge", () => {
    expect(getCityService("bonn", "umschreibung")!.maxVehicles).toBe(5);
    expect(getCityService("bonn", "kurzzeitkennzeichen")!.maxVehicles).toBe(1);
    expect(getCityService("bonn", "abmeldung-verlust")!.maxVehicles).toBe(3);
  });
});

describe("Bonn Buchung speichern", () => {
  it("nicht buchbar → abgelehnt", () => {
    const restore = bonnNotBookable();
    expect(prepareCityBooking(base, AFTER_CUTOFF).ok).toBe(false);
    restore();
  });
  it("Egal wo → alle möglichen Standorte", () => {
    const restore = bonnBookable();
    const r = prepareCityBooking(base, AFTER_CUTOFF);
    restore();
    expect(r.ok && r.row.locations).toEqual(ALL);
  });
  it("finanziert → nur dlz gespeichert", () => {
    const restore = bonnBookable();
    const r = prepareCityBooking({ ...base, financed: true, locations: ["beuel"] }, AFTER_CUTOFF);
    restore();
    expect(r.ok && r.row.locations).toEqual(["dlz"]);
    expect(r.ok && r.row.financed).toBe(true);
  });
  it("unmöglicher Standort wird abgelehnt", () => {
    const restore = bonnBookable();
    const r = prepareCityBooking({ ...base, service_id: "neuzulassung", locations: ["beuel"] }, AFTER_CUTOFF);
    restore();
    expect(r.ok).toBe(false);
  });
  it("Führerschein: Tag nach 35 Tagen erlaubt, Kfz nicht", () => {
    const restore = bonnBookable();
    const fs = prepareCityBooking({ ...base, service_id: "fs-umtausch", selected_dates: ["2027-01-14"] }, AFTER_CUTOFF);
    const kfz = prepareCityBooking({ ...base, selected_dates: ["2027-01-14"] }, AFTER_CUTOFF);
    restore();
    expect(fs.ok).toBe(true);
    expect(kfz.ok).toBe(false);
  });
});

describe("pending-bookings?city=bonn", () => {
  const row = {
    id: "b2", service_type: "Umschreibung (Halterwechsel)", salutation: "", first_name: "A", last_name: "B",
    email: "a@b.de", phone: "0151", fin_1: "", fin_2: null, fin_3: null, selected_dates: ["2026-11-20"],
    city: "bonn", locations: ["dlz"], financed: true, vehicle_count: 2,
  };
  it("Format mit standorte, finanziert, kategorie", () => {
    expect(mapBookingForScript(row)).toEqual({
      bookingId: "b2",
      nutzerdaten: {
        anrede: "", vorname: "A", nachname: "B", email: "a@b.de", telefon: "0151",
        fin: "", fin2: "", fin3: "", anzahl: "2", service: "1",
        standorte: ["dlz"], finanziert: true, kategorie: "kfz",
      },
      wunschDaten: ["20.11.2026"],
    });
  });
  it("Führerschein: anzahl 1", () => {
    const m = mapBookingForScript({ ...row, service_type: "Fahrerkarte", financed: false, vehicle_count: null });
    expect(m.nutzerdaten).toMatchObject({ anzahl: "1", service: "35", kategorie: "fuehrerschein" });
  });
});

describe("Sichtbarkeit und Ergänzungen", () => {
  it("Bonn versteckt, aber überwacht, weil buchbar", () => {
    expect(launchedCities().map((c) => c.slug)).toEqual(["koeln"]);
    expect(monitoredCities().map((c) => c.slug)).toEqual(["koeln", "bonn"]);
  });
  it("Stripe-Beschreibung je Stadt", () => {
    expect(checkoutDescription("koeln")).toBe("KFZ-Termin Köln – Terminservice bei der Zulassungsstelle");
    expect(checkoutDescription(null)).toBe("KFZ-Termin Köln – Terminservice bei der Zulassungsstelle");
    expect(checkoutDescription("bonn")).toBe("KFZ-Termin Bonn – Terminservice bei der Stadt Bonn");
  });
});
