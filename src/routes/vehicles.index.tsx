import {
  createFileRoute,
  Link,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { SlidersHorizontal, SearchX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Breadcrumbs, breadcrumbJsonLd, JsonLd } from "@/components/site/PageHeader";
import { VehicleCard, VehicleCardSkeleton } from "@/components/site/VehicleCard";
import {
  ActiveFilters,
  FilterPanel,
  Pagination,
  SearchBox,
  selectCls,
} from "@/components/site/InventoryControls";
import { searchVehicles } from "@/lib/inventory.functions";
import {
  DEFAULT_PAGE_SIZE,
  FILTER_KEYS,
  PAGE_SIZES,
  SNAPSHOT_NOTE,
  SORTS,
  parseFilters,
  type Filters,
  type Sort,
} from "@/lib/inventory";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const activeCount = (f: Filters) => FILTER_KEYS.filter((k) => f[k] != null).length;

function headingFor(f: Filters) {
  const subject = [f.make, f.model].filter(Boolean).join(" ");
  const body = f.body ? (f.body.endsWith("s") ? f.body : `${f.body}s`) : "";
  if (subject && body) return `${subject} ${body}`;
  if (subject) return `${subject} Vehicles`;
  if (body) return body;
  return "Browse Vehicles";
}

export const Route = createFileRoute("/vehicles/")({
  validateSearch: (s: Record<string, unknown>): Filters => parseFilters(s),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => searchVehicles({ data: deps }),
  head: ({ match }) => {
    const f = match.search;
    const title = headingFor(f);
    // Only unfiltered, make-only or body-only pages are worth indexing; everything else points to its base.
    const landing = activeCount(f) === 1 && (f.make || f.body) && !f.page && !f.sort && !f.size;
    const qs = landing
      ? `?${f.make ? `make=${encodeURIComponent(f.make)}` : `body=${encodeURIComponent(f.body!)}`}`
      : "";
    return seo({
      title: `${title === "Browse Vehicles" ? "Browse Used Japanese Vehicles" : `${title} for Sale`} — Canon Motors`,
      description: `Search ${title === "Browse Vehicles" ? "Japanese import vehicles" : title} from Canon Motors, Mombasa. Filter by make, model, body type, year, mileage and stock location.`,
      path: `/vehicles${qs}`,
      noindex: activeCount(f) > 0 && !landing,
    });
  },
  pendingComponent: InventoryPending,
  errorComponent: InventoryError,
  component: Browse,
});

function Browse() {
  const f = Route.useSearch();
  const r = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const loading = useRouterState({ select: (s) => s.isLoading });
  const [drawer, setDrawer] = useState(false);

  // Any filter change resets to page 1 and keeps sorting and page size.
  const set = useCallback(
    (patch: Partial<Filters>) =>
      navigate({ search: (p) => ({ ...p, ...patch, page: undefined }), resetScroll: false }),
    [navigate],
  );
  const clear = useCallback(
    () => navigate({ search: (p) => ({ sort: p.sort, size: p.size }), resetScroll: false }),
    [navigate],
  );
  const setQ = useCallback((q?: string) => set({ q }), [set]);
  const n = activeCount(f);
  const first = (r.page - 1) * r.size + 1;
  const crumbs = [
    { label: "Browse Vehicles", to: "/vehicles" },
    ...(n
      ? [{ label: headingFor(f) === "Browse Vehicles" ? "Search results" : headingFor(f) }]
      : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="border-b bg-secondary/60">
        <div className="container-page py-7 md:py-9">
          <Breadcrumbs items={crumbs} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h1 className="text-3xl font-extrabold md:text-4xl">{headingFor(f)}</h1>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <strong className="text-foreground">{r.total}</strong> of {r.catalogueTotal} listed
              vehicles
              {n > 0 && " match your filters"}
            </p>
          </div>
          <SearchBox value={f.q} onChange={setQ} className="mt-5 max-w-2xl" />
        </div>
      </section>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border bg-card p-5 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Filters</h2>
              {n > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel f={f} r={r} set={set} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Sheet open={drawer} onOpenChange={setDrawer}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 lg:hidden">
                  <SlidersHorizontal /> Filters
                  {n > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                      {n}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[92vw] max-w-sm flex-col gap-0 p-0">
                <div className="border-b px-5 py-4">
                  <SheetTitle className="text-lg font-extrabold">Filters</SheetTitle>
                  <SheetDescription className="text-sm">
                    Results update as you choose.
                  </SheetDescription>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <FilterPanel f={f} r={r} set={set} />
                </div>
                <div className="grid grid-cols-2 gap-2 border-t p-4">
                  <Button variant="outline" size="lg" onClick={clear} disabled={n === 0}>
                    Clear all
                  </Button>
                  <Button size="lg" onClick={() => setDrawer(false)}>
                    {loading ? "Updating…" : `Show ${r.total} result${r.total === 1 ? "" : "s"}`}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <p className="hidden text-sm text-muted-foreground sm:block">
              {r.total > 0 ? (
                <>
                  Showing {first}–{first + r.items.length - 1} of {r.total}
                </>
              ) : (
                "No results"
              )}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">Sort</span>
                <select
                  aria-label="Sort vehicles"
                  className={cn(selectCls, "mt-0 w-auto min-w-44")}
                  value={f.sort ?? "recent"}
                  onChange={(e) =>
                    set({
                      sort: e.target.value === "recent" ? undefined : (e.target.value as Sort),
                    })
                  }
                >
                  {Object.entries(SORTS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <select
                aria-label="Vehicles per page"
                className={cn(selectCls, "mt-0 hidden w-auto sm:block")}
                value={r.size}
                onChange={(e) =>
                  set({
                    size:
                      Number(e.target.value) === DEFAULT_PAGE_SIZE
                        ? undefined
                        : Number(e.target.value),
                  })
                }
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} per page
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <ActiveFilters f={f} set={set} clear={clear} />
          </div>

          {r.items.length === 0 ? (
            <div className="mt-6 rounded-lg border bg-card px-6 py-14 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
              <h2 className="mt-3 text-lg font-bold">No vehicles match these filters</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Try removing a filter, or tell us what you're looking for — we may be able to source
                it.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button onClick={clear} variant="outline">
                  Clear all filters
                </Button>
                <Button asChild>
                  <Link to="/contact" hash="enquire">
                    Ask our team
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "mt-5 grid gap-5 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
                loading && "pointer-events-none opacity-50",
              )}
              aria-busy={loading}
            >
              {r.items.map((v, i) => (
                <VehicleCard key={v.id} v={v} priority={i < 3} />
              ))}
            </div>
          )}

          <Pagination page={r.page} pages={r.pages} />
          <p className="mt-8 text-center text-xs text-muted-foreground">{SNAPSHOT_NOTE}</p>
        </div>
      </div>
    </>
  );
}

function InventoryPending() {
  return (
    <div className="container-page py-10" aria-busy aria-label="Loading vehicles">
      <div className="h-8 w-60 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function InventoryError({ reset }: ErrorComponentProps) {
  return (
    <div className="container-page py-20 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-warning" aria-hidden />
      <h1 className="mt-3 text-2xl font-extrabold">We couldn't load the inventory</h1>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Please try again in a moment. You can also contact our team directly for current stock.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link to="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
