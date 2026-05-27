## Ziel
Zwei veraltete FAQ-Einträge in `src/components/landing/Faq.tsx` aktualisieren, damit sie alle verfügbaren Services abdecken und auf die verlinkten Infoseiten der Stadt Köln verweisen.

## Änderungen

### 1. "Für welche Fahrzeuge gilt der Service?"
**Aktuell:** Beschränkt sich auf Gebrauchtfahrzeuge und Neufahrzeuge.
**Neu:** Allgemeine Formulierung, die alle 9 Services abdeckt (Fahrzeuganmeldung, Kennzeichenwechsel, technische Änderungen, H-Kennzeichen, Saisonkennzeichen etc.) und auf die "Infos Stadt Köln"-Links verweist.

### 2. "Was muss ich zum Termin mitbringen?"
**Aktuell:** "Bitte prüfe vorab auf der Seite der Stadt Köln, welche Unterlagen erforderlich sind."
**Neu:** Gleicher Inhalt, aber mit explizitem Hinweis, dass man über die "Infos Stadt Köln"-Links bei jedem Service oben auf der Seite die genauen Unterlagen findet.

## Technisch
- Datei: `src/components/landing/Faq.tsx`
- Nur die `a`-Texte von zwei FAQ-Items werden geändert.
- Keine neuen Dependencies, keine anderen Dateien betroffen.