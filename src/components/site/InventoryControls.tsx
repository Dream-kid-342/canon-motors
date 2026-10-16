import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { type Filters, type SearchResult, locationLabel } from "@/lib/inventory";
import { cn } from "@/lib/utils";

export const selectCls =
  "mt-1.5 block h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

export const MILEAGE_STEPS = [30_000, 50_000, 80_000, 100_000, 150_000];
export const SEAT_STEPS = [4, 5, 7, 8, 12, 15];

type SetFilters = (patch: Partial<Filters>) => void;

/** Free-text search, debounced so the URL and server query update as the visitor pauses typing. */
export function SearchBox({
  value,
  onChange,
  className,
}: {
  value?: string | undefined;
  onChange: (q?: string) => void;
  className?: string;
}) {
  const [text, setText] = useState(value ?? "");
  const last = useRef(value ?? "");
  useEffect(() => {
    // Sync when the URL changes from elsewhere (chips, clear all, back button).
    if ((value ?? "") !== last.current) {
      last.current = value ?? "";
      setText(value ?? "");
    }
  }, [value]);
  useEffect(() => {
    if (text.trim() === last.current) return;
    const t = setTimeout(() => {
      last.current = text.trim();
      onChange(text.trim() || undefined);
    }, 350);
    return () => clearTimeout(t);
  }, [text, onChange]);
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        aria-label="Search vehicles"
        placeholder="Search make, model, grade or ref (e.g. CM-17397)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            last.current = text.trim();
            onChange(text.trim() || undefined);
          }
        }}
        className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (v: string | undefined) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        className={selectCls}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        {children}
      </select>
    </label>
  );
}

/** All filter controls. Groups whose field has only one value in the catalogue are hidden. */
export function FilterPanel({ f, r, set }: { f: Filters; r: SearchResult; set: SetFilters }) {
  const fc = r.facets;
  const opts = (key: keyof typeof fc, label = (v: string) => v) =>
    fc[key].map(({ value, count }) => (
      <option key={value} value={value} disabled={count === 0 && f[key] !== value}>
        {label(value)} ({count})
      </option>
    ));
  const num = (v?: string) => (v ? Number(v) : undefined);
  const show = (key: keyof typeof fc) => fc[key].length > 1 || f[key] != null;

  return (
    <div className="space-y-4">
      <Select label="Make" value={f.make} onChange={(v) => set({ make: v, model: undefined })}>
        <option value="">All makes</option>
        {opts("make")}
      </Select>
      <Select label="Model" value={f.model} onChange={(v) => set({ model: v })}>
        <option value="">{f.make ? `All ${f.make} models` : "All models"}</option>
        {opts("model")}
      </Select>
      <Select label="Body type" value={f.body} onChange={(v) => set({ body: v })}>
        <option value="">All body types</option>
        {opts("body")}
      </Select>
      <div>
        <span className="text-sm font-medium">Registration year</span>
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Year from"
            className={selectCls}
            value={f.minYear ?? ""}
            onChange={(e) => set({ minYear: num(e.target.value) })}
          >
            <option value="">From</option>
            {r.years.map((y) => (
              <option key={y} value={y} disabled={f.maxYear != null && y > f.maxYear}>
                {y}
              </option>
            ))}
          </select>
          <select
            aria-label="Year to"
            className={selectCls}
            value={f.maxYear ?? ""}
            onChange={(e) => set({ maxYear: num(e.target.value) })}
          >
            <option value="">To</option>
            {r.years.map((y) => (
              <option key={y} value={y} disabled={f.minYear != null && y < f.minYear}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Select label="Maximum mileage" value={f.maxKm} onChange={(v) => set({ maxKm: num(v) })}>
        <option value="">Any mileage</option>
        {MILEAGE_STEPS.map((k) => (
          <option key={k} value={k}>
            Up to {k.toLocaleString("en-US")} km
          </option>
        ))}
      </Select>
      {show("fuel") && (
        <Select label="Fuel type" value={f.fuel} onChange={(v) => set({ fuel: v })}>
          <option value="">Any fuel</option>
          {opts("fuel")}
        </Select>
      )}
      {show("trans") && (
        <Select label="Transmission" value={f.trans} onChange={(v) => set({ trans: v })}>
          <option value="">Any transmission</option>
          {opts("trans")}
        </Select>
      )}
      {show("steer") && (
        <Select label="Steering" value={f.steer} onChange={(v) => set({ steer: v })}>
          <option value="">Any steering</option>
          {opts("steer")}
        </Select>
      )}
      <Select label="Seats" value={f.minSeats} onChange={(v) => set({ minSeats: num(v) })}>
        <option value="">Any seating</option>
        {SEAT_STEPS.map((s) => (
          <option key={s} value={s}>
            {s}+ seats
          </option>
        ))}
      </Select>
      {show("loc") && (
        <Select label="Stock location" value={f.loc} onChange={(v) => set({ loc: v })}>
          <option value="">Any location</option>
          {opts("loc", locationLabel)}
        </Select>
      )}
    </div>
  );
}

/** Removable chips for every active filter. */
export function ActiveFilters({
  f,
  set,
  clear,
}: {
  f: Filters;
  set: SetFilters;
  clear: () => void;
}) {
  const chips: { label: string; patch: Partial<Filters> }[] = [];
  if (f.q) chips.push({ label: `“${f.q}”`, patch: { q: undefined } });
  if (f.make) chips.push({ label: f.make, patch: { make: undefined, model: undefined } });
  if (f.model) chips.push({ label: f.model, patch: { model: undefined } });
  if (f.body) chips.push({ label: f.body, patch: { body: undefined } });
  if (f.minYear || f.maxYear)
    chips.push({
      label:
        f.minYear && f.maxYear
          ? `${f.minYear}–${f.maxYear}`
          : f.minYear
            ? `From ${f.minYear}`
            : `Up to ${f.maxYear}`,
      patch: { minYear: undefined, maxYear: undefined },
    });
  if (f.maxKm)
    chips.push({ label: `≤ ${f.maxKm.toLocaleString("en-US")} km`, patch: { maxKm: undefined } });
  if (f.fuel) chips.push({ label: f.fuel, patch: { fuel: undefined } });
  if (f.trans) chips.push({ label: f.trans, patch: { trans: undefined } });
  if (f.steer) chips.push({ label: f.steer, patch: { steer: undefined } });
  if (f.minSeats) chips.push({ label: `${f.minSeats}+ seats`, patch: { minSeats: undefined } });
  if (f.loc) chips.push({ label: locationLabel(f.loc), patch: { loc: undefined } });
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => set(c.patch)}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent py-1 pl-3 pr-2 text-sm font-medium text-accent-foreground transition-colors hover:border-primary"
          aria-label={`Remove filter: ${c.label}`}
        >
          {c.label} <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={clear}
        className="px-2 text-sm font-semibold text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

/** Numbered pagination with real links (crawlable, shareable). */
export function Pagination({ page, pages }: { page: number; pages: number }) {
  if (pages <= 1) return null;
  const nums: (number | "…")[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  const to = (p: number) => ({
    to: "/vehicles" as const,
    search: (s: Filters) => ({ ...s, page: p > 1 ? p : undefined }),
    // Page 1 has `page: undefined`; without this it would count as active on every page.
    activeOptions: { includeSearch: true, explicitUndefined: true },
  });
  const btn =
    "grid h-10 min-w-10 place-items-center rounded-md border px-3 text-sm font-semibold transition-colors";
  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link
          {...to(page - 1)}
          className={`${btn} bg-card hover:border-foreground/30`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${btn} bg-card opacity-40`} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}
      {nums.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            {...to(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(
              btn,
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-foreground/30",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < pages ? (
        <Link
          {...to(page + 1)}
          className={`${btn} bg-card hover:border-foreground/30`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${btn} bg-card opacity-40`} aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
