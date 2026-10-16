import { legacyPage } from "./inventory";

/**
 * Map URLs from the previous canonmotors.com site to their equivalents here,
 * so bookmarks, shared links and search results keep working. Returns the
 * new path (with query) or null when the URL is not a known legacy pattern.
 *
 * Known patterns (observed on the live site, October 2026):
 *   /Kenya/{MAKE MODEL}/{id}                → /vehicles/{id}
 *   /Maker/{MAKE}/{makerId}                 → /vehicles?make=…
 *   /Model/{MAKE MODEL}/{makerId}/{modelId} → /vehicles?make=…&model=…
 *   /index.php?page=N&ipp=M, /?Stock=Kenya  → /vehicles (equivalent page)
 *   /about_us/, /contact_us/, /faqs/        → /about, /contact, /contact#faq
 */
export function legacyRedirect(
  url: URL,
  catalogue: { make: string; model: string }[],
): string | null {
  const segs = url.pathname
    .split("/")
    .filter(Boolean)
    .map((s) => {
      try {
        return decodeURIComponent(s).replace(/\s+/g, " ").trim();
      } catch {
        return s;
      }
    });
  const head = segs[0]?.toLowerCase();
  const norm = (s: string) => s.toUpperCase().replace(/\s+/g, " ").trim();
  const qs = (p: Record<string, string | number | undefined>) => {
    const e = Object.entries(p).filter(([, v]) => v !== undefined) as [string, string][];
    return e.length ? `?${new URLSearchParams(e).toString()}` : "";
  };

  if (head === "kenya" && segs.length >= 2) {
    const id = segs[segs.length - 1] ?? "";
    return /^\d+$/.test(id) ? `/vehicles/${id}` : "/vehicles";
  }
  const name1 = segs[1];
  if (head === "maker" && name1) {
    const make = catalogue.find((v) => norm(v.make) === norm(name1))?.make;
    return make ? `/vehicles${qs({ make })}` : "/makes";
  }
  if (head === "model" && name1) {
    const name = norm(name1);
    const exact = catalogue.find((v) => norm(`${v.make} ${v.model}`) === name);
    if (exact) return `/vehicles${qs({ make: exact.make, model: exact.model })}`;
    const make = catalogue.find((v) => name.startsWith(`${norm(v.make)} `))?.make;
    return make ? `/vehicles${qs({ make })}` : "/makes";
  }
  if (head === "index.php" || (url.pathname === "/" && url.searchParams.has("Stock"))) {
    return `/vehicles${qs({ page: legacyPage(url.searchParams.get("page"), url.searchParams.get("ipp")) })}`;
  }
  if (segs.length === 1) {
    if (head === "about_us" || head === "about-us.php") return "/about";
    if (head === "contact_us" || head === "contact-us.php") return "/contact";
    if (head === "faqs") return "/contact#faq";
  }
  return null;
}
