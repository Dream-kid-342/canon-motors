import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Logo } from "./SiteHeader";
import { BUSINESS, addressLines } from "@/lib/business";
import type { Facet } from "@/lib/inventory";

const linkCls = "hover:text-graphite-foreground hover:underline underline-offset-2";

export function SiteFooter({ makes, bodyTypes }: { makes: Facet; bodyTypes: Facet }) {
  return (
    <footer className="bg-graphite text-graphite-muted">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Established in {BUSINESS.established}, Canon Motors imports used and new vehicles from
            Japan, with its head office in Mombasa, Kenya.
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic">
            <div className="font-semibold text-graphite-foreground">{BUSINESS.name}</div>
            {addressLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div className="pt-2">
              <a className={`text-graphite-foreground ${linkCls}`} href={BUSINESS.phoneHref}>
                {BUSINESS.phoneDisplay}
              </a>
            </div>
            <div>
              <a
                className={`text-graphite-foreground ${linkCls}`}
                href={`mailto:${BUSINESS.email}`}
              >
                {BUSINESS.email}
              </a>
            </div>
          </address>
        </div>
        <FooterCol title="Popular makes">
          {makes.slice(0, 6).map(({ value }) => (
            <li key={value}>
              <Link to="/vehicles" search={{ make: value }} className={linkCls}>
                {value}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/makes" className={`font-semibold text-graphite-foreground ${linkCls}`}>
              All makes
            </Link>
          </li>
        </FooterCol>
        <FooterCol title="Categories">
          {bodyTypes.slice(0, 6).map(({ value }) => (
            <li key={value}>
              <Link to="/vehicles" search={{ body: value }} className={linkCls}>
                {value}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/categories" className={`font-semibold text-graphite-foreground ${linkCls}`}>
              All categories
            </Link>
          </li>
        </FooterCol>
        <FooterCol title="Company">
          <li>
            <Link to="/vehicles" className={linkCls}>
              Vehicle inventory
            </Link>
          </li>
          <li>
            <Link to="/about" className={linkCls}>
              About us
            </Link>
          </li>
          <li>
            <Link to="/how-importing-works" className={linkCls}>
              How importing works
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkCls}>
              Contact & FAQs
            </Link>
          </li>
          <li>
            <Link to="/favourites" className={linkCls}>
              Saved vehicles
            </Link>
          </li>
          <li>
            <Link to="/compare" className={linkCls}>
              Compare vehicles
            </Link>
          </li>
        </FooterCol>
      </div>
      <div className="container-page">
        <Link
          to="/contact"
          hash="payment-safety"
          className="flex items-start gap-2 rounded-lg border border-graphite-foreground/10 p-4 text-sm hover:border-graphite-foreground/25"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
          <span>
            <span className="font-semibold text-graphite-foreground">Payment safety:</span> our only
            website is canonmotors.com. Always confirm with us through the official contacts before
            making any payment.
          </span>
        </Link>
      </div>
      <div className="mt-10 border-t border-graphite-foreground/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name} All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link to="/privacy" className={linkCls}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={linkCls}>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-graphite-foreground">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">{children}</ul>
    </div>
  );
}
