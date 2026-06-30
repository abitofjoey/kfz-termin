import { useState, useMemo, useEffect, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { AlertCircle, Check, Info, Loader2, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import finFahrzeugscheinImg from "@/assets/fin-fahrzeugschein.webp.asset.json";
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
  fin_2: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen (Buchstaben oder Zahlen)")
    .optional()
    .or(z.literal("")),
  fin_3: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Genau 4 Zeichen (Buchstaben oder Zahlen)")
    .optional()
    .or(z.literal("")),
  selected_dates: z
    .array(z.date())
    .min(1, "Bitte wähle mindestens 1 Wunschtag aus."),
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
  const [vehicleCount, setVehicleCount] = useState(1);
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

  // Compute date boundaries on the client only to avoid SSR hydration mismatches
  // (server and client `new Date()` differ → React error #418 / blank page).
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(startOfDay(new Date()));
  }, []);
  const minDate = useMemo(() => (today ? addDays(today, 1) : null), [today]);
  const maxDate = useMemo(() => (today ? addDays(today, 14) : null), [today]);
  const threeDayThreshold = useMemo(
    () => (today ? addDays(today, 3) : null),
    [today],
  );

  const hasShortNotice = threeDayThreshold
    ? selectedDates.some((d) => d.getTime() < threeDayThreshold.getTime())
    : false;

  

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
          fin_2: values.fin_2 || undefined,
          fin_3: values.fin_3 || undefined,
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
            Fülle das Formular aus – wir kümmern uns um den Rest.
          </p>
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md border border-warning-border bg-warning p-3 text-sm text-warning-foreground">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            <strong>Wichtig:</strong> Bitte gib die Daten der <strong>künftigen Halterin / des künftigen Halters</strong> des Fahrzeugs an (Anrede, Vor- und Nachname, E-Mail, Telefonnummer). Diese Angaben werden bei der Zulassungsstelle für die Terminbuchung verwendet.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          noValidate
        >
          {/* Service */}
          <Field label="Dienstleistung" error={errors.service_type?.message}>
            {(id) => (
              <Controller
                control={control}
                name="service_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={id}>
                      <SelectValue placeholder="Bitte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label} – 9,99 €
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Anrede" error={errors.salutation?.message}>
              {(id) => (
                <Controller
                  control={control}
                  name="salutation"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={id}>
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
              )}
            </Field>
            <div /> {/* spacer */}
            <Field label="Vorname" error={errors.first_name?.message}>
              {(id) => <Input id={id} {...register("first_name")} autoComplete="given-name" />}
            </Field>
            <Field label="Nachname" error={errors.last_name?.message}>
              {(id) => <Input id={id} {...register("last_name")} autoComplete="family-name" />}
            </Field>
          </div>

          <Field label="E-Mail" error={errors.email?.message} hint="Nach der Buchung erhältst du eine Bestätigungsmail der Kölner Zulassungsstelle – bitte klicke den Link darin innerhalb von 3 Stunden an.">
            {(id) => <Input id={id} type="email" {...register("email")} autoComplete="email" />}
          </Field>

          <Field label="Telefonnummer" error={errors.phone?.message}>
            {(id) => <Input id={id} type="tel" {...register("phone")} autoComplete="tel" />}
          </Field>

          <div className="space-y-3">
            <Field
              label={vehicleCount > 1 ? "FIN Fahrzeug 1 – letzte 4 Zeichen" : "FIN – letzte 4 Zeichen"}
              error={errors.fin_1?.message}
              info={
              <div className="space-y-2">
                  <p>
                    Bis zu 3 Fahrzeuge pro Termin möglich. Die letzten 4 Zeichen findest du in deinen Fahrzeugdokumenten (Fahrzeugschein oder Fahrzeugbrief).
                  </p>
                  <img
                    src={finFahrzeugscheinImg.url}
                    alt="Beispiel: FIN auf dem Fahrzeugschein mit hervorgehobenen letzten 4 Zeichen"
                    loading="lazy"
                    className="w-full h-auto rounded-md border border-border"
                  />
                </div>
              }
            >
              {(id) => (
                <Input
                  id={id}
                  {...register("fin_1")}
                  maxLength={4}
                  className="uppercase tracking-widest"
                  placeholder="z.B. 4F8K"
                />
              )}
            </Field>

            {vehicleCount >= 2 && (
              <ExtraFinField
                index={2}
                error={errors.fin_2?.message}
                register={register("fin_2")}
                onRemove={() => {
                  setValue("fin_2", "", { shouldValidate: true });
                  if (vehicleCount === 2) setVehicleCount(1);
                  else {
                    // shift fin_3 down into fin_2
                    const v3 = (watch("fin_3") ?? "") as string;
                    setValue("fin_2", v3, { shouldValidate: true });
                    setValue("fin_3", "", { shouldValidate: true });
                    setVehicleCount(2);
                  }
                }}
              />
            )}

            {vehicleCount >= 3 && (
              <ExtraFinField
                index={3}
                error={errors.fin_3?.message}
                register={register("fin_3")}
                onRemove={() => {
                  setValue("fin_3", "", { shouldValidate: true });
                  setVehicleCount(2);
                }}
              />
            )}

            {vehicleCount < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVehicleCount((c) => Math.min(3, c + 1))}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Weiteres Fahrzeug hinzufügen
              </Button>
            )}
          </div>


          {/* Calendar */}
          <Field
            label="Wunschtermine"
            info="Wähle die Tage an denen du einen Termin bekommen möchtest. Je mehr Tage, desto höher die Chance auf einen schnellen Termin."
            error={errors.selected_dates?.message as string | undefined}
          >
            <Controller
              control={control}
              name="selected_dates"
              render={({ field }) => (
                <div className="rounded-md border border-border bg-background p-2">
                  {today && minDate && maxDate ? (
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
                  ) : (
                    <div className="h-[320px]" aria-hidden="true" />
                  )}
                  {selectedDates.length < 1 ? (
                    <p className="mt-2 px-2 flex flex-col items-start gap-1 text-xs text-destructive sm:flex-row sm:items-center">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Bitte wähle mindestens 1 Wunschtag aus.</span>
                    </p>
                  ) : (
                    <p className="mt-2 px-2 text-xs text-emerald-600">
                      <span>Ausgewählt: <strong>{selectedDates.length}</strong> {selectedDates.length === 1 ? "Tag" : "Tage"} ✓</span>
                    </p>
                  )}
                </div>
              )}
            />
          </Field>

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
              Ich verlange ausdrücklich den sofortigen Beginn der Terminsuche vor Ablauf der Widerrufsfrist und erkenne an, dass mein Widerrufsrecht mit vollständiger Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB).
            </CheckboxRow>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird verarbeitet...
              </>
            ) : (
              "Jetzt für 9,99 € buchen"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            9,99 € inkl. aller Gebühren (keine USt.) · Sichere Zahlung über Stripe · Bestätigungs-E-Mail direkt nach der Buchung
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  info,
  error,
  children,
}: {
  label: string;
  hint?: string;
  info?: React.ReactNode;
  error?: string;
  children: React.ReactNode | ((id: string) => React.ReactNode);
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm font-medium">{label} *</Label>
        {info && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Mehr Informationen"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Info className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              collisionPadding={16}
              className="w-80 max-w-[calc(100vw-2rem)] text-sm"
            >
              {info}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {typeof children === "function" ? children(id) : children}
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

function ExtraFinField({
  index,
  error,
  register,
  onRemove,
}: {
  index: 2 | 3;
  error?: string;
  register: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
  onRemove: () => void;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          FIN Fahrzeug {index} – letzte 4 Zeichen{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          aria-label={`Fahrzeug ${index} entfernen`}
        >
          <X className="h-3.5 w-3.5" />
          Entfernen
        </button>
      </div>
      <Input
        id={id}
        {...register}
        maxLength={4}
        className="uppercase tracking-widest"
        placeholder="z.B. 9X2P"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
