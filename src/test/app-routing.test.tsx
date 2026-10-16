import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  const leaf = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

  it("matches a page for / instead of falling back to not found", () => {
    expect(leaf("/")).not.toBe(rootRouteId);
  });

  it.each([
    ["/vehicles", "/vehicles/"],
    ["/vehicles/20530", "/vehicles/$id"],
    ["/makes", "/makes"],
    ["/categories", "/categories"],
    ["/how-importing-works", "/how-importing-works"],
    ["/about", "/about"],
    ["/contact", "/contact"],
    ["/favourites", "/favourites"],
    ["/compare", "/compare"],
    ["/privacy", "/privacy"],
    ["/terms", "/terms"],
    ["/sitemap.xml", "/sitemap.xml"],
    ["/robots.txt", "/robots.txt"],
  ])("routes %s", (path, id) => {
    expect(leaf(path)).toBe(id);
  });
});
