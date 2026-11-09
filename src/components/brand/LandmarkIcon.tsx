import type { ComponentType } from "react";

/** Shared SVG component rendering preserves currentColor across all placements. */
export function LandmarkIcon({ icon: Icon, className = "" }: { icon?: ComponentType; className?: string }) {
  if (!Icon) return null;
  return (
    <span
      aria-hidden="true"
      className={`landmark-icon pointer-events-none block shrink-0 ${className}`}
    >
      <Icon />
    </span>
  );
}