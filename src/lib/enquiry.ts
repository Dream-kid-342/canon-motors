import { z } from "zod";

export const CONTACT_METHODS = {
  whatsapp: "WhatsApp",
  phone: "Phone call",
  email: "E-mail",
} as const;
export type ContactMethod = keyof typeof CONTACT_METHODS;

const phoneRe = /^\+?[0-9][0-9\s-]{5,19}$/;

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
    method: z.enum(["whatsapp", "phone", "email"]),
    phone: z.string().trim().max(24).optional().default(""),
    email: z.string().trim().max(120).optional().default(""),
    message: z
      .string()
      .trim()
      .max(1000, "Message is too long (1,000 characters max).")
      .optional()
      .default(""),
  })
  .superRefine((d, ctx) => {
    const needsPhone = d.method !== "email";
    if (needsPhone && !phoneRe.test(d.phone))
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a phone number, e.g. +254 712 345 678.",
      });
    if (!needsPhone && !z.string().email().safeParse(d.email).success)
      ctx.addIssue({ code: "custom", path: ["email"], message: "Enter a valid e-mail address." });
    if (d.email && needsPhone && !z.string().email().safeParse(d.email).success)
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter a valid e-mail address or leave it blank.",
      });
  });

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryVehicle = { title: string; stockNo: string; url?: string };

/** Plain-text enquiry, always carrying the vehicle reference when there is one. */
export function composeEnquiry(e: Enquiry, vehicle?: EnquiryVehicle) {
  const lines: (string | null)[] = [
    "Hello Canon Motors,",
    "",
    vehicle
      ? `I am enquiring about: ${vehicle.title} — Ref ${vehicle.stockNo}`
      : "I am looking for a vehicle.",
    vehicle?.url ? `Listing: ${vehicle.url}` : null,
    ...(e.message ? ["", e.message] : []),
    "",
    `Name: ${e.name}`,
    e.phone ? `Phone: ${e.phone}` : null,
    e.email ? `E-mail: ${e.email}` : null,
    `Preferred contact: ${CONTACT_METHODS[e.method]}`,
  ];
  return lines.filter((l) => typeof l === "string").join("\n");
}

export const enquirySubject = (vehicle?: EnquiryVehicle) =>
  vehicle ? `Enquiry: ${vehicle.title} (Ref ${vehicle.stockNo})` : "Vehicle enquiry";
