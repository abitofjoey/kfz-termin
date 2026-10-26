# Interne Mail bei geänderten Wunschterminen

## Änderungen
1. Neue Vorlage `src/lib/email-templates/search-dates-updated-internal.tsx` im Stil von `search-email-changed-internal` (HealthLayout/Row), fester Empfänger info@kfz-termin.online.
   - Betreff: "Wunschtermine geändert: <Vorname Nachname>"
   - Zeilen: Name, Buchungsnummer, Service, bisherige Wunschtermine, neue Wunschtermine (beide im Langformat, z. B. "Freitag, 20.11.2026"), Buchungs-ID.
2. Eintrag `search-dates-updated-internal` in `registry.ts`.
3. `dates.ts`: nur bei `changed: true`, nach der Kundenmail, zusätzlich die interne Mail. Schlüssel = Schlüssel der Kundenmail + `-internal`. Fehler nur loggen (ohne Kundendaten), Antwort unverändert.

Sonst nichts ändern.

## Danach
Typprüfung, Build, 401-Test ohne Schlüssel, Sicherheitscheck ansehen, dann veröffentlichen.
