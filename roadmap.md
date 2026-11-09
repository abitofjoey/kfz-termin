# Roadmap – Mehrstädtigkeit Stufe 1
- [x] Snapshot alte Startseite + Mails + pending-bookings-Mapping (vorher)
- [x] cities.ts (launched/bookable), content/cities/koeln.ts, Dienstleistungen pro Stadt
- [x] Kalenderregeln aus Konfiguration
- [x] Dynamische Route /$city mit CityLanding, neue Startseite /, Hash-Weiterleitung
- [x] Header/Footer/Sitemap/llms, Zurück-Links pro Buchungsstadt
- [x] Migration city/locations/booked_location/booking_reference/cancel_url
- [x] Formular/Checkout setzen city
- [x] pending-bookings/heartbeat/result/health/daily-status/dates städtefähig, [Köln]-Präfix
- [x] Mails aus Stadt-Konfiguration
- [x] Rechtstexte städteneutral
- [x] Vergleich vorher/nachher, Tests, Typprüfung, Build
- [x] Stufe 1 Rest → in Stufe 2 übernommen

# Roadmap – Preis 12,99 €
- [x] Zentrale Preisquelle, amount_cents pro Buchung, USt-Umschaltung ab VAT_FROM, Tests
- [ ] Anfang 2027: Impressum und llms.txt (USt) manuell anpassen – macht der Nutzer

# Roadmap – Stufe 2 Bonn (versteckt)
- [x] Migration financed/vehicle_count
- [x] cities.ts Bonn, Dienstleistungen Bonn 1–35
- [x] Kalender je Kategorie, auch /termine-aendern
- [x] Bonner Formular, createBooking-Prüfungen, finanziert → ["dlz"]
- [x] pending-bookings Bonn-Format
- [x] Mails Bonn (Köln identisch)
- [x] /bonn Inhalt, Sichtbarkeit nur über launched
- [x] Stripe-Beschreibung, dataLayer city
- [x] Health/Daily-Status für bookable
- [x] Tests, Vergleich, Typprüfung, Build

## Bonn-Seite wie Köln
- [x] Reihenfolge, Steps, Services (Umschalter, Kacheln, Karte), Founder
- [x] Umschalten wählt erste Kachel der Kategorie
- [x] "Jetzt buchen" wählt im Formular vor
- [x] Texte entschärfen (Formular, FAQ, Mails)
- [x] Prüfung inkl. Handy-Screenshots, Köln-Vergleich
