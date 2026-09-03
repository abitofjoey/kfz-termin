import { createFileRoute } from "@tanstack/react-router";

type BookingRow = {
  id: string;
  service_type: string;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  fin_1: string;
  fin_2: string | null;
  fin_3: string | null;
  selected_dates: string[];
};

const SALUTATION_MAP: Record<string, string> = {
  Herr: "m",
  Frau: "w",
  Divers: "d",
};

const SERVICE_MAP: Record<string, string> = {
  "Anmeldung Gebrauchtfahrzeug": "1",
  "Anmeldung Neufahrzeug": "2",
  "Kennzeichenwechsel": "3",
  "Technische Änderung": "4",
  "Wiederzulassung": "5",
  "H-Kennzeichen": "6",
  "Saisonkennzeichen": "7",
  "Kurzzeitkennzeichen": "8",
  "Ausfuhrkennzeichen": "9",
  "Ersatz Zulassungsbescheinigung Teil I": "10",
  "Abmeldung eines Fahrzeugs (Außerbetriebsetzung)": "11",
  "Anschriftenänderung in den Fahrzeugpapieren": "12",
  "Feinstaubplakette": "13",
  "Änderung des Familiennamens in Fahrzeugpapieren": "14",
  "Neusiegelung von Kennzeichen": "15",
};

function mapSalutation(value: string): string {
  return SALUTATION_MAP[value] ?? "m";
}

function countNonEmptyFins(row: BookingRow): string {
  const fins = [row.fin_1, row.fin_2, row.fin_3].filter(
    (fin): fin is string => typeof fin === "string" && fin.trim().length > 0,
  );
  return String(fins.length);
}

function mapService(row: BookingRow): { service: string } | { serviceUnklar: true } {
  const number = SERVICE_MAP[row.service_type];
  if (number) {
    return { service: number };
  }
  return { serviceUnklar: true };
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

function mapBooking(row: BookingRow) {
  return {
    bookingId: row.id,
    nutzerdaten: {
      anrede: mapSalutation(row.salutation),
      vorname: row.first_name,
      nachname: row.last_name,
      email: row.email,
      telefon: row.phone,
      fin: row.fin_1,
      fin2: row.fin_2 ?? "",
      fin3: row.fin_3 ?? "",
      anzahl: countNonEmptyFins(row),
      ...mapService(row),
    },
    wunschDaten: row.selected_dates.map(formatDate),
  };
}

export const Route = createFileRoute("/api/internal/pending-bookings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expectedKey = process.env["SCRIPT_API_KEY"];
        if (!expectedKey) {
          console.error("pending-bookings: SCRIPT_API_KEY not configured");
          return new Response("Server misconfigured", { status: 500 });
        }

        const providedKey = request.headers.get("x-script-key");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("*")
          .eq("paid", true)
          .eq("assigned_to_script", false)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("pending-bookings: database error", error);
          return new Response("Database error", { status: 500 });
        }

        return Response.json({
          bookings: (data ?? []).map((row) => mapBooking(row as unknown as BookingRow)),
        });
      },
    },
  },
});
