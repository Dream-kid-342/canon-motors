import { createFileRoute, Link, notFound, useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Heart,
  GitCompareArrows,
  Info,
  Mail,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { VehicleCard } from "@/components/site/VehicleCard";
import { VehicleGallery } from "@/components/site/VehicleGallery";
import { Breadcrumbs, breadcrumbJsonLd, JsonLd } from "@/components/site/PageHeader";
import { getVehicleDetail } from "@/lib/inventory.functions";
import {
  type Vehicle,
  vehicleName,
  vehicleTitle,
  fmtKm,
  fmtCc,
  fmtReg,
  fmtNum,
  locationLabel,
  locationDetail,
  NOT_PROVIDED,
  SNAPSHOT_NOTE,
} from "@/lib/inventory";
import { BUSINESS, SITE_URL, whatsappLink, mailtoLink } from "@/lib/business";
import { useCompare, useFavourites, COMPARE_MAX } from "@/lib/favourites";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicles/$id")({
  loader: async ({ params }) => {
    if (!/^\d+$/.test(params.id)) throw notFound();
    const res = await getVehicleDetail({ data: Number(params.id) });
    if (!res) throw notFound();
    return res;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Vehicle not found — Canon Motors" },
          { name: "robots", content: "noindex" },
        ],
      };
    const v = loaderData.vehicle;
    const facts = [
      v.grade,
      v.year && `${v.year} registration`,
      v.mileageKm != null && fmtKm(v.mileageKm),
      v.engineCc && fmtCc(v.engineCc),
      v.fuel,
      v.transmission,
    ]
      .filter(Boolean)
      .join(", ");
    return seo({
      title: `${vehicleTitle(v)} (Ref ${v.stockNo}) — Canon Motors`,
      description: `${vehicleTitle(v)} ${v.bodyType}: ${facts}. ${locationLabel(v.location)}. Enquire with Canon Motors, Mombasa.`,
      path: `/vehicles/${params.id}`,
      image: v.image,
    });
  },
  notFoundComponent: VehicleNotFound,
  component: Detail,
});

/** schema.org Car built only from listed facts — no price, offer or condition is invented. */
function carJsonLd(v: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleTitle(v),
    url: `${SITE_URL}/vehicles/${v.id}`,
    sku: v.stockNo,
    image: v.images.slice(0, 6),
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    ...(v.grade ? { vehicleConfiguration: v.grade } : {}),
    bodyType: v.bodyType,
    fuelType: v.fuel,
    vehicleTransmission: v.transmission,
    steeringPosition:
      v.steering === "Right Hand" ? "https://schema.org/RightHandDriving" : undefined,
    ...(v.color ? { color: v.color } : {}),
    ...(v.doors != null ? { numberOfDoors: v.doors } : {}),
    ...(v.seats != null ? { seatingCapacity: v.seats } : {}),
    ...(v.year
      ? {
          dateVehicleFirstRegistered: v.month
            ? `${v.year}-${String(v.month).padStart(2, "0")}`
            : String(v.year),
        }
      : {}),
    ...(v.mileageKm != null
      ? {
          mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: v.mileageKm,
            unitCode: "KMT",
          },
        }
      : {}),
    ...(v.engineCc != null
      ? {
          vehicleEngine: {
            "@type": "EngineSpecification",
            engineDisplacement: {
              "@type": "QuantitativeValue",
              value: v.engineCc,
              unitCode: "CMQ",
            },
          },
        }
      : {}),
  };
}

/** Japanese chassis numbers are "<model code>-<serial>"; show the model code separately for readability. */
const modelCode = (chassis: string) =>
  /^[A-Z0-9]+-\d+$/i.test(chassis) ? chassis.split("-")[0] : null;

function Detail() {
  const { vehicle: v, related } = Route.useLoaderData();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const fav = useFavourites();
  const cmp = useCompare();
  const title = vehicleTitle(v);
  const url = `${SITE_URL}/vehicles/${v.id}`;
  const enquiryVehicle = { title, stockNo: v.stockNo, url };
  const waText = `Hello Canon Motors, I'm interested in the ${title} (Ref ${v.stockNo}). ${url}`;
  const crumbs = [
    { label: "Browse Vehicles", to: "/vehicles" },
    { label: v.make, to: "/vehicles", search: { make: v.make } },
    { label: `${vehicleName(v)} · ${v.stockNo}` },
  ];

  const specs: [string, string][] = [
    ["Reference", v.stockNo],
    ["Make", v.make],
    ["Model", v.model],
    ["Grade / variant", v.grade ?? NOT_PROVIDED],
    ["Body type", v.bodyType],
    ["Registration year/month", fmtReg(v)],
    ["Mileage", fmtKm(v.mileageKm)],
    ["Engine capacity", fmtCc(v.engineCc)],
    ["Fuel", v.fuel],
    ["Transmission", v.transmission],
    ["Steering", v.steering],
    ["Colour", v.color ?? NOT_PROVIDED],
    ["Doors", fmtNum(v.doors)],
    ["Seats", fmtNum(v.seats)],
    ["Chassis number", v.chassis],
    ...(modelCode(v.chassis) ? [["Model code", modelCode(v.chassis)!] as [string, string]] : []),
    ["Stock location", locationLabel(v.location)],
  ];

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Link copied");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <JsonLd data={carJsonLd(v)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container-page py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs items={crumbs} />
          {canGoBack ? (
            <button
              type="button"
              onClick={() => router.history.back()}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to results
            </button>
          ) : (
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All vehicles
            </Link>
          )}
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <VehicleGallery images={v.images} title={title} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {locationLabel(v.location)}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-[34px]">
              {vehicleName(v)}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {[v.grade, v.year ? `Reg. ${fmtReg(v)}` : null].filter(Boolean).join(" · ") ||
                v.bodyType}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ref <span className="font-semibold text-foreground">{v.stockNo}</span>
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
              {[
                ["Mileage", fmtKm(v.mileageKm)],
                ["Engine", fmtCc(v.engineCc)],
                ["Fuel", v.fuel],
                ["Gearbox", v.transmission],
                ["Seats", fmtNum(v.seats)],
                ["Body", v.bodyType],
              ].map(([k, val]) => (
                <div key={k} className="bg-card px-3 py-2.5">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
                  <dd
                    className={cn(
                      "text-sm font-semibold",
                      val === NOT_PROVIDED && "font-normal text-muted-foreground",
                    )}
                  >
                    {val}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-lg border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Price</p>
              <p className="text-xl font-extrabold">Price on request</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask for a written quotation and confirm exactly what it includes before paying.
              </p>
              <div className="mt-4 grid gap-2">
                <Button asChild size="lg">
                  <a href="#enquire">
                    <Mail /> Enquire about this vehicle
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="whatsapp" size="lg">
                    <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={BUSINESS.phoneHref}>
                      <Phone /> Call
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={fav.has(v.id)}
                onClick={() => fav.toggle(v.id)}
              >
                <Heart className={cn(fav.has(v.id) && "fill-primary text-primary")} />{" "}
                {fav.has(v.id) ? "Saved" : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={cmp.has(v.id)}
                onClick={() => {
                  if (!cmp.toggle(v.id)) toast(`You can compare up to ${COMPARE_MAX} vehicles`);
                }}
              >
                <GitCompareArrows className={cn(cmp.has(v.id) && "text-primary")} />{" "}
                {cmp.has(v.id) ? "In comparison" : "Compare"}
              </Button>
              {cmp.ids.length > 1 && cmp.has(v.id) && (
                <Button asChild variant="link" size="sm">
                  <Link to="/compare">View comparison ({cmp.ids.length})</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={share}>
                <Share2 /> Share
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <section aria-labelledby="specs">
            <h2 id="specs" className="text-xl font-extrabold">
              Full specifications
            </h2>
            <dl className="mt-4 grid overflow-hidden rounded-lg border bg-card text-sm sm:grid-cols-2">
              {specs.map(([k, val]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b px-4 py-3 sm:[&:nth-last-child(-n+2)]:border-b-0 last:border-b-0"
                >
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd
                    className={cn(
                      "text-right font-medium",
                      val === NOT_PROVIDED && "font-normal text-muted-foreground",
                    )}
                  >
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Specifications are as listed by Canon Motors. "Not provided" means the listing does
              not state a value — ask our team for details. {SNAPSHOT_NOTE}
            </p>
          </section>

          <section aria-labelledby="availability" className="space-y-4">
            <h2 id="availability" className="text-xl font-extrabold">
              Availability & importing
            </h2>
            <div className="flex gap-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p>{locationDetail(v.location)}</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Quote the reference <strong className="text-foreground">{v.stockNo}</strong> in
                every message.
              </li>
              <li>
                • Hire purchase and financing from reputable institutions are accepted — ask for
                terms.
              </li>
              <li>• Only pay against invoices confirmed through our official contacts.</li>
            </ul>
            <Link
              to="/how-importing-works"
              className="inline-block text-sm font-semibold text-primary hover:underline"
            >
              How buying and importing works →
            </Link>
          </section>
        </div>

        <section
          id="enquire"
          aria-labelledby="enquire-title"
          className="mt-12 scroll-mt-24 rounded-xl border bg-card p-5 shadow-card md:p-8"
        >
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="enquire-title" className="text-2xl font-extrabold">
                Enquire about this vehicle
              </h2>
              <p className="mt-2 text-muted-foreground">
                Ask about price, availability, condition, shipping or financing. Your message will
                include the vehicle reference automatically.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li>
                  <a
                    className="inline-flex items-center gap-2 font-semibold hover:text-primary"
                    href={BUSINESS.phoneHref}
                  >
                    <Phone className="h-4 w-4 text-primary" /> {BUSINESS.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-2 font-semibold hover:text-primary"
                    href={mailtoLink(`Enquiry: ${title} (Ref ${v.stockNo})`, waText)}
                  >
                    <Mail className="h-4 w-4 text-primary" /> {BUSINESS.email}
                  </a>
                </li>
              </ul>
            </div>
            <EnquiryForm vehicle={enquiryVehicle} />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-14" aria-labelledby="related">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related" className="text-xl font-extrabold">
                Similar vehicles
              </h2>
              <Link
                to="/vehicles"
                search={{ body: v.bodyType }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                More {v.bodyType}s →
              </Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <VehicleCard key={r.id} v={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function VehicleNotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="eyebrow">Vehicle unavailable</p>
      <h1 className="mt-2 text-3xl font-extrabold">This vehicle is no longer listed</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        It may have been sold or removed. Browse similar vehicles, or contact us — we may be able to
        find a match.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/vehicles">Browse vehicles</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact" hash="enquire">
            Contact us
          </Link>
        </Button>
      </div>
    </div>
  );
}
