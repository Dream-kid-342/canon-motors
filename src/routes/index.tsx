import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Clock,
  MessagesSquare,
  Car,
  Images,
  Landmark,
  ArrowRight,
  Phone,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/VehicleCard";
import { VehicleImage } from "@/components/site/VehicleImage";
import { SectionHeading } from "@/components/site/Section";
import { JsonLd } from "@/components/site/PageHeader";
import { STEPS } from "@/lib/process";
import { selectCls } from "@/components/site/InventoryControls";
import { locationLabel } from "@/lib/inventory";
import { BUSINESS, SITE_URL, addressLines } from "@/lib/business";
import { seo } from "@/lib/seo";
import { Route as RootRoute } from "./__root";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Canon Motors — Japanese Vehicle Imports in Mombasa, Kenya",
      description:
        "Browse Japanese import SUVs, wagons, hatchbacks, vans and more from Canon Motors, established 2005 with its head office in Mombasa. Enquire by WhatsApp, phone or e-mail.",
      path: "/",
    }),
  component: Home,
});

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: BUSINESS.name,
  url: SITE_URL,
  telephone: "+254110096963",
  email: BUSINESS.email,
  foundingDate: String(BUSINESS.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    postOfficeBoxNumber: BUSINESS.postal,
    addressLocality: "Mombasa",
    addressCountry: "KE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:30",
      closes: "19:00",
    },
  ],
};

function Home() {
  const s = RootRoute.useLoaderData();
  const nav = useNavigate();
  const [q, setQ] = useState({ make: "", model: "", body: "", minYear: "", loc: "" });
  const models = q.make ? (s.modelsByMake[q.make] ?? []) : [];

  return (
    <>
      <JsonLd data={orgJsonLd} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-graphite">
        <img
          src={hero}
          alt=""
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-page pb-28 pt-16 md:pb-36 md:pt-24">
          <p className="eyebrow !text-graphite-foreground/80">
            Japanese vehicle imports · Since {BUSINESS.established}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.08] text-graphite-foreground md:text-[56px]">
            Find your next vehicle with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite-foreground/85">
            Explore Japanese vehicles with Canon Motors and get professional assistance throughout
            your vehicle-buying journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/vehicles">
                Browse vehicles <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link to="/contact" hash="enquire">
                Talk to our team
              </Link>
            </Button>
          </div>
        </div>
        <span className="absolute right-3 top-2 text-[10px] text-graphite-foreground/60">
          Illustrative image
        </span>
      </section>

      {/* Search panel */}
      <section
        className="container-page relative z-10 -mt-16 md:-mt-20"
        aria-labelledby="quick-search"
      >
        <form
          className="rounded-xl border bg-card p-5 shadow-lift md:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            nav({
              to: "/vehicles",
              search: {
                make: q.make || undefined,
                model: q.model || undefined,
                body: q.body || undefined,
                loc: q.loc || undefined,
                minYear: q.minYear ? Number(q.minYear) : undefined,
              },
            });
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="quick-search" className="text-lg font-extrabold">
              Search the inventory
            </h2>
            <p className="text-sm text-muted-foreground">{s.total} vehicles listed</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
            <label className="text-sm font-medium">
              Make
              <select
                className={selectCls}
                value={q.make}
                onChange={(e) => setQ({ ...q, make: e.target.value, model: "" })}
              >
                <option value="">Any make</option>
                {s.makes.map(({ value, count }) => (
                  <option key={value} value={value}>
                    {value} ({count})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Model
              <select
                className={selectCls}
                value={q.model}
                onChange={(e) => setQ({ ...q, model: e.target.value })}
                disabled={!q.make}
              >
                <option value="">{q.make ? "Any model" : "Choose a make first"}</option>
                {models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Body type
              <select
                className={selectCls}
                value={q.body}
                onChange={(e) => setQ({ ...q, body: e.target.value })}
              >
                <option value="">Any body type</option>
                {s.bodyTypes.map(({ value }) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Registered from
              <select
                className={selectCls}
                value={q.minYear}
                onChange={(e) => setQ({ ...q, minYear: e.target.value })}
              >
                <option value="">Any year</option>
                {s.years.map((y) => (
                  <option key={y} value={y}>
                    {y} or newer
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Stock location
              <select
                className={selectCls}
                value={q.loc}
                onChange={(e) => setQ({ ...q, loc: e.target.value })}
              >
                <option value="">Any location</option>
                {s.locations.map(({ value }) => (
                  <option key={value} value={value}>
                    {locationLabel(value)}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" size="lg" className="h-10 self-end lg:px-6">
              <Search /> Search
            </Button>
          </div>
        </form>
      </section>

      {/* Latest vehicles */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Latest listings"
          title="Recently added vehicles"
          action={{ label: "View all vehicles", to: "/vehicles" }}
        >
          Real listings with full photo sets, references and specifications.
        </SectionHeading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.featured.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-secondary/60">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            eyebrow="Browse by type"
            title="Vehicle categories"
            action={{ label: "All categories", to: "/categories" }}
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {s.bodyTypes.map((b) => (
              <Link
                key={b.value}
                to="/vehicles"
                search={{ body: b.value }}
                className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lift"
              >
                <div className="overflow-hidden">
                  <VehicleImage
                    src={b.image}
                    alt=""
                    sizes="(min-width: 1024px) 240px, 50vw"
                    className="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="font-bold group-hover:text-primary">{b.value}</span>
                  <span className="text-xs text-muted-foreground">{b.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Makes */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Browse by make"
          title="Find your manufacturer"
          action={{ label: "All makes", to: "/makes" }}
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {s.makes.map(({ value, count }) => (
            <Link
              key={value}
              to="/vehicles"
              search={{ make: value }}
              className="flex items-center justify-between rounded-lg border bg-card px-4 py-4 font-bold transition-colors hover:border-primary hover:text-primary"
            >
              {value}
              <span className="text-sm font-medium text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Canon Motors */}
      <section className="bg-graphite text-graphite-foreground">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            dark
            eyebrow="Why Canon Motors"
            title="An established importer of Japanese vehicles"
          >
            Established in {BUSINESS.established}, Canon Motors imports used and new vehicles, with
            its head office in the heart of Mombasa.
          </SectionHeading>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                i: Car,
                t: "Japanese imports since 2005",
                d: "Right-hand-drive vehicles from Japan, each listed with its stock reference, chassis number and grade.",
              },
              {
                i: Images,
                t: "Detailed photographs",
                d: "Most listings carry 10 or more photos. Ask us for any other view or detail before you decide.",
              },
              {
                i: Landmark,
                t: "Hire purchase & financing",
                d: "Hire purchase with a deposit and monthly instalments, or financing from reputable institutions.",
              },
              {
                i: MessagesSquare,
                t: "Direct communication",
                d: "Talk to our Mombasa team by phone, WhatsApp or e-mail from enquiry through to collection.",
              },
            ].map(({ i: I, t, d }) => (
              <div key={t}>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-graphite-foreground/10">
                  <I className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="How importing works"
          title="From listing to collection"
          action={{ label: "Full process", to: "/how-importing-works" }}
        >
          Every vehicle shows where it is right now — in Japan, on the way, at port or in Mombasa —
          so you know what to expect.
        </SectionHeading>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((st, i) => (
            <li key={st.t} className="rounded-lg border bg-card p-5">
              <span className="text-sm font-extrabold text-primary">0{i + 1}</span>
              <h3 className="mt-2 font-bold">{st.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{st.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="grid gap-8 overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">Found a vehicle you like?</h2>
            <p className="mt-3 max-w-lg text-primary-foreground/85">
              Speak with our team for availability, vehicle details and the next steps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link to="/contact" hash="enquire">
                  Enquire about a vehicle
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="onDark"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href={BUSINESS.phoneHref}>
                  <Phone /> {BUSINESS.phoneDisplay}
                </a>
              </Button>
            </div>
          </div>
          <address className="self-end space-y-1 text-sm not-italic text-primary-foreground/85">
            <div className="font-semibold text-primary-foreground">{BUSINESS.name}</div>
            {addressLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div>
              <a href={`mailto:${BUSINESS.email}`} className="underline-offset-2 hover:underline">
                {BUSINESS.email}
              </a>
            </div>
            <div className="pt-2 text-xs">
              <Clock className="mr-1 inline h-3.5 w-3.5" aria-hidden />
              Mon–Fri 8:30–18:00 · Sat 8:30–19:00
            </div>
          </address>
        </div>
      </section>
    </>
  );
}
