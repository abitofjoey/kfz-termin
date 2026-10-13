# Text-Korrekturen und kleine Fehlerbehebungen

Nur Texte und kleine Fixes; Abläufe, Datenbank und Mail-Logik bleiben sonst unverändert. Kein Deploy.

1. **Anrede in Kundenmails** (booking-confirmation, appointment-found, search-email-limit, search-rebook-offer, search-rebook-confirmed, search-not-found): Begrüßung `Hallo {Vorname},`, ohne Vorname `Hallo,`. In booking-confirmation bleibt die Datenzeile „Name" mit vollem Namen erhalten. Interne Mails unverändert.
2. **booking-confirmation.tsx**: Wunschtermine mit `formatDayLong` („Dienstag, 06.10.2026"), Überschrift „Deine Wunschtermine"; neuer letzter Absatz in „So läuft es ab" (Text wie vorgegeben). Vorschaudaten auf ISO-Daten umstellen, damit die Vorschau stimmt.
3. **Faq.tsx**: die drei Antworten wortgleich ersetzen (das FAQ-JSON-LD übernimmt sie automatisch).
4. **Steps.tsx**: Text von Schritt 4 ersetzen.
5. **BookingForm.tsx**: Hinweis am E-Mail-Feld ersetzen.
6. **buchung-erfolgreich.tsx**: eigener Zustand „unpaid" mit Überschrift „Zahlung wird noch verarbeitet" und neuem Text (mit mailto-Link); „error" bleibt wie bisher.
7. **booking.functions.ts**: allgemeine Fehlermeldung für gesperrte Tage; **calendar-rules.ts**: `2026-10-12` entfernen, `BLOCKED_DATES` bleibt als leere Liste (Kalender-Sperrlogik im Formular bleibt).
8. **Founder.tsx**: Überschrift „Wer steckt hinter KFZ-Termin Köln?".
9. **stripe.functions.ts**: `locale: "de"` bei `checkout.sessions.create`.
10. **finalize-booking.ts** löschen (Route-Baum regeneriert sich).
11. **Stripe-Webhook / finalizePaidBooking**: Datenbankfehler beim Update `paid=true` wirft einen Fehler, der Webhook antwortet dann 500 (Stripe wiederholt). Mailfehler bleiben abgefangen. Sonst nichts am Webhook.

Danach Typprüfung (`tsgo`) und Diff zeigen.
