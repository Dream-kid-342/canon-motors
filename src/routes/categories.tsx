import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { bodyTypes } from "@/lib/inventory";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [
    { title: "Vehicle Categories — Canon Motors" },
    { name: "description", content: "Browse SUVs, station wagons, hatchbacks, mini vans, vans, pickups and trucks from Canon Motors." },
    { property: "og:title", content: "Vehicle Categories — Canon Motors" },
    { property: "og:description", content: "Find your vehicle by body type." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Vehicle Categories" crumb="Categories" />
      <div className="container-page grid gap-3 py-10 sm:grid-cols-3 lg:grid-cols-4">
        {bodyTypes().map(([b, n]) => (
          <Link key={b} to="/vehicles" search={{ body: b }} className="flex justify-between rounded-lg border bg-card p-5 font-bold hover:border-primary hover:text-primary">
            {b}<span className="text-sm font-medium text-muted-foreground">{n}</span>
          </Link>
        ))}
      </div>
    </>
  ),
});
