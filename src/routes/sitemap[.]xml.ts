import { createFileRoute } from "@tanstack/react-router";
import { launchedCities } from "@/lib/cities";

const SITE = "https://kfz-termin.online";

// Sitemap: Stadtseiten kommen ausschließlich aus launchedCities().
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          { loc: `${SITE}/`, freq: "weekly", prio: "1.0" },
          ...launchedCities().map((c) => ({ loc: `${SITE}/${c.slug}`, freq: "weekly", prio: "1.0" })),
          { loc: `${SITE}/impressum`, freq: "yearly", prio: "0.3" },
          { loc: `${SITE}/datenschutz`, freq: "yearly", prio: "0.3" },
          { loc: `${SITE}/agb`, freq: "yearly", prio: "0.3" },
        ];
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.prio}</priority>\n  </url>`)
            .join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
