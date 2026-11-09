// Grafik-Bausteine für /ads-grafiken (versteckte Hilfsseite für Werbegrafiken).
// Optik exakt wie das bestehende Logo (src/assets/brand/mark.svg, public/ads-square.jpg):
// dunkelblauer Hintergrund, weiße Kachel mit dunklem Haken, Inter, Orange #ff6200.

export const ADS_BG = "#111729";
export const ADS_TILE = "#ffffff";
export const ADS_CHECK = "#1c2233";
export const ADS_ORANGE = "#ff6200";
export const ADS_SUBTLE = "#c7d3e8";

/** Haken-Symbol aus src/assets/brand/mark.svg, skaliert auf box×box an Position x/y. */
export function CheckTile({ x, y, box }: { x: number; y: number; box: number }) {
  const s = box / 64;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="64" height="64" rx="12" fill={ADS_TILE} />
      <path
        d="M16 33 L28 44 L48 22"
        fill="none"
        stroke={ADS_CHECK}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

const FONT_STACK = "'Inter Variable','Inter',sans-serif";

export function LogoSquare({ city }: { city: string }) {
  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`KFZ-Termin ${city}`}>
      <rect width="1200" height="1200" fill={ADS_BG} />
      <CheckTile x={452} y={180} box={296} />
      <text x="600" y={652} textAnchor="middle" fontFamily={FONT_STACK} fontWeight={800} fontSize={118} fill="#ffffff">
        KFZ-Termin <tspan fill={ADS_ORANGE}>{city}</tspan>
      </text>
      <text x="600" y={742} textAnchor="middle" fontFamily={FONT_STACK} fontWeight={400} fontSize={46} fill={ADS_SUBTLE}>
        Wunschtermin bei der Zulassungsstelle
      </text>
    </svg>
  );
}

export function LogoWide({ city }: { city: string }) {
  return (
    <svg viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`KFZ-Termin ${city}`}>
      <rect width="1200" height="300" fill={ADS_BG} />
      <CheckTile x={96} y={66} box={168} />
      <text x={304} y={188} fontFamily={FONT_STACK} fontWeight={800} fontSize={92} fill="#ffffff">
        KFZ-Termin <tspan fill={ADS_ORANGE}>{city}</tspan>
      </text>
    </svg>
  );
}

// --- Strichgrafiken: eine durchgehende Linie, einheitliche Strichstärke, runde Enden ---

type LandmarkFormat = "square" | "wide";

/** Kölner Dom: zwei Türme mit Spitzen, Dach dazwischen. Ein Pfad, viewBox 0 0 1000 1000. */
const DOM_SQUARE_PATH =
  "M140 900 L140 460 L165 460 L165 350 L180 350 L180 240 L225 130 L270 240 L270 350 L285 350 L285 460 " +
  "L330 460 L330 640 L500 500 L670 640 L670 460 L715 460 L715 350 L730 350 L730 240 L775 130 L820 240 " +
  "L820 350 L835 350 L835 460 L860 460 L860 900 Z M330 900 L330 640 M670 640 L670 900";

const DOM_SQUARE = { viewBox: "0 0 1000 1000", path: DOM_SQUARE_PATH, strokeWidth: 14 };

/** Kölner Dom quer: gleiche Silhouette, breiter angelegt, viewBox 0 0 1910 1000. */
const DOM_WIDE_PATH =
  "M450 890 L450 480 L475 480 L475 380 L490 380 L490 280 L535 170 L580 280 L580 380 L595 380 L595 480 " +
  "L640 480 L640 650 L955 510 L1270 650 L1270 480 L1315 480 L1315 380 L1330 380 L1330 280 L1375 170 " +
  "L1420 280 L1420 380 L1435 380 L1435 480 L1460 480 L1460 890 Z M640 890 L640 650 M1270 650 L1270 890";

const DOM_WIDE = { viewBox: "0 0 1910 1000", path: DOM_WIDE_PATH, strokeWidth: 14 };

/** Bonner Münster: hoher Mittelturm mit vier Nebentürmchen, Langhaus. viewBox 0 0 1000 1000. */
const MUENSTER_SQUARE_PATH =
  "M185 900 L185 640 L270 640 L270 480 L395 480 L395 330 L395 280 L415 250 L435 280 L435 330 L470 330 " +
  "L470 250 L500 130 L530 250 L530 330 L565 330 L565 280 L585 250 L605 280 L605 330 L605 480 L730 480 " +
  "L730 640 L815 640 L815 900 Z M270 640 L270 900 M730 640 L730 900";

const MUENSTER_SQUARE = { viewBox: "0 0 1000 1000", path: MUENSTER_SQUARE_PATH, strokeWidth: 14 };

/** Bonner Münster quer: Mittelturm mittig, Langhaus beidseitig, viewBox 0 0 1910 1000. */
const MUENSTER_WIDE_PATH =
  "M380 890 L380 660 L560 660 L560 500 L755 500 L755 340 L755 300 L778 265 L800 300 L800 340 L845 340 " +
  "L845 260 L872 140 L898 260 L898 340 L944 340 L944 300 L966 265 L989 300 L989 340 L989 500 L1184 500 " +
  "L1184 660 L1364 660 L1364 890 Z M560 660 L560 890 M1184 660 L1184 890";

const MUENSTER_WIDE = { viewBox: "0 0 1910 1000", path: MUENSTER_WIDE_PATH, strokeWidth: 14 };

const LANDMARKS: Record<string, Record<LandmarkFormat, { viewBox: string; path: string; strokeWidth: number }>> = {
  koeln: { square: DOM_SQUARE, wide: DOM_WIDE },
  bonn: { square: MUENSTER_SQUARE, wide: MUENSTER_WIDE },
};

export function hasLandmark(slug: string): boolean {
  return slug in LANDMARKS;
}

export function LandmarkArt({ slug, format }: { slug: string; format: LandmarkFormat }) {
  const art = LANDMARKS[slug]?.[format];
  if (!art) return null;
  return (
    <svg viewBox={art.viewBox} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strichgrafik Wahrzeichen">
      <rect width="100%" height="100%" fill={ADS_BG} />
      <path
        d={art.path}
        fill="none"
        stroke={ADS_ORANGE}
        strokeWidth={art.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
