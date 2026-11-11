import { createFileRoute } from "@tanstack/react-router";
import { SCRIPT_FILES, extractMetaBlock, injectToken, safeEqual, validUpdateToken } from "@/lib/script-release";

const HEADERS = {
  "Content-Type": "text/javascript; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};
const notFound = () => new Response("Not found", { status: 404, headers: HEADERS });

export const Route = createFileRoute("/api/script/$token/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const kind = SCRIPT_FILES[params.file as keyof typeof SCRIPT_FILES];
        if (!kind) return notFound();
        const secret = validUpdateToken(process.env["SCRIPT_UPDATE_TOKEN"]);
        if (!secret || !safeEqual(params.token ?? "", secret)) return notFound();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("script-releases").download("kfz-termin.user.js");
        if (error || !data) return notFound();

        const source = await data.text();
        const body = kind === "meta" ? extractMetaBlock(source) : source;
        if (body === null) return notFound();

        console.log(`script ausgeliefert (${kind})`);
        return new Response(injectToken(body, secret), { status: 200, headers: HEADERS });
      },
    },
  },
});
