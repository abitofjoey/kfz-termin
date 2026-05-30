## Ziel
Den Satz in § 2 Leistungsbeschreibung der AGB (`src/routes/agb.tsx`) rechtlich präzisieren, damit klar wird: Der Anbieter bucht den Termin im Namen des Kunden, die tatsächliche Wahrnehmung (Erscheinen bei der Zulassungsstelle) liegt jedoch beim Kunden selbst.

## Änderung
**Aktueller Text:**
> Der Anbieter sucht im Auftrag des Kunden nach einem freien Termin im vom Kunden gewünschten Zeitraum und nimmt diesen mit den vom Kunden bereitgestellten Daten in dessen Namen wahr.

**Neuer Text:**
> Der Anbieter sucht im Auftrag des Kunden nach einem freien Termin im vom Kunden gewünschten Zeitraum und bucht diesen mit den vom Kunden bereitgestellten Daten in dessen Namen. Die Wahrnehmung des Termins erfolgt durch den Kunden selbst.

## Prüfung auf weitere Vorkommen
Vor dem Commit wird geprüft, ob die alte Formulierung ("nimmt [...] wahr") auch in E-Mail-Templates, Meta-Beschreibungen oder anderen Rechtstexten vorkommt, damit die Aussage überall konsistent ist.

## Dateien
- `src/routes/agb.tsx`