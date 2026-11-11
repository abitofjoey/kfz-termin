# Automatische Script-Updates für den Pi

## 1. Privater Speicherordner „script-releases"
- Ich lege den Ordner privat an (nicht öffentlich).
- Hochladen machst du selbst: **Cloud → Storage → script-releases → Upload**, Dateiname exakt `kfz-termin.user.js`; zum Ersetzen alte Datei löschen bzw. gleichnamig neu hochladen.
- Ob der Upload-Knopf in deiner Ansicht wirklich da ist, kann ich vorab nicht sicher prüfen. Ich lege zuerst nur den Ordner an und du probierst es. Klappt es nicht, sage ich dir das und baue nichts weiter, bis du entscheidest (Ersatz wäre: du lädst die Datei hier im Chat hoch und ich lege sie ab).

## 2. Secret SCRIPT_UPDATE_TOKEN
- Sicheres Eingabeformular; du gibst den Wert selbst ein. SCRIPT_API_KEY bleibt unberührt.

## 3. Zwei Abruf-Adressen ohne Login
- `/api/script/$token/kfz-termin.user.js` – ganze Datei
- `/api/script/$token/kfz-termin.meta.js` – nur Block `// ==UserScript==` bis `// ==/UserScript==` (fehlt der Block → 404)
- Token zeitkonstant gegen SCRIPT_UPDATE_TOKEN; falsch/Secret fehlt/Datei fehlt → 404 „Not found".
- Jedes `{{UPDATE_TOKEN}}` wird durch den echten Token ersetzt.
- Header: `Content-Type: text/javascript; charset=utf-8`, `Cache-Control: no-store`, `X-Robots-Tag: noindex` (auch bei 404).
- Log nur „script ausgeliefert (user/meta)", nie der Token.

## 4. Versionsanzeige
- Migration: `script_heartbeat.script_version text NULL`.
- `pending-bookings`: Header `x-script-version` (gekürzt auf max. 32 Zeichen) wird beim bestehenden Heartbeat-Speichern mitgeschrieben; ohne Header exakt wie bisher.
- `/api/internal/heartbeat`: zusätzlich `scriptVersion` (oder `null`).

## 5. robots.txt
- `Disallow: /api/` ergänzen.

## Prüfung
- Tests für Token-Prüfung, Kopfblock-Ausschnitt und Platzhalter-Ersetzung; Typecheck/Build; 404 mit falschem Token per Abruf. Nicht veröffentlichen.

## Technisch
- Neue Datei `src/routes/api/script/$token/$file.ts` (ein Handler, `$file` nur die zwei erlaubten Namen, sonst 404), Download per Admin-Client im Handler nach Token-Prüfung; Hilfsfunktionen in `src/lib/script-release.ts`.
- Bestehende interne Routen ändern sich nur um die Versions-Spalte, Auth bleibt gleich.
