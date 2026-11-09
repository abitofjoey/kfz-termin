# Neue Stadt onboarden

Eine neue Stadt braucht nur Konfiguration und Inhalt – keinen neuen Seiten- oder Mail-Code.
Köln (eine Stelle, Kunde bestätigt selbst) und Bonn (mehrere Standorte, sofort gebucht) sind die beiden Vorlagen.

## 1. Eintrag in `src/lib/cities.ts`

| Feld | Bedeutung |
|---|---|
| `slug` | URL-Teil (`/bonn`) und Schlüssel in der Datenbank (`bookings.city`). Nie mehr ändern. |
| `name` / `adjective` | „Bonn“ / „Bonner“ – für Überschriften, Texte, `[Bonn]`-Präfix interner Mails. |
| `landmarkIcon` | Optionaler SVG-Import aus `src/assets/landmarks/<slug>.svg?raw`. Ohne Feld wird kein Icon angezeigt; Stadtkarten, Hero und Städte-Menüs nutzen denselben Import. |
| `authorityName` | Vollständige Behördenbezeichnung (Seiten, llms.txt). |
| `appointmentLocation` | Ort in Terminmails, falls kein Standort gewählt wird. |
| `locations` | Standorte (`id`, `name`, `address`); bei einer Stelle nur ein Eintrag. |
| `portalUrl` / `infoUrl` | Terminportal der Stadt / allgemeine Infoseite (Fallback für „Unterlagen“-Link). |
| `siteName` | Immer `BRAND_NAME`. |
| `checkoutDescription` | Produkttext im Stripe-Checkout. |
| `calendar` | Kalenderregeln: `minOffsetDays`, `afterCutoffOffsetDays`, `cutoffHour` (24 = kein Cutoff), `windowDays`, `allowWeekends`, `blockedDates`. |
| `searchHours` | Suchzeiten `{from, to}`; `0–24` = „rund um die Uhr“. |
| `priceCents` | Preis in Cent – einzige Preisquelle. |
| `customerConfirmationHours` | Frist, in der der Kunde den Behörden-Link klicken muss; `null` = keine Bestätigung nötig (sofort gebucht). Steuert viele Mail- und Seitentexte. |
| `form` | `finRequired`, `salutationRequired`, `locationChoice` (Mehrstandort-Formular), `financedCheckbox`. |
| `categories` | Abweichende Regeln je Kategorie (`kfz`, `fuehrerschein`), z. B. längeres Kalenderfenster. |
| `mail` | `atAuthority` („bei der Stadt Bonn“), `authority` (Behörde im Fließtext nach „der/die“), `showBookingReference`, `showCancelUrl`. |
| `pages` | `authorityShort`, `successIntro`, `successNotice` (null = Standardtext mit Bestätigungsfrist). |
| `launched` | Sichtbar in Header, Footer, Startseite, Sitemap, llms.txt; sonst noindex. |
| `bookable` | Buchungen möglich und Pi-Überwachung (Health-Check, Tagesstatus) aktiv. |

## 2. Inhalte `src/content/cities/<slug>.ts`
Wahrzeichen-Icon: SVG 64×64, Linienstil wie koeln.svg/bonn.svg (stroke 2, runde Enden, nur Silhouette, keine Wappen/Logos).

Meta-Texte, Hero, FAQ, Service-JSON-LD; Einzelstandort: `single` (Ablauf, Formularhinweise) und `info`; Mehrstandort: `multi`. In `src/content/cities/index.ts` eintragen.

## 3. Anliegen in `src/lib/services.ts`
Liste in `SERVICES_BY_CITY` mit Kategorie, Standorten, `maxVehicles`, optional `infoUrl`; Script-Nummern in `SCRIPT_SERVICE_MAP_BY_CITY` (müssen zum Pi-Script passen).

## 4. Rechtstexte
`src/content/legal/cities.ts` von Hand ergänzen (Städte-/Behördenliste) und `LEGAL_STAND` aktualisieren. Wird bewusst nicht automatisch aus `launchedCities()` erzeugt.

## 5. Freischalten
`bookable: false, launched: false` → Pi-Script einrichten und Testbuchung → `bookable: true` (weiter versteckt, Test mit echter Buchung) → `launched: true`.

## 6. Search Console
Nach dem Start Sitemap neu einreichen und `/<slug>` zur Indexierung anfragen.
