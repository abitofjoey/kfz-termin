import { describe, it, expect } from "vitest";
import { CITY_CONTENT } from "@/content/cities";

const koeln = CITY_CONTENT.koeln.single!.formNotice;
const bonnKfz = CITY_CONTENT.bonn.multi!.formNotice!.kfz!;
const bonnFuehrerschein = CITY_CONTENT.bonn.multi!.formNotice!.fuehrerschein!;

/** Fettet Textabschnitt zwischen zwei ** -Markierungen. */
const boldPart = (text: string) => text.split("**")[1];

describe("Formular-Hinweis über den Kontaktdaten", () => {
  it("Köln: Halter-Hinweis mit Vollmacht und E-Mail-Regel", () => {
    expect(boldPart(koeln)).toBe("Wichtig:");
    expect(koeln).toContain("**künftigen Halterin / des künftigen Halters**");
    expect(koeln).toContain("Jemand anderes kann mit Vollmacht hingehen.");
    expect(koeln).toContain("Pro E-Mail-Adresse ist nur eine Buchung möglich.");
    expect(koeln).not.toContain("Mehrfachbuchungen");
    expect(koeln).not.toContain("(Anrede");
  });

  it("Bonn Kfz: Halter-Hinweis mit Vollmacht und E-Mail-Regel", () => {
    expect(boldPart(bonnKfz)).toBe("Wichtig:");
    expect(bonnKfz).toContain("**künftigen Halterin / des künftigen Halters**");
    expect(bonnKfz).toContain("Jemand anderes kann mit Vollmacht hingehen.");
    expect(bonnKfz).toContain("Pro E-Mail-Adresse ist nur eine Buchung möglich.");
    expect(bonnKfz).not.toContain("Führerschein");
  });

  it("Bonn Führerschein: Hinweis auf die Person hinter dem Führerschein", () => {
    expect(boldPart(bonnFuehrerschein)).toBe("Wichtig:");
    expect(bonnFuehrerschein).toContain("**um deren Führerschein es geht**");
    expect(bonnFuehrerschein).toContain("darauf wird der Termin gebucht.");
    expect(bonnFuehrerschein).toContain("Pro E-Mail-Adresse ist nur eine Buchung möglich.");
    expect(bonnFuehrerschein).not.toContain("Vollmacht");
    expect(bonnFuehrerschein).not.toContain("Halterin");
  });

  it("jeder Hinweis hat geradzahlig viele ** -Markierungen", () => {
    for (const text of [koeln, bonnKfz, bonnFuehrerschein]) {
      expect(text.split("**").length % 2).toBe(1);
    }
  });
});
