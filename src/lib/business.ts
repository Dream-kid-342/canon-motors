/**
 * Business details, verified against canonmotors.com (vehicle pages, About Us
 * and FAQs) in October 2026. Edit here to update every page at once.
 */
export const BUSINESS = {
  name: "Canon Motors Ltd.",
  established: 2005,
  website: "https://www.canonmotors.com/",
  phoneDisplay: "+254 110 096 963",
  phoneHref: "tel:+254110096963",
  /** The official site's "Chat on WhatsApp" button links to this number. */
  whatsapp: "254110096963",
  email: "sales@canonmotors.com",
  postal: "P.O. Box 1207-80100",
  /**
   * The official site words the street location two ways ("Moi Avenue, behind
   * Equity Bank" and "Moi Avenue, Bunju Road"). Both are shown until the
   * business confirms one canonical wording.
   */
  street: "Moi Avenue, Bunju Road",
  directions:
    "Our office is on Moi Avenue, Bunju Road; vehicle listings also describe it as behind Equity Bank. Please call ahead to confirm directions before visiting.",
  city: "Mombasa, Kenya",
  hours: [
    { days: "Monday – Friday", time: "8:30 a.m. – 6:00 p.m." },
    { days: "Saturday", time: "8:30 a.m. – 7:00 p.m." },
    { days: "Sunday & Kenyan public holidays", time: "Closed" },
  ],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Moi+Avenue+Mombasa+Kenya",
};

export const addressLines = [BUSINESS.postal, BUSINESS.street, BUSINESS.city];

export const FRAUD_NOTICE =
  "Beware of websites, social media accounts, e-mails and invoices impersonating Canon Motors. We are not related to them. Our official website is canonmotors.com — always confirm with us through the official contacts before making any payment.";

/** Questions and answers as published on the official canonmotors.com FAQ page. */
export const FAQS = [
  {
    q: "Do you sell on hire purchase?",
    a: "Yes. Hire purchase is available: you pay a minimum deposit and the balance in 10 monthly instalments. The 10-month term can be adjusted to suit your needs — speak to our sales team for an arrangement that fits you.",
  },
  {
    q: "Can I buy with financing from a bank or other lender?",
    a: "Yes, financing from reputable institutions is accepted. Logbook transfer is effected once the lender's offer letter has been provided.",
  },
  {
    q: "What does a quoted price include?",
    a: 'Canon Motors states that its listed prices include taxes, duties and registration charges, except inspection charges for commercial vehicles and logbook transfer fees. Vehicles on this site show "Price on request", so always ask for a written quotation and confirm exactly what it covers before paying.',
  },
  {
    q: "Can you show me the condition of a vehicle?",
    a: "Yes. We provide as many detailed photographs as we can to help you decide. Ask us for any specific view or detail you need.",
  },
  {
    q: "What are your office hours?",
    a: "Monday to Friday 8:30 a.m. – 6:00 p.m. and Saturday 8:30 a.m. – 7:00 p.m. (Kenya time). We are closed on Sundays and Kenyan public holidays; dates for long holidays are announced as the season approaches.",
  },
];

export const whatsappLink = (text: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Public origin used for canonical URLs, sitemap and structured data. */
export const SITE_URL =
  (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(/\/$/, "") ||
  "https://www.canonmotors.com";
