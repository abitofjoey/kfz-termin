## Ziel

1. Datenschutzerklärung um den fehlenden Punkt **automatisierte Buchung bei der Kölner Zulassungsstelle** ergänzen (Datenübermittlung an Dritte, Art. 6 Abs. 1 lit. b DSGVO).
2. **Speicherdauer konkretisieren** und technisch durchsetzen: 90 Tage nach dem spätesten Wunschtermin werden sensible Buchungsdetails automatisch anonymisiert; abrechnungsrelevante Daten bleiben 10 Jahre.

---

## Teil 1 — Datenschutzerklärung ergänzen

Datei: `src/routes/datenschutz.tsx`

**Neuer Abschnitt 6** (zwischen aktuell 5 und 6, alle folgenden Punkte rutschen eins nach hinten):

> **6. Automatisierte Terminbuchung bei der Kölner Zulassungsstelle**
> Kern unseres Dienstes ist die automatisierte Suche und Buchung eines freien Termins im Online-Portal der Stadt Köln (Zulassungsstelle) in deinem Namen. Hierzu übermitteln wir die für die Buchung erforderlichen Daten – insbesondere Vor- und Nachname, E-Mail-Adresse, Telefonnummer, Anliegen sowie die letzten vier Stellen der Fahrzeug-Identifikationsnummer (FIN) – an das Buchungssystem der Stadt Köln. Empfänger ist die Stadt Köln als eigenständig Verantwortliche; die weitere Verarbeitung richtet sich nach deren Datenschutzhinweisen. Rechtsgrundlage für die Übermittlung ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung des mit dir geschlossenen Vertrags über die Terminvermittlung). Ohne diese Übermittlung kann der Dienst nicht erbracht werden.

**Punkt „Speicherdauer" konkretisieren:**

> Wir löschen bzw. anonymisieren personenbezogene Daten gestaffelt nach Erforderlichkeit:
> - **Fahrzeugdaten (FIN), Telefonnummer, gewählte Wunschtermine und interne Notizen:** automatische Anonymisierung **90 Tage nach dem spätesten von dir gewählten Wunschtermin**.
> - **Rechnungs- und zahlungsrelevante Daten** (Name, E-Mail, Buchungs-ID, Zahlungsreferenz, Betrag): **10 Jahre** gemäß § 147 AO / § 257 HGB, danach vollständige Löschung des Datensatzes.
> - **E-Mail-Sperrliste (Unsubscribe):** so lange erforderlich, um Werbewidersprüche zu dokumentieren.

Punkt „Buchung eines Termins" am Ende um einen Verweis ergänzen: *„Zur konkreten Speicherdauer siehe Abschnitt zur Speicherdauer."*

---

## Teil 2 — Automatische Anonymisierung in der Datenbank

### 2a. Schema-Anpassung (Migration)

Tabelle `bookings`:
- Neue Spalte `anonymized_at timestamptz NULL` — Marker, dass der Datensatz bereits anonymisiert wurde (idempotent, vermeidet Mehrfach-Updates).

**Kein** neuer Status-Workflow, **kein** `completed_at` — als Termin-Referenz nutzen wir das maximale Datum aus `selected_dates`. Das ist die obere Schranke des möglichen Termins (Wunschtermine liegen in der Zukunft, die Buchung erfolgt an genau einem dieser Tage). 90 Tage nach dem spätesten Wunschtermin ist garantiert nach Terminwahrnehmung.

### 2b. Anonymisierungs-Funktion (SQL)

`public.anonymize_old_bookings()` (SECURITY DEFINER, `search_path = public`) macht für alle Zeilen wo
`anonymized_at IS NULL` UND `(SELECT max(d::date) FROM unnest(selected_dates) d) < current_date - interval '90 days'`:

- `phone = ''`
- `fin_1 = 'XXXX'`, `fin_2 = NULL`, `fin_3 = NULL`
- `selected_dates = '{}'`
- `notes = NULL`
- `anonymized_at = now()`

**Fallback** für defekte/leere `selected_dates`: zusätzlich anonymisieren wenn `created_at < now() - interval '180 days'`.

**Bewusst NICHT geleert:** `first_name`, `last_name`, `email`, `service_type`, `stripe_session_id`, `paid`, `created_at`, `id` — bleiben für 10 Jahre Aufbewahrung von Zahlungsbelegen.

`public.delete_ancient_bookings()` löscht Zeilen mit `created_at < now() - interval '10 years'` komplett.

### 2c. Täglicher Cron-Job

`pg_cron` ist bereits aktiv. Täglich um 03:15 Uhr:

```sql
select cron.schedule(
  'anonymize-old-bookings',
  '15 3 * * *',
  $$ select public.anonymize_old_bookings(); select public.delete_ancient_bookings(); $$
);
```

Reiner SQL-Job, kein HTTP-Endpoint. Fehler/Erfolge sind in `cron.job_run_details` einsehbar (kein eigenes Log nötig).

### 2d. Code-Auswirkungen

Keine. Neue Spalte `anonymized_at` ist nullable; bestehende Schreib- und Lese-Pfade in `booking.functions.ts`, `stripe.functions.ts` und den Mail-Templates bleiben unverändert. TypeScript-Typen werden nach Migration automatisch regeneriert.

---

## Reihenfolge der Umsetzung

1. Migration: neue Spalte + beide Funktionen + Cron-Job (eine Migration).
2. Datenschutzerklärung aktualisieren.
3. Manueller erster Testlauf von `anonymize_old_bookings()` direkt nach der Migration, um Verhalten an den aktuellen Daten zu prüfen.