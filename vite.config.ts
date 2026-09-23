import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { SEO_ROUTES } from "./src/lib/seo-routes";

// Emits sitemap.xml at build time. On Vercel the base URL is the project's
// production domain (custom domain once added, *.vercel.app until then).
function sitemap(): Plugin {
  return {
    name: "sitemap",
    apply: "build",
    generateBundle() {
      const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "medicalbay-agadir.vercel.app";
      const base = (host.startsWith("http") ? host : `https://${host}`).replace(/\/$/, "");
      const urls = SEO_ROUTES.map((r) => `  <url><loc>${base}${r.path}</loc></url>`).join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), sitemap(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
