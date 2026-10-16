// Business details verified from canonmotors.com vehicle pages.
export const BUSINESS = {
  name: "Canon Motors Ltd.",
  website: "https://www.canonmotors.com/",
  phoneDisplay: "+254 110 096 963",
  phoneHref: "tel:+254110096963",
  whatsapp: "254110096963",
  email: "sales@canonmotors.com",
  address: ["P.O. Box 1207-80100", "Moi Avenue, behind Equity Bank", "Mombasa, Kenya"],
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
