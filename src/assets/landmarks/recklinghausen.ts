import { createElement } from "react";

/** Exact geometry from the supplied recklinghausen.svg; browser-safe without JSX refresh instrumentation. */
export function RecklinghausenLandmark() {
  return createElement("svg", {"viewBox": "0 0 64 64", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "role": "img", "aria-label": "Rathaus Recklinghausen"},
    createElement("path", {"d": "M4 60H60"}),
    createElement("path", {"d": "M8 60V40L12 34H22"}),
    createElement("path", {"d": "M56 60V40L52 34H42"}),
    createElement("path", {"d": "M22 60V31L32 26L42 31V60"}),
    createElement("path", {"d": "M27 28.5V17H37V28.5"}),
    createElement("path", {"d": "M26 17H38"}),
    createElement("path", {"d": "M28 17C28 12 36 12 36 17"}),
    createElement("path", {"d": "M30.5 13.4V10H33.5V13.4"}),
    createElement("path", {"d": "M32 10V4.5"}),
    createElement("path", {"d": "M29.5 22.5A2.5 2.5 0 1 0 34.5 22.5A2.5 2.5 0 1 0 29.5 22.5"}),
    createElement("path", {"d": "M29 60V53A3 3 0 0 1 35 53V60"}),
    createElement("path", {"d": "M12.5 45V50M17.5 45V50M46.5 45V50M51.5 45V50"}),
    createElement("path", {"d": "M26 37V42M38 37V42"})
  );
}
