import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleImage } from "@/components/site/VehicleImage";
import { seo } from "@/lib/seo";
import { Route as RootRoute } from "./__root";

export const Route = createFileRoute("/categories")({
  head: () =>
    seo({
      title: "Vehicle Categories — Canon Motors",
      description:
        "Browse Canon Motors vehicles by body type: SUVs, station wagons, hatchbacks, mini vans, vans, pickups, trucks, buses and more.",
      path: "/categories",
    }),
  component: Categories,
});

function Categories() {
  const s = RootRoute.useLoaderData();
  return (
    <>
      <PageHeader title="Vehicle Categories" crumbs={[{ label: "Vehicle Categories" }]}>
        Only categories with vehicles currently listed are shown. Each photo is a real vehicle from
        that category.
      </PageHeader>
      <div className="container-page grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {s.bodyTypes.map((b) => (
          <Link
            key={b.value}
            to="/vehicles"
            search={{ body: b.value }}
            className="group overflow-hidden rounded-lg border bg-card shadow-card transition-shadow hover:shadow-lift"
          >
            <div className="overflow-hidden">
              <VehicleImage
                src={b.image}
                alt=""
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-extrabold group-hover:text-primary">{b.value}</h2>
              <span className="text-sm text-muted-foreground">
                {b.count} vehicle{b.count === 1 ? "" : "s"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
