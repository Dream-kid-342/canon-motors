import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompareArrows, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleImage } from "@/components/site/VehicleImage";
import { useCompare, COMPARE_MAX } from "@/lib/favourites";
import {
  type Vehicle,
  vehicleName,
  fmtKm,
  fmtCc,
  fmtReg,
  fmtNum,
  locationLabel,
  NOT_PROVIDED,
} from "@/lib/inventory";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useVehiclesByIds } from "@/lib/use-vehicles";

export const Route = createFileRoute("/compare")({
  head: () =>
    seo({
      title: "Compare Vehicles — Canon Motors",
      description: "Compare Canon Motors vehicles side by side.",
      path: "/compare",
      noindex: true,
    }),
  component: Compare,
});

const ROWS: [string, (v: Vehicle) => string][] = [
  ["Price", () => "On request"],
  ["Reference", (v) => v.stockNo],
  ["Grade", (v) => v.grade ?? NOT_PROVIDED],
  ["Body type", (v) => v.bodyType],
  ["Reg. year/month", fmtReg],
  ["Mileage", (v) => fmtKm(v.mileageKm)],
  ["Engine", (v) => fmtCc(v.engineCc)],
  ["Fuel", (v) => v.fuel],
  ["Transmission", (v) => v.transmission],
  ["Steering", (v) => v.steering],
  ["Seats", (v) => fmtNum(v.seats)],
  ["Doors", (v) => fmtNum(v.doors)],
  ["Colour", (v) => v.color ?? NOT_PROVIDED],
  ["Location", (v) => locationLabel(v.location)],
];

function Compare() {
  const cmp = useCompare();
  const q = useVehiclesByIds(cmp.ids);
  const list = (q.data?.vehicles ?? []).filter((v) => cmp.ids.includes(v.id));

  return (
    <>
      <PageHeader title="Compare Vehicles" crumbs={[{ label: "Compare" }]}>
        Compare up to {COMPARE_MAX} vehicles side by side. Your selection is kept in this browser
        only.
      </PageHeader>
      <div className="container-page py-10">
        {cmp.ids.length === 0 ? (
          <div className="rounded-lg border bg-card px-6 py-14 text-center">
            <GitCompareArrows className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <h2 className="mt-3 text-lg font-bold">Nothing to compare yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the compare button on any vehicle card to add it here.
            </p>
            <Button asChild className="mt-5">
              <Link to="/vehicles">Browse vehicles</Link>
            </Button>
          </div>
        ) : q.isPending ? (
          <div
            className="h-96 animate-pulse rounded-lg bg-muted"
            aria-busy
            aria-label="Loading comparison"
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {list.length} of {COMPARE_MAX} selected
                {list.length < 2 && " — add at least one more vehicle to compare"}
              </p>
              <Button variant="ghost" size="sm" onClick={cmp.clear}>
                Clear all
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="w-full min-w-[640px] table-fixed text-sm">
                <caption className="sr-only">Vehicle comparison</caption>
                <thead>
                  <tr>
                    <td className="w-36 border-b p-3" />
                    {list.map((v) => (
                      <th
                        key={v.id}
                        scope="col"
                        className="border-b border-l p-3 text-left align-top font-normal"
                      >
                        <div className="relative">
                          <Link
                            to="/vehicles/$id"
                            params={{ id: String(v.id) }}
                            className="block overflow-hidden rounded-md"
                          >
                            <VehicleImage src={v.image} alt="" sizes="240px" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => cmp.toggle(v.id)}
                            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/95 shadow hover:text-primary"
                            aria-label={`Remove ${vehicleName(v)} from comparison`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <Link
                          to="/vehicles/$id"
                          params={{ id: String(v.id) }}
                          className="mt-2 block font-bold hover:text-primary"
                        >
                          {vehicleName(v)}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label, get]) => (
                    <tr key={label} className="border-b last:border-0">
                      <th
                        scope="row"
                        className="bg-secondary/50 p-3 text-left font-medium text-muted-foreground"
                      >
                        {label}
                      </th>
                      {list.map((v) => {
                        const val = get(v);
                        return (
                          <td
                            key={v.id}
                            className={cn(
                              "border-l p-3",
                              val === NOT_PROVIDED ? "text-muted-foreground" : "font-medium",
                            )}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="bg-secondary/50 p-3" />
                    {list.map((v) => (
                      <td key={v.id} className="border-l p-3">
                        <Button asChild size="sm" className="w-full">
                          <Link to="/vehicles/$id" params={{ id: String(v.id) }} hash="enquire">
                            Enquire
                          </Link>
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
