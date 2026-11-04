import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = { q: string; a: string };

// Köln-FAQ liegt in den Stadtinhalten; Re-Export für bestehende Importe.
export { koelnFaq as faqItems } from "@/content/cities/koeln";
import { koelnFaq } from "@/content/cities/koeln";

export function Faq({ items = koelnFaq }: { items?: FaqItem[] } = {}) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="faq-heading" className="text-3xl font-bold sm:text-4xl">Häufige Fragen</h2>
          <p className="mt-4 text-muted-foreground">
            Antworten auf die wichtigsten Fragen zu unserem Service.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
