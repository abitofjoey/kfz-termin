import { cityOrDefault } from "@/lib/cities";
import { getServices } from "@/lib/services";

export const SITE_URL = "https://kfz-termin.online";
const DURATION_MIN = 30;

export type CalendarBooking = {
  id: string;
  city?: string | null;
  serviceType?: string | null;
  appointmentAt: string;
  bookedLocation?: string | null;
  bookingReference?: string | null;
  cancelUrl?: string | null;
};

export type CalendarEvent = {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
};

/** Termininhalt für Google-Link und .ics – Texte aus der Stadt-Konfiguration. */
export function buildCalendarEvent(b: CalendarBooking): CalendarEvent {
  const c = cityOrDefault(b.city);
  const service = getServices(c.slug).find((s) => s.label === b.serviceType);
  const kind = service?.category === "fuehrerschein" ? "Führerschein-Termin" : "Kfz-Termin";
  const loc = c.locations.find((l) => l.id === b.bookedLocation || l.name === b.bookedLocation);
  const location = loc ? `${loc.name}, ${loc.address}` : b.bookedLocation || c.appointmentLocation;
  const infoUrl = service?.infoUrl || c.infoUrl;
  const hours = c.customerConfirmationHours;
  const parts: string[] = [];
  if (hours == null) {
    if (b.bookingReference) parts.push(`${referenceLabelOf(c)}: ${b.bookingReference}.`);
    if (c.mail.calendarCheckIn) parts.push(c.mail.calendarCheckIn);
    if (b.cancelUrl) parts.push(`Stornieren: ${b.cancelUrl}`);
  } else {
    parts.push(`Bitte den Bestätigungslink der Stadt innerhalb von ${hours} Stunden anklicken, sonst verfällt der Termin.`);
  }
  const start = new Date(b.appointmentAt);
  return {
    uid: `${b.id}@kfz-termin.online`,
    title: `${kind}: ${b.serviceType || "Termin"} (${c.flow === "multi" ? c.pages.authorityShort : `Stadt ${c.name}`})`,
    start,
    end: new Date(start.getTime() + DURATION_MIN * 60_000),
    location,
    description: `${parts.join(" ")}\nUnterlagen: ${infoUrl}`,
  };
}

/** 20261006T062000Z */
export const icsUtc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(ev: CalendarEvent): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${icsUtc(ev.start)}/${icsUtc(ev.end)}`,
    details: ev.description,
    location: ev.location,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export const calendarIcsUrl = (token: string) => `${SITE_URL}/kalender/${token}.ics`;

/** RFC 5545 TEXT-Escaping. */
export const icsEscape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Zeilen nach 75 Oktetten (UTF-8) falten, ohne Zeichen zu teilen. */
export function icsFold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // Folgezeilen beginnen mit Leerzeichen
    if (bytes + n > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function buildIcs(ev: CalendarEvent, now: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KFZ-Termin//Terminservice//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${icsUtc(now)}`,
    `DTSTART:${icsUtc(ev.start)}`,
    `DTEND:${icsUtc(ev.end)}`,
    `SUMMARY:${icsEscape(ev.title)}`,
    `LOCATION:${icsEscape(ev.location)}`,
    `DESCRIPTION:${icsEscape(ev.description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(ev.title)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(ev.title)}`,
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(icsFold).join("\r\n") + "\r\n";
}
