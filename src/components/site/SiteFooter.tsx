import { Link } from "@tanstack/react-router";
import { Logo } from "./SiteHeader";
import { BUSINESS } from "@/lib/business";
import { makes, bodyTypes } from "@/lib/inventory";

export function SiteFooter() {
  return (
    <footer className="bg-graphite text-graphite-muted">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Importer of quality used Japanese vehicles, serving buyers in Kenya and abroad from Mombasa.
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic">
            {BUSINESS.address.map((l) => <div key={l}>{l}</div>)}
            <div className="pt-2"><a className="text-graphite-foreground hover:underline" href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></div>
            <div><a className="text-graphite-foreground hover:underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div>
          </address>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-graphite-foreground">Popular makes</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {makes().slice(0, 6).map(([m]) => (
              <li key={m}><Link to="/vehicles" search={{ make: m }} className="hover:text-graphite-foreground">{m}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-graphite-foreground">Categories</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {bodyTypes().slice(0, 6).map(([b]) => (
              <li key={b}><Link to="/vehicles" search={{ body: b }} className="hover:text-graphite-foreground">{b}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-graphite-foreground">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/vehicles" className="hover:text-graphite-foreground">Vehicle inventory</Link></li>
            <li><Link to="/about" className="hover:text-graphite-foreground">About us</Link></li>
            <li><Link to="/how-importing-works" className="hover:text-graphite-foreground">How importing works</Link></li>
            <li><Link to="/contact" className="hover:text-graphite-foreground">Contact</Link></li>
            <li><Link to="/favourites" className="hover:text-graphite-foreground">Favourites</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-graphite-foreground/10">
        <div className="container-page py-5 text-xs">© {new Date().getFullYear()} CANON MOTORS. All rights reserved.</div>
      </div>
    </footer>
  );
}
