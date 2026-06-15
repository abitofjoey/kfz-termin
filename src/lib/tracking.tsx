import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/consent";

const GTM_ID = "GTM-KJPNQMXH";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    // Consent Mode v2 – Default: alles denied (muss VOR GTM-Load gesetzt sein)
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

function loadGTM() {
  if (typeof window === "undefined") return;
  if (document.getElementById("gtm-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export function TrackingScripts() {
  const { hydrated, hasDecided, state } = useConsent();
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    // GTM erst nach aktiver Einwilligungsentscheidung laden (DSGVO/TTDSG-sicher).
    // Vor der Entscheidung wird kein Drittanbieter-Script geladen.
    if (!hasDecided) return;

    if (!initialized.current) {
      ensureGtag();
      loadGTM();
      initialized.current = true;
    }

    window.gtag?.("consent", "update", {
      analytics_storage: state.categories.analytics ? "granted" : "denied",
      ad_storage: state.categories.marketing ? "granted" : "denied",
      ad_user_data: state.categories.marketing ? "granted" : "denied",
      ad_personalization: state.categories.marketing ? "granted" : "denied",
    });
  }, [hydrated, hasDecided, state.categories.analytics, state.categories.marketing]);

  return null;
}
