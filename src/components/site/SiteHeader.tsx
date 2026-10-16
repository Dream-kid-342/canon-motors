import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Menu,
  Heart,
  Phone,
  ShieldAlert,
  X,
  GitCompareArrows,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { BUSINESS, whatsappLink } from "@/lib/business";
import { useCompare, useFavourites } from "@/lib/favourites";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Browse Vehicles" },
  { to: "/makes", label: "By Make" },
  { to: "/categories", label: "Categories" },
  { to: "/how-importing-works", label: "How Importing Works" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2.5 rounded-md"
      aria-label="Canon Motors — home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-extrabold tracking-tight text-primary-foreground">
        CM
      </span>
      <span
        className={`${compact ? "hidden sm:inline" : ""} text-[17px] font-extrabold tracking-tight ${dark ? "text-graphite-foreground" : "text-foreground"}`}
      >
        CANON <span className="font-medium">MOTORS</span>
      </span>
    </Link>
  );
}

const NOTICE_KEY = "cm-notice-dismissed-v1";

/**
 * Anti-impersonation banner from the official site. It can be hidden for the
 * session, but the full notice stays available on the Contact page and footer.
 */
function NoticeBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(NOTICE_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);
  if (hidden) return null;
  return (
    <div
      className="bg-graphite text-graphite-muted"
      role="region"
      aria-label="Payment safety notice"
    >
      <div className="container-page flex items-center gap-3 py-2 text-xs sm:text-[13px]">
        <ShieldAlert className="h-4 w-4 shrink-0 text-graphite-foreground" aria-hidden />
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold text-graphite-foreground">Beware of impersonators.</span>{" "}
          <span className="hidden sm:inline">
            Our only website is canonmotors.com — confirm with us directly before making any
            payment.{" "}
          </span>
          <Link
            to="/contact"
            hash="payment-safety"
            className="font-semibold text-graphite-foreground underline underline-offset-2"
          >
            Read the notice
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem(NOTICE_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md hover:bg-graphite-foreground/10 hover:text-graphite-foreground"
          aria-label="Hide notice for this visit"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CountBadge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
      {n}
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const fav = useFavourites();
  const cmp = useCompare();
  return (
    <>
      <NoticeBar />
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Logo />
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-3 data-[status=active]:after:-bottom-[13px] data-[status=active]:after:h-0.5 data-[status=active]:after:bg-primary"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-0.5">
            <Link
              to="/compare"
              className="relative hidden h-10 w-10 place-items-center rounded-md hover:bg-secondary min-[400px]:grid"
              aria-label={`Compare vehicles (${cmp.ids.length} selected)`}
            >
              <GitCompareArrows className="h-5 w-5" />
              <CountBadge n={cmp.ids.length} />
            </Link>
            <Link
              to="/favourites"
              className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-secondary"
              aria-label={`Saved vehicles (${fav.ids.length})`}
            >
              <Heart className="h-5 w-5" />
              <CountBadge n={fav.ids.length} />
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="grid h-10 w-10 place-items-center rounded-md hover:bg-secondary sm:hidden"
              aria-label={`Call Canon Motors on ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" />
            </a>
            <Button asChild className="ml-1 hidden sm:inline-flex">
              <Link to="/contact" hash="enquire">
                Enquire Now
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="grid h-10 w-10 place-items-center rounded-md hover:bg-secondary xl:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[86vw] max-w-sm flex-col gap-0 p-0">
                <div className="flex h-16 items-center border-b px-5">
                  <SheetTitle className="text-base font-extrabold">Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation and contact options
                  </SheetDescription>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
                  {NAV.map((n) => (
                    <SheetClose asChild key={n.to}>
                      <Link
                        to={n.to}
                        activeOptions={{ exact: n.to === "/" }}
                        className="flex items-center rounded-md px-3 py-3 text-[15px] font-medium hover:bg-secondary data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
                      >
                        {n.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="my-3 border-t" />
                  <SheetClose asChild>
                    <Link
                      to="/favourites"
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium hover:bg-secondary"
                    >
                      <Heart className="h-4 w-4" /> Saved vehicles{" "}
                      {fav.ids.length > 0 && (
                        <span className="text-muted-foreground">({fav.ids.length})</span>
                      )}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/compare"
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-[15px] font-medium hover:bg-secondary"
                    >
                      <GitCompareArrows className="h-4 w-4" /> Compare{" "}
                      {cmp.ids.length > 0 && (
                        <span className="text-muted-foreground">({cmp.ids.length})</span>
                      )}
                    </Link>
                  </SheetClose>
                </nav>
                <div className="space-y-2 border-t p-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/contact" hash="enquire" onClick={() => setOpen(false)}>
                      Enquire Now
                    </Link>
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    <Button asChild variant="outline">
                      <a href={BUSINESS.phoneHref}>
                        <Phone /> Call
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a
                        href={whatsappLink(
                          "Hello Canon Motors, I'd like some help finding a vehicle.",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle /> Chat
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={`mailto:${BUSINESS.email}`}>
                        <Mail /> Email
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
