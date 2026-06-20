# Bewertungssektion hinzufügen

## Ziel
Eine neue Sektion „Das sagen erste Kund:innen" auf der Startseite, die 4 Erfahrungsberichte zeigt – passend zum bestehenden Design (helles Card-Layout, Akzentfarbe Orange, dezente Borders wie in Steps/Pricing).

## Inhalt der 4 Bewertungen

Damit sich die Stimmen klar unterscheiden (verschiedene Tonalitäten, Anlässe, Längen) – mit leichten Anpassungen deiner Vorlagen:

**1. Lukas M.** – Ummeldung, überrascht & locker
> „Auftrag morgens abgeschickt – keine Stunde später kam die Mail mit dem Termin für den nächsten Tag. Damit hatte ich ehrlich nicht gerechnet. Top."

**2. Sabine K.** – sachlich, dankbar, etwas länger
> „Ich brauchte kurzfristig einen Termin und hatte wenig Hoffnung, online noch etwas Passendes zu finden. Noch am selben Tag kam die Bestätigung – Termin in drei Tagen. Hat sich für mich wirklich gelohnt."

**3. Markus B.** – Service-Erfahrung, persönlich
> „Hatte noch eine Frage zur FIN und einfach kurz angerufen. Wurde direkt und freundlich erklärt, ging super unkompliziert."

**4. Jonas R.** – knapp, pragmatisch (deine Option A, leicht angepasst)
> „Formular ausgefüllt, bezahlt, fertig. Musste nichts mehr machen, bis die Bestätigungsmail kam. Genau so soll's sein."

Die Namen sind erfunden, abgekürzte Nachnamen wie bei klassischen Kundenstimmen – wirkt seriös und vermeidet falsche Authentizität.

## Design & Platzierung

- **Position:** Neuer Abschnitt zwischen `Founder` und `BookingForm` auf `src/routes/index.tsx`. So baust du Vertrauen direkt vor dem Buchungsformular auf.
- **Layout:** Section mit `max-w-6xl`, Überschrift links (gleiche Typo wie Steps/Founder), darunter ein responsives Grid:
  - Mobile: 1 Spalte
  - md: 2 Spalten
  - lg: 4 Spalten (alle nebeneinander)
- **Card-Stil:** Wiederverwendung der bestehenden `Card`-Komponente (`rounded-xl border bg-card shadow`), Padding `p-6`, gleiche dezente Optik wie die Pricing-/Steps-Karten – kein neuer visueller Stil.
- **Innerhalb jeder Card:**
  - 5 orange Sterne (`lucide-react` `Star`, gefüllt, `text-accent`) oben
  - Zitat in `text-foreground`, leicht serifenlos, Zeilenhöhe `leading-relaxed`
  - Trenner / Spacing
  - Name in `font-semibold` + kleine Sub-Zeile mit Anlass (z. B. „Ummeldung", „Wunschkennzeichen", „Neuzulassung", „Außerbetriebsetzung") in `text-muted-foreground text-sm`
- **Überschrift:** „Erfahrungen unserer Kund:innen" (H2), Subline: „Das sagen Personen, die KFZ-Termin Köln bereits genutzt haben."
- Keine Avatare/Fotos (würden Stockfoto-Vibe geben und schaden der Glaubwürdigkeit).
- Keine Sterne-Logos externer Plattformen (Google etc.), da keine echten Plattformbewertungen vorliegen – wäre rechtlich heikel.

## Technische Umsetzung

Neue Datei `src/components/landing/Testimonials.tsx`:
- Lokale Konstante `testimonials = [{ name, service, quote }, ...]`
- Reines Präsentations-Component, keine State, keine Server-Calls
- Verwendet `Card`, `CardContent`, `Star` (lucide-react)

Einbindung in `src/routes/index.tsx`:
```tsx
<Founder />
<Testimonials />
<BookingForm preselected={preselected} />
```

Keine Änderungen an Routen, Backend, Tracking, Meta-Tags, Pricing, Buchungsformular oder bestehenden Komponenten.

## Optional (nur auf deinen Wunsch, jetzt NICHT geplant)
- JSON-LD `Review` / `AggregateRating` für SEO. Standardmäßig **nicht** eingebaut, da Google echte, überprüfbare Bewertungen erwartet und „first-party"-Testimonials ohne Plattformnachweis schnell als Policy-Verstoß gelten können. Sag Bescheid, wenn du es trotzdem willst.
