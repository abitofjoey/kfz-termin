# Vier Änderungen

Pi-Schnittstellen (pending-bookings, ack, result, heartbeat) bleiben im Verhalten unverändert.

## 1) Mail-Versand absichern
- **Bestätigung nach Zahlung:** `confirmation_sent_at` wird nur gesetzt, wenn Kundenmail **und** interne Mail `success: true` melden. Sonst bleibt das Feld leer (Fehler wird geloggt, Stripe-Webhook antwortet weiter normal).
- **Überwachung (alle 15 Min.), neu a):** bezahlte Buchungen ohne `confirmation_sent_at`, 15 Min. bis 3 Tage alt → Bestätigung erneut versuchen (gleiche Idempotenz-Schlüssel wie bisher, also keine Doppelmails). Klappt es nicht → interne Mail „Bestätigungsmail nicht versendet" an info@, Schlüssel `health-confirm-failed-<id>` (einmal pro Buchung).
- **Neu b):** `search_result = 'found'`, `result_notified_at` leer, 15 Min. bis 3 Tage alt (gemessen an `found_at`) → Kundenmail „Termin gebucht" mit denselben Daten und demselben Schlüssel wie in der Ergebnis-Route (`booking-found-<id>-<appointmentAt>`). Erfolg → `result_notified_at` setzen; sonst interne Mail „Terminmail nicht versendet", Schlüssel `health-found-failed-<id>-<appointmentAt>`.
- Die Daten für die Terminmail werden aus der Ergebnis-Route in eine gemeinsame Hilfsfunktion gezogen, damit beide identisch sind; die Route selbst verhält sich gleich.
- Zwei neue interne Mailvorlagen.
- Tests: Bestätigung setzt Feld nur bei beidem Erfolg; Nachversuch a) und b) inkl. Fehlermail.

## 2) Versions-Warnung
- Die Überwachung liest aus `script-releases/kfz-termin.user.js` die Zeile `// @version`.
- Neue kleine Tabelle `script_version_lag` (Stadt, Version, erste Abweichung, Mail gesendet). Ist die Stadt-Version niedriger (Versionsvergleich nummerisch, z. B. 40.4 < 40.10), wird der Zeitpunkt der ersten Abweichung gemerkt; nach über 12 Stunden interne Mail „Stadt X läuft noch auf Version Y (aktuell Z)", Schlüssel pro Stadt + Stadt-Version + aktuelle Version. Holt die Stadt auf, wird der Eintrag gelöscht.
- Fehlt Datei oder Versionszeile, passiert nichts. Dateiinhalt und Token werden nie geloggt.
- Test für Versionsvergleich und 12-Stunden-Regel.

## 3) Abgebrochene Buchungen löschen
- Die nächtliche Datenbank-Funktion (03:15) löscht zusätzlich Buchungen mit `paid = false`, älter als 30 Tage. Bezahlte Buchungen werden nie angefasst. Es hängen derzeit keine Tabellen per Fremdschlüssel an Buchungen; falls doch, wird mitgelöscht (wird bei der Umsetzung nochmals geprüft).
- Datenschutzerklärung, Abschnitt 17 „Speicherdauer": Satz „Nicht abgeschlossene Buchungen (ohne Zahlung) löschen wir nach 30 Tagen." ergänzt.

## 4) Hero-Texte
- Köln: nur Komma vor „sobald".
- Bonn, Recklinghausen, Neuss: Überschrift, Akzent „automatisch gebucht." und Einleitung wörtlich wie angegeben; Neuss zusätzlich Standort-Überschrift „Dein Wunschtermin beim Straßenverkehrsamt {town} –".
- Seitentitel und Beschreibungen bleiben unverändert. Bestehende Tests für die Standort-Überschrift werden auf den neuen Wortlaut angepasst.

## Abschluss
Tests und Typprüfung laufen lassen; nichts veröffentlichen, bis du es sagst.
