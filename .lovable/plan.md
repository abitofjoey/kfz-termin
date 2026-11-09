# SEO/GEO-Check der Mehrstädte-Seiten

## Befund (heute geprüft)

Schon gut:
- Sitemap live mit Start, /koeln, /bonn und Rechtsseiten; neue Städte kommen automatisch dazu.
- robots.txt erlaubt alles Öffentliche, sperrt Danke-/Abbruchseiten, verweist auf die Sitemap.
- /llms.txt live (200) und wird automatisch aus den gestarteten Städten erzeugt.
- Jede Stadtseite hat eigenen Titel, Beschreibung, og-Tags, Canonical sowie Service- und FAQ-Daten für Google.
- Nicht gestartete Städte sind automatisch auf "nicht indexieren" gestellt.
- www leitet auf die Hauptadresse um.

Verbesserungswürdig:
1. Firmen-Daten (Organization) stehen doppelt: einmal sitewide, einmal auf der Startseite.
2. Bonn hat kein eigenes Vorschaubild für WhatsApp/Social (nur Köln).
3. Keine "Brotkrumen"-Daten (Start > Bonn) auf den Stadtseiten.
4. Service-Daten der Städte ohne Angabe der Behörde/Standorte (für KI-Suche hilfreich: Ort, Adresse).
5. Sitemap ohne Änderungsdatum (lastmod) – optional.
6. www-Umleitung ist vorübergehend (302) statt dauerhaft (301) – Einstellung der Domain, nicht im Code.
7. Unklar ohne Search Console: ob die Sitemap eingereicht ist und /bonn indexiert wird.

## Umsetzung
- Doppelte Organization auf der Startseite entfernen (sitewide bleibt).
- BreadcrumbList auf /koeln und /bonn.
- Service-Daten je Stadt um Behörde/Standorte (Name, Adresse aus Stadt-Konfiguration) ergänzen.
- Bonn: Vorschaubild 1200x630 "KFZ-Termin Bonn" erzeugen und als og:image/twitter:image setzen (nur nach deinem OK).
- llms.txt: pro Stadt Standorte und Suchzeiten ergänzen (weiter automatisch).
- Search Console prüfen (Indexierung, Sitemap-Status); falls nicht verbunden, sage ich, wie du die Sitemap einreichst.
- Köln-Texte bleiben wortgleich; danach Typprüfung, Tests, Prüfung des ausgelieferten HTML. Nicht veröffentlichen ohne OK.
