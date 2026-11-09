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
  "M140 900 L140 430 L168 430 L168 318 L182 318 L182 210 L226 118 L270 210 L270 318 L284 318 L284 430 " +
  "L330 430 L330 560 L382 520 L452 560 L500 520 L548 560 L618 520 L670 560 L670 430 L716 430 L716 318 " +
  "L730 318 L730 210 L774 118 L818 210 L818 318 L832 318 L832 430 L860 430 L860 900 Z " +
  "M330 900 L330 700 L670 700 L670 900";

const DOM_SQUARE = { viewBox: "0 0 1000 1000", path: DOM_SQUARE_PATH, strokeWidth: 14 };

/** Kölner Dom quer: gleiche Silhouette, breiter angelegt, viewBox 0 0 1910 1000. */
const DOM_WIDE_PATH =
  "M315 880 L315 470 L345 470 L345 360 L360 360 L360 260 L410 165 L460 260 L460 360 L475 360 L475 470 " +
  "L525 470 L525 590 L585 548 L665 590 L720 548 L775 590 L845 548 L905 590 L905 470 L955 470 L955 360 " +
  "L970 360 L970 260 L1020 165 L1070 260 L1070 360 L1085 360 L1085 470 L1115 470 L1115 880 Z " +
  "M525 880 L525 720 L905 720 L905 880";

const DOM_WIDE = { viewBox: "0 0 1910 1000", path: DOM_WIDE_PATH, strokeWidth: 14 };

/** Bonner Münster: hoher Mittelturm mit vier Nebentürmchen, Langhaus. viewBox 0 0 1000 1000. */
const MUENSTER_SQUARE_PATH =
  "M190 900 L190 620 L260 620 L260 470 L310 470 L310 400 L340 400 L340 300 L370 300 L370 250 L430 250 " +
  "L430 185 L500 95 L570 185 L570 250 L630 250 L630 300 L660 300 L660 400 L690 400 L690 470 L740 470 " +
  "L740 620 L810 620 L810 900 Z M260 620 L260 900 M740 620 L740 900";

const MUENSTER_SQUARE = { viewBox: "0 0 1000 1000", path: MUENSTER_SQUARE_PATH, strokeWidth: 14 };

/** Bonner Münster quer: Mittelturm mittig, Langhaus beidseitig, viewBox 0 0 1910 1000. */
const MUENSTER_WIDE_PATH =
  "M420 880 L420 640 L560 640 L560 520 L700 520 L700 430 L760 430 L760 340 L800 340 L800 260 L845 260 " +
  "L845 200 L915 110 L985 200 L985 260 L1030 260 L1030 340 L1070 340 L1070 430 L1130 430 L1130 520 " +
  "L1270 520 L1270 640 L1410 640 L1410 880 Z M560 640 L560 880 M1270 640 L1270 880";

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
