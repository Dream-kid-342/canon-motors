import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BUSINESS, FRAUD_NOTICE } from "@/lib/business";
import { seo } from "@/lib/seo";
import { LegalBody } from "@/components/site/LegalBody";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms & Conditions — Canon Motors",
      description:
        "Terms for using the Canon Motors website: vehicle listings, prices and quotations, payments and external links.",
      path: "/terms",
    }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHeader title="Terms & Conditions" crumbs={[{ label: "Terms & Conditions" }]}>
        Website terms of use. Last updated October 2026.
      </PageHeader>
      <LegalBody>
        <p>
          These terms apply to your use of this website, operated by {BUSINESS.name}. By using the
          website you agree to them.
        </p>

        <h2>Vehicle listings</h2>
        <p>
          Listings are provided for information. We aim to keep them accurate, but specifications,
          photographs, stock location and availability can change and may contain errors. A listing
          is not an offer to sell. Always confirm the details of a vehicle with our team before
          making any decision.
        </p>
        <p>
          Where a value is shown as "Not provided", the listing does not state it; it should not be
          read as zero or as a guarantee of any value.
        </p>

        <h2>Prices and quotations</h2>
        <p>
          Vehicles on this website show "Price on request". The price, what it includes, and any
          timeline are set out in the individual written quotation we give you, which takes
          precedence over anything on this website.
        </p>

        <h2>Payments</h2>
        <p>{FRAUD_NOTICE}</p>
        <p>
          Never make a payment based only on information from this website or from any other
          website, social media account or unverified message.
        </p>

        <h2>External links</h2>
        <p>
          Links to WhatsApp, Google Maps and other services are provided for convenience. We are not
          responsible for their content or practices.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a className="font-semibold text-primary underline" href={`mailto:${BUSINESS.email}`}>
            {BUSINESS.email}
          </a>
          . See also our{" "}
          <Link to="/privacy" className="font-semibold text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalBody>
    </>
  );
}
