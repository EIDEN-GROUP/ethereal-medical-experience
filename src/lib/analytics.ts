// Google Analytics 4 (+ dataLayer events for Google Tag Manager).
// GTM itself (GTM-PMLN3BTJ) is loaded by the snippet in index.html.

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

// The measurement ID is public (it ships in the page anyway), so production
// falls back to it; dev only tracks if you set the env var explicitly.
const GA_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ||
  (import.meta.env.PROD ? "G-6BS367D8J1" : undefined);

// Internal pages we don't want in the GTM stats.
const EXCLUDED_PATHS = ["/admin"];

let initialized = false;

function loadScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];

  if (GA_ID) {
    window.gtag = function gtag() {
      // gtag.js expects the raw `arguments` object, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    // GA4 Enhanced Measurement tracks SPA route changes (history events)
    // itself, so page views are NOT sent manually to avoid double counting.
    window.gtag("config", GA_ID);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
  }
}

export function trackPageView(path: string) {
  if (!initialized || EXCLUDED_PATHS.some((p) => path.startsWith(p))) return;

  const payload = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  };

  // For GTM: use a Custom Event trigger on "page_view".
  window.dataLayer.push({ event: "page_view", ...payload });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!initialized) return;
  window.dataLayer.push({ event: name, ...params });
  if (GA_ID) window.gtag?.("event", name, params);
}
