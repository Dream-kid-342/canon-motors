import { describe, expect, it } from "vitest";
import { legacyRedirect } from "@/lib/legacy";
import { composeEnquiry, enquirySchema } from "@/lib/enquiry";

const catalogue = [
  { make: "Toyota", model: "Probox" },
  { make: "Mazda", model: "Cx-8" },
  { make: "Nissan", model: "Nv200 Vanette" },
];
const go = (path: string) =>
  legacyRedirect(new URL(path, "https://www.canonmotors.com"), catalogue);

describe("legacy URL redirects", () => {
  it("maps old vehicle pages to the new detail URL", () => {
    expect(go("/Kenya/NISSAN%20JUKE/20530")).toBe("/vehicles/20530");
    expect(go("/Kenya/TOYOTA%20PROBOX/abc")).toBe("/vehicles");
  });
  it("maps maker and model pages to filtered inventory", () => {
    expect(go("/Maker/TOYOTA/1")).toBe("/vehicles?make=Toyota");
    expect(go("/Maker/BENTLEY/99")).toBe("/makes");
    expect(go("/Model/MAZDA%20CX-8/18/123")).toBe("/vehicles?make=Mazda&model=Cx-8");
    expect(go("/Model/TOYOTA%20ALLION/1/10")).toBe("/vehicles?make=Toyota");
  });
  it("maps the old paginated inventory, preserving position", () => {
    expect(go("/index.php?page=2&ipp=25")).toBe("/vehicles?page=3");
    expect(go("/index.php")).toBe("/vehicles");
    expect(go("/?Stock=Kenya")).toBe("/vehicles");
  });
  it("maps company pages and ignores everything else", () => {
    expect(go("/about_us/")).toBe("/about");
    expect(go("/contact_us/?Contact=Kenya")).toBe("/contact");
    expect(go("/faqs/")).toBe("/contact#faq");
    expect(go("/")).toBeNull();
    expect(go("/vehicles/20530")).toBeNull();
  });
});

describe("enquiry", () => {
  const ok = {
    name: "Amina",
    method: "whatsapp" as const,
    phone: "+254 712 345 678",
    email: "",
    message: "",
  };

  it("requires a phone for WhatsApp/phone replies and an e-mail for e-mail replies", () => {
    expect(enquirySchema.safeParse(ok).success).toBe(true);
    expect(enquirySchema.safeParse({ ...ok, phone: "" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, method: "email", phone: "" }).success).toBe(false);
    expect(
      enquirySchema.safeParse({ ...ok, method: "email", phone: "", email: "a@b.co" }).success,
    ).toBe(true);
    expect(enquirySchema.safeParse({ ...ok, email: "not-an-email" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, name: "A" }).success).toBe(false);
  });

  it("always includes the vehicle reference and title", () => {
    const parsed = enquirySchema.parse({ ...ok, message: "Is it still available?" });
    const text = composeEnquiry(parsed, {
      title: "2019 Nissan Juke",
      stockNo: "CM-17397",
      url: "https://x/vehicles/20530",
    });
    expect(text).toContain("2019 Nissan Juke — Ref CM-17397");
    expect(text).toContain("Listing: https://x/vehicles/20530");
    expect(text).toContain("Is it still available?");
    expect(text).toContain("Preferred contact: WhatsApp");
    expect(text).not.toContain("E-mail:");
    // No stray blank lines left by empty optional fields.
    expect(text).toContain("Phone: +254 712 345 678\nPreferred contact: WhatsApp");
    expect(text).not.toContain("\n\n\n");
  });
});
