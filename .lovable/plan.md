# Neuss: Standort per Link vorwählen (?standort=…)

Gilt vorerst nur für Neuss. Köln, Bonn und Recklinghausen ignorieren den Parameter und bleiben genau wie heute.

## Verhalten
- Gültige Werte: `neuss`, `grevenbroich`, `dormagen`, `meerbusch`. Jeder andere Wert (z. B. `xyz`) wird ignoriert, die Seite sieht dann aus wie ohne Parameter.
- **Überschrift:** Mit gültigem Standort lautet sie „Dein Termin beim Straßenverkehrsamt Grevenbroich –" / „automatisch gebucht". Der Ortsname kommt aus dem Standort. Badge, Einleitung und alles andere bleiben gleich.
- **Formular:** „Nur bestimmte Standorte" ist vorgewählt und genau dieser Standort angehakt. Darunter steht klein: „Tipp: Weitere Standorte dazunehmen erhöht deine Chance auf einen frühen Termin." Der Kunde kann jederzeit auf „Egal wo" wechseln oder weitere Standorte anhaken.
- **Anliegen gibt es dort nicht** (z. B. Ausfuhr in Meerbusch): Dann gilt die bisherige Logik, also wird Meerbusch nicht angezeigt und der Haken fällt weg. Es gibt keinen neuen Fehler. Wer so abschickt, sieht wie bisher den Hinweis „Bitte mindestens einen Standort wählen".
- **Google:** Die Canonical-Adresse bleibt https://kfz-termin.online/neuss ohne Parameter. Seitentitel, Beschreibung, Vorschaubild und strukturierte Daten bleiben gleich.

## Technische Details
- `$city`-Route: `validateSearch` mit `standort: fallback(z.string(), "")`, ohne Enum. Prüfung gegen `city.locations` erst in der Komponente. Den Canonical-/og:url-Code aus `params` lasse ich unverändert, er enthält ohnehin keine Query.
- Neue optionale Einstellung `hero.locationHeadline` im Stadt-Content, nur bei Neuss gesetzt: `"Dein Termin beim Straßenverkehrsamt {town} –"`. Der Parameter wirkt nur, wenn diese Einstellung vorhanden ist und die Stadt `flow: "multi"` mit `form.locationChoice` hat. So bleibt Bonn trotz `?standort=beuel` unverändert.
- Helfer `resolveStandort(city, content, raw)` gibt die Location oder `null` zurück. Er wird in `MultiLocationLanding` → `Hero` (optional überschriebene Überschrift) und `CityBookingForm` (Prop `initialLocation`) verwendet.
- `CityBookingForm`: Ist `initialLocation` gesetzt, starten die Werte mit `mode = "specific"` und `chosen = [id]`. Der Tipp erscheint, solange `mode === "specific"` und eine Vorwahl besteht. Der bestehende Filter `possible` bleibt unverändert.
- Tests: Helfer und Render. `grevenbroich` ergibt Überschrift mit Grevenbroich und Grevenbroich angehakt. `xyz` ergibt die Standard-Überschrift und „Egal wo". Bonn mit `beuel` ergibt die unveränderte Bonn-Überschrift und „Egal wo". Die bestehenden Tests bleiben grün.

Nicht veröffentlichen ohne Freigabe.
