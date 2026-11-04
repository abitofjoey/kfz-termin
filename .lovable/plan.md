# Mehrstädtigkeit, Stufe 1: neue Startseite, Köln nach /koeln, Backend städtefähig

Ziel: Für Köln-Kunden und das Pi-Script (v39.14) ändert sich nichts. Das gilt für Inhalte, Mails, Antworten der Schnittstelle, Stripe und Cron-Jobs. Bonn wird nur vorbereitet (`launched: false`, keine Seite).

## 1. Stadt-Konfiguration
- **Neu `src/lib/cities.ts`:** Typ `City` mit den Feldern slug, name, adjective, authorityName, locations[{name, address}], portalUrl, serviceListKey, calendar{minOffsetDays: 1, afterHourOffsetDays: 2, cutoffHour: 14, windowDays: 14, allowWeekends: false, blockedDates}, customerConfirmationHours, searchHours{from: 6, to: 20}, priceCents: 999, finRequired, locationChoice und launched. Dazu die Funktionen `getCity(slug)`, `activeCities()`, `DEFAULT_CITY = "koeln"` und `cityOrDefault(value)`.
  - **koeln:** Werte werden 1:1 aus den heutigen Texten übernommen (Behörde, Standort, Portal-Link aus InfoBlock/Mails).
  - **bonn:** Platzhalterwerte mit `launched: false`. Die Bonner Werte stehen noch nicht fest und werden später nachgetragen.
- **`services.ts`:** Liste, `maxVehicles` und Reihenfolge bleiben unverändert. Neu ist `SERVICES_BY_CITY = { koeln: SERVICES }` und `getServices(city)`. Die bisherigen Exporte bleiben als Alias erhalten, damit sich keine Aufrufer ändern.
- **`SERVICE_MAP` „1"–„19":** wird aus `pending-bookings.ts` nach `services.ts` verschoben (`SCRIPT_SERVICE_MAP_BY_CITY.koeln`). Der Inhalt bleibt Zeichen für Zeichen gleich.
- **`calendar-rules.ts`:** `computeCalendarBounds(now, city = "koeln")` und `areDatesAllowed(dates, now, city = "koeln")` lesen die Regeln aus der Stadt-Konfiguration. `BLOCKED_DATES` bleibt als Export erhalten (= Köln-Sperrtage). Bisherige Aufrufe ohne Stadt verhalten sich wie heute.

## 2. Seiten und Navigation
- **Neu `src/routes/koeln.tsx`:** Der heutige Inhalt von `index.tsx` wird 1:1 verschoben, mit derselben Komponentenfolge, demselben Formular-Nachladen, Title, Description, OG-Daten, Service- und FAQPage-JSON-LD. Nur `og:url` und canonical ändern sich auf `https://kfz-termin.online/koeln`. Die Anker `#ablauf`, `#preise`, `#buchung` und `#faq` bleiben bestehen.
- **`src/routes/index.tsx` wird neu (städteneutral):**
  - Hero „Dein Wunschtermin bei der Zulassungsstelle – automatisch gebucht"
  - `#staedte` mit Karten aus `activeCities()` und dem Hinweis „Weitere Städte folgen"
  - `#so-funktionierts` mit 3 Schritten
  - `#preis` mit 9,99 € und Geld-zurück-Garantie
  - kurze Founder-Sektion
  - Kundenstimmen mit der Überschrift „Kundenstimmen aus Köln"
  - `#haeufige-fragen` mit einer kurzen allgemeinen FAQ
  - eigene Meta-Daten, canonical `/` sowie JSON-LD Organization und Service mit `areaServed` aus den aktiven Städten
  - **Neue Startseiten-Bausteine:** `src/components/home/` mit CityPicker, HomeHero, HomeSteps, HomeFaq. Die bestehenden Landing-Bausteine bleiben unangetastet. Founder und Testimonials bekommen nur eine optionale Prop (`variant="short"` bzw. `title`), die Standardwerte bleiben gleich.
- **Alte Links:** Ein kleines Client-Skript auf `/` leitet die Hashes `#buchung`, `#preise`, `#ablauf` und `#faq` per `location.replace` auf `/koeln#…` weiter. Server-Redirects sind nicht möglich, weil der Hash nie beim Server ankommt. Andere Hashes und `/` ohne Hash bleiben auf der Startseite.
- **Header:** bekommt eine Prop `city?`.
  - Immer sichtbar: „Start" und je aktive Stadt.
  - Mit Stadt zusätzlich: Ablauf, Preise und FAQ (`/koeln#…`), „Jetzt buchen" führt zu `#buchung`.
  - Ohne Stadt: „Jetzt buchen" führt zu `/#staedte`.
  - Die mobile Ansicht wird genauso angepasst.
- **Footer:** Links zu allen aktiven Städten.
- **Hero.tsx (Köln):** Der Anker `#buchung` bleibt relativ und funktioniert damit auf `/koeln`.
- **Brand-Logo:** Link bleibt auf `/`.
- **`public/sitemap.xml`:** `/` und `/koeln`.
- **`public/robots.txt`:** Sitemap-Verweis prüfen, sonst unverändert.
- **`public/llms.txt`:** Hinweis auf `/koeln` ergänzen.
- **Zurück-Links:** betrifft buchung-erfolgreich, buchung-abgebrochen, termine-aendern, email-aendern und widerruf. Die bestehenden Server-Funktionen liefern zusätzlich `city` der Buchung. Links führen auf `/${city}`, ohne bekannte Buchung auf `/`. Für buchung-abgebrochen übergibt Stripe die Stadt per `cancel_url` (`?city=koeln`). Ortsangaben kommen aus `getCity(city)`.

## 3. Datenbank (eine Migration, nur additiv)
```sql
ALTER TABLE public.bookings ADD COLUMN city text NOT NULL DEFAULT 'koeln';
ALTER TABLE public.bookings ADD COLUMN locations text[] NULL;
ALTER TABLE public.bookings ADD COLUMN booked_location text NULL;
ALTER TABLE public.bookings ADD COLUMN booking_reference text NULL;
ALTER TABLE public.bookings ADD COLUMN cancel_url text NULL;
CREATE INDEX bookings_city_pending_idx ON public.bookings (city, paid, assigned_to_script);
-- script_heartbeat: city ist bereits Schlüssel (upsert onConflict city), Zeile 'koeln' existiert.
-- Absicherung nur falls nötig: Unique-Constraint auf city ergänzen (idempotent via DO-Block).
```
- Bestehende Zeilen bekommen `'koeln'` über den Default.
- Bestehende Grants und RLS bleiben gleich, keine neuen Tabellen.

**Formular und Checkout:**
- `BookingForm` bekommt `city` als Prop und `createBooking` nimmt optional `city` an (zod: aktive Stadt, Standard `koeln`).
- Der Server validiert die Stadt sowie Services und Kalender dieser Stadt und speichert sie.
- `stripe.functions.ts` setzt `city` in den Metadaten und in die Rücksprung-URLs. Preis und Ablauf bleiben gleich.

## 4. Pi-Schnittstelle (rückwärtskompatibel)
- **`pending-bookings.ts`:**
  - `city = cityOrDefault(searchParams.city)`, eine unbekannte Stadt ergibt 400.
  - Zusätzlicher Filter `.eq("city", city)` für Buchungen und die withdrawn-Liste.
  - Lebenszeichen per upsert für diese Stadt.
  - Die Köln-Antwort entsteht über dieselbe Mapping-Funktion. `nutzerdaten.standorte` kommt nur hinzu, wenn `locationChoice` aktiv ist (Köln: nie).
- **`bookings/$id/result.ts`:**
  - Optional werden `location`, `bookingReference` und `cancelUrl` angenommen (zod optional, `cancelUrl` muss eine URL sein). Nur wenn sie mitkommen, landen sie in `booked_location`, `booking_reference` und `cancel_url`.
  - Die bisherigen Zweige found, not_found und error bleiben inhaltlich unverändert.
- **`heartbeat.ts`:** `?city=`, Standard koeln.
- **`health/check.ts` und `daily-status.ts`:**
  - Die Pi- und Auftragsprüfung läuft in einer Schleife über `activeCities()`, mit Abfragen pro Stadt.
  - Interne Mails bekommen den Betreff-Präfix `[Köln] `.
  - Idempotenz-Schlüssel bekommen für Köln keine Ergänzung, damit an laufenden Tagen keine doppelten Mails entstehen. Andere Städte bekommen `-<slug>`.
  - Der Präfix ist die einzige gewollte Änderung an internen Mails.
- **Unverändert:** `ack.ts`, `dates.ts` und `refunds/due.ts`. `dates.ts` liest Kalender und Texte nicht stadtabhängig.

## 5. Mails
- Alle Vorlagen bekommen optional die Prop `city` (Standard koeln). Behörde, Ortsangaben, Portal-Link, „3 Stunden" und der FIN-Hinweis kommen aus `getCity(city)`. Die Platzhalter erzeugen für Köln exakt die heutigen Strings.
- Aufrufer (`result.ts`, webhook/finalize, rebook, withdrawal, email-change, daily-status, dates) übergeben `booking.city`.
- **Betroffen:** booking-confirmation, appointment-found, search-email-limit, search-rebook-offer, customer-email-parts, send-email (Absendername prüfen) und die internen Vorlagen mit Köln-Bezug.

## 6. Rechtstexte
- In AGB, Widerrufsbelehrung und Datenschutz werden Stellen wie „die Zulassungsstelle Köln" ersetzt durch „die jeweilige Zulassungsbehörde (derzeit die Stadt Köln)".
- Das Impressum bleibt unverändert.

## 7. Bewusst unverändert
Diese Abläufe werden nur städtefähig gemacht, verhalten sich aber wie heute:
- Stripe-Ablauf, Preis, Erstattung und die 48-Stunden-Regel
- Cron-Jobs und Vault-Schlüssel
- Tokens, Wunschtermine ändern, E-Mail ändern und Widerruf

## Absicherung „nichts ändert sich für Köln"
1. **Snapshot vorher:** Vor dem Umbau speichere ich per Playwright das HTML-Gerüst von `/` (Textinhalt aller Abschnitte, `head`-Tags, JSON-LD) und einen Screenshot. Danach vergleiche ich `/koeln` damit. Erlaubte Abweichungen sind nur canonical/og:url und die Header-Menüpunkte.
2. **Mails vorher/nachher:** Ein Skript rendert alle Kundenvorlagen und Köln-relevanten internen Vorlagen mit festen Testdaten vor und nach dem Umbau als HTML. Der Diff muss leer sein, ausgenommen der Betreff-Präfix `[Köln]` der internen Pi-Mails.
3. **pending-bookings:** Neuer Test (vitest) mit festen Beispielzeilen gegen die ausgelagerte Mapping-Funktion. Die erwartete JSON-Struktur wird vor dem Umbau aus dem heutigen Code erzeugt und muss danach identisch sein. Zusätzlich prüft der Test, dass ein fehlender Parameter `koeln` ergibt. Live ohne Schlüssel: 401. Ein Aufruf mit echtem Schlüssel erfolgt nicht, weil er das Lebenszeichen setzt.
4. **Kalender:** Test für Köln mit festen Zeitpunkten (13:59 und 14:00 Berlin, Wochenende, gesperrter Tag) vor und nach dem Umbau.
5. **Weiterleitung:** Playwright prüft, dass `/#buchung` auf `/koeln#buchung` landet und das Formular sichtbar ist.
6. Typprüfung und Build, kein Publish.

## Dateien
**Neu:**
- `src/lib/cities.ts`
- `src/routes/koeln.tsx`
- `src/components/home/` (HomeHero, CityPicker, HomeSteps, HomeFaq)
- Tests `src/lib/cities.test.ts`, `src/lib/calendar-rules.test.ts`, `src/routes/api/internal/pending-bookings.test.ts`
- Migration `0008_multi_city.sql`

**Geändert:**
- `src/routes/index.tsx`, `services.ts`, `calendar-rules.ts`, `booking.functions.ts`, `stripe.functions.ts`, `booking-finalize.server.ts`, `rebook.functions.ts`, `withdrawal.functions.ts`, `email-change.functions.ts`
- `Header.tsx`, `Footer.tsx`, `BookingForm.tsx`, `Founder.tsx`, `Testimonials.tsx`, `InfoBlock.tsx` (Ortsangaben aus Config)
- `buchung-erfolgreich.tsx`, `buchung-abgebrochen.tsx`, `termine-aendern.tsx`, `email-aendern.tsx`, `widerruf.tsx`
- `agb.tsx`, `widerrufsbelehrung.tsx`, `datenschutz.tsx`
- `pending-bookings.ts`, `result.ts`, `heartbeat.ts`, `health/check.ts`, `daily-status.ts`, `webhook.ts` (city durchreichen)
- die Mailvorlagen mit Köln-Bezug und `registry.ts` (nur Typen)
- `public/sitemap.xml`, `public/llms.txt`, `AGENTS.md` (Regel: Stadtdaten nur aus `cities.ts`)

## Offene Fragen
- Soll `/` in der Google-Suche sofort die Köln-Platzierung übernehmen? Die bisherigen Köln-Keywords wandern nach `/koeln`, und das kann vorübergehend Ranking kosten.
- Der Präfix `[Köln]` gilt auch für die bestehenden internen Pi-Wächter-Mails. Ist das gewollt? Die Kundenmails bleiben ohne Präfix.
