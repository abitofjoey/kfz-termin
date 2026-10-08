# Online-Widerrufsfunktion (§ 356a BGB) – Teil 1

Buchungsablauf, Stripe-Checkout und bestehende Mails bleiben unverändert. Ausnahmen sind nur die genannten Stellen: ein neuer Satz und die Buchungsnummer in der Buchungsbestätigung sowie der Filter in der internen API.

## 1. Footer-Button
- In `Footer.tsx` (der Footer erscheint auf jeder Seite) kommt ein umrandeter Button „Vertrag widerrufen“ hinzu, der direkt auf `/widerruf` führt.
- Er bekommt weißen Rand und weiße Schrift auf dem dunklen Footer und unterscheidet sich klar vom gefüllten Haupt-CTA.

## 2. Seite `/widerruf`
- Neue Route `src/routes/widerruf.tsx` mit Header und Footer wie `/agb`, `noindex` und eigenen Meta-Daten.
- Überschrift, Einleitung, die 4 Felder, Button „Widerruf bestätigen“ und Hinweistext stehen wortgleich wie vorgegeben.
- Feld 4 übernimmt automatisch den Wert aus Feld 2, bis der Nutzer es selbst ändert.
- Prüfung im Browser und auf dem Server: Name und Bestätigungs-E-Mail sind Pflicht. Außerdem muss Buchungs-E-Mail oder Buchungsnummer angegeben sein, sonst erscheint die vorgegebene Meldung.
- Spamschutz über ein unsichtbares Honeypot-Feld: Ist es ausgefüllt, kommt eine scheinbare Erfolgsmeldung, aber nichts wird gespeichert oder versendet.
- Der Link „Widerrufsbelehrung“ zeigt schon jetzt auf `/widerrufsbelehrung`. Es ist ein normaler Link, weil die Seite erst im nächsten Prompt angelegt wird. Bis dahin führt er auf die 404-Seite.
- Nach dem Absenden zeigt dieselbe Seite die Erfolgsansicht: Eingangszeit (Europe/Berlin), eine Zusammenfassung der Angaben und den vorgegebenen Text.

## 3. Backend
Server-Funktion `submitWithdrawal`. Statt einer Edge Function wird die projektübliche Server-Funktion genutzt. Sie schreibt mit Service-Role-Rechten.
- Rate-Limit: höchstens 5 Absendungen pro IP und Stunde. Die IP wird nur als Hash mit Stundenfenster in einer kurzlebigen Zählertabelle gespeichert, Einträge älter als 1 Stunde werden gelöscht. Wird das Limit überschritten, erscheint eine freundliche Meldung.
- Zuordnung: zuerst über die Buchungsnummer (erste 8 Zeichen der ID, ohne Groß-/Kleinschreibung), sonst über die jüngste Buchung zur E-Mail-Adresse. Der Widerruf wird immer gespeichert und bestätigt. Der Nutzer erfährt nie, ob eine Buchung gefunden wurde.
- Hat die zugeordnete Buchung noch keinen Termin (`search_result` ist leer), wird `widerruf_eingegangen_at` gesetzt. Status und Zahlung bleiben unverändert.
- Interne API `GET /api/internal/pending-bookings`: Der Filter wird um „`widerruf_eingegangen_at` ist leer“ ergänzt, sonst ändert sich nichts.

## 4. Mails (über den bestehenden Versand)
- Neues Template `withdrawal-confirmation`: die Eingangsbestätigung an die Bestätigungs-E-Mail mit Betreff und Inhalt wie vorgegeben und der Signatur der anderen Kundenmails.
- Neues Template `withdrawal-internal`: geht an info@kfz-termin.online. Enthält alle Angaben, die Eingangszeit und die zugeordnete Buchung (ID, Status, Stripe-Session) oder „keine Buchung zugeordnet“, dazu den vorgegebenen Hinweis.
- Buchungsbestätigung: Unter „Deine Angaben“ kommt die Zeile „Buchungsnummer“ hinzu (erste 8 Zeichen der ID, großgeschrieben). Außerdem wird der Satz „Du kannst diesen Vertrag unter kfz-termin.online/widerruf widerrufen.“ ergänzt. Dafür wird die Buchungs-ID beim Versand zusätzlich mitgegeben.

## 5. Tests
Die 6 genannten Fälle werden über die Seite und die Datenbank geprüft. Für Fall 6 wird eine Testbuchung angelegt, danach die interne API mit Schlüssel abgefragt und die Testdaten werden wieder entfernt.

## Technische Details
Migration:
- Neue Tabelle `public.widerrufe` (id, eingegangen_at default now(), name, buchungs_email, buchungsnummer, bestaetigungs_email, booking_id → bookings(id) on delete set null, status default 'eingegangen'). Nur `service_role` hat Rechte, RLS ist an, es gibt keine öffentlichen Policies.
- Neue Tabelle `public.widerruf_rate_limits` (ip_hash, window_start, count). Nur `service_role` hat Rechte, RLS ist an.
- Neue Spalte `bookings.widerruf_eingegangen_at timestamptz` (nullable).

Dateien:
- Neu: `src/routes/widerruf.tsx`, `src/lib/withdrawal.functions.ts`, `src/lib/email-templates/withdrawal-confirmation.tsx`, `src/lib/email-templates/withdrawal-internal.tsx`
- Geändert: `Footer.tsx`, `registry.ts`, `booking-confirmation.tsx`, `booking-finalize.server.ts` (gibt `bookingId` mit), `api/internal/pending-bookings.ts` (Filter), `public/sitemap.xml` bleibt unverändert, weil die Seite `noindex` ist.

Nichts wird veröffentlicht.

## Ergänzungen (Freigabe 08.10.2026)
1. **Zuordnung über E-Mail:** Es zählen nur bezahlte Buchungen.
   - Genau eine offene Buchung (noch kein Ergebnis): Sie wird zugeordnet und `widerruf_eingegangen_at` wird gesetzt.
   - Mehrere offene Buchungen: Keine wird markiert und `booking_id` bleibt leer. Die interne Mail listet alle Kandidaten mit ID, Buchungsnummer, Buchungsdatum und Dienstleistung.
   - Keine offene, aber mindestens eine erledigte Buchung: Die jüngste wird zugeordnet, aber nicht markiert.
   - Die Zuordnung über die Buchungsnummer bleibt wie geplant.
2. **Ergebnis-Route („found“):** Ist `widerruf_eingegangen_at` gesetzt, wird das Ergebnis gespeichert, aber der Kunde bekommt keine Mail. Stattdessen geht das neue Template `appointment-after-withdrawal-internal` an info@kfz-termin.online.
   - Betreff: „Achtung: Termin trotz Widerruf gebucht – [Name]“
   - Inhalt: Buchungs-ID, der gebuchte Termin und der Hinweis „Termin bei der Stadt stornieren und Kunden informieren“.
   - Ohne Widerruf läuft alles unverändert.
3. **Reihenfolge:** Zuerst wird der Widerruf gespeichert, dann werden die Mails versendet. Schlägt der Versand fehl, erscheint trotzdem die Erfolgsansicht und der Fehler wird geloggt. Die neue Spalte `widerrufe.bestaetigung_gesendet_at` wird nur gesetzt, wenn die Eingangsbestätigung erfolgreich versendet wurde.
4. **Tests:**
   - Alle Testmails gehen ausschließlich an info@kfz-termin.online. In Fall 3 ist die Buchungs-E-Mail unbekannt, die Bestätigungs-E-Mail ist info@kfz-termin.online.
   - Vor Fall 6 halte ich an und warte auf dein OK, weil zuerst das Live-Script abgeschaltet werden muss.
