import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Camera, GitCompareArrows, Check } from "lucide-react";
import { toast } from "sonner";
import {
  type Vehicle,
  vehicleName,
  vehicleTitle,
  fmtKm,
  fmtCc,
  fmtReg,
  locationShort,
} from "@/lib/inventory";
import { useCompare, useFavourites, COMPARE_MAX } from "@/lib/favourites";
import { VehicleImage } from "./VehicleImage";
import { cn } from "@/lib/utils";

export function VehicleCard({ v, priority = false }: { v: Vehicle; priority?: boolean }) {
  const fav = useFavourites();
  const cmp = useCompare();
  const saved = fav.has(v.id);
  const comparing = cmp.has(v.id);
  const params = { id: String(v.id) };
  const title = vehicleTitle(v);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transform-none">
      <div className="relative overflow-hidden">
        <Link to="/vehicles/$id" params={params} tabIndex={-1} aria-hidden>
          <VehicleImage
            src={v.image}
            alt={`${title}, ${v.color ?? ""} ${v.bodyType}`.replace(/\s+/g, " ").trim()}
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </Link>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
          <MapPin className="h-3 w-3 text-primary" aria-hidden /> {locationShort(v.location)}
        </span>
        {v.images.length > 1 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-graphite/80 px-2 py-0.5 text-[11px] font-semibold text-graphite-foreground">
            <Camera className="h-3 w-3" aria-hidden /> {v.images.length}
            <span className="sr-only">photos</span>
          </span>
        )}
        <div className="absolute right-3 top-3 flex gap-1.5">
          <IconToggle
            on={comparing}
            label={
              comparing
                ? `Remove ${vehicleName(v)} from comparison`
                : `Add ${vehicleName(v)} to comparison`
            }
            onClick={() => {
              if (!cmp.toggle(v.id))
                toast(`You can compare up to ${COMPARE_MAX} vehicles`, {
                  description: "Remove one from the comparison first.",
                });
            }}
          >
            {comparing ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
          </IconToggle>
          <IconToggle
            on={saved}
            label={saved ? `Remove ${vehicleName(v)} from saved` : `Save ${vehicleName(v)}`}
            onClick={() => fav.toggle(v.id)}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </IconToggle>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Ref {v.stockNo}</span>
          <span>{v.bodyType}</span>
        </div>
        <h3 className="mt-1 text-[17px] font-bold leading-snug">
          <Link
            to="/vehicles/$id"
            params={params}
            className="after:absolute after:inset-0 after:z-0 hover:text-primary focus-visible:outline-none"
          >
            {vehicleName(v)}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted-foreground">{v.grade || " "}</p>
        <dl className="mb-4 mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <Spec k="Reg. year" val={fmtReg(v)} />
          <Spec k="Mileage" val={fmtKm(v.mileageKm)} />
          <Spec k="Engine" val={fmtCc(v.engineCc)} />
          <Spec
            k="Fuel · Gearbox"
            val={`${v.fuel} · ${v.transmission === "Automatic" ? "Auto" : v.transmission}`}
          />
        </dl>
        <div className="relative z-10 mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <span className="text-sm font-semibold">Price on request</span>
          <Link
            to="/vehicles/$id"
            params={params}
            hash="enquire"
            className="rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-accent"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

function IconToggle({
  on,
  label,
  onClick,
  children,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className={cn(
        "relative z-10 grid h-9 w-9 place-items-center rounded-full shadow-sm transition-colors",
        on ? "bg-primary text-primary-foreground" : "bg-background/95 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function Spec({ k, val }: { k: string; val: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd
        className={cn(
          "truncate font-medium",
          val === "Not provided" && "font-normal text-muted-foreground",
        )}
      >
        {val}
      </dd>
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
