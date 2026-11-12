import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CityLanding } from "@/components/city/CityLanding";
import { getCity } from "@/lib/cities";
import { CITY_CONTENT } from "@/content/cities";

const SITE = "https://kfz-termin.online";

export const Route = createFileRoute("/$city")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    const content = CITY_CONTENT[params.city];
    if (!city || !content) throw notFound();
    return { slug: city.slug };
  },
  head: ({ params, loaderData }) => {
    const city = loaderData ? getCity(loaderData.slug) : undefined;
    const content = loaderData ? CITY_CONTENT[loaderData.slug] : undefined;
    if (!city || !content) {
      return { meta: [{ title: "Seite nicht gefunden – KFZ-Termin" }, { name: "robots", content: "noindex" }] };
    }
    const url = `${SITE}/${params.city}`;
    const m = content.meta;
    const meta: Array<Record<string, string>> = [
      { title: m.title },
      { name: "description", content: m.description },
      { property: "og:title", content: m.ogTitle },
      { property: "og:description", content: m.ogDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: url },
    ];
    if (m.ogImage) {
      meta.push(
        { property: "og:image", content: m.ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        ...(m.ogImageAlt ? [{ property: "og:image:alt", content: m.ogImageAlt }] : []),
        { name: "twitter:image", content: m.ogImage },
      );
    }
    if (!city.launched) meta.push({ name: "robots", content: "noindex" });
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: content.serviceJsonLd.name,
            url,
            description: content.serviceJsonLd.description,
            provider: {
              "@type": "Organization",
              name: "KFZ-Termin",
              email: "info@kfz-termin.online",
              url: SITE,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Longericher Str. 31",
                postalCode: "50739",
                addressLocality: "Köln",
                addressCountry: "DE",
              },
            },
            areaServed: content.serviceJsonLd.areaServed ?? { "@type": "City", name: city.name },
            offers: { "@type": "Offer", price: (city.priceCents / 100).toFixed(2), priceCurrency: "EUR" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Start", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: city.name, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        },
      ],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Diese Seite gibt es nicht</h1>
      <Link to="/" className="text-accent underline">Zur Startseite</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">Die Seite konnte nicht geladen werden.</div>
  ),
});

function CityPage() {
  const { slug } = Route.useLoaderData();
  return <CityLanding city={slug} content={CITY_CONTENT[slug]} />;
}
