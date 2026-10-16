import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Ship, FileCheck2, MessagesSquare, Car, MapPin } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/VehicleCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { STEPS } from "@/components/site/PageHeader";
import { vehicles, makes, bodyTypes, uniq } from "@/lib/inventory";
import { BUSINESS, whatsappLink } from "@/lib/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Canon Motors — Quality Japanese Vehicle Imports in Mombasa, Kenya" },
      { name: "description", content: "Browse used Japanese SUVs, wagons, hatchbacks and vans from Canon Motors. Stock in Japan and in transit to Mombasa." },
      { property: "og:title", content: "Canon Motors — Japanese Vehicle Imports" },
      { property: "og:description", content: "Quality used Japanese vehicles, imported to Mombasa, Kenya." },
    ],
  }),
  component: Home,
});

const sel = "h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary";

function Home() {
  const nav = useNavigate();
  const [s, setS] = useState({ make: "", body: "", fuel: "", loc: "", minYear: "" });
  const featured = [...vehicles].sort((a, b) => b.id - a.id).slice(0, 8);
  const years = (uniq(vehicles.map((v) => v.year)) as number[]).sort((a, b) => b - a);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-graphite">
        <img src={hero} alt="Japanese vehicles lined up at a port terminal" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow !text-graphite-foreground/80">Mombasa · Japan</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.08] text-graphite-foreground md:text-5xl">
            Quality Japanese vehicles, imported with care.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-graphite-foreground/80">
            Browse {vehicles.length}+ listed vehicles — SUVs, wagons, hatchbacks, vans and more — in stock in Japan or already on their way to Mombasa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/vehicles">Browse vehicles</Link></Button>
            <Button asChild size="lg" variant="onDark"><a href={whatsappLink("Hello Canon Motors, I'd like help finding a vehicle.")} target="_blank" rel="noopener">Chat on WhatsApp</a></Button>
          </div>
        </div>
      </section>

      <section className="container-page relative z-10 -mt-10">
        <form
          className="grid gap-3 rounded-xl border bg-card p-4 shadow-lift sm:grid-cols-2 lg:grid-cols-6"
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/vehicles", search: { make: s.make || undefined, body: s.body || undefined, fuel: s.fuel || undefined, loc: s.loc || undefined, minYear: s.minYear ? Number(s.minYear) : undefined } });
          }}
        >
          <select aria-label="Make" className={sel} value={s.make} onChange={(e) => setS({ ...s, make: e.target.value })}>
            <option value="">Any make</option>
            {makes().map(([m]) => <option key={m}>{m}</option>)}
          </select>
          <select aria-label="Body type" className={sel} value={s.body} onChange={(e) => setS({ ...s, body: e.target.value })}>
            <option value="">Any body type</option>
            {bodyTypes().map(([b]) => <option key={b}>{b}</option>)}
          </select>
          <select aria-label="Fuel" className={sel} value={s.fuel} onChange={(e) => setS({ ...s, fuel: e.target.value })}>
            <option value="">Any fuel</option>
            {uniq(vehicles.map((v) => v.fuel)).map((f) => <option key={f}>{f}</option>)}
          </select>
          <select aria-label="Minimum year" className={sel} value={s.minYear} onChange={(e) => setS({ ...s, minYear: e.target.value })}>
            <option value="">Any year</option>
            {years.map((y) => <option key={y} value={y}>From {y}</option>)}
          </select>
          <select aria-label="Location" className={sel} value={s.loc} onChange={(e) => setS({ ...s, loc: e.target.value })}>
            <option value="">Any location</option>
            <option value="Japan">In Japan</option>
            <option value="On Way">In transit</option>
          </select>
          <Button type="submit" size="lg" className="h-11"><Search /> Search</Button>
        </form>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Latest arrivals</p>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Recently added vehicles</h2>
          </div>
          <Link to="/vehicles" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>
      </section>

      <section className="border-y bg-secondary/60">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Browse by type</p>
            <h2 className="mt-1 text-2xl font-extrabold">Vehicle categories</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {bodyTypes().map(([b, n]) => (
                <Link key={b} to="/vehicles" search={{ body: b }} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">
                  <span className="flex items-center gap-2"><Car className="h-4 w-4 text-muted-foreground" />{b}</span>
                  <span className="text-xs text-muted-foreground">{n}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Browse by make</p>
            <h2 className="mt-1 text-2xl font-extrabold">Popular makes</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {makes().map(([m, n]) => (
                <Link key={m} to="/vehicles" search={{ make: m }} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">
                  {m}<span className="text-xs text-muted-foreground">{n}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-graphite text-graphite-foreground">
        <div className="container-page py-16">
          <p className="eyebrow">Why Canon Motors</p>
          <h2 className="mt-1 max-w-xl text-2xl font-extrabold md:text-3xl">A dependable partner from Japan to Mombasa</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Car, t: "Japanese imports", d: "Right-hand drive vehicles sourced from Japan, each with chassis number and grade listed." },
              { i: MessagesSquare, t: "Help choosing", d: "Talk to our team by WhatsApp, phone or e-mail about the right vehicle for you." },
              { i: FileCheck2, t: "Clear documentation", d: "Every vehicle carries a stock reference so you always know exactly what you are buying." },
              { i: Ship, t: "Shipping guidance", d: "We keep you informed while your vehicle is in transit to Mombasa port." },
            ].map(({ i: I, t, d }) => (
              <div key={t}>
                <I className="h-6 w-6 text-graphite-foreground" />
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-1 text-sm text-graphite-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">How importing works</p>
        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Five clear steps</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-lg border bg-card p-5">
              <span className="text-sm font-extrabold text-primary">0{i + 1}</span>
              <h3 className="mt-2 font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
        <Link to="/how-importing-works" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">Learn more →</Link>
      </section>

      <section className="border-t bg-secondary/60">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">Looking for a specific vehicle?</h2>
            <p className="mt-3 max-w-md text-muted-foreground">Tell us what you need and our team will get back to you.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary" />{BUSINESS.address.slice(1).join(", ")}</li>
              <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Only pay against invoices confirmed via canonmotors.com contacts.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-card"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}
