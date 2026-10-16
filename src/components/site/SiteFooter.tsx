import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Logo } from "./SiteHeader";
import { BUSINESS, addressLines, whatsappLink } from "@/lib/business";
import type { Facet } from "@/lib/inventory";

const linkCls = "transition-colors hover:text-graphite-foreground";

/**
 * Footer content mirrors the official canonmotors.com footer (About Us,
 * contact block, find by year / make, support & FAQs, contact), linked to the
 * equivalent pages and filters on this site. Price bands are omitted because
 * listings carry no prices.
 */
export function SiteFooter({
  makes,
  bodyTypes,
  years,
}: {
  makes: Facet;
  bodyTypes: Facet;
  years: number[];
}) {
  return (
    <footer className="bg-graphite text-sm text-graphite-muted">
      <div className="container-page grid gap-x-8 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="inline-block">
            <Logo dark />
          </div>
          <h2 className="mt-6 text-xs font-bold uppercase tracking-wider text-graphite-foreground">
            About us
          </h2>
          <p className="mt-2 max-w-sm leading-relaxed">
            Established in {BUSINESS.established}, Canon Motors is a global importer of used &amp;
            new vehicles with our head office in the heart of Mombasa, Kenya.
          </p>
          <address className="mt-5 space-y-2.5 not-italic">
            <div className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
              <span>
                <span className="block font-semibold text-graphite-foreground">
                  {BUSINESS.name}
                </span>
                {addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </div>
            <a href={BUSINESS.phoneHref} className={`flex gap-2.5 ${linkCls}`}>
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
              Tel: {BUSINESS.phoneDisplay}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={`flex gap-2.5 ${linkCls}`}>
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
              Email: {BUSINESS.email}
            </a>
            <a
              href={whatsappLink("Hello Canon Motors,")}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex gap-2.5 ${linkCls}`}
            >
              <MessageCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground"
                aria-hidden
              />
              WhatsApp: {BUSINESS.phoneDisplay}
            </a>
            <div className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
              <span>
                {BUSINESS.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </div>
          </address>
        </div>

        <FooterCol title="Find car by year">
          <li>
            <Link to="/vehicles" className={linkCls}>
              Browse all cars
            </Link>
          </li>
          {years.map((y) => (
            <li key={y}>
              <Link to="/vehicles" search={{ minYear: y, maxYear: y }} className={linkCls}>
                Registration year {y}
              </Link>
            </li>
          ))}
          {years.length > 0 && (
            <li>
              <Link to="/vehicles" search={{ sort: "newest" }} className={linkCls}>
                Newest first
              </Link>
            </li>
          )}
        </FooterCol>

        <FooterCol title="Car by make">
          {makes.slice(0, 8).map(({ value, count }) => (
            <li key={value}>
              <Link to="/vehicles" search={{ make: value }} className={linkCls}>
                {value} ({count})
              </Link>
            </li>
          ))}
          <li>
            <Link to="/makes" className={`font-semibold text-graphite-foreground ${linkCls}`}>
              All makes →
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Car by type">
          {bodyTypes.slice(0, 8).map(({ value, count }) => (
            <li key={value}>
              <Link to="/vehicles" search={{ body: value }} className={linkCls}>
                {value} ({count})
              </Link>
            </li>
          ))}
          <li>
            <Link to="/categories" className={`font-semibold text-graphite-foreground ${linkCls}`}>
              All categories →
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Support & FAQs">
          <li>
            <Link to="/contact" hash="faq" className={linkCls}>
              FAQs
            </Link>
          </li>
          <li>
            <Link to="/how-importing-works" className={linkCls}>
              How importing works
            </Link>
          </li>
          <li>
            <Link to="/about" className={linkCls}>
              About us
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkCls}>
              Contact us — Kenya
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
          className="flex items-start gap-2.5 rounded-lg border border-primary/40 bg-primary/10 p-4 hover:border-primary/70"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
          <span>
            <span className="font-semibold text-graphite-foreground">Important notice:</span> beware
            of websites, social media, e-mails and invoices impersonating Canon Motors. Our only
            website is canonmotors.com — kindly confirm with us every time before making any
            payment.
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
                Terms &amp; Conditions
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
      <h2 className="text-xs font-bold uppercase tracking-wider text-graphite-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}
