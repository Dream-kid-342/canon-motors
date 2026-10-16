import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { makes } from "@/lib/inventory";

export const Route = createFileRoute("/makes")({
  head: () => ({ meta: [
    { title: "Vehicles by Make — Canon Motors" },
    { name: "description", content: "Browse Canon Motors Japanese imports by manufacturer: Toyota, Nissan, Suzuki, Mazda, Honda and more." },
    { property: "og:title", content: "Vehicles by Make — Canon Motors" },
    { property: "og:description", content: "Find your vehicle by manufacturer." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Vehicles by Make" crumb="By Make" />
      <div className="container-page grid gap-3 py-10 sm:grid-cols-3 lg:grid-cols-4">
        {makes().map(([m, n]) => (
          <Link key={m} to="/vehicles" search={{ make: m }} className="flex justify-between rounded-lg border bg-card p-5 font-bold hover:border-primary hover:text-primary">
            {m}<span className="text-sm font-medium text-muted-foreground">{n} vehicles</span>
          </Link>
        ))}
      </div>
    </>
  ),
});
