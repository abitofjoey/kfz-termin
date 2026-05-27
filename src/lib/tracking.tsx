import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/consent";

const GA_ID = "G-NQXH96FZW3";
const HOTJAR_ID = 6719467;
const HOTJAR_SV = 6;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
    _hjSettings?: { hjid: number; hjsv: number };
  }
}

function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    // Consent Mode v2 – Default: alles denied
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
    window.gtag("js", new Date());
  }
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function loadGA() {
  loadScript("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  window.gtag?.("config", GA_ID, { anonymize_ip: true });
}

function loadHotjar() {
  if (window.hj) return;
  window._hjSettings = { hjid: HOTJAR_ID, hjsv: HOTJAR_SV };
  const hj: Window["hj"] = Object.assign(
    function (...args: unknown[]) {
      (hj!.q = hj!.q || []).push(args);
    },
    { q: [] as unknown[] },
  );
  window.hj = hj;
  loadScript(
    "hotjar-script",
    `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=${HOTJAR_SV}`,
  );
}

export function TrackingScripts() {
  const { hydrated, state } = useConsent();
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!initialized.current) {
      ensureGtag();
      initialized.current = true;
    }

    window.gtag?.("consent", "update", {
      analytics_storage: state.categories.analytics ? "granted" : "denied",
      ad_storage: state.categories.marketing ? "granted" : "denied",
      ad_user_data: state.categories.marketing ? "granted" : "denied",
      ad_personalization: state.categories.marketing ? "granted" : "denied",
    });

    if (state.categories.analytics) {
      loadGA();
      loadHotjar();
    }
  }, [hydrated, state.categories.analytics, state.categories.marketing]);

  return null;
}
