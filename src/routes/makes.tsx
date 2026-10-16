import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { seo } from "@/lib/seo";
import { Route as RootRoute } from "./__root";

export const Route = createFileRoute("/makes")({
  head: () =>
    seo({
      title: "Vehicles by Make — Canon Motors",
      description:
        "Browse Canon Motors Japanese imports by manufacturer — Toyota, Nissan, Suzuki, Mazda, Honda, Subaru and more — with current model counts.",
      path: "/makes",
    }),
  component: Makes,
});

function Makes() {
  const s = RootRoute.useLoaderData();
  return (
    <>
      <PageHeader title="Vehicles by Make" crumbs={[{ label: "Vehicles by Make" }]}>
        {s.makes.length} manufacturers across {s.total} listed vehicles. Choose a make, or jump
        straight to a model.
      </PageHeader>
      <div className="container-page grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {s.makes.map(({ value, count }) => (
          <section
            key={value}
            className="rounded-lg border bg-card p-5"
            aria-labelledby={`make-${value}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`make-${value}`} className="text-lg font-extrabold">
                <Link to="/vehicles" search={{ make: value }} className="hover:text-primary">
                  {value}
                </Link>
              </h2>
              <span className="text-sm text-muted-foreground">
                {count} vehicle{count === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(s.modelsByMake[value] ?? []).map((m) => (
                <li key={m}>
                  <Link
                    to="/vehicles"
                    search={{ make: value, model: m }}
                    className="inline-block rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {m}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
