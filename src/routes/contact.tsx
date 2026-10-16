import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { PageHeader, JsonLd } from "@/components/site/PageHeader";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { TrustNotice } from "@/components/site/TrustNotice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BUSINESS, FAQS, addressLines, whatsappLink } from "@/lib/business";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact Canon Motors — Mombasa, Kenya",
      description: `Call, WhatsApp or e-mail Canon Motors on Moi Avenue, Mombasa: ${BUSINESS.phoneDisplay}, ${BUSINESS.email}. Office hours, FAQs and enquiry form.`,
      path: "/contact",
    }),
  component: Contact,
});

const row = "flex gap-3 rounded-lg p-3 transition-colors";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function Contact() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHeader title="Contact Us" crumbs={[{ label: "Contact" }]}>
        Our Mombasa team can help with availability, quotations, financing and the import process.
      </PageHeader>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-8">
          <div className="space-y-1">
            <a href={BUSINESS.phoneHref} className={`${row} hover:bg-secondary`}>
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block text-sm text-muted-foreground">Call us</span>
                <span className="font-semibold">{BUSINESS.phoneDisplay}</span>
              </span>
            </a>
            <a
              href={whatsappLink("Hello Canon Motors,")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${row} hover:bg-secondary`}
            >
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-whatsapp" aria-hidden />
              <span>
                <span className="block text-sm text-muted-foreground">WhatsApp</span>
                <span className="font-semibold">{BUSINESS.phoneDisplay}</span>
              </span>
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={`${row} hover:bg-secondary`}>
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block text-sm text-muted-foreground">E-mail</span>
                <span className="font-semibold">{BUSINESS.email}</span>
              </span>
            </a>
            <div className={row}>
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <span className="block text-sm text-muted-foreground">Head office</span>
                <address className="not-italic">
                  <span className="font-semibold">{BUSINESS.name}</span>
                  {addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <p className="mt-2 text-sm text-muted-foreground">{BUSINESS.directions}</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Open Moi Avenue in Google Maps →
                </a>
              </div>
            </div>
            <div className={row}>
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div className="w-full">
                <span className="block text-sm text-muted-foreground">
                  Office hours (Kenya time)
                </span>
                <dl className="mt-1 space-y-0.5 text-sm">
                  {BUSINESS.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt>{h.days}</dt>
                      <dd className="text-right font-semibold">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <TrustNotice />
        </div>

        <section
          id="enquire"
          aria-labelledby="enquire-title"
          className="scroll-mt-24 rounded-xl border bg-card p-5 shadow-card md:p-8"
        >
          <h2 id="enquire-title" className="text-2xl font-extrabold">
            Send an enquiry
          </h2>
          <p className="mb-6 mt-1 text-muted-foreground">
            Tell us what you're looking for. If you have a vehicle in mind, include its reference
            (e.g. CM-17397).
          </p>
          <EnquiryForm />
        </section>
      </div>

      <section className="border-t bg-secondary/60" aria-labelledby="faq">
        <div className="container-page max-w-3xl py-14">
          <h2 id="faq" className="text-2xl font-extrabold">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-6 rounded-lg border bg-card px-5">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-[15px] font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
