import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEmailChangeState, submitEmailChange } from "@/lib/email-change.functions";

export const Route = createFileRoute("/email-aendern")({
  validateSearch: z.object({ token: z.string().optional(), aktion: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Andere E-Mail-Adresse eintragen – KFZ-Termin Köln" },
      { name: "description", content: "Trage eine andere E-Mail-Adresse ein, damit wir deine Terminsuche fortsetzen können." },
      { property: "og:title", content: "Andere E-Mail-Adresse eintragen – KFZ-Termin Köln" },
      { property: "og:description", content: "Trage eine andere E-Mail-Adresse ein, damit wir deine Terminsuche fortsetzen können." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EmailChangePage,
});

type State = Awaited<ReturnType<typeof getEmailChangeState>> | { state: "saved"; email: string };

function EmailChangePage() {
  const { token, aktion } = Route.useSearch();
  const loadState = useServerFn(getEmailChangeState);
  const submit = useServerFn(submitEmailChange);

  const [state, setState] = useState<State | null>(null);
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmStorno, setConfirmStorno] = useState(aktion === "storniert");

  useEffect(() => {
    loadState({ data: { token: token ?? "" } }).then(setState).catch(() => setState({ state: "invalid" }));
  }, [token, loadState]);

  const send = async (payload: { newEmail: string } | { storniert: true }) => {
    if (!token) return;
    setBusy(true);
    setError(null);
    const res = await submit({ data: { token, ...payload } }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Speichern fehlgeschlagen. Bitte prüfe deine Eingabe und versuche es erneut.");
    if (!res.ok) return setError(res.error);
    setState({ state: "saved", email: res.email });
  };

  const onSave = () => {
    const a = email1.trim().toLowerCase();
    const b = email2.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (a !== b) return setError("Die beiden E-Mail-Adressen stimmen nicht überein.");
    send({ newEmail: a });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Andere E-Mail-Adresse eintragen</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground">
          {!state ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Lädt" />
          ) : state.state === "invalid" ? (
            <p>Dieser Link ist ungültig.</p>
          ) : state.state === "refunded" ? (
            <p>
              Die Rückerstattung wurde bereits beantragt. Du kannst jederzeit neu buchen auf{" "}
              <Link to="/" className="text-accent underline">kfz-termin.online</Link>.
            </p>
          ) : state.state === "found" ? (
            <p>
              Wir haben einen Termin für dich gebucht. Alle Details findest du in unserer E-Mail
              und in der Bestätigung der Zulassungsstelle.
            </p>
          ) : state.state === "done" ? (
            <p>Wir suchen bereits mit {state.email} weiter.</p>
          ) : state.state === "saved" ? (
            <p>Danke, wir suchen weiter mit {state.email}. Eine Bestätigung ist an diese Adresse unterwegs.</p>
          ) : state.state === "expired" ? (
            <p>
              Dein Wunschzeitraum ist bereits vorbei. Bei Fragen schreib uns an{" "}
              <a href="mailto:info@kfz-termin.online" className="text-accent underline">info@kfz-termin.online</a>.
            </p>
          ) : (
            <>
              <p>
                Hallo {state.firstName}, die Zulassungsstelle Köln lässt für deine bisherige Adresse{" "}
                <strong>{state.maskedEmail}</strong> aktuell keine weitere Buchung zu.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email1">Neue E-Mail-Adresse</Label>
                  <Input id="email1" type="email" autoComplete="email" value={email1} onChange={(e) => setEmail1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Neue E-Mail-Adresse wiederholen</Label>
                  <Input id="email2" type="email" autoComplete="email" value={email2} onChange={(e) => setEmail2(e.target.value)} />
                </div>
                <p className="text-muted-foreground">
                  An diese Adresse schickt die Zulassungsstelle später den Bestätigungslink. Bitte nimm eine
                  Adresse, mit der noch kein Termin bei der Zulassungsstelle Köln besteht.
                </p>
              </div>
              {error ? <p className="text-destructive" role="alert">{error}</p> : null}
              <Button size="lg" className="w-full" disabled={busy || !email1 || !email2} onClick={onSave}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Neue Adresse speichern
              </Button>
              {!confirmStorno ? (
                <div className="text-center">
                  <Button variant="outline" disabled={busy} onClick={() => setConfirmStorno(true)}>
                    Termin storniert – mit bisheriger Adresse weitersuchen
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border border-border p-4 text-center">
                  <p>Hast du deinen bestehenden Termin bei der Zulassungsstelle storniert? Dann suchen wir mit {state.maskedEmail} weiter.</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" disabled={busy} onClick={() => send({ storniert: true })}>
                      Ja, mit bisheriger Adresse weitersuchen
                    </Button>
                    <Button variant="ghost" disabled={busy} onClick={() => setConfirmStorno(false)}>Abbrechen</Button>
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
