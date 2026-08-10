# Service-Kacheln: 9 statt 8 sichtbar

Aktuell sind 8 Anliegen sichtbar, wodurch in der 3-spaltigen Kachel-Reihe eine Lücke entsteht. Mit 9 sichtbaren Kacheln füllen sich genau 3 Reihen ohne Löcher, und die restlichen 6 bleiben hinter „Weitere Anliegen anzeigen“.

## Änderung

- `src/lib/services.ts`: „H-Kennzeichen“ zusätzlich als häufiges Anliegen markieren (`popular: true`), sodass 9 Kacheln direkt sichtbar sind.
- Button-Text bleibt automatisch korrekt („Weitere Anliegen anzeigen (6)“), da die Anzahl aus der Liste berechnet wird.

Sonst keine Änderungen: Reihenfolge, Buchung, E-Mails und `llms.txt` bleiben unverändert.
