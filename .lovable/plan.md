# Portal-Check

## Wichtiger Hinweis vorab (bitte bestätigen)
Die heutige "tägliche Status-Mail" (19:20 Uhr) geht **an die Kunden**. An info@ geht abends nur dann eine Mail, wenn der Pi einer Stadt nicht erreichbar ist. Eine tägliche interne Übersicht gibt es noch nicht.

Vorschlag: Im selben Abendlauf geht **zusätzlich eine neue interne Mail "Portal-Check täglich" an info@** (eine Mail, je Stadt eine Zeile). Kundenmails und die bestehende Pi-Mail bleiben unverändert. Portal-Zeilen kommen **nicht** in Kundenmails.

## 1. Neue Tabelle portal_checks
Spalten wie vorgegeben: city (Primärschlüssel), ok, signature, findings (Liste von Texten), script_version (optional), changed_at, last_check_at. Nur der Server hat Zugriff, kein öffentlicher Zugriff.

## 2. POST /api/internal/portal-check
- Anmeldung wie bei den anderen internen Routen (x-script-key gegen SCRIPT_API_KEY), vor jedem Datenbankzugriff.
- Prüfung: city muss eine bekannte Stadt aus der Stadtkonfiguration sein, ok ist ja/nein, findings höchstens 50 Texte mit je max. 300 Zeichen, bereiche ist eine Liste von Texten. Bei Fehlern 400.
- `bereiche` wird angenommen und geprüft, aber nicht gespeichert (keine Spalte vorgesehen).
- x-script-version (falls vorhanden, gekürzt auf 50 Zeichen) wird mitgespeichert.
- signature = findings sortiert, mit Zeilenumbruch verbunden; leer = "ok".
- Kein Eintrag vorhanden: speichern (changed_at = last_check_at = jetzt); Mail nur bei ok=false (Abweichungs-Mail).
- signature geändert: speichern, changed_at = jetzt, interne Mail an info@:
  - ok=false: Betreff "[Stadt] Terminseite geändert – N Abweichung(en)", alle findings als Liste, darunter "Bitte Script/Website prüfen lassen (Claude Bescheid geben). Suchen und Buchen laufen unverändert weiter."
  - ok=true: Betreff "[Stadt] Terminseite wieder wie erwartet".
- Unverändert: nur last_check_at (und script_version) aktualisieren, keine Mail.
- Antwort { ok: true }. Mailfehler verhindern das Speichern nicht.
- Mail-Wiederholschutz über einen Schlüssel aus Stadt + changed_at.

## 3. Tägliche Übersicht (siehe Hinweis oben)
Je Stadt mit Pi-Überwachung eine Zeile:
- "Portal-Check: ok"
- "Portal-Check: N Abweichung(en) seit <changed_at, Berliner Zeit>"
- last_check_at älter als 48 Stunden oder kein Eintrag: "Portal-Check: seit <Datum> keine Meldung" bzw. "noch keine Meldung".
Einmal pro Tag (Wiederholschutz über das Datum). Im Testlauf (dryRun) wird nichts verschickt.

## Nicht geändert
Bestehende interne Routen, SCRIPT_API_KEY, Kundenmails, Cron-Jobs, Buchungsablauf.

## Technische Details
- Migration: CREATE TABLE public.portal_checks, GRANT ALL an service_role, RLS an, Policy nur service_role.
- Neue Route `src/routes/api/internal/portal-check.ts` (Zod), Logik zu signature/Entscheidung als reine Funktion in `src/lib/portal-check.ts` mit Tests (neu/unverändert/geändert/wieder ok, Grenzen 50/300).
- Neue Templates `portal-check-changed-internal.tsx`, `portal-check-recovered-internal.tsx`, `portal-check-daily-internal.tsx` + Registry.
- `daily-status.ts`: Portal-Abschnitt ergänzen, sonstiger Ablauf unverändert.
- Typecheck, Tests, 401-Test; nicht veröffentlichen, bis du es sagst.
