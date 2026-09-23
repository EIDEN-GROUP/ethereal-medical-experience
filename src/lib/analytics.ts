// Google Tag Manager + Google Analytics 4.
// IDs come from env vars so nothing loads in dev unless you set them:
//   VITE_GTM_ID=GTM-XXXXXXX
//   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
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

  if (GTM_ID) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
  }

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
  if (!initialized || !GTM_ID || EXCLUDED_PATHS.some((p) => path.startsWith(p))) return;

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
  if (GTM_ID) window.dataLayer.push({ event: name, ...params });
  if (GA_ID) window.gtag?.("event", name, params);
}
