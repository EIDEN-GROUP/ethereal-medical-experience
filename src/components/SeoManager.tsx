import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NOINDEX_PATHS, SEO_ROUTES } from "@/lib/seo-routes";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

// Updates title, description, canonical and robots on every route change.
// The canonical follows the domain serving the site, so it stays correct
// when the site moves from *.vercel.app to its own domain.
const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = SEO_ROUTES.find((r) => r.path === pathname);
    const noindex = !route || NOINDEX_PATHS.some((p) => pathname.startsWith(p));
    const home = SEO_ROUTES[0];
    const { title, description } = route ?? home;
    const url = window.location.origin + pathname;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setCanonical(noindex ? null : url);
  }, [pathname]);

  return null;
};

export default SeoManager;
