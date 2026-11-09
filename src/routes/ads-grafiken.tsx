import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import interWoff2Url from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { launchedCities } from "@/lib/cities";
import { LogoSquare, LogoWide, LandmarkArt, hasLandmark } from "@/lib/ads-graphics";

// Versteckte Hilfsseite: Werbegrafiken als Vorschau + PNG-Download.
// noindex/nofollow, nicht verlinkt, nicht in der Sitemap, per robots.txt gesperrt.

export const Route = createFileRoute("/ads-grafiken")({
  head: () => ({
    meta: [
      { title: "Werbegrafiken – KFZ-Termin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdsGrafikenPage,
});

type GraphicDef = {
  key: string;
  filename: string;
  width: number;
  height: number;
  label: string;
  render: () => ReactNode;
};

let fontDataUrlPromise: Promise<string> | null = null;

/** Inter Variable als data-URL, damit der Canvas-Export die gleiche Schrift nutzt. */
function loadFontDataUrl(): Promise<string> {
  if (!fontDataUrlPromise) {
    fontDataUrlPromise = fetch(interWoff2Url)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          }),
      );
  }
  return fontDataUrlPromise;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function GraphicCard({ def }: { def: GraphicDef }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    const svgEl = previewRef.current?.querySelector("svg");
    if (!svgEl || busy) return;
    setBusy(true);
    setError(null);
    try {
      const fontDataUrl = await loadFontDataUrl();
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", String(def.width));
      clone.setAttribute("height", String(def.height));
      const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      style.textContent = `@font-face{font-family:'Inter Variable';font-weight:100 900;src:url('${fontDataUrl}') format('woff2-variations');}`;
      clone.insertBefore(style, clone.firstChild);

      const svgBlob = new Blob([new XMLSerializer().serializeToString(clone)], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      try {
        const img = new Image();
        img.src = svgUrl;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = def.width;
        canvas.height = def.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas nicht verfügbar");
        ctx.drawImage(img, 0, 0, def.width, def.height);
        const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!png) throw new Error("PNG-Erzeugung fehlgeschlagen");
        if (png.size > 5 * 1024 * 1024) throw new Error("Datei größer als 5 MB");
        downloadBlob(png, def.filename);
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{def.label}</h3>
        <span className="text-xs text-muted-foreground">
          {def.width} × {def.height} px · {def.filename}
        </span>
      </div>
      <div ref={previewRef} className="overflow-hidden rounded-md border border-border [&>svg]:block [&>svg]:h-auto [&>svg]:w-full">
        {def.render()}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? "Erzeuge PNG …" : "Als PNG laden"}
        </button>
        {error ? <span className="text-sm text-destructive">{error}</span> : null}
      </div>
    </div>
  );
}

function AdsGrafikenPage() {
  const cities = launchedCities();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground">Werbegrafiken</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Interne Hilfsseite zum Herunterladen der Grafiken für Google Ads. Jede Grafik wird als PNG in exakter
          Pixelgröße erzeugt.
        </p>

        {cities.map((city) => {
          const graphics: GraphicDef[] = [
            {
              key: "logo-square",
              filename: `logo-${city.slug}-1200x1200.png`,
              width: 1200,
              height: 1200,
              label: "Logo quadratisch (1:1)",
              render: () => <LogoSquare city={city.name} />,
            },
            {
              key: "logo-wide",
              filename: `logo-${city.slug}-1200x300.png`,
              width: 1200,
              height: 300,
              label: "Logo quer (4:1)",
              render: () => <LogoWide city={city.name} />,
            },
          ];
          if (hasLandmark(city.slug)) {
            graphics.push(
              {
                key: "bild-square",
                filename: `bild-${city.slug}-1200x1200.png`,
                width: 1200,
                height: 1200,
                label: "Bild quadratisch (1:1)",
                render: () => <LandmarkArt slug={city.slug} format="square" />,
              },
              {
                key: "bild-wide",
                filename: `bild-${city.slug}-1200x628.png`,
                width: 1200,
                height: 628,
                label: "Bild quer (1,91:1)",
                render: () => <LandmarkArt slug={city.slug} format="wide" />,
              },
            );
          }

          return (
            <section key={city.slug} className="mt-12">
              <h2 className="text-xl font-semibold text-foreground">{city.name}</h2>
              <div className="mt-4 grid gap-6">
                {graphics.map((def) => (
                  <GraphicCard key={def.key} def={def} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
