import raw from "@/data/vehicles.json";

/**
 * Inventory adapter. Data is a snapshot taken from the public listing pages of
 * canonmotors.com. Replace `loadVehicles` with a call to the real inventory
 * source when API access is available; the rest of the app only uses this module.
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
  doors: number;
  seats: number;
  color: string;
  engineCc: number | null;
  year: number | null;
  month: number | null;
  mileageKm: number | null;
  transmission: string;
  steering: string;
  location: string;
  image: string;
  sourceUrl: string;
};

export const SNAPSHOT_NOTE =
  "Listings are a snapshot of the Canon Motors inventory. Please confirm availability before making any decision.";

export const vehicles: Vehicle[] = raw as Vehicle[];

export const getVehicle = (id: number) => vehicles.find((v) => v.id === id);

export const vehicleName = (v: Vehicle) => `${v.make} ${v.model}`;

export const locationLabel = (loc: string) =>
  loc === "On Way" ? "In transit to Mombasa" : loc === "Japan" ? "In stock — Japan" : loc;

export const uniq = (arr: (string | number | null)[]) =>
  [...new Set(arr.filter((x) => x !== null && x !== ""))] as (string | number)[];

export const makes = () => {
  const m = new Map<string, number>();
  vehicles.forEach((v) => m.set(v.make, (m.get(v.make) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export const bodyTypes = () => {
  const m = new Map<string, number>();
  vehicles.forEach((v) => m.set(v.bodyType, (m.get(v.bodyType) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export type Filters = {
  q?: string;
  make?: string;
  model?: string;
  body?: string;
  fuel?: string;
  trans?: string;
  loc?: string;
  minYear?: number;
  maxYear?: number;
  maxKm?: number;
  seats?: number;
  sort?: "recent" | "year" | "mileage";
  page?: number;
};

export function filterVehicles(list: Vehicle[], f: Filters) {
  const q = f.q?.trim().toLowerCase();
  let out = list.filter((v) => {
    if (q && !`${v.make} ${v.model} ${v.stockNo} ${v.grade ?? ""} ${v.chassis}`.toLowerCase().includes(q)) return false;
    if (f.make && v.make !== f.make) return false;
    if (f.model && v.model !== f.model) return false;
    if (f.body && v.bodyType !== f.body) return false;
    if (f.fuel && v.fuel !== f.fuel) return false;
    if (f.trans && v.transmission !== f.trans) return false;
    if (f.loc && v.location !== f.loc) return false;
    if (f.minYear && (v.year ?? 0) < f.minYear) return false;
    if (f.maxYear && (v.year ?? 9999) > f.maxYear) return false;
    if (f.maxKm && (v.mileageKm ?? Infinity) > f.maxKm) return false;
    if (f.seats && v.seats < f.seats) return false;
    return true;
  });
  if (f.sort === "year") out = [...out].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0));
  else if (f.sort === "mileage") out = [...out].sort((a, b) => (a.mileageKm ?? Infinity) - (b.mileageKm ?? Infinity));
  else out = [...out].sort((a, b) => b.id - a.id);
  return out;
}

export const PAGE_SIZE = 12;

export const fmtKm = (n: number | null) => (n == null ? "Not listed" : `${n.toLocaleString("en-US")} km`);
export const fmtCc = (n: number | null) => (n == null ? "—" : `${n.toLocaleString("en-US")} cc`);
