import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { AlertTriangle, Info, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBooking } from "@/lib/booking.functions";
import { createCheckoutSession } from "@/lib/stripe.functions";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SERVICES, SERVICE_IDS, type ServiceId } from "@/lib/services";

const schema = z.object({
  service_type: z.enum(SERVICE_IDS, {
    errorMap: () => ({ message: "Bitte Dienstleistung wählen" }),
  }),
  salutation: z.enum(["Herr", "Frau", "Divers"], {
    errorMap: () => ({ message: "Bitte Anrede wählen" }),
  }),
  first_name: z.string().trim().min(1, "Pflichtfeld").max(100),
  last_name: z.string().trim().min(1, "Pflichtfeld").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(4, "Pflichtfeld").max(40),
  fin_1: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen (Buchstaben oder Zahlen)"),
  selected_dates: z
    .array(z.date())
    .min(5, "Bitte wählen Sie mindestens 5 Wunschtage für eine realistische Erfolgschance."),
  agree_terms: z.literal(true, {
    errorMap: () => ({ message: "Bitte zustimmen" }),
  }),
  agree_waiver: z.literal(true, {
    errorMap: () => ({ message: "Bitte zustimmen" }),
  }),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  preselected?: ServiceId | null;
};

export function BookingForm({ preselected }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const submitBooking = useServerFn(createBooking);
  const startCheckout = useServerFn(createCheckoutSession);
  

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_type: preselected ?? undefined,
      selected_dates: [],
    },
  });

  const selectedDates = watch("selected_dates") ?? [];

  useEffect(() => {
    if (preselected) {
      setValue("service_type", preselected, { shouldValidate: true });
    }
  }, [preselected, setValue]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(() => addDays(today, 1), [today]);
  const maxDate = useMemo(() => addDays(today, 14), [today]);
  const threeDayThreshold = useMemo(() => addDays(today, 3), [today]);

  const hasShortNotice = selectedDates.some(
    (d) => d.getTime() < threeDayThreshold.getTime(),
  );

  const tooFewDates = selectedDates.length < 5;

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const dateStrings = values.selected_dates.map((d) =>
        format(d, "yyyy-MM-dd"),
      );
      const result = await submitBooking({
        data: {
          service_type: values.service_type,
          salutation: values.salutation,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          fin_1: values.fin_1,
          selected_dates: dateStrings,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const checkout = await startCheckout({
        data: { bookingId: result.bookingId },
      });
      if (!checkout.ok || !checkout.url) {
        toast.error(
          ("error" in checkout && checkout.error) ||
            "Bezahlung konnte nicht gestartet werden.",
        );
        return;
      }
      window.location.href = checkout.url;
    } catch (err) {
      console.error(err);
      toast.error("Etwas ist schiefgelaufen. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="buchung" className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Jetzt Termin buchen</h2>
          <p className="mt-4 text-muted-foreground">
            Füllen Sie das Formular aus – wir kümmern uns um den Rest.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          noValidate
        >
          {/* Service */}
          <Field label="Dienstleistung" error={errors.service_type?.message}>
            <Controller
              control={control}
              name="service_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label} – 19€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Anrede" error={errors.salutation?.message}>
              <Controller
                control={control}
                name="salutation"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Herr">Herr</SelectItem>
                      <SelectItem value="Frau">Frau</SelectItem>
                      <SelectItem value="Divers">Divers</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <div /> {/* spacer */}
            <Field label="Vorname" error={errors.first_name?.message}>
              <Input {...register("first_name")} autoComplete="given-name" />
            </Field>
            <Field label="Nachname" error={errors.last_name?.message}>
              <Input {...register("last_name")} autoComplete="family-name" />
            </Field>
          </div>

          <Field
            label="E-Mail"
            error={errors.email?.message}
            hint="An diese Adresse erhalten Sie die Bestätigungsmail der Zulassungsstelle. Bitte sicherstellen dass Sie Zugriff haben."
          >
            <Input type="email" {...register("email")} autoComplete="email" />
          </Field>

          <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning p-3 text-sm text-warning-foreground -mt-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              <strong>Wichtig:</strong> Sobald wir einen Termin gefunden haben, erhalten Sie eine E-Mail mit einem Bestätigungslink. Diesen müssen Sie <strong>innerhalb von 3 Stunden</strong> anklicken – sonst verfällt der Termin unwiderruflich.
            </p>
          </div>

          <Field label="Telefonnummer" error={errors.phone?.message}>
            <Input type="tel" {...register("phone")} autoComplete="tel" />
          </Field>

          <Field
            label="FIN – letzte 4 Ziffern"
            error={errors.fin_1?.message}
            hint="Die letzten 4 Ziffern finden Sie in Ihren Fahrzeugdokumenten (Fahrzeugschein / Fahrzeugbrief)."
          >
            <Input
              {...register("fin_1")}
              maxLength={4}
              className="uppercase tracking-widest"
              placeholder="z.B. 4F8K"
            />
          </Field>

          {/* Calendar */}
          <Field
            label="Wunschtermine (mindestens 5 Tage)"
            error={errors.selected_dates?.message as string | undefined}
          >
            <Controller
              control={control}
              name="selected_dates"
              render={({ field }) => (
                <div className="rounded-md border border-border bg-background p-2">
                  <Calendar
                    mode="multiple"
                    locale={de}
                    weekStartsOn={1}
                    selected={field.value}
                    onSelect={(dates) => {
                      field.onChange(dates ?? []);
                    }}
                    disabled={(date) =>
                      date < minDate ||
                      date > maxDate ||
                      date.getDay() === 0 ||
                      date.getDay() === 6
                    }
                    startMonth={today}
                    endMonth={maxDate}
                    className="pointer-events-auto mx-auto"
                  />
                  <p className="mt-2 px-2 text-xs text-muted-foreground">
                    Ausgewählt: <strong>{selectedDates.length}</strong> Tage
                  </p>
                  <p className="mt-2 px-2 text-xs text-muted-foreground">
                    Für den frühestmöglichen Termin einfach alle Tage auswählen.
                    Je mehr Tage Sie wählen, desto höher die
                    Erfolgswahrscheinlichkeit.
                  </p>
                  {tooFewDates && (
                    <p className="mt-2 px-2 text-xs font-medium text-destructive">
                      Bitte wählen Sie mindestens 5 Wunschtage.
                    </p>
                  )}
                </div>
              )}
            />

          </Field>

          {hasShortNotice && (
            <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning p-3 text-sm text-warning-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                Termine in den nächsten 3 Tagen sind sehr selten verfügbar. Wir
                empfehlen zusätzlich Tage weiter in der Zukunft auszuwählen.
              </p>
            </div>
          )}

          {/* Checkboxes */}
          <div className="space-y-3">
            <CheckboxRow
              control={control}
              name="agree_terms"
              error={errors.agree_terms?.message}
            >
              Ich habe die{" "}
              <Link to="/datenschutz" className="underline">
                Datenschutzerklärung
              </Link>{" "}
              und{" "}
              <Link to="/agb" className="underline">
                AGB
              </Link>{" "}
              gelesen und stimme zu.
            </CheckboxRow>
            <CheckboxRow
              control={control}
              name="agree_waiver"
              error={errors.agree_waiver?.message}
            >
              Ich stimme zu, dass der Service sofort beginnt und verzichte
              damit auf mein Widerrufsrecht gemäß § 356 Abs. 5 BGB.
            </CheckboxRow>
          </div>

          <Button
            type="submit"
            disabled={submitting || tooFewDates}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird verarbeitet...
              </>
            ) : (
              "Jetzt für 19€ buchen"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Gesamtpreis 19,00 €. Keine Umsatzsteuer gem. § 19 UStG
            (Kleinunternehmer).
          </p>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            Bezahlung erfolgt sicher über Stripe. Sie erhalten direkt nach
            der Zahlung eine Bestätigungsmail.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label} *</Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CheckboxRow({
  control,
  name,
  error,
  children,
}: {
  control: any;
  name: "agree_terms" | "agree_waiver";
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              className="mt-0.5"
            />
          )}
        />
        <span className="text-foreground">{children}</span>
      </label>
      {error && <p className="ml-7 mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
