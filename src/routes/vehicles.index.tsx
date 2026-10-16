import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleCard } from "@/components/site/VehicleCard";
import { vehicles, filterVehicles, makes, bodyTypes, uniq, PAGE_SIZE, SNAPSHOT_NOTE, type Filters } from "@/lib/inventory";

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown) => (v != null && v !== "" && !isNaN(Number(v)) ? Number(v) : undefined);

export const Route = createFileRoute("/vehicles/")({
  validateSearch: (s: Record<string, unknown>): Filters => ({
    q: str(s.q), make: str(s.make), model: str(s.model), body: str(s.body), fuel: str(s.fuel),
    trans: str(s.trans), loc: str(s.loc), minYear: num(s.minYear), maxYear: num(s.maxYear),
    maxKm: num(s.maxKm), seats: num(s.seats),
    sort: s.sort === "year" || s.sort === "mileage" ? s.sort : undefined, page: num(s.page),
  }),
  head: () => ({
    meta: [
      { title: "Browse Vehicles — Canon Motors" },
      { name: "description", content: "Search and filter used Japanese vehicles from Canon Motors by make, body type, fuel, year and mileage." },
      { property: "og:title", content: "Browse Vehicles — Canon Motors" },
      { property: "og:description", content: "Search the Canon Motors inventory of Japanese imports." },
    ],
  }),
  component: Browse,
});

const sel = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";

function Browse() {
  const f = Route.useSearch();
  const nav = Route.useNavigate();
  const set = (patch: Partial<Filters>) => nav({ search: (p) => ({ ...p, ...patch, page: undefined }) });
  const list = filterVehicles(vehicles, f);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(f.page ?? 1, pages);
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const models = uniq(vehicles.filter((v) => !f.make || v.make === f.make).map((v) => v.model)).sort() as string[];
  const years = (uniq(vehicles.map((v) => v.year)) as number[]).sort((a, b) => b - a);
  const Opt = ({ k, label, opts }: { k: keyof Filters; label: string; opts: (string | number)[] }) => (
    <label className="block text-sm font-medium">{label}
      <select className={`${sel} mt-1`} value={String(f[k] ?? "")} onChange={(e) => set({ [k]: e.target.value || undefined, ...(k === "make" ? { model: undefined } : {}) })}>
        <option value="">Any</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
  return (
    <>
      <PageHeader title="Browse Vehicles" crumb="Browse Vehicles">{list.length} vehicles match. {SNAPSHOT_NOTE}</PageHeader>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          <input aria-label="Search" placeholder="Search make, model or ref…" className={sel} defaultValue={f.q ?? ""}
            onKeyDown={(e) => e.key === "Enter" && set({ q: (e.target as HTMLInputElement).value || undefined })} />
          <Opt k="make" label="Make" opts={makes().map(([m]) => m)} />
          <Opt k="model" label="Model" opts={models} />
          <Opt k="body" label="Body type" opts={bodyTypes().map(([b]) => b)} />
          <Opt k="fuel" label="Fuel" opts={uniq(vehicles.map((v) => v.fuel))} />
          <Opt k="trans" label="Transmission" opts={uniq(vehicles.map((v) => v.transmission))} />
          <Opt k="loc" label="Location" opts={uniq(vehicles.map((v) => v.location))} />
          <Opt k="minYear" label="Min year" opts={years} />
          <Opt k="maxKm" label="Max mileage (km)" opts={[30000, 50000, 80000, 100000, 150000]} />
          <Opt k="seats" label="Min seats" opts={[5, 7, 8]} />
          <Link to="/vehicles" className="block text-sm font-semibold text-primary hover:underline">Clear all filters</Link>
        </aside>
        <div>
          <div className="mb-4 flex justify-end">
            <select aria-label="Sort" className={`${sel} max-w-56`} value={f.sort ?? ""} onChange={(e) => set({ sort: (e.target.value || undefined) as Filters["sort"] })}>
              <option value="">Recently added</option><option value="year">Newest year</option><option value="mileage">Lowest mileage</option>
            </select>
          </div>
          {shown.length === 0 ? (
            <p className="rounded-lg border bg-card p-10 text-center text-muted-foreground">No vehicles match these filters.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{shown.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
          )}
          {pages > 1 && (
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => nav({ search: (s) => ({ ...s, page: p }) })} aria-current={p === page}
                  className={`h-10 w-10 rounded-md border text-sm font-semibold ${p === page ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{p}</button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
