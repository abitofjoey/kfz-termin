# AGB-Anpassung Widerrufsrecht (§ 6 und § 7)

Ziel: Rechtssicher klarstellen, **wann** die Leistung als vollständig erbracht gilt (damit das Widerrufsrecht erlischt) und **was** passiert, wenn der Kunde während laufender Suche widerruft. Anlass: das Drei-Szenarien-Modell aus dem Chat (Suche läuft / Termin gebucht / Termin verfallen).

## Änderungen

### 1. `src/routes/agb.tsx` — § 6 ergänzen: Definition der Leistungserbringung

Am Ende von § 6 einen neuen Absatz einfügen:

> **Vollständige Leistungserbringung.** Die Dienstleistung gilt als vollständig erbracht, sobald der Anbieter im Namen des Kunden einen Termin bei der Kfz-Zulassungsstelle gebucht und eine Buchungs- bzw. Bestätigungs-E-Mail der Zulassungsstelle erhalten hat. Ob der Kunde den gebuchten Termin anschließend wahrnimmt oder eine zusätzliche Bestätigung innerhalb der Wahrnehmungsfrist abgibt, ist für die Leistungserbringung unerheblich.

Damit ist Szenario 3 (Termin gebucht, Kunde bestätigt nicht innerhalb von 3h → Termin verfällt) abgedeckt: Leistung gilt als erbracht, kein Erstattungsanspruch.

### 2. `src/routes/agb.tsx` — § 7 "Folgen des Widerrufs" präzisieren

Den bestehenden Absatz "Folgen des Widerrufs" (Zeilen 103–109) ergänzen, sodass die drei Szenarien klar geregelt sind:

- **Widerruf vor Beginn der Suche:** volle Rückerstattung.
- **Widerruf während laufender Suche (noch kein Termin gebucht):** Rückerstattung abzüglich eines angemessenen Betrags für die bis zum Widerruf bereits erbrachte Sucharbeit (§ 357a Abs. 2 BGB). Dieser Betrag wird zeitanteilig im Verhältnis zum vereinbarten Gesamtpreis bemessen.
- **Widerruf nach vollständiger Erbringung** (Termin gebucht + Bestätigungs-E-Mail vorhanden): Widerrufsrecht erloschen, keine Rückerstattung.

### 3. Keine Änderungen am Formular oder an der Checkbox

Die Checkbox-Erklärung (§ 356 Abs. 4 BGB) passt weiterhin 1:1 und referenziert das Erlöschen "mit vollständiger Erbringung der Leistung" — diese ist nun in § 6 sauber definiert.

## Was NICHT geändert wird

- Geld-zurück-Garantie in § 6 (kein Termin im gewählten Zeitraum gefunden → 100 % zurück) bleibt unverändert.
- Preise / Datenschutz / Auftrags-Checkbox bleiben unberührt.

## Offene Frage

Soll der "angemessene Betrag" bei Widerruf während laufender Suche **konkret beziffert** werden (z. B. pauschal 30 % des Gesamtpreises) oder bewusst offen als "zeitanteilig nach Aufwand" formuliert bleiben? Die pauschale Variante ist transparenter für den Kunden, die offene Variante flexibler für dich.
