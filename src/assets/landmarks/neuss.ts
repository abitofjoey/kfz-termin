import { createElement } from "react";

/** Exact geometry from the supplied neuss.svg; browser-safe without JSX refresh instrumentation. */
export function NeussLandmark() {
  return createElement("svg", {"viewBox": "0 0 64 64", "fill": "none", "stroke": "currentColor", "strokeWidth": "2", "strokeLinecap": "round", "strokeLinejoin": "round", "role": "img", "aria-label": "Quirinus-Münster Neuss"},
    createElement("path", {"d": "M6 60H58"}),
    createElement("path", {"d": "M15 60V38H49V60"}),
    createElement("path", {"d": "M10 38H54"}),
    createElement("path", {"d": "M15 38L32 27L49 38"}),
    createElement("path", {"d": "M25 31V8H39V31"}),
    createElement("path", {"d": "M24 8H40"}),
    createElement("path", {"d": "M26 8V4M38 8V4"}),
    createElement("path", {"d": "M29 13V16M35 13V16"}),
    createElement("circle", {"cx": "32", "cy": "20", "r": "2"}),
    createElement("path", {"d": "M29 24V27M35 24V27"}),
    createElement("path", {"d": "M15 50H49"}),
    createElement("path", {"d": "M20 60V55A3 3 0 0 1 26 55V60"}),
    createElement("path", {"d": "M38 60V55A3 3 0 0 1 44 55V60"}),
    createElement("path", {"d": "M30 60V56A2 2 0 0 1 34 56V60"}),
    createElement("path", {"d": "M21 43V46M27 43V46M32 42V46M37 43V46M43 43V46"})
  );
}
