## Ziel

Den Pricing-Bereich von 2 fixen Karten auf **9 Services** erweitern, ohne die Seite zu überladen. Pattern: **Tab-/Kachel-Auswahl oben + eine dynamische Karte unten**, die je nach Auswahl die passenden Details zeigt. Alle Services kosten 19€.

## Empfohlene UX (Kacheln statt Dropdown)

Kacheln sind besser als Dropdown, weil:
- Alle Optionen sofort sichtbar → schneller Überblick, besser für SEO
- Mobil als 2-spaltiges Grid responsiv darstellbar (Dropdown verbirgt Optionen, schlechter für Discovery)
- Aktive Auswahl visuell hervorhebbar
- Keine zusätzliche Interaktion nötig

Layout:
```
[ Kachel1 ] [ Kachel2 ] [ Kachel3 ]
[ Kachel4 ] [ Kachel5 ] [ Kachel6 ]   ← mobil 2 Spalten, desktop 3
[ Kachel7 ] [ Kachel8 ] [ Kachel9 ]

┌─────────────────────────────────┐
│   Karte des gewählten Service   │
│   Titel + Beschreibung          │
│   19€ einmalig                  │
│   Features                      │
│   [ℹ Mehr Infos Stadt Köln]    │
│   [ Jetzt buchen ]              │
└─────────────────────────────────┘
```

Bei Klick auf „Jetzt buchen" → Scroll zum Formular, Service ist vorausgewählt.

## Die 9 Services

1. Anmeldung Gebrauchtfahrzeug
2. Anmeldung Neufahrzeug
3. Kennzeichenwechsel (Umkennzeichnung)
4. Technische Änderung
5. Wiederzulassung
6. H-Kennzeichen (historische Fahrzeuge)
7. Saisonkennzeichen
8. Kurzzeitkennzeichen
9. Ausfuhrkennzeichen

## Änderungen

### 1. Neue zentrale Service-Definition: `src/lib/services.ts`
Eine `SERVICES`-Liste mit `id`, `label`, `shortLabel` (für Kachel), `subtitle`, `note`, `infoUrl` (zunächst leer, trägst du selbst ein). Wird sowohl von `Pricing` als auch vom `BookingForm`-Select genutzt → keine Duplikate.

### 2. `src/components/landing/Pricing.tsx`
- 9 Kacheln (Grid: 2 Spalten mobil, 3 Spalten ab `sm`)
- `useState` für aktive Auswahl (Default: erster Service)
- Eine dynamische `PriceCard` unter den Kacheln
- Pro Karte: kleines Info-Icon-Link (`ExternalLink` von lucide) → öffnet `infoUrl` in neuem Tab. Nur sichtbar wenn URL gesetzt ist.
- Beim Klick auf „Jetzt buchen" wird die Service-ID an `onSelect` übergeben

### 3. `src/routes/index.tsx`
- State `preselected` von `"gebraucht" | "neu"` auf `ServiceId` (alle 9) erweitern

### 4. `src/components/landing/BookingForm.tsx`
- `service_type`-Enum auf alle 9 IDs erweitern
- `SelectItem`s aus `SERVICES` rendern (statt hardcoded)
- Zod-Schema und Props-Typ entsprechend anpassen

### 5. `src/lib/booking.functions.ts`
- `BookingInput.service_type` auf alle 9 IDs erweitern
- `serviceLabel`-Mapping über `SERVICES`-Liste statt if/else

### 6. Datenbank
**Keine Schema-Änderung nötig.** Spalte `service_type` ist bereits `text` ohne Enum-Constraint — speichert problemlos alle 9 Labels. Bestehende Einträge bleiben unberührt.

### 7. E-Mail-Templates (`booking-confirmation`, `booking-internal-notification`)
Kurz prüfen, ob `service_type` als beliebiger Text dargestellt wird (sollte schon der Fall sein). Falls dort ein hardcoded if/else existiert → entfernen.

## Was du noch bedenken solltest

1. **SEO-Wirkung**: Mit 9 Services lohnt es sich später, pro Service eine eigene Landingpage zu bauen (`/anmeldung-gebrauchtfahrzeug-koeln` etc.). Erst mal aber nur die Kachel-Lösung — Routen können wir später ergänzen.
2. **Ausschluss-Hinweise**: „Ausgenommen ausländische Fahrzeuge" / „Ausgenommen § 13 EG-FGV" — gibt's solche Einschränkungen auch für die neuen 7 Services? Falls ja, sag mir Bescheid, dann packe ich sie ins `note`-Feld.
3. **Voreinstellung beim Direkt-Aufruf**: Wenn jemand mit `?service=h-kennzeichen` in der URL landet, könnten wir später automatisch vorauswählen. Erstmal nicht im Scope.
4. **Default-Auswahl**: Welcher Service soll initial aktiv sein? Vorschlag: **Gebrauchtfahrzeug** (häufigster Fall).
5. **Info-Link**: Wirklich nur ein kleines Icon, oder soll daneben „Details bei der Stadt Köln" stehen? Vorschlag: Icon + kurzer Text für Klarheit/Vertrauen.

## Geänderte/Neue Dateien

- **NEU** `src/lib/services.ts`
- `src/components/landing/Pricing.tsx`
- `src/components/landing/BookingForm.tsx`
- `src/lib/booking.functions.ts`
- `src/routes/index.tsx`
- ggf. `src/lib/email-templates/booking-confirmation.tsx` und `booking-internal-notification.tsx` (nur wenn nötig)
