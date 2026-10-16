import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Globe2, Images, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { TrustNotice } from "@/components/site/TrustNotice";
import { BUSINESS, addressLines } from "@/lib/business";
import { locationLabel } from "@/lib/inventory";
import { seo } from "@/lib/seo";
import { Route as RootRoute } from "./__root";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About Canon Motors — Japanese Vehicle Importer Since 2005",
      description:
        "Established in 2005, Canon Motors imports used and new vehicles from Japan, with its head office on Moi Avenue, Mombasa, Kenya.",
      path: "/about",
    }),
  component: About,
});

function About() {
  const s = RootRoute.useLoaderData();
  return (
    <>
      <PageHeader
        title="About Canon Motors"
        eyebrow={`Established ${BUSINESS.established}`}
        crumbs={[{ label: "About Us" }]}
      >
        A Mombasa-based importer of Japanese vehicles, serving buyers in Kenya and abroad.
      </PageHeader>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-[17px] leading-relaxed text-muted-foreground">
          <h2 className="text-2xl font-extrabold text-foreground">Who we are</h2>
          <p>
            Established in {BUSINESS.established},{" "}
            <strong className="text-foreground">Canon Motors</strong> is an importer of used and new
            vehicles, with its head office in the heart of Mombasa, Kenya.
          </p>
          <p>
            Our inventory covers everyday hatchbacks and station wagons, family SUVs and mini vans,
            and working vehicles such as vans, pickups, trucks and buses — from manufacturers
            including{" "}
            {s.makes
              .slice(0, 6)
              .map((m) => m.value)
              .join(", ")}
            .
          </p>
          <p>
            Every listing carries a stock reference, chassis number and grade, together with a set
            of photographs, so you know exactly which vehicle you are asking about. Each vehicle
            also shows its current stock location (
            {s.locations.map((l) => locationLabel(l.value).toLowerCase()).join(" or ")}).
          </p>

          <h2 className="pt-4 text-2xl font-extrabold text-foreground">What we offer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                i: Globe2,
                t: "Japanese vehicle imports",
                d: "Right-hand-drive vehicles sourced in Japan and shipped to Mombasa.",
              },
              {
                i: Images,
                t: "Detailed photographs",
                d: "Multiple photos per vehicle, and more on request, to help you decide.",
              },
              {
                i: Landmark,
                t: "Flexible payment",
                d: "Hire purchase with a deposit and monthly instalments, or financing from reputable institutions.",
              },
              {
                i: Building2,
                t: "A Mombasa office",
                d: "Speak to our team in person, by phone, WhatsApp or e-mail.",
              },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="rounded-lg border bg-card p-5">
                <I className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-base font-bold text-foreground">{t}</h3>
                <p className="mt-1 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="font-extrabold">Visit or contact us</h2>
            <address className="mt-3 space-y-1 text-sm not-italic text-muted-foreground">
              <div className="font-semibold text-foreground">{BUSINESS.name}</div>
              {addressLines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </address>
            <dl className="mt-4 space-y-1 text-sm">
              {BUSINESS.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="text-right font-medium">{h.time}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 grid gap-2">
              <Button asChild>
                <Link to="/contact" hash="enquire">
                  Send an enquiry
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
              </Button>
            </div>
          </div>
          <TrustNotice />
        </aside>
      </div>
    </>
  );
}
