## Ziel
Die drei Security-Warnungen zu `SECURITY DEFINER`-Funktionen beheben, ohne die App-Funktionalität zu verändern.

## Hintergrund
Die vier `pgmq`-Wrapper-Funktionen in der Datenbank (`read_email_batch`, `enqueue_email`, `delete_email`, `move_to_dlq`) sind als `SECURITY DEFINER` definiert. Dadurch führen sie sich mit den Rechten ihres Erstellers aus und umgehen RLS. Der Security-Scanner meldet, dass diese Funktionen aktuell von `PUBLIC`, `anon` und `authenticated` ausführbar sind – obwohl sie nur von serverseitigen Prozessen über den Service-Role-Key genutzt werden.

## Schritte

### 1. Datenbank-Migration
Eine Migration führt für alle vier Funktionen folgende Änderungen durch:
- **Zugriffsrechte einschränken:** `EXECUTE` wird `PUBLIC`, `anon` und `authenticated` entzogen.
- **Service-Role explizit erlauben:** `EXECUTE` wird explizit an `service_role` vergeben.
- **Suchpfad fixieren:** Der `search_path` wird auf `public, pgmq` gesetzt, um den "Function Search Path Mutable"-Befund zu beheben.

### 2. Security-Findings als behoben markieren
Nach erfolgreicher Migration werden folgende Findings auf `mark_as_fixed` gesetzt:
- `SUPA_anon_security_definer_function_executable`
- `SUPA_authenticated_security_definer_function_executable`
- `SUPA_function_search_path_mutable`

### 3. Security-Memory aktualisieren
Das Security-Memory wird ergänzt um die Dokumentation, dass die `pgmq`-Wrapper-Funktionen absichtlich `SECURITY DEFINER` sind, aber ausschließlich über `service_role` erreichbar – alle Aufrufe erfolgen serverseitig.

## Warum die Funktionalität erhalten bleibt
Die App ruft diese Funktionen nirgendwo clientseitig auf. Sie werden ausschließlich von TanStack-Serverfunktionen über `supabaseAdmin` (Service-Role-Key) verwendet. Da `service_role` nach der Migration weiterhin `EXECUTE`-Rechte besitzt, ändert sich für die App-Logik absolut nichts.