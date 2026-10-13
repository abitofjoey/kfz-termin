import { lazy, Suspense, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { de } from "date-fns/locale";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { getCalendarBounds } from "@/lib/booking.functions";
import { getRebookState, requestRebookRefund, submitRebookDates } from "@/lib/rebook.functions";

const Calendar = lazy(() =>
  import("@/components/ui/calendar").then((m) => ({ default: m.Calendar })),
);

export const Route = createFileRoute("/termine-aendern")({
  validateSearch: z.object({ t: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Neue Wunschtermine wählen – KFZ-Termin Köln" },
      { name: "description", content: "Wähle neue Wunschtermine für deine Terminsuche oder lass dir den Betrag erstatten." },
      { property: "og:title", content: "Neue Wunschtermine wählen – KFZ-Termin Köln" },
      { property: "og:description", content: "Wähle neue Wunschtermine für deine Terminsuche oder lass dir den Betrag erstatten." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RebookPage,
});

const fmtDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return format(new Date(y, m - 1, d), "EEEE, dd.MM.yyyy", { locale: de });
};
const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

type State = Awaited<ReturnType<typeof getRebookState>>;

function RebookPage() {
  const { t } = Route.useSearch();
  const loadState = useServerFn(getRebookState);
  const fetchBounds = useServerFn(getCalendarBounds);
  const submitDates = useServerFn(submitRebookDates);
  const requestRefund = useServerFn(requestRebookRefund);

  const [state, setState] = useState<State | null>(null);
  const [bounds, setBounds] = useState<{ today: Date; min: Date; max: Date; blocked: Date[] } | null>(null);
  const [selected, setSelected] = useState<Date[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRefund, setConfirmRefund] = useState(false);

  useEffect(() => {
    loadState({ data: { token: t ?? "" } }).then(setState).catch(() => setState({ state: "invalid" }));
    fetchBounds().then((b) =>
      setBounds({
        today: parseISO(b.todayISO),
        min: parseISO(b.minDateISO),
        max: parseISO(b.maxDateISO),
        blocked: (b.blockedDatesISO ?? []).map(parseISO),
      }),
    );
  }, [t, loadState, fetchBounds]);

  const onConfirmDates = async () => {
    if (selected.length < 1 || !t) return;
    setBusy(true);
    setError(null);
    const res = await submitDates({ data: { token: t, dates: selected.map((d) => format(d, "yyyy-MM-dd")) } }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
    if (!res.ok) return setError(res.error);
    setState((s) => ({
      state: "used",
      firstName: s && "firstName" in s ? s.firstName : "",
      serviceType: s && "serviceType" in s ? s.serviceType : "",
      selectedDates: res.selectedDates,
    }));
  };

  const onRefund = async () => {
    if (!t) return;
    setBusy(true);
    setError(null);
    const res = await requestRefund({ data: { token: t } }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Das hat nicht geklappt. Bitte versuche es erneut.");
    if (!res.ok) return setError(res.error);
    setState({ state: "refunded" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Neue Wunschtermine wählen</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
          {!state ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Lädt" />
          ) : state.state === "invalid" ? (
            <p>Dieser Link ist ungültig.</p>
          ) : state.state === "used" ? (
            <>
              <p>Deine neuen Wunschtermine sind gespeichert. Wir suchen bereits.</p>
              <ul className="list-disc pl-5">
                {state.selectedDates.map((d) => <li key={d}>{fmtDay(d)}</li>)}
              </ul>
            </>
          ) : state.state === "refunded" ? (
            <p>
              Die Rückerstattung wurde bereits beantragt. Du kannst jederzeit neu buchen auf{" "}
              <Link to="/" className="text-accent underline">kfz-termin.online</Link>.
            </p>
          ) : state.state === "expired" ? (
            <p>Das Angebot ist abgelaufen, die Rückerstattung wird automatisch veranlasst.</p>
          ) : (
            <>
              <p>Hallo {state.firstName}, für deinen Auftrag „{state.serviceType}" war bisher leider kein Termin frei.</p>
              <div>
                <p className="font-semibold">Bisherige Wunschtermine</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {state.selectedDates.map((d) => <li key={d}>{fmtDay(d)}</li>)}
                </ul>
              </div>
              <p className="font-medium">Tipp: Je mehr Tage du auswählst, desto höher ist die Chance auf einen Termin.</p>
              <div className="rounded-md border border-border bg-background p-2">
                {bounds ? (
                  <Suspense fallback={<div className="h-[320px]" aria-hidden="true" />}>
                    <Calendar
                      mode="multiple"
                      locale={de}
                      weekStartsOn={1}
                      selected={selected}
                      onSelect={(d) => setSelected(d ?? [])}
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
              </div>
              {error ? <p className="text-destructive" role="alert">{error}</p> : null}
              <Button size="lg" className="w-full" disabled={busy || selected.length < 1} onClick={onConfirmDates}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Neue Termine bestätigen
              </Button>
              {!confirmRefund ? (
                <div className="text-center">
                  <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setConfirmRefund(true)}>
                    Lieber Geld zurück
                  </button>
                </div>
              ) : (
                <div className="rounded-md border border-border p-4 text-center">
                  <p>Möchtest du dir den vollen Betrag erstatten lassen?</p>
                  <div className="mt-3 flex justify-center gap-3">
                    <Button variant="outline" disabled={busy} onClick={onRefund}>Ja, Geld zurück</Button>
                    <Button variant="ghost" disabled={busy} onClick={() => setConfirmRefund(false)}>Abbrechen</Button>
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
