# Neuss → „Rhein-Kreis Neuss" (Name und Adresse)

## Wo der Name „Neuss" heute überall erscheint
Der Stadtname kommt aus einer einzigen Einstellung und taucht dadurch automatisch auf in:
- Stadtauswahl oben, Fußzeile, Stadt-Karten und „Derzeit für: …" auf der Startseite
- Seitentitel, Brotkrümel-Pfad, Angaben für Suchmaschinen, Sitemap, /llms.txt
- Kundenmails, die den Stadtnamen nennen, und der Betreff-Präfix interner Mails („[Neuss] …"), tägliche Statusmail, Portal-Check-Mails
- Bezahlseite (Beschreibung bei Stripe)

Nicht betroffen: die Standortnamen („Straßenverkehrsamt Neuss", Ort „Neuss" im Betreff „Dein Termin in Neuss ist gebucht") – das ist der echte Ort und bleibt. Rechtstexte (Datenschutz, AGB-Städteliste) werden bewusst von Hand gepflegt; dort ändere ich „Neuss" ebenfalls in „Rhein-Kreis Neuss".

## Auswirkung der Adressänderung – wichtig
Das Kürzel „neuss" ist nicht nur die Adresse, sondern auch der interne Schlüssel:
- in jeder gespeicherten Neuss-Buchung,
- beim Pi-Script (fragt mit `?city=neuss` ab, meldet Herzschlag und Portal-Check mit „neuss"),
- in Überwachung und Statusmail.

Würde ich das Kürzel einfach umbenennen, fände das Script keine Buchungen mehr, bis es angepasst ist, und vorhandene Buchungen müssten umgeschrieben werden.

**Deshalb mein Vorschlag:** Intern bleibt „neuss" (Datenbank, Script, Mails-Logik unverändert). Nur die öffentliche Adresse wird `/rhein-kreis-neuss`. Die alte Adresse `/neuss` leitet dauerhaft weiter, damit geteilte Links und Google nicht ins Leere laufen.

## Umsetzung
1. Stadt-Einstellung: neues optionales Feld für die öffentliche Adresse; bei Neuss `rhein-kreis-neuss`, bei allen anderen fehlt es (Adresse = Kürzel wie heute).
2. Name bei Neuss auf „Rhein-Kreis Neuss"; Eigenschaftswort („Neusser") und Gebiet bleiben.
3. Alle Links, Sitemap, Canonical, /llms.txt, Brotkrümel nutzen die öffentliche Adresse.
4. Stadtseite findet die Stadt über die öffentliche Adresse; `/neuss` → dauerhafte Weiterleitung auf `/rhein-kreis-neuss`.
5. Texte prüfen, in denen „Neuss" mit dem Namen zusammengesetzt würde (z. B. „in Rhein-Kreis Neuss" → wo nötig „im Rhein-Kreis Neuss"), Neuss-Texte entsprechend glätten.
6. Rechtstexte: Städteliste von Hand anpassen.
7. Tests: Köln/Bonn/Recklinghausen-Adressen unverändert; Neuss-Link zeigt auf /rhein-kreis-neuss; /neuss leitet weiter; Script-Abfrage mit `city=neuss` funktioniert weiter.

Köln, Bonn, Recklinghausen bleiben Wort für Wort gleich. Nicht veröffentlichen ohne Freigabe.

## Technische Details
- `CityConfig.urlSlug?: string`; Helfer `cityPath(city)` und `getCityByUrlSlug()`; `$city`-Route löst über urlSlug auf, `beforeLoad` wirft `redirect` (301) für Kürzel mit abweichendem urlSlug.
- `slug` bleibt Schlüssel für `bookings.city`, `script_heartbeat`, `portal_checks`, `?city=`; keine Migration, Pi-Script unverändert.
- Rückfrage-Option: Wenn du lieber das Kürzel komplett umbenennst, braucht es eine Datenmigration der Buchungen und ein Script-Update auf dem Pi gleichzeitig.
