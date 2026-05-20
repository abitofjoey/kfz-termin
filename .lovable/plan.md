
# KFZ-Termin Köln – Umsetzungsplan

Eine professionelle, deutschsprachige Landing Page mit Buchungsformular, Zahlungsabwicklung, Datenbank-Speicherung und automatischer Kunden-Bestätigungsmail.

## Seitenstruktur

Eine Hauptseite (`/`) mit allen inhaltlichen Sektionen plus drei rechtliche Unterseiten als eigene Routen.

- `/` – Landing Page (Hero, So funktioniert's, Preise, Buchungsformular, FAQ, Footer)
- `/impressum` – Platzhalter
- `/datenschutz` – Platzhalter
- `/agb` – Platzhalter
- `/buchung-erfolgreich` – Bestätigungsseite nach Stripe-Checkout
- `/buchung-abgebrochen` – Hinweis nach Abbruch

## Design

- Hauptfarbe: Anthrazit / Dunkelblau (#0F172A-ähnlich), weiße Flächen, dezenter Akzent (z.B. gedämpftes Blau)
- Gelbe Warn-/Info-Boxen für wichtige Hinweise
- Klare serifenlose Typografie (Inter o.ä.), großzügige Weißräume
- Keine verspielten Animationen, sachlicher Behördenkontext

## Sektionen der Landing Page

1. **Hero** – Headline, Subheadline, CTA „Jetzt Termin sichern" (scrollt zum Formular)
2. **So funktioniert's** – 5 Schritte mit Icons + gelbe Warnbox zur 1-Stunden-Bestätigung
3. **Preise** – Zwei gleichwertige Karten (Gebraucht / Neufahrzeug, je 19€) mit Buttons, die zum Formular scrollen und das Dropdown vorbelegen
4. **Buchungsformular** – Alle Felder wie spezifiziert, Validierung inkl. Kalender-Mehrfachauswahl
5. **FAQ** – Accordion mit den 7 Fragen
6. **Footer** – Rechts-Links + Kontakt + Copyright

## Buchungsformular – Validierung

- Pflichtfelder mit Zod-Schema
- E-Mail-Format-Prüfung
- FIN: genau 4 Zeichen
- Kalender (shadcn Calendar, mode="multiple"): frühestes Datum heute+1
- Mindestens 5 Tage erforderlich – sonst roter Hinweis, Submit blockiert
- Wenn Tage innerhalb der nächsten 3 Tage gewählt: gelbe Info-Box (nicht blockierend)
- Zwei Pflicht-Checkboxen (AGB/Datenschutz, Widerrufsverzicht)

## Backend & Integrationen

Drei Lovable-Plattform-Features werden benötigt – diese müssen vor Implementierung aktiviert werden:

### a) Lovable Cloud (Datenbank)
Tabelle `bookings` mit den spezifizierten Spalten. RLS aktiviert, INSERT erlaubt für anon (nur Insert, kein Select), UPDATE/SELECT nur für Service-Role (für Webhook & spätere Verwaltung).

### b) Lovable Payments (Stripe)
Empfehlung: **Lovable's eingebaute Stripe-Integration** statt eigenem Stripe-Account – kein API-Key nötig, schneller startklar. Ein Produkt „KFZ-Terminservice" mit Preis 19,00 €. Checkout-Flow:
1. Formular abschicken → Server-Function legt `bookings`-Zeile mit `paid=false` an
2. Stripe-Checkout-Session wird erstellt mit `booking_id` als metadata
3. Nach erfolgreicher Zahlung: Webhook setzt `paid=true` und triggert Bestätigungsmail
4. Redirect zu `/buchung-erfolgreich` bzw. `/buchung-abgebrochen`

### c) Lovable Emails (Bestätigungsmail)
Eigene Sender-Domain wird im Setup-Dialog konfiguriert. Eine transaktionale React-Email-Template `booking-confirmation` mit allen geforderten Inhalten (Zusammenfassung, 1-Stunden-Hinweis fett, Rückerstattung, Widerrufshinweis, Kontakt). Versand wird vom Stripe-Webhook ausgelöst.

## Rechtliche Unterseiten

Jeweils minimale Seite mit Überschrift und Platzhalter-Hinweis in einer Info-Box, plus zurück-zur-Startseite-Link.

## Technische Details (für Entwickler)

- TanStack Start mit file-based Routing in `src/routes/`
- Formular: `react-hook-form` + `zod` + shadcn Form-Komponenten
- Kalender: shadcn `Calendar` mit `mode="multiple"`, `locale={de}` von `date-fns/locale`
- Server-Functions in `src/lib/booking.functions.ts`: `createBookingAndCheckout`
- Stripe-Webhook als public route unter `src/routes/api/public/stripe-webhook.ts` mit Signaturprüfung
- E-Mail-Template in `src/lib/email-templates/booking-confirmation.tsx`, registriert in `registry.ts`
- Aufruf via `sendTransactionalEmail` aus dem Webhook-Handler (mit Service-Role-Auth, da kein User-JWT)
- `selected_dates` wird als ISO-Date-Strings (text[]) gespeichert
- Idempotency-Key für Mail-Versand: `booking-confirm-${booking_id}`

## Reihenfolge der Umsetzung

1. Lovable Cloud aktivieren → `bookings`-Tabelle anlegen
2. Lovable Payments (Stripe) aktivieren → Produkt 19€ anlegen
3. Lovable Emails: Sender-Domain einrichten → E-Mail-Infrastruktur scaffolden
4. Landing Page (Hero, Schritte, Preise, FAQ, Footer) bauen
5. Buchungsformular mit Validierung
6. Server-Function + Stripe-Checkout
7. Webhook + Bestätigungsmail-Template
8. Rechtliche Unterseiten + Erfolgs-/Abbruch-Seiten

## Hinweise & offene Punkte

- Die rechtlichen Texte (Impressum, Datenschutz, AGB) bleiben als Platzhalter — diese müssen vor Live-Gang juristisch befüllt werden, sonst Abmahnrisiko.
- Die Mail vom „Kölner Zulassungsstelle" mit 1-Stunden-Bestätigungslink kommt nicht aus diesem System — das ist ein externer Prozess, der außerhalb der App stattfindet. Die App kommuniziert das nur in Hinweistexten.
- Stripe startet automatisch im Test-Modus; vor echtem Verkauf muss live-mode aktiviert werden.
