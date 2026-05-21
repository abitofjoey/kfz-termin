import { Link } from "@tanstack/react-router";
import markUrl from "@/assets/brand/mark.png";

interface BrandProps {
  city?: string;
  size?: "sm" | "md";
  asLink?: boolean;
  className?: string;
}

export function Brand({ city = "Köln", size = "md", asLink = true, className }: BrandProps) {
  const iconSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  const content = (
    <>
      <img
        src={markUrl}
        alt=""
        width={32}
        height={32}
        className={`${iconSize} rounded-md`}
      />
      <span className={`${textSize} font-bold leading-none`}>
        KFZ-Termin{city ? <span className="text-accent"> {city}</span> : null}
      </span>
    </>
  );

  const wrapperClass = `flex items-center gap-2 ${className ?? ""}`.trim();

  if (asLink) {
    return (
      <Link to="/" className={wrapperClass}>
        {content}
      </Link>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}
