# Startseite neu als Wegweiser

Nur die Startseite (`/`) und neue Bausteine unter `src/components/home/` ändern. `/koeln`, alle anderen Seiten, Formular, Mails und Backend bleiben unverändert. Texte wortgleich aus der Vorgabe.

## Aufbau
1. **Hero (hell)** mit H1, Einleitung, Frage „Für welche Stadt suchst du einen Termin?“ (Anker `#stadt-waehlen`), große Stadt-Karten als Link auf `/<slug>` (eine Stadt: breite Karte, mehrere: Raster), „Weitere Städte folgen.“, Vertrauenszeile mit drei Häkchen.
2. **So funktioniert's** als Zeitstrahl: Desktop waagerecht mit Verbindungslinie, mobil senkrecht.
3. **Warum KFZ-Termin?** drei Kacheln mit Icon.
4. **Kundenstimmen aus Köln**, 3 Karten aus den bestehenden Rezensionen (die ersten drei: Mona, Konstantin, Mario), Texte unverändert.
5. **Wer steckt dahinter?** kurzer Text mit vorhandenem Founder-Foto, „Eike Hoffmann · jeh-digital.de“.
6. **Deine Stadt fehlt?** Akzent-Box, Buttons WhatsApp (bestehende Nummer, vorbefüllter Text) und E-Mail (`mailto:info@kfz-termin.online?subject=Neue Stadt`).
7. **Häufige Fragen**: die 6 vorgegebenen, Städteliste aus `cities.ts`, Datenschutz-Link; FAQPage-JSON-LD aus genau diesen Fragen.
8. **Abschluss-Band** mit denselben Stadt-Karten.

Städte überall aus `launchedCities()`, Bonn erscheint so automatisch.

## Header
Nur auf der Startseite: Menü „Start“ + aktive Städte, Button rechts „Stadt wählen“ → `#stadt-waehlen`. Dafür bekommt der bestehende Header eine optionale Startseiten-Variante; ohne diese Einstellung (alle Stadtseiten) bleibt er exakt wie bisher. Das ist die einzige Änderung außerhalb von `src/components/home/` und der Startseite.

## Meta-Daten
Title und Description wie vorgegeben, „Derzeit für: …“ aus den aktiven Städten. Canonical bleibt `/`. Organization- und Service-JSON-LD bleiben.

## Unverändert / Leitplanken
- Hash-Weiterleitung `/#buchung` usw. → `/koeln#…` bleibt.
- Keine erfundenen Zahlen, Siegel, „sofort“/„garantiert schnell“.
- Mobil zuerst, große Klickflächen; keine neuen Bilder außer dem vorhandenen Founder-Foto (lazy).
- Farben, Schrift, Buttons nur aus dem bestehenden Design-System.

## Prüfung
Typprüfung, Build, Playwright-Screenshots mobil und Desktop, Check dass `/koeln` unverändert und die Legacy-Hashes weiterleiten. Nicht veröffentlichen.
