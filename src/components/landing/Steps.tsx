import { FileText, CreditCard, Search, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

const steps = [
  {
    n: 1,
    icon: FileText,
    title: "Daten eingeben",
    text: "Formular in 2 Minuten ausfüllen und Wunschtage wählen.",
  },
  {
    n: 2,
    icon: CreditCard,
    title: "Sicher bezahlen",
    text: "Kreditkarte oder PayPal via Stripe.",
  },
  {
    n: 3,
    icon: Search,
    title: "Wir suchen für Sie",
    text: "Täglich 7–18 Uhr, bis zu 14 Tage lang.",
  },
  {
    n: 4,
    icon: Mail,
    title: "Bestätigungsmail erhalten",
    text: "Automatische Mail der Zulassungsstelle Köln sobald Termin gebucht.",
  },
  {
    n: 5,
    icon: CheckCircle2,
    title: "Termin bestätigen",
    text: "Innerhalb 3 Stunden per Klick in der Mail bestätigen – sonst verfällt der Slot.",
  },
];

export function Steps() {
  return (
    <section id="ablauf" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">So funktioniert's</h2>
          <p className="mt-4 text-muted-foreground">
            In fünf einfachen Schritten zu Ihrem Termin bei der Kölner
            Zulassungsstelle.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ n, icon: Icon, title, text }) => (
            <li
              key={n}
              className="relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Schritt {n}
              </div>
              <h3 className="mt-1 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <div
          role="alert"
          className="mt-10 flex items-start gap-3 rounded-lg border border-warning-border bg-warning p-4 text-warning-foreground"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Wichtig:</strong> Bitte behalten Sie Ihr E-Mail-Postfach im
            Blick sobald Sie gebucht haben. Der Termin muss innerhalb von
            3 Stunden per E-Mail bestätigt werden – sonst verfällt er
            unwiderruflich.
          </p>
        </div>
      </div>
    </section>
  );
}
