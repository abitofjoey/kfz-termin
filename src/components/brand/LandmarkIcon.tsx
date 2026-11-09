/** Trusted, source-controlled SVG only; inline rendering preserves currentColor. */
export function LandmarkIcon({ icon, className = "" }: { icon?: string; className?: string }) {
  if (!icon) return null;
  return (
    <span
      aria-hidden="true"
      className={`landmark-icon pointer-events-none block shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}