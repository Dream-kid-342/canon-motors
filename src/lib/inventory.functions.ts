import { createServerFn } from "@tanstack/react-start";
import { parseFilters, search, relatedVehicles, facets, sortVehicles } from "@/lib/inventory";
import { loadCatalog, findVehicle } from "@/server/catalog";

/** Paginated, filtered inventory search. Only the requested page is sent to the browser. */
export const searchVehicles = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => parseFilters((input ?? {}) as Record<string, unknown>))
  .handler(({ data }) => search(loadCatalog(), data));

export const getVehicleDetail = createServerFn({ method: "GET" })
  .inputValidator((id: unknown) => {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new Error("Invalid vehicle id");
    return n;
  })
  .handler(({ data: id }) => {
    const vehicle = findVehicle(id);
    if (!vehicle) return null;
    return { vehicle, related: relatedVehicles(loadCatalog(), vehicle) };
  });

/** Vehicles by id, in the order requested (favourites, comparison). */
export const getVehiclesByIds = createServerFn({ method: "GET" })
  .inputValidator((ids: unknown) =>
    Array.isArray(ids)
      ? ids
          .map(Number)
          .filter((n) => Number.isInteger(n) && n > 0)
          .slice(0, 50)
      : [],
  )
  .handler(({ data: ids }) => {
    const found = ids.map(findVehicle).filter((v) => v != null);
    return { vehicles: found, missing: ids.filter((id) => !findVehicle(id)) };
  });

/** Site-wide catalogue summary for navigation, homepage and footer. */
export const getCatalogSummary = createServerFn({ method: "GET" }).handler(() => {
  const list = loadCatalog();
  const f = facets(list, {});
  const coverFor = (field: "bodyType" | "make", value: string) =>
    sortVehicles(list.filter((v) => v[field] === value))[0]?.image ?? null;
  return {
    total: list.length,
    makes: f.make,
    bodyTypes: f.body.map((b) => ({ ...b, image: coverFor("bodyType", b.value) })),
    locations: f.loc,
    fuels: f.fuel,
    transmissions: f.trans,
    years: [...new Set(list.map((v) => v.year).filter((y): y is number => y != null))].sort(
      (a, b) => b - a,
    ),
    modelsByMake: Object.fromEntries(
      f.make.map(({ value }) => [
        value,
        [...new Set(list.filter((v) => v.make === value).map((v) => v.model))].sort(),
      ]),
    ) as Record<string, string[]>,
    /** Most recently added listings. */
    featured: sortVehicles(list).slice(0, 8),
  };
});

export type CatalogSummary = Awaited<ReturnType<typeof getCatalogSummary>>;
