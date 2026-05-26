import { FileText, CreditCard, Search, Mail, CheckCircle2 } from "lucide-react";

const steps = [
  {
    n: 1,
    icon: FileText,
    title: "Daten eingeben",
    text: "Formular in rund 2 Minuten ausfüllen und Wunschtage auswählen.",
  },
  {
    n: 2,
    icon: CreditCard,
    title: "Sicher bezahlen",
    text: "Sichere Zahlung per Kreditkarte oder PayPal über Stripe.",
  },
  {
    n: 3,
    icon: Search,
    title: "Wir suchen für dich",
    text: "Neue Termine sind oft innerhalb von Minuten vergeben – unser System prüft die Verfügbarkeit automatisch, rund um die Uhr.",
  },
  {
    n: 4,
    icon: Mail,
    title: "Bestätigungs-E-Mail erhalten",
    text: "Sobald ein Termin reserviert ist, erhältst du eine automatische E-Mail der Zulassungsstelle Köln.",
  },
  {
    n: 5,
    icon: CheckCircle2,
    title: "Termin bestätigen",
    text: "Bitte bestätige den Termin innerhalb von 3 Stunden per Klick in der E-Mail – andernfalls verfällt die Reservierung.",
  },
];

export function Steps() {
  return (
    <section id="ablauf" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">So funktioniert's</h2>
          <p className="mt-4 text-muted-foreground">
            In fünf einfachen Schritten zu deinem Termin bei der Kölner
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

      </div>
    </section>
  );
}
