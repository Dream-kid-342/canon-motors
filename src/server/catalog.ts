import raw from "@/data/vehicles.json";
import type { Vehicle } from "@/lib/inventory";

/**
 * Inventory source adapter (server only).
 *
 * Today this reads `src/data/vehicles.json`, a snapshot of the public listing
 * pages on canonmotors.com. To connect the live inventory, replace
 * `loadCatalog` with a call to the real database or API and map its records
 * to `Vehicle`. Nothing else in the app reads the data source directly.
 */
type RawVehicle = Omit<Vehicle, "images"> & { images?: string[] };

const normalise = (v: RawVehicle): Vehicle => {
  const images = (v.images?.length ? v.images : [v.image]).filter(Boolean);
  return { ...v, image: images[0] ?? v.image, images };
};

let cache: Vehicle[] | undefined;

export function loadCatalog(): Vehicle[] {
  cache ??= (raw as RawVehicle[]).map(normalise);
  return cache;
}

export const findVehicle = (id: number) => loadCatalog().find((v) => v.id === id);
