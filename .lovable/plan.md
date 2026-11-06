# Firmenname „KFZ-Termin" überall, Stadtangaben nur wo stadtspezifisch

Regel: Der Firmenname ist überall „KFZ-Termin". Die Anschrift (Longericher Str. 31, 50739 Köln) bleibt. „Köln" oder „Bonn" steht nur noch dort, wo es wirklich um die Stadt bzw. ihre Behörde geht. Nichts wird veröffentlicht. Vor dem Veröffentlichen bekommst du wieder eine Vorher/Nachher-Liste.

## 1. Rechtstexte (AGB, Widerrufsbelehrung, Datenschutz, Impressum)
- In der Anschrift: „KFZ-Termin Köln" wird zu „KFZ-Termin". Straße und „50739 Köln" bleiben (AGB, Widerrufsbelehrung inkl. Muster-Formular, Datenschutz).
- AGB-Kopfzeile: „KFZ-Termin Köln · kfz-termin.online · Stand …" wird zu „KFZ-Termin · kfz-termin.online · Stand …".
- AGB § 1: „Dienstes ‚KFZ-Termin Köln'" wird zu „Dienstes ‚KFZ-Termin'".
- Datenschutz-Kopfzeile analog, Stand auf November 2026.
- Datenschutz Abschnitte zur Weitergabe an die Behörde: „derzeit die Stadt Köln" wird zu „derzeit die Stadt Köln und die Stadt Bonn" (gleicher Wortlaut wie in den AGB).
- Seitentitel und Beschreibungen von AGB, Widerrufsbelehrung, Datenschutz und Impressum: „… – KFZ-Termin Köln" wird zu „… – KFZ-Termin".

## 2. E-Mails (Köln und Bonn)
- Absendername, Betreff („Deine Buchung bei … ist bestätigt"), Kopfzeile und Gruß („Dein Team von …") lauten künftig „KFZ-Termin" statt „KFZ-Termin Köln" bzw. „KFZ-Termin Bonn".
- Widerrufsbelehrung in der Bestätigungsmail: Anschrift wie in Punkt 1.
- Stadtspezifische Inhalte (Behörde, Adresse des Termins, Fristen, Hinweise) bleiben pro Stadt.
- Hinweis: Damit ändert sich auch für Köln der Absender, der Betreff und der Gruß in allen Kundenmails. Alle anderen Kölner Mailtexte bleiben Wort für Wort gleich.

## 3. Zahlungsseite (Stripe)
- Köln: „KFZ-Termin Köln – Terminservice bei der Zulassungsstelle" wird zu „KFZ-Termin – Terminservice bei der Zulassungsstelle Köln".
- Bonn: „KFZ-Termin – Terminservice bei der Stadt Bonn".

## 4. Website allgemein
- App-Name im Browser bzw. auf dem Homescreen und die Firmenangabe für Suchmaschinen (Organization): „KFZ-Termin".
- `llms.txt`: Firmenname „KFZ-Termin", „Dienst von Eike Hoffmann (Köln)" bleibt, Städte Köln und Bonn werden genannt.

## 5. Köln-Seite /koeln
- Gründer-Abschnitt: „Wer steckt hinter KFZ-Termin Köln?" wird zu „Wer steckt hinter KFZ-Termin?", ebenso das Bild-Alt und der Schlusssatz.
- Kundenstimmen: „… die KFZ-Termin Köln bereits genutzt haben" wird zu „… die KFZ-Termin bereits genutzt haben".
- Angaben für Suchmaschinen: Dienstname „KFZ-Termin – Zulassungsstelle Köln", Logo-Alt „KFZ-Termin – Logo".
- Die Überschrift und die Kölner Behördentexte bleiben unverändert.

## Technische Details
- Neue zentrale Konstante `BRAND_NAME = "KFZ-Termin"` (z. B. in `src/lib/cities.ts`). `siteName` für beide Städte wird auf diese Konstante gesetzt. `SITE_NAME` in `send-email.ts` und `customer-email-parts.tsx` nutzt sie ebenfalls.
- `checkoutDescription` wird angepasst, die Erwartungen in `bonn.test.ts` werden aktualisiert.
- Dateien: agb, widerrufsbelehrung, datenschutz, impressum, __root (JSON-LD), booking-confirmation, send-email, customer-email-parts, checkout-amount, content/cities/koeln.ts, Founder, Testimonials, site.webmanifest, llms.txt.
- Abschluss: Typprüfung und Tests laufen, danach folgt die Vorher/Nachher-Liste. Es wird nicht veröffentlicht.
