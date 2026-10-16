/**
 * Inventory domain logic: types, filtering, sorting, pagination, facets and
 * display helpers. Pure functions only — no data source is imported here, so
 * this module is safe to use in the browser and easy to test. The data itself
 * is loaded on the server (see `src/server/catalog.ts`).
 */
export type Vehicle = {
  id: number;
  stockNo: string;
  make: string;
  model: string;
  bodyType: string;
  chassis: string;
  grade: string | null;
  fuel: string;
  doors: number | null;
  seats: number | null;
  color: string | null;
  engineCc: number | null;
  /** Registration year/month as listed by the source. Null means not provided. */
  year: number | null;
  month: number | null;
  mileageKm: number | null;
  transmission: string;
  steering: string;
  /** Raw stock-location code from the source: "Japan", "On Way", "Port", "Mombasa". */
  location: string;
  /** Main photo. */
  image: string;
  /** All listing photos, main photo first. May contain only the main photo. */
  images: string[];
  sourceUrl: string;
};

export const SNAPSHOT_NOTE =
  "Listings come from a snapshot of the Canon Motors inventory. Please confirm availability, price and condition with our team before making any decision.";

export const vehicleName = (v: Pick<Vehicle, "make" | "model">) => `${v.make} ${v.model}`;

export const vehicleTitle = (v: Vehicle) => [v.year, v.make, v.model].filter(Boolean).join(" ");

/** Stock-location meanings as used on canonmotors.com. */
const LOCATIONS: Record<string, { label: string; short: string; detail: string }> = {
  Japan: {
    label: "In Japan",
    short: "Japan",
    detail:
      "This vehicle is listed as located in Japan. It has not been shipped yet, so shipping, clearance and their costs still apply. Ask our team for a quotation and an indicative timeline.",
  },
  "On Way": {
    label: "On the way to Mombasa",
    short: "On the way",
    detail:
      "This vehicle is listed as shipped and on its way to Mombasa. Contact us to confirm the current shipping status and expected arrival before making plans.",
  },
  Port: {
    label: "At port",
    short: "At port",
    detail:
      "This vehicle is listed as at port. Contact us to confirm its clearance status and the next steps.",
  },
  Mombasa: {
    label: "Mombasa stock",
    short: "Mombasa",
    detail:
      "This vehicle is listed as Mombasa stock. Contact us to confirm it is still available and to arrange a viewing.",
  },
};

export const locationLabel = (loc: string) => LOCATIONS[loc]?.label ?? loc;
export const locationShort = (loc: string) => LOCATIONS[loc]?.short ?? loc;
export const locationDetail = (loc: string) =>
  LOCATIONS[loc]?.detail ??
  "Contact our team to confirm this vehicle's current location and availability.";

export const SORTS = {
  recent: "Recently added",
  newest: "Newest registration year",
  mileage: "Lowest mileage",
} as const;
export type Sort = keyof typeof SORTS;

export const PAGE_SIZES = [12, 24, 48] as const;
export const DEFAULT_PAGE_SIZE = 12;

export type Filters = {
  q?: string | undefined;
  make?: string | undefined;
  model?: string | undefined;
  body?: string | undefined;
  fuel?: string | undefined;
  trans?: string | undefined;
  steer?: string | undefined;
  loc?: string | undefined;
  minYear?: number | undefined;
  maxYear?: number | undefined;
  maxKm?: number | undefined;
  minSeats?: number | undefined;
  sort?: Sort | undefined;
  page?: number | undefined;
  size?: number | undefined;
};

/** Keys that narrow results (everything except sorting and paging). */
export const FILTER_KEYS = [
  "q",
  "make",
  "model",
  "body",
  "fuel",
  "trans",
  "steer",
  "loc",
  "minYear",
  "maxYear",
  "maxKm",
  "minSeats",
] as const satisfies readonly (keyof Filters)[];

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : undefined);
const int = (v: unknown, min: number, max: number) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isInteger(n) && n >= min && n <= max ? n : undefined;
};

/** Parse untrusted search params (URL or RPC input) into a clean Filters object. */
export function parseFilters(input: Record<string, unknown>): Filters {
  const s = input as { [K in keyof Filters]?: unknown };
  const size = int(s.size, 1, 100);
  return {
    q: str(s.q),
    make: str(s.make),
    model: str(s.model),
    body: str(s.body),
    fuel: str(s.fuel),
    trans: str(s.trans),
    steer: str(s.steer),
    loc: str(s.loc),
    minYear: int(s.minYear, 1950, 2100),
    maxYear: int(s.maxYear, 1950, 2100),
    maxKm: int(s.maxKm, 0, 2_000_000),
    minSeats: int(s.minSeats, 1, 100),
    sort:
      typeof s.sort === "string" && s.sort in SORTS && s.sort !== "recent"
        ? (s.sort as Sort)
        : undefined,
    page: int(s.page, 2, 10_000),
    size:
      size && (PAGE_SIZES as readonly number[]).includes(size) && size !== DEFAULT_PAGE_SIZE
        ? size
        : undefined,
  };
}

/** True when a vehicle satisfies every active filter. Unknown values never satisfy a range filter. */
export function matches(v: Vehicle, f: Filters) {
  const q = f.q?.toLowerCase();
  if (q) {
    const hay =
      `${v.make} ${v.model} ${v.stockNo} ${v.grade ?? ""} ${v.chassis} ${v.bodyType}`.toLowerCase();
    if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  if (f.make && v.make !== f.make) return false;
  if (f.model && v.model !== f.model) return false;
  if (f.body && v.bodyType !== f.body) return false;
  if (f.fuel && v.fuel !== f.fuel) return false;
  if (f.trans && v.transmission !== f.trans) return false;
  if (f.steer && v.steering !== f.steer) return false;
  if (f.loc && v.location !== f.loc) return false;
  if (f.minYear != null && (v.year == null || v.year < f.minYear)) return false;
  if (f.maxYear != null && (v.year == null || v.year > f.maxYear)) return false;
  if (f.maxKm != null && (v.mileageKm == null || v.mileageKm > f.maxKm)) return false;
  if (f.minSeats != null && (v.seats == null || v.seats < f.minSeats)) return false;
  return true;
}

/** Sort with unknown values always last, so missing data is never treated as best. */
export function sortVehicles(list: Vehicle[], sort: Sort = "recent") {
  const out = [...list];
  const last = (a: number | null, b: number | null, dir: 1 | -1) =>
    a == null ? (b == null ? 0 : 1) : b == null ? -1 : (a - b) * dir;
  if (sort === "newest")
    out.sort((a, b) => last(a.year, b.year, -1) || last(a.month, b.month, -1) || b.id - a.id);
  else if (sort === "mileage") out.sort((a, b) => last(a.mileageKm, b.mileageKm, 1) || b.id - a.id);
  else out.sort((a, b) => b.id - a.id);
  return out;
}

export type FacetKey = "make" | "model" | "body" | "fuel" | "trans" | "steer" | "loc";
const FACET_FIELD: Record<FacetKey, keyof Vehicle> = {
  make: "make",
  model: "model",
  body: "bodyType",
  fuel: "fuel",
  trans: "transmission",
  steer: "steering",
  loc: "location",
};
export type Facet = { value: string; count: number }[];

/**
 * Disjunctive facet counts: each facet is counted against results filtered by
 * every *other* active filter, so counts show what selecting an option yields.
 */
export function facets(list: Vehicle[], f: Filters) {
  const out = {} as Record<FacetKey, Facet>;
  for (const key of Object.keys(FACET_FIELD) as FacetKey[]) {
    const rest = { ...f, [key]: undefined, ...(key === "make" ? { model: undefined } : {}) };
    const counts = new Map<string, number>();
    for (const v of list) {
      if (key === "model" && f.make && v.make !== f.make) continue;
      const val = String(v[FACET_FIELD[key]] ?? "");
      if (!val) continue;
      if (!counts.has(val)) counts.set(val, 0);
      if (matches(v, rest)) counts.set(val, counts.get(val)! + 1);
    }
    out[key] = [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  }
  return out;
}

export type SearchResult = {
  items: Vehicle[];
  total: number;
  page: number;
  pages: number;
  size: number;
  facets: Record<FacetKey, Facet>;
  years: number[];
  catalogueTotal: number;
};

export function search(list: Vehicle[], f: Filters): SearchResult {
  const size = f.size ?? DEFAULT_PAGE_SIZE;
  const found = sortVehicles(
    list.filter((v) => matches(v, f)),
    f.sort,
  );
  const pages = Math.max(1, Math.ceil(found.length / size));
  const page = Math.min(Math.max(1, f.page ?? 1), pages);
  return {
    items: found.slice((page - 1) * size, page * size),
    total: found.length,
    page,
    pages,
    size,
    facets: facets(list, f),
    years: [...new Set(list.map((v) => v.year).filter((y): y is number => y != null))].sort(
      (a, b) => b - a,
    ),
    catalogueTotal: list.length,
  };
}

/** Rank other vehicles by meaningful similarity to `v`. */
export function relatedVehicles(list: Vehicle[], v: Vehicle, n = 4) {
  const score = (x: Vehicle) =>
    (x.model === v.model && x.make === v.make ? 4 : 0) +
    (x.bodyType === v.bodyType ? 3 : 0) +
    (x.make === v.make ? 2 : 0) +
    (x.fuel === v.fuel ? 1 : 0) +
    (v.year != null && x.year != null && Math.abs(x.year - v.year) <= 2 ? 1 : 0);
  return list
    .filter((x) => x.id !== v.id)
    .map((x) => ({ x, s: score(x) }))
    .filter(({ s }) => s >= 3)
    .sort((a, b) => b.s - a.s || b.x.id - a.x.id)
    .slice(0, n)
    .map(({ x }) => x);
}

/** Map an old canonmotors.com inventory page (`page`, `ipp`) to the equivalent page here. */
export function legacyPage(page: unknown, ipp: unknown, size = DEFAULT_PAGE_SIZE) {
  const p = Number(page);
  const per = Number(ipp);
  if (!Number.isInteger(p) || p < 2) return undefined;
  const perPage = Number.isInteger(per) && per > 0 ? per : 25;
  const target = Math.floor(((p - 1) * perPage) / size) + 1;
  return target > 1 ? target : undefined;
}

export const NOT_PROVIDED = "Not provided";
export const fmtKm = (n: number | null) =>
  n == null ? NOT_PROVIDED : `${n.toLocaleString("en-US")} km`;
export const fmtCc = (n: number | null) =>
  n == null ? NOT_PROVIDED : `${n.toLocaleString("en-US")} cc`;
export const fmtReg = (v: Pick<Vehicle, "year" | "month">) =>
  v.year == null
    ? NOT_PROVIDED
    : v.month
      ? `${v.year}/${String(v.month).padStart(2, "0")}`
      : String(v.year);
export const fmtNum = (n: number | null | undefined) => (n == null ? NOT_PROVIDED : String(n));

/**
 * canonmotors.com stores each photo in several renditions. Swap to a smaller
 * one where it is enough (cards, thumbnails); other URLs are returned as-is.
 */
const RENDITION = /\/images_800x600\//;
export const photoVariant = (url: string, size: "65" | "400" | "800") =>
  RENDITION.test(url)
    ? url.replace(
        RENDITION,
        size === "65" ? "/images_65x65/" : size === "400" ? "/images_400x300/" : "/images_800x600/",
      )
    : url;
export const photoSrcSet = (url: string) =>
  RENDITION.test(url) ? `${photoVariant(url, "400")} 400w, ${url} 800w` : undefined;
