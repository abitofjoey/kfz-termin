import { describe, it, expect } from "vitest";
import { render } from "@react-email/components";
import { createElement } from "react";
import { CITIES, bookedTown } from "@/lib/cities";
import { template } from "@/lib/email-templates/appointment-found";
import { neussFaq } from "@/content/cities/neuss";

const OLD = "Mit dieser Nummer meldest du dich vor Ort am Check-in-Terminal an.";
const NEW = "Mit dem QR-Code aus der Mail des Kreises oder deinem Geburtsdatum meldest du dich vor Ort am Check-in-Terminal an.";
const base = { appointmentAt: "2026-12-01T09:00:00+01:00", foundAt: "2026-11-20T09:00:00+01:00", bookingReference: "A123", serviceType: "Umschreibung" };
const html = (p: Record<string, unknown>) => render(createElement(template.component as any, { ...base, ...p }), { plainText: true });
const count = (s: string, x: string) => s.split(x).length - 1;

describe("Check-in-Satz aus der Konfiguration", () => {
  it("Neuss: neuer Satz genau einmal, alter nicht", async () => {
    const t = await html({ city: "neuss", bookedLocation: "grevenbroich" });
    expect(count(t, NEW)).toBe(1);
    expect(t).not.toContain(OLD);
  });
  it.each(["bonn", "recklinghausen"])("%s: bisheriger Satz genau einmal", async (city) => {
    const t = await html({ city });
    expect(count(t, OLD)).toBe(1);
  });
  it("Köln hat keinen Satz", () => expect(CITIES.koeln.mail.referenceHint).toBeUndefined());
});

describe("Betreff mit Ort", () => {
  it("Grevenbroich", () => expect(template.subject({ city: "neuss", bookedLocation: "grevenbroich" })).toBe("Dein Termin in Grevenbroich ist gebucht"));
  it("Recklinghausen → Marl", () => expect(template.subject({ city: "recklinghausen", bookedLocation: "marl" })).toBe("Dein Termin in Marl ist gebucht"));
  it("Bonn unverändert", () => expect(template.subject({ city: "bonn", bookedLocation: "beuel" })).toBe("Dein Termin in Bonn ist gebucht"));
  it("Köln unverändert", () => expect(template.subject({ city: "koeln" })).toBe("Termin gefunden – bitte innerhalb von 3 Stunden bestätigen"));
  it("ohne Standort: erster Standort", () => expect(bookedTown(CITIES.neuss, null)).toBe("Neuss"));
});

describe("Neuss-Texte", () => {
  const m = CITIES.neuss.mail;
  it("fünf Schritte", () => {
    expect(m.onSiteSteps).toHaveLength(5);
    expect(m.onSiteSteps![1]).toContain("**Aktiviere deinen Termin** am Touchscreen-Terminal");
  });
  it("Hinweis und Kalender", () => {
    expect(m.cityConfirmationNote).toBe("**Hinweis:** Der Rhein-Kreis Neuss schickt dir zusätzlich eine eigene Bestätigung mit QR-Code. Bring sie zum Termin mit (ausgedruckt oder auf dem Handy) – damit aktivierst du deinen Termin am Terminal.");
    expect(m.calendarCheckIn).toBe("Termin am Terminal aktivieren (QR-Code oder Geburtsdatum), frühestens 30 Min. vorher.");
  });
  it("FAQ 2", () => {
    expect(neussFaq[1].a).toBe("Der Rhein-Kreis Neuss verlangt es bei jeder Online-Terminbuchung. Vor Ort kannst du deinen Termin damit auch am Terminal aktivieren, falls du den QR-Code nicht dabei hast. Wir geben es nur an den Kreis weiter und löschen es nach Abschluss automatisch.");
  });
});
