import { ShieldAlert } from "lucide-react";
import { FRAUD_NOTICE, BUSINESS } from "@/lib/business";

/** Full customer-protection notice, shown on contact and process pages. */
export function TrustNotice({ className = "" }: { className?: string }) {
  return (
    <aside
      id="payment-safety"
      aria-labelledby="payment-safety-title"
      className={`scroll-mt-28 rounded-lg border border-primary/25 bg-accent p-5 text-accent-foreground ${className}`}
    >
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <h2 id="payment-safety-title" className="font-bold">
            Protect yourself from impersonators
          </h2>
          <p className="mt-1 text-sm leading-relaxed">{FRAUD_NOTICE}</p>
          <p className="mt-2 text-sm">
            Official contacts:{" "}
            <a className="font-semibold underline" href={BUSINESS.phoneHref}>
              {BUSINESS.phoneDisplay}
            </a>{" "}
            ·{" "}
            <a className="font-semibold underline" href={`mailto:${BUSINESS.email}`}>
              {BUSINESS.email}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}
