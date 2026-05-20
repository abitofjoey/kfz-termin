import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB – KFZ-Termin Köln" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen von KFZ-Termin Köln." },
    ],
  }),
  component: () => (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      [AGB hier eintragen]
    </LegalPage>
  ),
});
