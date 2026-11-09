import { useEffect, useId, useMemo, useState, lazy, Suspense } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Info, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCityBooking, getCalendarBounds } from "@/lib/booking.functions";
import { createCheckoutSession } from "@/lib/stripe.functions";
import { getCity, BONN_MAIN_LOCATION, type ServiceCategory } from "@/lib/cities";
import { getServices, possibleLocations } from "@/lib/services";
import { formatPrice, vatShortNote } from "@/lib/price";

const Calendar = lazy(() => import("@/components/ui/calendar").then((m) => ({ default: m.Calendar })));

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  kfz: "Kfz-Zulassung",
  fuehrerschein: "Führerschein",
};

const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Buchungsformular für Städte mit Standortwahl (z.B. Bonn). */
export type FormPreselect = { category: ServiceCategory; serviceId: string; nonce: number };

export function CityBookingForm({ city: slug, preselect, submitNotice }: { city: string; preselect?: FormPreselect | null; submitNotice?: string }) {
  const city = getCity(slug)!;
  const bookable = city.bookable;
  const submitBooking = useServerFn(createCityBooking);
  const startCheckout = useServerFn(createCheckoutSession);
  const fetchBounds = useServerFn(getCalendarBounds);

  const [category, setCategory] = useState<ServiceCategory>("kfz");
  const [serviceId, setServiceId] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicles, setVehicles] = useState(1);
  const [mode, setMode] = useState<"any" | "specific">("any");
  const [chosen, setChosen] = useState<string[]>([]);
  const [financed, setFinanced] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeWaiver, setAgreeWaiver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [bounds, setBounds] = useState<{ today: Date; min: Date; max: Date; blocked: Date[] } | null>(null);

  const services = useMemo(() => getServices(city.slug).filter((s) => s.category === category), [city.slug, category]);
  const service = services.find((s) => s.id === serviceId);
  const isKfz = category === "kfz";
  const maxVehicles = service?.maxVehicles ?? 1;
  const allIds = city.locations.map((l) => l.id);
  const possible = service ? possibleLocations(service, allIds) : allIds;
  const onlyMain = possible.length === 1 && possible[0] === BONN_MAIN_LOCATION;
  const financedActive = isKfz && city.form.financedCheckbox && financed;

  useEffect(() => {
    let cancelled = false;
    setBounds(null);
    fetchBounds({ data: { city: city.slug, category } })
      .then((b) => {
        if (cancelled) return;
        setBounds({
          today: parseISO(b.todayISO),
          min: parseISO(b.minDateISO),
          max: parseISO(b.maxDateISO),
          blocked: (b.blockedDatesISO ?? []).map(parseISO),
        });
        // Tage außerhalb des neuen Fensters entfernen.
        const max = parseISO(b.maxDateISO);
        const min = parseISO(b.minDateISO);
        setDates((ds) => ds.filter((d) => d >= min && d <= max));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [fetchBounds, city.slug, category]);

  // Vorauswahl aus "Unsere Services" → Bereich und Anliegen übernehmen.
  useEffect(() => {
    if (!preselect) return;
    setCategory(preselect.category);
    setServiceId(preselect.serviceId);
  }, [preselect]);

  // Anliegen gehört nicht mehr zur Kategorie → zurücksetzen.
  useEffect(() => {
    if (serviceId && !services.some((s) => s.id === serviceId)) setServiceId("");
  }, [services, serviceId]);
  useEffect(() => {
    if (vehicles > maxVehicles) setVehicles(maxVehicles);
  }, [maxVehicles, vehicles]);
  useEffect(() => {
    setChosen((c) => c.filter((id) => possible.includes(id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!service) e.service = "Bitte Dienstleistung wählen";
    if (!firstName.trim()) e.firstName = "Pflichtfeld";
    if (!lastName.trim()) e.lastName = "Pflichtfeld";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Ungültige E-Mail-Adresse";
    if (phone.trim().length < 4) e.phone = "Pflichtfeld";
    if (!financedActive && !onlyMain && mode === "specific" && chosen.length === 0)
      e.locations = "Bitte mindestens einen Standort wählen";
    if (dates.length < 1) e.dates = "Bitte wähle mindestens 1 Wunschtag aus.";
    if (!agreeTerms) e.terms = "Bitte zustimmen";
    if (!agreeWaiver) e.waiver = "Bitte zustimmen";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!bookable || !validate() || !service) return;
    setSubmitting(true);
    try {
      const res = await submitBooking({
        data: {
          city: city.slug,
          service_id: service.id,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          vehicle_count: isKfz ? vehicles : undefined,
          locations: financedActive || onlyMain || mode === "any" ? null : chosen,
          financed: financedActive,
          selected_dates: dates.map((d) => format(d, "yyyy-MM-dd")),
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const checkout = await startCheckout({ data: { bookingId: res.bookingId } });
      if (!checkout.ok || !checkout.url) {
        toast.error(("error" in checkout && checkout.error) || "Bezahlung konnte nicht gestartet werden.");
        return;
      }
      window.location.href = checkout.url;
    } catch {
      toast.error("Etwas ist schiefgelaufen. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  const price = formatPrice(city.priceCents);

  return (
    <section id="buchung" aria-labelledby="buchung-heading" className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="buchung-heading" className="text-3xl font-bold sm:text-4xl">Jetzt Termin buchen</h2>
          <p className="mt-4 text-muted-foreground">Fülle das Formular aus – wir kümmern uns um den Rest.</p>
        </div>

        {!bookable ? (
          <div role="status" className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md border border-warning-border bg-warning p-3 text-sm text-warning-foreground">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p><strong>Buchungen für {city.name} starten in Kürze.</strong></p>
          </div>
        ) : null}

        <form onSubmit={onSubmit} noValidate aria-labelledby="buchung-heading" className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Bereich *</legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {(["kfz", "fuehrerschein"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={category === k}
                  onClick={() => setCategory(k)}
                  className={`rounded-md border-2 px-4 py-3 text-sm font-semibold transition ${category === k ? "border-primary bg-secondary" : "border-border hover:border-primary/50"}`}
                >
                  {CATEGORY_LABEL[k]}
                </button>
              ))}
            </div>
          </fieldset>

          <Field label="Dienstleistung" error={errors.service}>
            {(id) => (
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger id={id} aria-invalid={!!errors.service}>
                  <SelectValue placeholder="Bitte auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label} – {price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vorname" error={errors.firstName}>
              {(id) => <Input id={id} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />}
            </Field>
            <Field label="Nachname" error={errors.lastName}>
              {(id) => <Input id={id} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />}
            </Field>
            <Field label="E-Mail" error={errors.email}>
              {(id) => <Input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />}
            </Field>
            <Field label="Telefonnummer" error={errors.phone}>
              {(id) => <Input id={id} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />}
            </Field>
          </div>

          {isKfz ? (
            <Field label="Anzahl Fahrzeuge">
              {(id) => (
                <Select value={String(vehicles)} onValueChange={(v) => setVehicles(Number(v))}>
                  <SelectTrigger id={id}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: maxVehicles }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}

          {isKfz && city.form.financedCheckbox ? (
            <div>
              <label className="flex items-start gap-3 text-sm">
                <Checkbox checked={financed} onCheckedChange={(v) => setFinanced(v === true)} className="mt-0.5" />
                <span>
                  Fahrzeug ist finanziert oder geleast
                  <span className="block text-xs text-muted-foreground">Dann ist nur das Dienstleistungszentrum möglich.</span>
                </span>
              </label>
            </div>
          ) : null}

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Standort *</legend>
            {financedActive || onlyMain ? (
              <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                {financedActive && !onlyMain
                  ? "Bei finanzierten oder geleasten Fahrzeugen suchen wir nur im Dienstleistungszentrum (Berliner Platz 2)."
                  : `Dieses Anliegen bearbeitet ${city.name} nur im Dienstleistungszentrum (Berliner Platz 2).`}
              </p>
            ) : (
              <div className="space-y-2">
                <label className="flex items-start gap-3 text-sm">
                  <input type="radio" name="loc-mode" checked={mode === "any"} onChange={() => setMode("any")} className="mt-1 accent-primary" />
                  <span>Egal wo – Hauptsache Wunschtermin (höchste Chance)</span>
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <input type="radio" name="loc-mode" checked={mode === "specific"} onChange={() => setMode("specific")} className="mt-1 accent-primary" />
                  <span>Nur bestimmte Standorte</span>
                </label>
                {mode === "specific" ? (
                  <div className="ml-7 space-y-2">
                    {city.locations.filter((l) => possible.includes(l.id)).map((l) => (
                      <label key={l.id} className="flex items-start gap-3 text-sm">
                        <Checkbox
                          checked={chosen.includes(l.id)}
                          onCheckedChange={(v) =>
                            setChosen((c) => (v === true ? [...c, l.id] : c.filter((x) => x !== l.id)))
                          }
                          className="mt-0.5"
                        />
                        <span>
                          {l.name}
                          <span className="block text-xs text-muted-foreground">{l.address}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
                {errors.locations ? <p role="alert" className="text-xs text-destructive">{errors.locations}</p> : null}
              </div>
            )}
          </fieldset>

          <Field label="Wunschtag(e)" error={errors.dates}>
            {() => (
              <div className="rounded-md border border-border bg-background p-2">
                {bounds ? (
                  <Suspense fallback={<div className="h-[320px]" aria-hidden="true" />}>
                    <Calendar
                      mode="multiple"
                      locale={de}
                      weekStartsOn={1}
                      selected={dates}
                      onSelect={(d) => setDates(d ?? [])}
                      disabled={(date) =>
                        date < bounds.min ||
                        date > bounds.max ||
                        date.getDay() === 0 ||
                        date.getDay() === 6 ||
                        bounds.blocked.some((b) => b.getTime() === date.getTime())
                      }
                      startMonth={bounds.today}
                      endMonth={bounds.max}
                      className="pointer-events-auto mx-auto"
                    />
                  </Suspense>
                ) : (
                  <div className="h-[320px]" aria-hidden="true" />
                )}
                <p className="mt-2 px-2 text-xs text-muted-foreground">
                  {dates.length === 0 ? "Noch kein Tag ausgewählt." : `Ausgewählt: ${dates.length} ${dates.length === 1 ? "Tag" : "Tage"}. Je mehr Tage, desto höher die Chance.`}
                </p>
              </div>
            )}
          </Field>

          <div className="space-y-3">
            <CheckRow checked={agreeTerms} onChange={setAgreeTerms} error={errors.terms}>
              Ich habe die <Link to="/datenschutz" className="underline">Datenschutzerklärung</Link> und{" "}
              <Link to="/agb" className="underline">AGB</Link> gelesen und stimme zu.
            </CheckRow>
            <p className="text-sm text-muted-foreground">
              Es gelten unsere <Link to="/agb" target="_blank" rel="noreferrer" className="text-accent underline">AGB</Link>. Informationen zum Widerrufsrecht findest du in der{" "}
              <Link to="/widerrufsbelehrung" target="_blank" rel="noreferrer" className="text-accent underline">Widerrufsbelehrung</Link>, zum Datenschutz in der{" "}
              <Link to="/datenschutz" target="_blank" rel="noreferrer" className="text-accent underline">Datenschutzerklärung</Link>.
            </p>
            <CheckRow checked={agreeWaiver} onChange={setAgreeWaiver} error={errors.waiver}>
              Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB).
            </CheckRow>
          </div>

          {submitNotice ? (
            <p className="flex gap-2 rounded-md bg-secondary/60 p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {submitNotice}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting || !bookable} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird verarbeitet...
              </>
            ) : bookable ? (
              "Zahlungspflichtig buchen"
            ) : (
              "Buchungen starten in Kürze"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {price} inkl. aller Gebühren ({vatShortNote()}) · Sichere Zahlung über Stripe · Bestätigungs-E-Mail direkt nach der Buchung
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label} *</Label>
      {children(id)}
      {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function CheckRow({ checked, onChange, error, children }: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
        <span className="text-foreground">{children}</span>
      </label>
      {error ? <p className="ml-7 mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
