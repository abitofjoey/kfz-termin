## Ziel

Da du Kleinunternehmer nach § 19 UStG bist, soll an allen Stellen, an denen ein Preis sichtbar ist, klargestellt werden, dass **keine Umsatzsteuer** anfällt. So vermeidest du den falschen Eindruck „inkl. MwSt." und bist konform mit der Pflicht zur Kennzeichnung.

In den **AGB (§ 4)** und im **Impressum** steht der Hinweis bereits — dort ist nichts zu tun. Ergänzt wird er an den UI- und Mail-Stellen.

## Änderungen

### 1. `src/components/landing/Pricing.tsx`
Unter dem Preis (`19€ einmalig`) eine kleine Zeile ergänzen:
> „Gesamtpreis, keine USt. gem. § 19 UStG"

Als unauffälliger `text-xs text-muted-foreground` direkt unter „einmalig".

### 2. `src/components/landing/Hero.tsx`
Den Satz „Für nur 19€…" ergänzen um „(umsatzsteuerfrei)" oder einen kleinen Zusatz darunter — dezent, damit der Flow nicht bricht.

### 3. `src/components/landing/BookingForm.tsx`
- Direkt unter dem Buchungs-Button („Jetzt für 19€ buchen") eine kleine Zeile:
  > „Gesamtpreis, keine Umsatzsteuer gem. § 19 UStG (Kleinunternehmer)."

### 4. `src/lib/email-templates/booking-confirmation.tsx`
In der Bestätigungsmail einen Abschnitt „Zahlung" ergänzen mit:
- Betrag: 19,00 €
- Hinweis: „Kein Ausweis von Umsatzsteuer gem. § 19 UStG (Kleinunternehmerregelung)."
- Hinweis auf die separate Stripe-Zahlungsquittung.

### 5. `src/routes/buchung-erfolgreich.tsx`
Im Erfolgs-Screen einen kleinen Hinweis ergänzen: „Gezahlt: 19,00 € (umsatzsteuerfrei gem. § 19 UStG). Die Zahlungsquittung erhältst du separat per E-Mail von Stripe."

### 6. AGB (`src/routes/agb.tsx`)
Bereits in § 4 vorhanden — **keine Änderung nötig**. Optional könnte ich in § 6 (Geld-zurück-Garantie) noch klarstellen, dass die Erstattung den vollen Bruttobetrag umfasst (da ohnehin keine USt anfällt) — sage Bescheid, wenn das gewünscht ist.

## Nicht Teil dieses Plans

- **Eigene Rechnungs-PDF** mit fortlaufender Rechnungsnummer (das wäre Option b aus der vorherigen Antwort).
- **Stripe-Dashboard-Einstellungen** (Tax deaktivieren, Receipt-Footer) — das musst du selbst im Stripe-Dashboard erledigen, kann ich nicht aus dem Code heraus konfigurieren.

## Geänderte Dateien

- `src/components/landing/Pricing.tsx`
- `src/components/landing/Hero.tsx`
- `src/components/landing/BookingForm.tsx`
- `src/lib/email-templates/booking-confirmation.tsx`
- `src/routes/buchung-erfolgreich.tsx`
