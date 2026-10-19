import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getWithdrawalPrefill, submitWithdrawal, type WithdrawalPrefill } from "@/lib/withdrawal.functions";

export const Route = createFileRoute("/widerruf")({
  validateSearch: z.object({ token: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Vertrag widerrufen – KFZ-Termin Köln" },
      { name: "description", content: "Widerrufe deine Buchung bei KFZ-Termin Köln online – ohne Login." },
      { property: "og:title", content: "Vertrag widerrufen – KFZ-Termin Köln" },
      { property: "og:description", content: "Widerrufe deine Buchung bei KFZ-Termin Köln online – ohne Login." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: WithdrawalPage,
});

function formatReceived(iso: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return { date, time };
}

function WithdrawalPage() {
  const { token } = Route.useSearch();
  const loadPrefill = useServerFn(getWithdrawalPrefill);
  const submit = useServerFn(submitWithdrawal);

  const [prefill, setPrefill] = useState<WithdrawalPrefill | null>(token ? null : { valid: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [website, setWebsite] = useState("");
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivedAt, setReceivedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    loadPrefill({ data: { token } })
      .then((p) => {
        setPrefill(p);
        if (p.valid) {
          setName(p.name);
          setEmail(p.email);
        }
      })
      .catch(() => setPrefill({ valid: false }));
  }, [token, loadPrefill]);

  const linked = prefill?.valid === true;

  const onNext = () => {
    setError(null);
    if (name.trim().length < 2) return setError("Bitte gib deinen Namen ein.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    setStep("confirm");
  };

  const onConfirm = async () => {
    setBusy(true);
    setError(null);
    const res = await submit({
      data: {
        token: linked ? token : undefined,
        name: name.trim(),
        email: email.trim(),
        contractReference: linked ? undefined : reference.trim() || undefined,
        website: website || undefined,
      },
    }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Das hat leider nicht geklappt. Bitte prüfe deine Eingaben und versuche es erneut.");
    if (!res.ok) return setError(res.error);
    setReceivedAt(res.receivedAt);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Vertrag widerrufen</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
          {receivedAt ? (
            <p role="status">
              Wir haben deinen Widerruf am {formatReceived(receivedAt).date} um {formatReceived(receivedAt).time} Uhr
              erhalten. Eine Bestätigung ist per E-Mail unterwegs.
            </p>
          ) : !prefill ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Lädt" />
          ) : (
            <>
              {token && !linked ? (
                <p className="text-muted-foreground">
                  Dieser Link ist ungültig. Du kannst deinen Widerruf trotzdem hier mit deinen Angaben erklären.
                </p>
              ) : null}

              {linked && prefill.valid ? (
                <div className="rounded-md border border-border p-4">
                  <p className="font-semibold">Buchung {prefill.bookingNumber}</p>
                  <p className="mt-1">{prefill.serviceType}</p>
                  {prefill.selectedDates.length > 0 ? (
                    <p className="mt-1 text-muted-foreground">Wunschtermine: {prefill.selectedDates.join(", ")}</p>
                  ) : null}
                </div>
              ) : null}

              {step === "form" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="w-name">Name</Label>
                    <Input id="w-name" autoComplete="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-email">E-Mail-Adresse (die bei der Buchung angegeben wurde)</Label>
                    <Input id="w-email" type="email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} />
                    {linked ? (
                      <p className="text-muted-foreground">An diese Adresse schicken wir die Eingangsbestätigung.</p>
                    ) : null}
                  </div>
                  {!linked ? (
                    <div className="space-y-2">
                      <Label htmlFor="w-ref">Welche Buchung? (optional)</Label>
                      <Textarea
                        id="w-ref"
                        maxLength={500}
                        placeholder="z. B. Buchungsnummer oder Datum der Buchung"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  ) : null}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="w-website">Website</label>
                    <input id="w-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  {error ? <p className="text-destructive" role="alert">{error}</p> : null}
                  <Button size="lg" className="w-full" onClick={onNext}>Weiter</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border border-border p-4">
                    <p className="font-semibold">Deine Erklärung</p>
                    <p className="mt-2">Ich widerrufe hiermit den von mir abgeschlossenen Vertrag.</p>
                    <p className="mt-2">Name: {name.trim()}</p>
                    <p>E-Mail: {email.trim()}</p>
                    {linked && prefill.valid ? <p>Buchung: {prefill.bookingNumber}</p> : null}
                    {!linked && reference.trim() ? <p>Angaben zur Buchung: {reference.trim()}</p> : null}
                  </div>
                  {error ? <p className="text-destructive" role="alert">{error}</p> : null}
                  <Button size="lg" className="w-full" disabled={busy} onClick={onConfirm}>
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Widerruf bestätigen
                  </Button>
                  <div className="text-center">
                    <Button variant="ghost" disabled={busy} onClick={() => setStep("form")}>Angaben ändern</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
