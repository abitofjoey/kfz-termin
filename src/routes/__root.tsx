import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ConsentProvider } from "@/lib/consent";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CookieSettingsDialog } from "@/components/consent/CookieSettingsDialog";
import { TrackingScripts } from "@/lib/tracking";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "D2oJlQb2gzO0djNk9cBghulyxZUkfGL9ih8tH8agZZA" },
      { title: "KFZ-Termin Köln – Wunschtermin bei der Zulassungsstelle" },
      { name: "description", content: "Kein passender Termin bei der Kölner Zulassungsstelle? Wir suchen automatisch täglich und buchen sobald ein Slot frei wird. 9,99€ mit Geld-zurück-Garantie." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:title", content: "KFZ-Termin Köln" },
      { name: "twitter:title", content: "KFZ-Termin Köln" },
      { property: "og:description", content: "Kein passender Termin bei der Kölner Zulassungsstelle? Wir suchen automatisch täglich und buchen sobald ein Slot frei wird. 9,99€ mit Geld-zurück-Garantie." },
      { name: "twitter:description", content: "Kein passender Termin bei der Kölner Zulassungsstelle? Wir suchen automatisch täglich und buchen sobald ein Slot frei wird. 9,99€ mit Geld-zurück-Garantie." },
      { property: "og:image", content: "https://kfz-termin.online/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "KFZ-Termin Köln – Automatische Terminbuchung bei der Kölner Zulassungsstelle" },
      { name: "twitter:image", content: "https://kfz-termin.online/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KFZ-Termin Köln",
          url: "https://kfz-termin.online",
          logo: "https://kfz-termin.online/icon-512.png",
          email: "info@kfz-termin.online",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Longericher Str. 31",
            postalCode: "50739",
            addressLocality: "Köln",
            addressCountry: "DE",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "KFZ-Termin Köln",
          url: "https://kfz-termin.online",
          inLanguage: "de-DE",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ConsentProvider>
        <Outlet />
        <WhatsAppButton />
        <TrackingScripts />
        <CookieBanner />
        <CookieSettingsDialog />
      </ConsentProvider>
    </QueryClientProvider>
  );
}
