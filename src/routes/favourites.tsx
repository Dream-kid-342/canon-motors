import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleCard } from "@/components/site/VehicleCard";
import { useFavourites } from "@/lib/favourites";
import { vehicles } from "@/lib/inventory";

export const Route = createFileRoute("/favourites")({
  head: () => ({ meta: [
    { title: "Your Favourites — Canon Motors" },
    { name: "description", content: "Vehicles you saved while browsing Canon Motors." },
    { property: "og:title", content: "Favourites — Canon Motors" },
    { property: "og:description", content: "Your saved vehicles." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Favs,
});

function Favs() {
  const { ids } = useFavourites();
  const list = vehicles.filter((v) => ids.includes(v.id));
  return (
    <>
      <PageHeader title="Your Favourites" crumb="Favourites">Saved on this device.</PageHeader>
      <div className="container-page py-10">
        {list.length === 0 ? (
          <p className="text-muted-foreground">No saved vehicles yet. <Link to="/vehicles" className="font-semibold text-primary">Browse vehicles →</Link></p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
        )}
      </div>
    </>
  );
}
