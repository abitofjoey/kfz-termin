# Sicherheitslücke in `seroval` schließen

## Befund

Die Warnung betrifft nicht die TanStack-Pakete selbst, sondern deren gemeinsame Unterabhängigkeit `seroval`. Installiert ist `seroval` 1.5.2 (und `seroval-plugins` 1.5.2) — die Lücke (GHSA-mv8w-475r-vwqw) ist ab 1.5.3 behoben. TanStack erlaubt bereits `^1.5.0`, es braucht also kein TanStack-Update und keine Codeänderung.

## Umsetzung

1. In `package.json` ein `overrides`-Eintrag ergänzen, der `seroval` und `seroval-plugins` auf eine gepatchte Version (aktuell 1.6.x, mindestens 1.5.3) hebt.
2. `bun install` ausführen, damit `bun.lock` die neue Version enthält.
3. Verifizieren:
   - Lockfile enthält keine `seroval@1.5.2` mehr
   - Dependency-Scan erneut laufen lassen und den Befund als behoben markieren
   - Produktions-Build (`vite build`) und Preview-Check der Startseite plus Buchungsformular, da `seroval` die SSR-/Server-Function-Serialisierung übernimmt

## Risiko

Gering: Patch-/Minor-Update innerhalb der von TanStack erlaubten Range, keine API-Änderung. Sollte der Build oder die Buchung nach dem Update fehlschlagen, wird das Override auf exakt `1.5.6` (letzte 1.5er) reduziert bzw. zurückgenommen.
