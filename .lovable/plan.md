## Setup

- **Interne Benachrichtigung an:** `j.eikehoffmann@gmail.com`
- **Absender (From):** `KFZ-Termin Köln <buchung@kfz-termin.online>` falls "Display from root" für deine Domain aktiviert ist – sonst Fallback `buchung@notify.kfz-termin.online`. Versand läuft technisch immer über die verifizierte Subdomain `notify.kfz-termin.online`, das ist im Posteingang aber nicht sichtbar.
- **Reply-To:** `buchung@kfz-termin.online` – damit Antworten direkt bei dir landen (du brauchst dafür ein funktionierendes Postfach für diese Adresse bei deinem Mail-Provider; die Lovable-Mail-Infrastruktur sendet nur, sie empfängt nichts).
- **Stripe-Zahlungsquittung:** ja, `receipt_email` wird in der Checkout-Session gesetzt. Damit Stripe die Mail im Test-Modus tatsächlich verschickt, muss in deinem Stripe-Dashboard unter **Settings → Emails → "Successful payments"** der Schalter **einmal aktiviert** werden (im Live-Modus ist das standardmäßig an).

## Umsetzung

### 1. App-E-Mail-Infrastruktur scaffolden
- `send-transactional-email` Server-Route, Unsubscribe-Handler, Suppression-Liste, Template-Registry.

### 2. Zwei React-Email-Templates (im Stil deiner Landingpage – weiß, klares Schwarz, Akzentfarbe `accent` aus `styles.css`)

**a) `booking-confirmation`** – an den Kunden
- Betreff: „Ihre Buchung bei KFZ-Termin Köln ist bestätigt"
- Inhalt: Anrede mit Name, Service (Gebraucht/Neu), FIN-Endung, Liste der gewünschten Termine, Hinweis auf die 1-Stunden-Bestätigungsmail der Zulassungsstelle, Footer: *„Sie haben noch Fragen? Antworten Sie einfach auf diese E-Mail."*

**b) `booking-internal-notification`** – an dich
- Betreff: `Neue Buchung: {Vorname} {Nachname} – {Service}`
- Inhalt: Buchungs-ID, Service, Anrede + Name, E-Mail, Telefon, FIN-Endung, alle gewählten Termine, Zahlungsstatus (paid via Stripe), Stripe-Session-ID.

### 3. Versand-Trigger nach erfolgreicher Zahlung
- In `confirmCheckoutSession` (`src/lib/stripe.functions.ts`): sobald die Buchung auf `paid = true` gesetzt wurde, beide Mails über `sendTransactionalEmail` verschicken.
- Idempotenzschlüssel `booking-confirm-{id}` / `booking-internal-{id}` → bei Reload der Erfolgsseite keine Doppelversendung.
- Optionales Flag in der `bookings`-Tabelle (`confirmation_sent_at`) als zusätzliche Absicherung. *Mini-Migration nötig.*

### 4. Stripe Checkout-Session anpassen
- `receipt_email: data.email` in `createCheckoutSession` ergänzen → Stripe schickt automatisch die Zahlungsquittung.

### 5. Helper + Page
- `src/lib/email/send.ts` (Client-Helper für die Server-Route).
- `src/routes/unsubscribe.tsx` (Abmelde-Seite, Pflicht wg. Unsubscribe-Footer).

## Was du noch tun musst (außerhalb des Codes)

1. **Stripe Dashboard** (Test-Modus) → Settings → Emails → „Successful payments" aktivieren.
2. **Postfach `buchung@kfz-termin.online`** bei deinem Mail-Provider einrichten (oder eine Weiterleitung auf `j.eikehoffmann@gmail.com`), damit Antworten der Kunden wirklich ankommen.
3. Nach dem Implementieren eine Testbuchung machen → du solltest 3 Mails sehen:
   - Stripe-Quittung (an Kunde)
   - Buchungsbestätigung (an Kunde, mit Reply-to auf dich)
   - Interne Benachrichtigung (an dich)

Soll ich so loslegen?
