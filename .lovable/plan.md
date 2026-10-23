# Stripe-Hinweis: Node.js-Sicherheitslücke

## Was ist das Problem?
Stripe sieht an den Anfragen deiner Seite eine Versionsangabe, die nach einem veralteten Node.js aussieht. In Node.js gibt es eine schwere Lücke. Darüber könnte jemand fremde Befehle auf einem Server ausführen und so an den Stripe-Schlüssel kommen.

## Betrifft das deine Seite?
Sehr wahrscheinlich nicht direkt. Deine Seite läuft nicht auf einem eigenen Node.js-Server, sondern auf Cloudflare. Dort wird die Laufzeit vom Anbieter aktuell gehalten. Die Stripe-Bibliothek meldet in dieser Umgebung trotzdem eine „Node"-Kennung. Deshalb kann Stripe die Warnung automatisch verschickt haben.

Selbst prüfen solltest du:
- ob dein Pi-Script oder ein anderes Programm auf deinem PC den Stripe-Schlüssel nutzt und auf einem alten Node.js läuft. Dann Node.js dort aktualisieren.

## Was empfohlen wird (Vorschlag)
1. **Du im Stripe-Dashboard:** In den Request-Logs und Zahlungen nach ungewöhnlichen Aktivitäten suchen, also fremde Auszahlungen, Erstattungen oder geänderte Einstellungen.
2. **Du im Stripe-Dashboard:** Den geheimen Schlüssel neu erzeugen („Roll key"), den alten sofort oder nach kurzer Frist ablaufen lassen.
3. **Ich:** Den neuen Schlüssel als geschütztes Secret `STRIPE_SECRET_KEY` hinterlegen. Dazu öffne ich ein Eingabefeld, du fügst den Schlüssel dort ein, nicht im Chat.
4. **Ich:** Danach prüfen, dass Bezahlen und die Bestätigung nach der Zahlung weiter funktionieren. Das Webhook-Signing-Secret bleibt unverändert, solange du den Webhook in Stripe nicht neu anlegst.
5. Kein Code muss geändert werden. Ein neues Veröffentlichen ist nicht nötig, weil Secrets sofort wirken.

## Technische Details
- Betroffen sind nur `src/lib/stripe.functions.ts` und `src/routes/api/public/stripe/webhook.ts`. Beide lesen `process.env.STRIPE_SECRET_KEY`.
- Die Laufzeit ist Cloudflare workerd mit nodejs_compat und kein eigenständiges Node.js.
