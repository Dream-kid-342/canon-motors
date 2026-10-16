import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/business";

export type Crumb = { label: string; to?: string; search?: Record<string, unknown> };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
            {c.to && i < all.length - 1 ? (
              <Link
                to={c.to}
                search={c.search as never}
                className="hover:text-foreground hover:underline"
              >
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={i === all.length - 1 ? "page" : undefined}
                className="text-foreground/80"
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** schema.org BreadcrumbList for the same trail. */
export function breadcrumbJsonLd(items: Crumb[]) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: `${SITE_URL}${c.to}` } : {}),
    })),
  };
}

export function PageHeader({
  title,
  crumbs,
  children,
  eyebrow,
}: {
  title: string;
  crumbs: Crumb[];
  children?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="border-b bg-secondary/60">
      <div className="container-page py-8 md:py-12">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mt-5">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-1" : "mt-4"} text-3xl font-extrabold md:text-4xl`}>
          {title}
        </h1>
        {children && (
          <div className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/** Render JSON-LD safely (escapes "<" so data cannot close the script tag). */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
