import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – KFZ-Termin Köln" },
      { name: "description", content: "Impressum von KFZ-Termin Köln." },
    ],
  }),
  component: () => (
    <LegalPage title="Impressum">
      [Hier Namen, Adresse, E-Mail und ggf. USt-ID eintragen]
    </LegalPage>
  ),
});
