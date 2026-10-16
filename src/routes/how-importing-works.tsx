import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { TrustNotice } from "@/components/site/TrustNotice";
import { STEPS } from "@/lib/process";
import { FAQS } from "@/lib/business";
import { locationLabel, locationDetail } from "@/lib/inventory";
import { seo } from "@/lib/seo";
import { Route as RootRoute } from "./__root";

export const Route = createFileRoute("/how-importing-works")({
  head: () =>
    seo({
      title: "How Importing Works — Canon Motors",
      description:
        "How buying a Japanese import from Canon Motors works: choosing a vehicle, quotations, payment and financing, shipping to Mombasa, clearance and collection.",
      path: "/how-importing-works",
    }),
  component: HowItWorks,
});

const COSTS = [
  ["Vehicle price", "The price of the vehicle itself."],
  ["Freight & insurance", "Shipping the vehicle from Japan to Mombasa."],
  ["Import duty & taxes", "Kenyan duties and taxes charged on imported vehicles."],
  ["Port & clearance charges", "Handling, storage and clearing at the port."],
  ["Registration", "Registering the vehicle in Kenya."],
  ["Other fees", "For example inspection of commercial vehicles and logbook transfer fees."],
];

function HowItWorks() {
  const s = RootRoute.useLoaderData();
  const priceFaq = FAQS.find((f) => f.q.startsWith("What does a quoted price"));
  return (
    <>
      <PageHeader
        title="How Importing Works"
        eyebrow="Buying with Canon Motors"
        crumbs={[{ label: "How Importing Works" }]}
      >
        A plain-English overview of buying a vehicle with us. Costs and timelines depend on the
        vehicle, so we always give you an individual quotation.
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Step by step</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((st, i) => (
              <li key={st.t} className="flex gap-5 rounded-lg border bg-card p-5 md:p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-accent-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{st.t}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{st.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-14 text-2xl font-extrabold">What the stock locations mean</h2>
          <p className="mt-2 text-muted-foreground">
            Every listing shows where the vehicle is. A listed vehicle is not automatically
            available for immediate collection.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {s.locations.map(({ value }) => (
              <div key={value} className="rounded-lg border bg-card p-5">
                <dt className="flex items-center gap-2 font-bold">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden /> {locationLabel(value)}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {locationDetail(value)}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-14 text-2xl font-extrabold">Understanding the cost of an import</h2>
          <p className="mt-2 text-muted-foreground">
            Importing a vehicle involves more than its purchase price. These are the typical
            components — your quotation should make clear which are included.
          </p>
          <div className="mt-6 overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Typical components of an imported vehicle's cost
              </caption>
              <tbody>
                {COSTS.map(([k, d]) => (
                  <tr key={k} className="border-b last:border-0">
                    <th
                      scope="row"
                      className="w-2/5 px-4 py-3 text-left align-top font-semibold sm:w-1/3"
                    >
                      {k}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {priceFaq && (
            <p className="mt-4 rounded-lg border bg-secondary/60 p-4 text-sm leading-relaxed">
              {priceFaq.a}
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            We don't publish a landed-cost calculator, because duties and charges depend on the
            specific vehicle and change over time.
          </p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="font-extrabold">Ready for a quotation?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send us the reference of the vehicle you like, or describe what you're looking for.
            </p>
            <div className="mt-5 grid gap-2">
              <Button asChild>
                <Link to="/contact" hash="enquire">
                  Request a quotation
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/vehicles">Browse vehicles</Link>
              </Button>
            </div>
          </div>
          <TrustNotice />
        </aside>
      </div>
    </>
  );
}
