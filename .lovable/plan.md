## Ziel
Die Startseite so strukturieren, dass KI-Agenten (und Screenreader) sie zuverlässig lesen, verstehen und bedienen können. Keine sichtbaren Design- oder Funktionsänderungen.

## 1. Landmarks eindeutig benennen
Aktuell gibt es mehrere `<nav>`- und `<section>`-Elemente ohne Namen – Agenten können sie nicht unterscheiden.
- `Header.tsx`: `<nav aria-label="Hauptnavigation">`
- `Footer.tsx`: `<nav aria-label="Rechtliches und Kontakt">`
- Jeder Abschnitt (`Hero`, `Steps`, `Pricing`, `Founder`, `Testimonials`, `BookingForm`, `InfoBlock`, `Faq`) bekommt `aria-labelledby`, das auf die vorhandene `h1`/`h2` zeigt (IDs an den Überschriften ergänzen). Damit hat jeder Bereich im Accessibility-Tree einen sprechenden Namen.
- Skip-Link „Zum Inhalt springen" vor dem Header, nur bei Tastaturfokus sichtbar.

## 2. Strukturierte Daten erweitern (das liest ein Agent zuerst)
In `src/routes/index.tsx` als JSON-LD ergänzen:
- **Service/Offer**: Leistungsbeschreibung, Anbieter, Preis `9.99 EUR`, Verfügbarkeit, Einsatzgebiet Köln.
- **FAQPage**: aus den vorhandenen FAQ-Einträgen in `Faq.tsx` generiert (eine Quelle, kein doppelter Text).
- **BreadcrumbList** ist bei einer Onepager-Struktur nicht sinnvoll – wird weggelassen.

## 3. Formular agentenlesbar machen
`BookingForm.tsx` prüfen und ergänzen:
- Jedes Feld hat eine echte `label`/`id`-Verknüpfung, Pflichtfelder `aria-required`, Fehlermeldungen per `aria-describedby` + `aria-invalid` verknüpft.
- Statusmeldungen (Fehler/Erfolg) in einer `aria-live="polite"`-Region, damit Agenten den Ausgang einer Aktion mitbekommen.
- `<form>` bekommt `aria-labelledby` auf die Abschnittsüberschrift; `autoComplete`-Attribute (`given-name`, `family-name`, `email`, `tel`) ergänzen – hilft Agenten und echten Nutzern beim Ausfüllen.

## 4. `public/llms.txt` korrigieren und ausbauen
Die Datei nennt aktuell **„ab 19 €"** – der echte Preis ist **9,99 €**. Das ist die Datei, die KI-Agenten bevorzugt lesen, also:
- Preis korrigieren.
- Kurzabschnitte ergänzen: Ablauf in Schritten, was der Dienst NICHT tut (keine Behörde, kein Erscheinen vor Ort), Geld-zurück-Garantie, Kontaktadresse, Öffnungszeiten der Zulassungsstelle.

## 5. Verifikation
Automatisierter axe-Lauf im Browser über Startseite plus Impressum/Datenschutz/AGB, dazu ein Dump des Accessibility-Trees, um zu prüfen, dass alle Landmarks und Formularfelder benannt sind. Ergebnis melde ich dir.

## Technisches Detail
Betroffen sind ausschließlich Präsentations-/Markup-Dateien: `Header.tsx`, `Footer.tsx`, die Landing-Sections, `BookingForm.tsx` (nur ARIA/Autocomplete, keine Logik), `src/routes/index.tsx` (JSON-LD) und `public/llms.txt`. Keine Änderungen an Datenbank, Stripe, E-Mail oder Buchungsablauf.
