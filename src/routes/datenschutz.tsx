import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – KFZ-Termin Köln" },
      { name: "description", content: "Datenschutzerklärung von KFZ-Termin Köln." },
    ],
  }),
  component: () => (
    <LegalPage title="Datenschutzerklärung">
      [Datenschutzerklärung gemäß DSGVO hier eintragen]
    </LegalPage>
  ),
});
