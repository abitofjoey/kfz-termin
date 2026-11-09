import { createElement } from "react";

/** Exact geometry from the supplied bonn.svg; browser-safe without JSX refresh instrumentation. */
export function BonnLandmark() {
  return createElement("svg", {"viewBox": "0 0 64 64", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "role": "img", "aria-label": "Bonner M\u00fcnster"},
    createElement("path", {"d": "M4 60H60"}),
    createElement("path", {"d": "M8 60V46H14"}),
    createElement("path", {"d": "M14 60V26L16.5 19L19 26V40"}),
    createElement("path", {"d": "M19 40H26V20L29 17L32 20L35 17L38 20V40H45"}),
    createElement("path", {"d": "M29 17L32 4L35 17"}),
    createElement("path", {"d": "M32 4V1.5M30.6 2.6H33.4"}),
    createElement("path", {"d": "M45 40V26L47.5 19L50 26V60"}),
    createElement("path", {"d": "M50 46H56V60"}),
    createElement("path", {"d": "M30.5 34V28A1.5 1.5 0 0 1 33.5 28V34"}),
    createElement("path", {"d": "M21.5 55V49.5A1.5 1.5 0 0 1 24.5 49.5V55M39.5 55V49.5A1.5 1.5 0 0 1 42.5 49.5V55"}),
    createElement("path", {"d": "M29 60V52L32 48L35 52V60"})
  );
}
