import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Canon Motors — Mombasa, Kenya" },
    { name: "description", content: "Call, WhatsApp or e-mail Canon Motors on Moi Avenue, Mombasa. +254 110 096 963, sales@canonmotors.com." },
    { property: "og:title", content: "Contact Canon Motors" },
    { property: "og:description", content: "Get in touch with Canon Motors in Mombasa." },
  ] }),
  component: () => (
    <>
      <PageHeader title="Contact Us" crumb="Contact" />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold">{BUSINESS.name}</h2>
          <address className="not-italic text-muted-foreground">{BUSINESS.address.map((l) => <div key={l}>{l}</div>)}</address>
          <p><a href={BUSINESS.phoneHref} className="font-semibold text-primary hover:underline">{BUSINESS.phoneDisplay}</a></p>
          <p><a href={`mailto:${BUSINESS.email}`} className="font-semibold text-primary hover:underline">{BUSINESS.email}</a></p>
          <p className="rounded-lg border bg-accent p-4 text-sm text-accent-foreground">Beware of impersonators. Only make payments after confirming directly through these official contacts.</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-card"><EnquiryForm /></div>
      </div>
    </>
  ),
});
