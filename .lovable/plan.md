# Preis 12,99 € aus zentraler Quelle, bezahlter Betrag pro Buchung, USt ab 2027

## 1. Zentrale Quelle
- `src/lib/cities.ts`: `priceCents` für koeln und bonn auf 1299.
- Neue Datei `src/lib/price.ts`: `formatPrice(cents)` → "12,99 €" (de-DE, immer zwei Nachkommastellen), `VAT_FROM = "2027-01-01"`, `isVatActive(now)` (Berliner Kalendertag ≥ VAT_FROM), `vatNote()` / `priceTaxSuffix()` für die Texte.
- Fest eingetragene Preise ersetzen durch `formatPrice(city.priceCents)` (bzw. Köln-Konfiguration auf der neutralen Startseite):
  - `Pricing.tsx` (große Preisangabe)
  - `BookingForm.tsx` (Dienstleistungs-Liste, Hinweis unter dem Button)
  - `components/home/HomeSections.tsx` (Vertrauenszeile, Schritt 1, Kachel Geld-zurück, zwei FAQ)
  - `content/cities/koeln.ts` (drei FAQ-Antworten, SEO-Titel/Beschreibung) – Texte werden mit dem Preis aus der Konfiguration zusammengesetzt
  - `routes/index.tsx` (Description, JSON-LD `offers.price`)
  - `agb.tsx` §(1)
  - `public/llms.txt` (statische Datei, kann nicht rechnen) → Text auf 12,99 € anpassen
- Abschluss: Suche nach "9,99", "9.99", "999" in `src` und `public` – Treffer nur noch dort, wo der historische Wert gewollt ist (Migration-Backfill, Test).

## 2. Bezahlter Betrag pro Buchung
- Migration: `bookings.amount_cents integer`, bestehende Zeilen per Backfill 999 (additiv, nullable).
- `stripe.functions.ts`: Betrag serverseitig aus der Stadt der Buchung, in `amount_cents` speichern, als `unit_amount` an Stripe.
- Mails mit Betrag: heute nennt nur die Bestätigungsmail einen Betrag ("Betrag 9,99 €"). Rückerstattungsangebot, Erstattung und Widerruf sagen nur „den vollen Betrag“ – ohne Zahl. Vorschlag: dort unverändert lassen (Mailvergleich bleibt identisch). Bestätigung zeigt `formatPrice(booking.amount_cents)` (Fallback 999 falls leer).
- Rückerstattung (`refund.server.ts`) erstattet bereits ohne Betragsangabe über den payment_intent → Stripe erstattet automatisch den tatsächlich bezahlten Betrag. Keine Änderung nötig.
- `buchung-erfolgreich.tsx`: Conversion-Wert = `amount_cents / 100` der Buchung (wird mit dem bestehenden Statusabruf mitgeladen; Fallback 12,99 aus Stadt).

## 3. Umsatzsteuer ab 2027
Heutige Kleinunternehmer-/„keine USt.“-Hinweise:
- `BookingForm.tsx` – Hinweis unter dem Button „(keine USt.)“
- `booking-confirmation.tsx` – Zeile „Umsatzsteuer: Keine USt. gem. § 19 UStG“
- `agb.tsx` §(1) – „Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.“
- `impressum.tsx` – Abschnitt „Umsatzsteuer … Kleinunternehmerregelung“
- `public/llms.txt` – „keine Umsatzsteuer (§ 19 UStG)“
- Preis-Sektion `Pricing.tsx`: aktuell kein Steuerhinweis

Ab VAT_FROM automatisch: Formular „inkl. 19 % USt.“, Preis-Sektion „inkl. 19 % USt.“ (vorher kein Zusatz, wie heute), Bestätigungsmail Zeile „Umsatzsteuer: inkl. 19 % USt.“, AGB „Der Preis versteht sich inklusive der gesetzlichen Umsatzsteuer.“
- Bei der Bestätigungsmail zählt das Buchungsdatum, nicht das Versanddatum.
- Impressum und `llms.txt` stelle ich nicht automatisch um (Impressum braucht ab dann eine USt-IdNr., `llms.txt` ist statisch) – bitte Anfang 2027 manuell anpassen. Sag Bescheid, falls das Impressum trotzdem automatisch umschalten soll.

## 4. Absicherung
- Mail-Snapshot vorher/nachher für alle Templates: Unterschied nur in der Betragszeile (bei amount_cents 1299).
- Tests (vitest): Checkout-Betrag für Köln = 1299; Bestätigungsmail mit amount_cents 999 zeigt „9,99 €“; formatPrice(1299) = „12,99 €“; USt-Text am 31.12.2026 vs. 01.01.2027 (Berliner Zeit).
- Typprüfung und Build, nicht veröffentlichen.
