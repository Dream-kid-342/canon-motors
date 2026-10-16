import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { type Vehicle, vehicleName, fmtKm, fmtCc, locationLabel } from "@/lib/inventory";
import { useFavourites } from "@/lib/favourites";

export function VehicleCard({ v }: { v: Vehicle }) {
  const { has, toggle } = useFavourites();
  const fav = has(v.id);
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link to="/vehicles/$id" params={{ id: String(v.id) }} aria-label={`View ${vehicleName(v)}`}>
          <img
            src={v.image}
            alt={`${v.year ?? ""} ${vehicleName(v)}`}
            loading="lazy"
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold">
          <MapPin className="h-3 w-3 text-primary" /> {locationLabel(v.location)}
        </span>
        <button
          onClick={() => toggle(v.id)}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/95 transition-colors hover:text-primary"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span>Ref {v.stockNo}</span>
          <span>{v.bodyType}</span>
        </div>
        <h3 className="mt-1 text-lg font-bold leading-tight">
          <Link to="/vehicles/$id" params={{ id: String(v.id) }} className="hover:text-primary">
            {vehicleName(v)}
          </Link>
        </h3>
        {v.grade && <p className="truncate text-sm text-muted-foreground">{v.grade}</p>}
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
          <Spec k="Reg. year" val={v.year ? `${v.year}${v.month ? `/${String(v.month).padStart(2, "0")}` : ""}` : "—"} />
          <Spec k="Mileage" val={fmtKm(v.mileageKm)} />
          <Spec k="Engine" val={fmtCc(v.engineCc)} />
          <Spec k="Fuel" val={v.fuel} />
          <Spec k="Gearbox" val={v.transmission} />
          <Spec k="Seats" val={String(v.seats)} />
        </dl>
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 mt-4">
          <span className="text-sm font-semibold">Price on request</span>
          <Link to="/vehicles/$id" params={{ id: String(v.id) }} className="text-sm font-semibold text-primary hover:underline">
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ k, val }: { k: string; val: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[11px] text-muted-foreground">{k}</dt>
      <dd className="font-medium">{val}</dd>
    </div>
  );
}
