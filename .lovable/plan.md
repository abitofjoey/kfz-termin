## Ziel

Tracking (Hotjar, Google Analytics 4, Google Ads) DSGVO-konform integrieren: nichts lädt vor Einwilligung. Eigenes schlankes Cookie-Banner im Seiten-Stil, Datenschutzerklärung aktualisiert.

## 1. Consent-System

Neue Datei `src/lib/consent.tsx`:
- Kategorien: `necessary` (immer an), `analytics` (GA4 + Hotjar), `marketing` (Google Ads).
- React Context + Hook `useConsent()` mit `consent`, `setConsent(partial)`, `acceptAll()`, `rejectAll()`, `open()` (Settings öffnen).
- Persistenz in `localStorage` unter `kfz-consent-v1` inkl. Timestamp und Version.
- Custom Event `consent-changed` für Tracking-Loader.

In `src/routes/__root.tsx` `<ConsentProvider>` um `<Outlet />` legen und `<CookieBanner />` + `<CookieSettingsDialog />` einbinden.

## 2. Cookie-Banner

Neue Komponenten:
- `src/components/consent/CookieBanner.tsx`: Erscheint unten rechts/Mitte, wenn noch keine Entscheidung. Buttons: „Alle akzeptieren", „Nur notwendige", „Einstellungen". Stil mit bestehenden Tokens (`bg-background`, `border-border`, `text-foreground`, `bg-primary`). Link zu `/datenschutz`.
- `src/components/consent/CookieSettingsDialog.tsx`: Modal mit Switches je Kategorie + Beschreibung (Anbieter, Zweck, Speicherdauer). „Auswahl speichern" + „Alle akzeptieren".
- Footer-Link „Cookie-Einstellungen" (öffnet Dialog erneut) in `src/components/landing/Footer.tsx`.

## 3. Tracking-Loader

Neue Datei `src/lib/tracking.tsx` als Komponente `<TrackingScripts />` in `__root.tsx` eingebunden. Liest `useConsent()` und lädt/entlädt:

- **Google Consent Mode v2**: Initial im `<head>` (immer) wird ein Default-Consent gesetzt mit allem `denied` (Script ohne Network-Call). Bei Zustimmung `gtag('consent','update', …)`.
- **Google Analytics 4** (`G-NQXH96FZW3`): Script `https://www.googletagmanager.com/gtag/js?id=G-NQXH96FZW3` wird erst injiziert, wenn `analytics === true`. `anonymize_ip: true`.
- **Hotjar** (`hjid: 6719467`): Loader-Snippet wird erst ausgeführt, wenn `analytics === true`.
- **Google Ads**: Vorbereitet, aber nur aktiv wenn Ads-ID gesetzt ist (siehe offene Frage). Solange leer: kein Script, kein Banner-Text dazu.

Bei Widerruf: entsprechende Skripte werden nicht erneut ausgeführt; die zugehörigen Cookies (`_ga*`, `_hj*`, `_gcl*`) werden aktiv via `document.cookie` (mit Domain `.kfz-termin.online` und `path=/`) gelöscht und ein Hinweis-Toast zeigt, dass ein Reload empfohlen ist.

## 4. Datenschutz-Update `src/routes/datenschutz.tsx`

Neue/aktualisierte Abschnitte:
- **§ 9 Cookies & Einwilligung**: Erklärung Consent-Banner, Kategorien, Rechtsgrundlage § 25 Abs. 1 TDDDG + Art. 6 Abs. 1 lit. a DSGVO, Widerruf jederzeit über „Cookie-Einstellungen" im Footer.
- **Neuer § 10 Google Analytics 4**: Anbieter Google Ireland Ltd., Mess-ID, Zwecke (Reichweitenmessung), IP-Anonymisierung, Speicherdauer, Datenübermittlung USA + Standardvertragsklauseln, Opt-out.
- **Neuer § 11 Hotjar**: Anbieter Hotjar Ltd. (Malta), Site-ID 6719467, Zweck (Heatmaps, Session-Recordings), Speicherdauer, keine Übertragung in Drittländer ohne SCC, Opt-out-Link.
- **Neuer § 12 Google Ads / Conversion-Tracking**: nur wenn AdsID kommt – Platzhalter-Abschnitt vorbereiten, Anbieter, Conversion-Cookies (`_gcl_*`), Remarketing-Hinweis.
- Folgenummerierung anpassen, Stand auf Mai 2026 lassen / aktualisieren.

Impressum unverändert.

## 5. SSR-Sicherheit

- Alle `window`/`document`-Zugriffe in `useEffect` oder Event-Handlern – keine Top-Level-Calls (TanStack Start SSR).
- Banner rendert in einem `ClientOnly`-Pattern (Mount-Flag), um Hydration-Mismatch zu vermeiden.

## Offene Frage

- **Google Ads ID + Conversion-Label** fehlen noch. Ohne werden Code & Datenschutz-Abschnitt nur als deaktivierter Platzhalter vorbereitet; sobald du die ID nachreichst, aktiviere ich Ads + Conversion-Tracking (z. B. nach Stripe-Erfolg auf `/buchung-erfolgreich`).
