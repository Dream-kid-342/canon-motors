import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageHeader({ title, crumb, children }: { title: string; crumb: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-secondary/60">
      <div className="container-page py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> <span>{crumb}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h1>
        {children && <div className="mt-2 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export const STEPS = [
  { t: "Choose a vehicle", d: "Browse our inventory or tell us what you need. Every listing has a reference number (e.g. CM-17364)." },
  { t: "Enquire & get a quote", d: "Contact us by WhatsApp, phone or e-mail with the reference number to confirm price and availability." },
  { t: "Confirm & pay securely", d: "Only make payments against invoices you have confirmed directly with Canon Motors through canonmotors.com contacts." },
  { t: "Shipping from Japan", d: "Vehicles listed as \"In transit\" are already on their way. We keep you updated through the shipping process." },
  { t: "Arrival in Mombasa", d: "Your vehicle arrives at Mombasa port. We guide you on the clearance and collection process." },
];
