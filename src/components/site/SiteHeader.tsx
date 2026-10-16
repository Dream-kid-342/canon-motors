import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Heart, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/business";
import { useFavourites } from "@/lib/favourites";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Browse Vehicles" },
  { to: "/makes", label: "By Make" },
  { to: "/categories", label: "Categories" },
  { to: "/how-importing-works", label: "How Importing Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Canon Motors home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-extrabold text-primary-foreground">
        CM
      </span>
      <span className={`text-[17px] font-extrabold tracking-tight ${dark ? "text-graphite-foreground" : "text-foreground"}`}>
        CANON <span className="font-medium">MOTORS</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { ids } = useFavourites();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="bg-graphite text-graphite-muted">
        <div className="container-page flex items-center gap-2 py-1.5 text-xs">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-graphite-foreground" />
          <p className="truncate">
            Beware of websites, e-mails and invoices impersonating Canon Motors. Our only website is canonmotors.com — confirm before any payment.
          </p>
        </div>
      </div>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/favourites" className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-secondary" aria-label="Favourites">
            <Heart className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {ids.length}
              </span>
            )}
          </Link>
          <a href={BUSINESS.phoneHref} className="grid h-10 w-10 place-items-center rounded-md hover:bg-secondary xl:hidden" aria-label="Call Canon Motors">
            <Phone className="h-5 w-5" />
          </a>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/contact">Enquire Now</Link>
          </Button>
          <button
            className="grid h-10 w-10 place-items-center rounded-md hover:bg-secondary xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background xl:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-2 py-3 font-medium data-[status=active]:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)}>Enquire Now</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
