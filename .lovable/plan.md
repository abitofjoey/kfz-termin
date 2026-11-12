# Recklinghausen live schalten

## Änderung
- In der Stadt-Konfiguration für Recklinghausen nur `launched: false` → `launched: true`. Sonst nichts.

## Was sich dadurch automatisch ergänzt (kein weiterer Code nötig)
- Header-Stadtauswahl und Footer (alphabetisch: Bonn, Köln, Recklinghausen)
- Stadt-Karten auf der Startseite inkl. Wahrzeichen-Icon
- Startseiten-Beschreibung und Text „Derzeit für: …", JSON-LD `areaServed`
- Sitemap und /llms.txt
- Stadtseite verliert `noindex` und wird indexierbar

## Bereits erledigt
- Rechtstexte (AGB, Datenschutz, Widerruf) nennen den Kreis Recklinghausen schon.
- Buchbarkeit und Pi-Überwachung sind seit der letzten Änderung aktiv.

## Prüfung
- Tests und Typprüfung, Vorschau der Startseite (Karten, Header, Footer) und Sitemap ansehen.
- Danach veröffentlichen.
