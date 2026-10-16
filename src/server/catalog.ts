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

/**
 * The source lists model names in capitals ("MAZDA CX-8"); the snapshot was
 * title-cased, which mangles acronyms. Restore manufacturers' styling per word.
 */
const MODEL_WORDS: Record<string, string> = {
  xv: "XV",
  rav4: "RAV4",
  rvr: "RVR",
  nv200: "NV200",
  miraes: "Mira e:S",
};
export const styleModel = (model: string) =>
  model
    .split(" ")
    .map((w) => MODEL_WORDS[w.toLowerCase()] ?? (/^cx-\d+$/i.test(w) ? w.toUpperCase() : w))
    .join(" ");

const normalise = (v: RawVehicle): Vehicle => {
  const images = (v.images?.length ? v.images : [v.image]).filter(Boolean);
  return { ...v, model: styleModel(v.model), image: images[0] ?? v.image, images };
};

let cache: Vehicle[] | undefined;

export function loadCatalog(): Vehicle[] {
  cache ??= (raw as RawVehicle[]).map(normalise);
  return cache;
}

export const findVehicle = (id: number) => loadCatalog().find((v) => v.id === id);
