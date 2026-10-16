import { describe, expect, it } from "vitest";
import {
  type Vehicle,
  facets,
  legacyPage,
  matches,
  parseFilters,
  photoSrcSet,
  photoVariant,
  relatedVehicles,
  search,
  sortVehicles,
} from "@/lib/inventory";
import { loadCatalog } from "@/server/catalog";

const base: Vehicle = {
  id: 1,
  stockNo: "CM-1",
  make: "Toyota",
  model: "Probox",
  bodyType: "Station Wagon",
  chassis: "NCP160-1",
  grade: "DX",
  fuel: "Petrol",
  doors: 5,
  seats: 5,
  color: "White",
  engineCc: 1500,
  year: 2019,
  month: 6,
  mileageKm: 80_000,
  transmission: "Automatic",
  steering: "Right Hand",
  location: "Japan",
  image: "a.jpg",
  images: ["a.jpg"],
  sourceUrl: "",
};
const v = (o: Partial<Vehicle>): Vehicle => ({ ...base, ...o });

const list = [
  v({ id: 1, make: "Toyota", bodyType: "SUV", model: "Harrier", year: 2020, mileageKm: 50_000 }),
  v({ id: 2, make: "Toyota", bodyType: "SUV", model: "Rav4", year: 2018, mileageKm: 30_000 }),
  v({ id: 3, make: "Nissan", bodyType: "SUV", model: "X-Trail", year: 2021, mileageKm: null }),
  v({
    id: 4,
    make: "Toyota",
    bodyType: "Station Wagon",
    year: null,
    mileageKm: 90_000,
    location: "On Way",
  }),
  v({
    id: 5,
    make: "Mazda",
    bodyType: "Hatchback",
    model: "Demio",
    year: 2019,
    mileageKm: 10_000,
    seats: null,
  }),
];

describe("filtering", () => {
  it("combines filters with AND", () => {
    const r = list.filter((x) => matches(x, { make: "Toyota", body: "SUV", minYear: 2019 }));
    expect(r.map((x) => x.id)).toEqual([1]);
  });

  it("never lets an unknown value satisfy a range filter", () => {
    expect(matches(list[3]!, { minYear: 2000 })).toBe(false); // year null
    expect(matches(list[3]!, { maxYear: 2030 })).toBe(false);
    expect(matches(list[2]!, { maxKm: 1_000_000 })).toBe(false); // mileage null
    expect(matches(list[4]!, { minSeats: 1 })).toBe(false); // seats null
  });

  it("matches every word of a free-text query across make, model, ref and grade", () => {
    expect(list.filter((x) => matches(x, { q: "toyota rav" })).map((x) => x.id)).toEqual([2]);
    expect(list.filter((x) => matches(x, { q: "cm-1" })).length).toBe(list.length);
  });
});

describe("sorting", () => {
  it("puts unknown years and mileages last instead of treating them as best", () => {
    expect(sortVehicles(list, "newest").map((x) => x.id)).toEqual([3, 1, 5, 2, 4]);
    expect(sortVehicles(list, "mileage").map((x) => x.id)).toEqual([5, 2, 1, 4, 3]);
  });
  it("defaults to most recently added (highest id first)", () => {
    expect(sortVehicles(list).map((x) => x.id)).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("search & pagination", () => {
  it("returns only the requested page and correct totals", () => {
    const r = search(list, { size: 12 });
    expect(r.total).toBe(5);
    expect(r.pages).toBe(1);
    const many = Array.from({ length: 30 }, (_, i) => v({ id: i + 1 }));
    const p2 = search(many, { page: 2 });
    expect(p2.items.map((x) => x.id)).toEqual([18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7]);
    expect(p2.pages).toBe(3);
  });
  it("clamps an out-of-range page to the last page", () => {
    const r = search(list, { page: 99 });
    expect(r.page).toBe(1);
    expect(r.items.length).toBe(5);
  });
});

describe("facets", () => {
  it("counts each facet against the other active filters", () => {
    const f = facets(list, { make: "Toyota", body: "SUV" });
    // Make counts ignore the make filter but respect body = SUV.
    expect(f.make.find((x) => x.value === "Nissan")?.count).toBe(1);
    expect(f.make.find((x) => x.value === "Mazda")?.count).toBe(0);
    // Body counts ignore body but respect make = Toyota.
    expect(f.body.find((x) => x.value === "Station Wagon")?.count).toBe(1);
  });
});

describe("parseFilters", () => {
  it("drops invalid, default and out-of-range values from the URL", () => {
    expect(
      parseFilters({
        make: "  Toyota ",
        minYear: "abc",
        maxKm: "-5",
        page: "1",
        size: "12",
        sort: "recent",
        body: "",
      }),
    ).toEqual(
      expect.objectContaining({
        make: "Toyota",
        minYear: undefined,
        maxKm: undefined,
        page: undefined,
        size: undefined,
        sort: undefined,
        body: undefined,
      }),
    );
    expect(parseFilters({ size: "24", page: "3", sort: "mileage" })).toEqual(
      expect.objectContaining({ size: 24, page: 3, sort: "mileage" }),
    );
    expect(parseFilters({ size: "1000" }).size).toBeUndefined();
  });
});

describe("related vehicles", () => {
  it("prefers the same model and body type and excludes the vehicle itself", () => {
    const r = relatedVehicles(list, list[0]!);
    expect(r.map((x) => x.id)).not.toContain(1);
    expect(r[0]?.bodyType).toBe("SUV");
  });
});

describe("legacy pagination", () => {
  it("maps old page/ipp to the page containing the same records", () => {
    expect(legacyPage("2", "25")).toBe(3); // record 26 → page 3 of 12
    expect(legacyPage("1", "25")).toBeUndefined();
    expect(legacyPage("x", "25")).toBeUndefined();
  });
});

describe("photo renditions", () => {
  const url = "https://www.canonmotors.com/Admin/uploads/cars_images/images_800x600/CM-1_1_2_3.jpg";
  it("swaps to smaller renditions only for the canonmotors image host", () => {
    expect(photoVariant(url, "65")).toContain("/images_65x65/");
    expect(photoSrcSet(url)).toContain("/images_400x300/CM-1_1_2_3.jpg 400w");
    expect(photoVariant("https://example.com/x.jpg", "65")).toBe("https://example.com/x.jpg");
    expect(photoSrcSet("https://example.com/x.jpg")).toBeUndefined();
  });
});

describe("catalogue snapshot integrity", () => {
  const cat = loadCatalog();
  it("has unique ids and stock references", () => {
    expect(new Set(cat.map((x) => x.id)).size).toBe(cat.length);
    expect(new Set(cat.map((x) => x.stockNo)).size).toBe(cat.length);
    expect(cat.every((x) => /^CM-\d+$/.test(x.stockNo))).toBe(true);
  });
  it("only associates photos with the vehicle they belong to, main photo first", () => {
    for (const x of cat) {
      expect(x.images[0]).toBe(x.image);
      expect(x.images.every((u) => u.includes(`/${x.stockNo}_`))).toBe(true);
    }
  });
  it("keeps missing values missing rather than zero", () => {
    expect(cat.some((x) => x.year === 0 || x.mileageKm === 0 || x.engineCc === 0)).toBe(false);
  });
  it("uses only known stock-location codes", () => {
    expect(cat.every((x) => ["Japan", "On Way", "Port", "Mombasa"].includes(x.location))).toBe(
      true,
    );
  });
});
