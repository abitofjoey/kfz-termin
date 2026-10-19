# Vier neue Anliegen („Besondere Zulassungsangelegenheiten“)

## 1. Liste der Anliegen (`src/lib/services.ts`)
- Neues optionales Feld `maxVehicles` (Standard 3) plus Hilfsfunktion `getMaxVehicles(id)`.
- Vier neue Einträge am Ende, nicht `popular`, jeweils `maxVehicles: 2`, Texte und Links wörtlich aus der Vorgabe:
  - Verlust der Zulassungsbescheinigung Teil II (Verlust Fahrzeugbrief)
  - Zulassung importierter Fahrzeuge (Importfahrzeug)
  - Abholung einer neu beantragten Zulassungsbescheinigung Teil II (Abholung Fahrzeugbrief)
  - Zulassung eines technisch veränderten Neufahrzeugs (§ 13 EG-FGV) (Neufahrzeug § 13 EG-FGV)
- Neue Hinweise bei `gebraucht` und `neu` wie vorgegeben.
- Fehlende Info-Links ergänzen: ersatz-zb1, abmeldung, anschriftenaenderung, feinstaubplakette, familienname, neusiegelung.
- Damit zeigt die Kachel-Auswahl automatisch „Weitere Anliegen anzeigen (10)“: 9 sichtbar + 6 bisherige weitere + 4 neue = 10 weitere. Hinweis: In der Vorgabe steht „(11)“. Rechnerisch ergeben sich 10, ich prüfe beim Klicktest auf 10.

## 2. Höchstzahl Fahrzeuge
- `BookingForm.tsx`: Der Button „Weiteres Fahrzeug hinzufügen“ erscheint nur, solange die Anzahl unter `maxVehicles` des gewählten Anliegens liegt. Wechselt man bei 3 Fahrzeugen auf ein Anliegen mit höchstens 2: Anzahl auf 2, FIN 3 leeren, kurzer Hinweis unter den FIN-Feldern: „Für dieses Anliegen sind bei der Stadt höchstens 2 Fahrzeuge pro Termin möglich.“
- `booking.functions.ts`: Ist bei einem Anliegen mit höchstens 2 Fahrzeugen eine FIN 3 gesetzt, wird die Buchung mit derselben verständlichen Meldung abgelehnt (gleiches `{ ok: false, error }`-Muster wie beim gesperrten Tag).

## 3. Interne Schnittstelle (`pending-bookings.ts`)
- SERVICE_MAP um 16–19 ergänzen, Labels Zeichen für Zeichen aus `services.ts`. Sonst keine Änderung an der Datei.

## 4. Texte
- `Faq.tsx`: „alle 15“ → „alle 19“, neue Anliegen kurz ergänzt (Verlust/Abholung Fahrzeugbrief, Importfahrzeuge, technisch veränderte Neufahrzeuge). Die FAQ zu „bis zu 3 Fahrzeuge“ erhält den Zusatz, dass bei einigen Anliegen höchstens 2 möglich sind. Bitte bestätigen, sonst lasse ich diese Antwort unverändert.
- `public/llms.txt`: Punkte 16–19 ergänzen, Hinweise bei Gebraucht- und Neufahrzeug angepasst, Zeile „bis zu 3 Fahrzeuge“ um denselben Zusatz ergänzt.

## 5. Nicht geändert
Preis, Kalender, Stripe, Mail-Vorlagen, Datenbankschema, health/check.

## 6. Prüfung
Typprüfung und Build, Klicktest: Button „Weitere Anliegen anzeigen“ mit Anzahl, neues Anliegen im Formular wählen, höchstens 2 Fahrzeuge, Reduzierung von 3 auf 2 mit Hinweis. Nicht veröffentlichen, weil das Pi-Script vorher aktualisiert werden muss.
