# Stripe-Hinweis: Erklärung (keine Änderungen)

## Was ist das Problem?
Stripe hat an den Anfragen deines Kontos eine Kennung gesehen, die auf ein veraltetes Node.js hindeutet. In Node.js gibt es derzeit eine schwere Sicherheitslücke. Über einen ungepatchten Server könnte jemand an den geheimen Stripe-Schlüssel kommen. Die Warnung betrifft kein Problem bei Stripe selbst.

## Betrifft das deine Seite?
Sehr wahrscheinlich nicht. Deine Seite läuft auf Cloudflare und nicht auf einem eigenen Node.js-Server. Diese Umgebung hält der Anbieter selbst aktuell. Die Stripe-Bibliothek meldet dort trotzdem eine „Node"-Kennung. Deshalb hat Stripe die Warnung vermutlich automatisch verschickt.

## Was du selbst tun kannst
1. Prüfe, ob auf deinem Pi oder PC ein Programm den geheimen Stripe-Schlüssel nutzt. Läuft es mit einem alten Node.js, aktualisiere Node.js dort.
2. Sieh im Stripe-Dashboard nach ungewöhnlichen Aktivitäten. Schau dazu in die Request-Logs, die Zahlungen, die Auszahlungen und die Einstellungen.
3. Optional kannst du zur Sicherheit einen neuen Schlüssel erzeugen („Roll key"). Sag mir dann Bescheid, und ich hinterlege ihn sicher.

## Umsetzung
Keine. Code, Daten und Einstellungen bleiben unverändert.
