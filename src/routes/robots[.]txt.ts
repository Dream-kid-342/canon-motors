import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/business";

/** robots.txt with an absolute sitemap URL for the configured site origin. */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            "User-agent: *",
            "Allow: /",
            "Disallow: /favourites",
            "Disallow: /compare",
            "",
            `Sitemap: ${SITE_URL}/sitemap.xml`,
            "",
          ].join("\n"),
          {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "public, max-age=86400",
            },
          },
        ),
    },
  },
});
