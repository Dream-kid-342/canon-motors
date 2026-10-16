import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BUSINESS } from "@/lib/business";
import { seo } from "@/lib/seo";
import { LegalBody } from "@/components/site/LegalBody";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy — Canon Motors",
      description:
        "How the Canon Motors website handles your information, including enquiries, saved vehicles and third-party services.",
      path: "/privacy",
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHeader title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]}>
        Last updated October 2026.
      </PageHeader>
      <LegalBody>
        <p>
          This notice explains how this website handles information about you. It is operated by{" "}
          {BUSINESS.name}, {BUSINESS.postal}, {BUSINESS.city}.
        </p>

        <h2>Enquiries</h2>
        <p>
          The enquiry forms on this website do not store or transmit your details to a database.
          When you choose to continue, your message is placed into WhatsApp or your own e-mail app,
          addressed to our official contacts, and is only sent when you press send there.
        </p>
        <p>
          We ask only for what we need to reply: your name, how you would like us to contact you,
          your phone number or e-mail address, and your message. We use this information to answer
          your enquiry, prepare quotations and arrange a purchase you ask us about. We do not sell
          it.
        </p>

        <h2>Saved vehicles, comparisons and notices</h2>
        <p>
          Vehicles you save or add to a comparison, and whether you hid the payment-safety notice,
          are remembered in your browser's local storage on your device. This information is not
          sent to us and is not synced between devices. You can clear it at any time from the Saved
          and Compare pages or by clearing your browser's site data.
        </p>

        <h2>Third-party services</h2>
        <ul>
          <li>Vehicle photographs are loaded from canonmotors.com.</li>
          <li>Fonts are loaded from Google Fonts.</li>
          <li>
            WhatsApp and Google Maps open only when you choose to follow those links, and their own
            privacy policies then apply.
          </li>
        </ul>
        <p>This website does not use advertising or analytics cookies.</p>

        <h2>Contact</h2>
        <p>
          For questions about your information, or to ask us to delete the details you sent in an
          enquiry, contact us at{" "}
          <a className="font-semibold text-primary underline" href={`mailto:${BUSINESS.email}`}>
            {BUSINESS.email}
          </a>{" "}
          or{" "}
          <a className="font-semibold text-primary underline" href={BUSINESS.phoneHref}>
            {BUSINESS.phoneDisplay}
          </a>
          . See also our{" "}
          <Link to="/terms" className="font-semibold text-primary underline">
            Terms & Conditions
          </Link>
          .
        </p>
      </LegalBody>
    </>
  );
}
