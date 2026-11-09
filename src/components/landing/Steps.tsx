import { FileText, CreditCard, Search, Mail, CheckCircle2 } from "lucide-react";

const ICONS = [FileText, CreditCard, Search, Mail, CheckCircle2];

export function Steps({ intro, steps }: { intro: string; steps: { title: string; text: string }[] }) {
  return (
    <section id="ablauf" aria-labelledby="ablauf-heading" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="ablauf-heading" className="text-3xl font-bold sm:text-4xl">So funktioniert's</h2>
          <p className="mt-4 text-muted-foreground">
            {intro}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ title, text }, i) => { const n = i + 1; const Icon = ICONS[i % ICONS.length]; return (
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
          ); })}
        </ol>

      </div>
    </section>
  );
}
