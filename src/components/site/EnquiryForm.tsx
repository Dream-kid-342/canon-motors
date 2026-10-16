import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, mailtoLink } from "@/lib/business";

const field = "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring";

/** No enquiry backend exists yet, so the form opens WhatsApp or e-mail with a pre-filled message. */
export function EnquiryForm({ vehicle }: { vehicle?: string }) {
  const [f, setF] = useState({ name: "", phone: "", country: "Kenya", message: "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const compose = () =>
    [
      "Hello Canon Motors,",
      vehicle ? `I am interested in: ${vehicle}` : "",
      f.message,
      "",
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      `Country: ${f.country}`,
    ].filter((l, i) => l !== "" || i === 3).join("\n");

  const send = (via: "wa" | "mail") => {
    if (f.name.trim().length < 2 || f.phone.trim().length < 6) {
      setErr("Please enter your name and a phone number.");
      return;
    }
    setErr("");
    const url = via === "wa" ? whatsappLink(compose()) : mailtoLink(vehicle ? `Enquiry: ${vehicle}` : "Vehicle enquiry", compose());
    window.open(url, "_blank", "noopener");
  };

  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); send("wa"); }}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">Your name<input className={`${field} mt-1`} value={f.name} onChange={set("name")} maxLength={80} required /></label>
        <label className="block text-sm font-medium">Phone<input className={`${field} mt-1`} type="tel" value={f.phone} onChange={set("phone")} maxLength={30} required /></label>
      </div>
      <label className="block text-sm font-medium">Country<input className={`${field} mt-1`} value={f.country} onChange={set("country")} maxLength={60} /></label>
      <label className="block text-sm font-medium">Message
        <textarea className={`${field} mt-1 min-h-24`} value={f.message} onChange={set("message")} maxLength={1000}
          placeholder={vehicle ? "Ask about price, shipping, or condition…" : "Tell us what vehicle you are looking for…"} />
      </label>
      {err && <p className="text-sm text-destructive" role="alert">{err}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" variant="whatsapp" size="lg"><MessageCircle /> Send via WhatsApp</Button>
        <Button type="button" variant="outline" size="lg" onClick={() => send("mail")}><Mail /> Send by e-mail</Button>
      </div>
    </form>
  );
}
