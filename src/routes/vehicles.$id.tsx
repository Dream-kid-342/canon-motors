import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { VehicleCard } from "@/components/site/VehicleCard";
import { getVehicle, vehicles, vehicleName, fmtKm, fmtCc, locationLabel, SNAPSHOT_NOTE } from "@/lib/inventory";
import { BUSINESS, whatsappLink } from "@/lib/business";

export const Route = createFileRoute("/vehicles/$id")({
  loader: ({ params }) => {
    const v = getVehicle(Number(params.id));
    if (!v) throw notFound();
    return v;
  },
  head: ({ loaderData: v }) => ({
    meta: v
      ? [
          { title: `${v.year ?? ""} ${vehicleName(v)} (${v.stockNo}) — Canon Motors` },
          { name: "description", content: `${v.year ?? ""} ${vehicleName(v)} ${v.grade ?? ""}, ${fmtKm(v.mileageKm)}, ${v.fuel}, ${v.transmission}.` },
          { property: "og:title", content: `${vehicleName(v)} — Canon Motors` },
          { property: "og:description", content: `Ref ${v.stockNo}. ${locationLabel(v.location)}.` },
          { property: "og:image", content: v.image },
          { name: "twitter:image", content: v.image },
        ]
      : [{ title: "Vehicle unavailable — Canon Motors" }, { name: "robots", content: "noindex" }],
  }),
  component: Detail,
});

function Detail() {
  const v = Route.useLoaderData();
  const name = `${v.year ?? ""} ${vehicleName(v)} (Ref ${v.stockNo})`;
  const related = vehicles.filter((x) => x.id !== v.id && (x.bodyType === v.bodyType || x.make === v.make)).slice(0, 4);
  const specs: [string, string][] = [
    ["Reference", v.stockNo], ["Chassis", v.chassis], ["Grade", v.grade ?? "—"], ["Body type", v.bodyType],
    ["Reg. year/month", v.year ? `${v.year}${v.month ? ` / ${v.month}` : ""}` : "—"], ["Mileage", fmtKm(v.mileageKm)],
    ["Engine", fmtCc(v.engineCc)], ["Fuel", v.fuel], ["Transmission", v.transmission], ["Steering", v.steering],
    ["Colour", v.color], ["Doors", String(v.doors)], ["Seats", String(v.seats)], ["Location", locationLabel(v.location)],
  ];
  return (
    <div className="container-page py-8">
      <nav className="text-xs text-muted-foreground"><Link to="/vehicles" className="hover:text-foreground">← Back to results</Link></nav>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <img src={v.image} alt={name} width={800} height={600} className="aspect-[4/3] w-full rounded-lg border object-cover" />
          <a href={v.sourceUrl} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-primary hover:underline">See all photos on canonmotors.com →</a>
        </div>
        <div>
          <p className="eyebrow">{locationLabel(v.location)}</p>
          <h1 className="mt-1 text-3xl font-extrabold">{vehicleName(v)}</h1>
          {v.grade && <p className="text-muted-foreground">{v.grade}</p>}
          <p className="mt-4 text-xl font-bold">Price on request</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="whatsapp" size="lg"><a href={whatsappLink(`Hello Canon Motors, I'm interested in ${name}`)} target="_blank" rel="noopener"><MessageCircle /> WhatsApp</a></Button>
            <Button asChild variant="outline" size="lg"><a href={BUSINESS.phoneHref}><Phone /> Call</a></Button>
          </div>
          <dl className="mt-6 divide-y rounded-lg border bg-card text-sm">
            {specs.map(([k, val]) => <div key={k} className="flex justify-between px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{val}</dd></div>)}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{SNAPSHOT_NOTE}</p>
        </div>
      </div>
      <section className="mt-12 rounded-xl border bg-card p-6"><h2 className="mb-4 text-xl font-extrabold">Enquire about this vehicle</h2><EnquiryForm vehicle={name} /></section>
      {related.length > 0 && (
        <section className="mt-12"><h2 className="text-xl font-extrabold">Similar vehicles</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <VehicleCard key={r.id} v={r} />)}</div></section>
      )}
    </div>
  );
}
