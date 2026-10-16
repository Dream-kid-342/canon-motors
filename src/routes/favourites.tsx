import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleCard, VehicleCardSkeleton } from "@/components/site/VehicleCard";
import { useVehiclesByIds } from "@/lib/use-vehicles";
import { useFavourites } from "@/lib/favourites";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/favourites")({
  head: () =>
    seo({
      title: "Saved Vehicles — Canon Motors",
      description: "Vehicles you saved while browsing Canon Motors.",
      path: "/favourites",
      noindex: true,
    }),
  component: Favourites,
});

function Favourites() {
  const fav = useFavourites();
  const q = useVehiclesByIds(fav.ids);
  const list = (q.data?.vehicles ?? []).filter((v) => fav.ids.includes(v.id));
  const missing = q.data?.missing.filter((id) => fav.ids.includes(id)) ?? [];

  return (
    <>
      <PageHeader title="Saved Vehicles" crumbs={[{ label: "Saved Vehicles" }]}>
        Saved in this browser only — your list isn't synced to other devices.
      </PageHeader>
      <div className="container-page py-10">
        {fav.ids.length === 0 ? (
          <div className="rounded-lg border bg-card px-6 py-14 text-center">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <h2 className="mt-3 text-lg font-bold">No saved vehicles yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart on any vehicle to keep it here.
            </p>
            <Button asChild className="mt-5">
              <Link to="/vehicles">Browse vehicles</Link>
            </Button>
          </div>
        ) : q.isError ? (
          <p className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            We couldn't load your saved vehicles.{" "}
            <button className="font-semibold text-primary underline" onClick={() => q.refetch()}>
              Try again
            </button>
          </p>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{fav.ids.length} saved</p>
              <Button variant="ghost" size="sm" onClick={fav.clear}>
                Clear all
              </Button>
            </div>
            {missing.length > 0 && (
              <p className="mb-5 rounded-md border bg-secondary/60 p-3 text-sm">
                {missing.length} saved vehicle{missing.length === 1 ? " is" : "s are"} no longer
                listed and {missing.length === 1 ? "has" : "have"} been hidden.
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {q.isPending
                ? fav.ids.map((id) => <VehicleCardSkeleton key={id} />)
                : list.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
