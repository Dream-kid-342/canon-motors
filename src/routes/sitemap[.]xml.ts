import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/business";
import { facets } from "@/lib/inventory";
import { loadCatalog } from "@/server/catalog";

const STATIC = [
  "/",
  "/vehicles",
  "/makes",
  "/categories",
  "/how-importing-works",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** XML sitemap: static pages, make/category landing pages and every listed vehicle. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const list = loadCatalog();
        const f = facets(list, {});
        const urls = [
          ...STATIC,
          ...f.make.map(({ value }) => `/vehicles?make=${encodeURIComponent(value)}`),
          ...f.body.map(({ value }) => `/vehicles?body=${encodeURIComponent(value)}`),
          ...list.map((v) => `/vehicles/${v.id}`),
        ];
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `  <url><loc>${esc(SITE_URL + u)}</loc></url>`).join("\n") +
          `\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
