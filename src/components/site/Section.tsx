import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  action?: { label: string; to: string };
  dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow ${dark ? "!text-graphite-muted" : ""}`}>{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">{title}</h2>
        {children && (
          <p className={`mt-2 ${dark ? "text-graphite-muted" : "text-muted-foreground"}`}>
            {children}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`text-sm font-semibold hover:underline ${dark ? "text-graphite-foreground" : "text-primary"}`}
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
