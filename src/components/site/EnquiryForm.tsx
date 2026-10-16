import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, CheckCircle2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, mailtoLink, BUSINESS } from "@/lib/business";
import {
  CONTACT_METHODS,
  composeEnquiry,
  enquirySchema,
  enquirySubject,
  type ContactMethod,
  type EnquiryVehicle,
} from "@/lib/enquiry";
import { cn } from "@/lib/utils";

const field =
  "mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/25 aria-[invalid=true]:border-destructive";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

/**
 * Enquiry form. Canon Motors has no enquiry API connected to this site yet, so
 * on submit the validated message is handed to WhatsApp or the visitor's
 * e-mail app, addressed to the official contacts. Nothing is stored here, and
 * the form says so plainly.
 */
export function EnquiryForm({ vehicle }: { vehicle?: EnquiryVehicle }) {
  const id = useId();
  const [f, setF] = useState({
    name: "",
    method: "whatsapp" as ContactMethod,
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState<null | "wa" | "mail">(null);
  const set =
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setF({ ...f, [k]: e.target.value });
      if (errors[k as keyof Errors]) setErrors({ ...errors, [k]: undefined });
    };

  const send = (via: "wa" | "mail") => {
    const parsed = enquirySchema.safeParse(f);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Errors] ??= i.message;
      setErrors(errs);
      document.getElementById(`${id}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setErrors({});
    const body = composeEnquiry(parsed.data, vehicle);
    const url = via === "wa" ? whatsappLink(body) : mailtoLink(enquirySubject(vehicle), body);
    if (via === "wa") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setOpened(via);
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-1 text-sm text-destructive">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Errors) => ({
    id: `${id}-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send(f.method === "email" ? "mail" : "wa");
      }}
    >
      {vehicle && (
        <div className="flex items-center gap-3 rounded-md border bg-secondary/60 px-3 py-2.5 text-sm">
          <Car className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">Enquiring about</span>
            <span className="block truncate font-semibold">
              {vehicle.title} · Ref {vehicle.stockNo}
            </span>
          </span>
        </div>
      )}
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          Your name
        </label>
        <input
          {...aria("name")}
          className={field}
          value={f.name}
          onChange={set("name")}
          maxLength={80}
          autoComplete="name"
        />
        {err("name")}
      </div>
      <fieldset>
        <legend className="text-sm font-medium">How should we reply?</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(Object.keys(CONTACT_METHODS) as ContactMethod[]).map((m) => (
            <label
              key={m}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border px-2 py-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                f.method === m
                  ? "border-primary bg-accent text-accent-foreground"
                  : "bg-card hover:border-foreground/30",
              )}
            >
              <input
                type="radio"
                name={`${id}-method`}
                value={m}
                checked={f.method === m}
                onChange={() => setF({ ...f, method: m })}
                className="sr-only"
              />
              {CONTACT_METHODS[m]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className="text-sm font-medium">
            Phone{" "}
            {f.method === "email" && (
              <span className="font-normal text-muted-foreground">(optional)</span>
            )}
          </label>
          <input
            {...aria("phone")}
            className={field}
            type="tel"
            inputMode="tel"
            value={f.phone}
            onChange={set("phone")}
            maxLength={24}
            autoComplete="tel"
            placeholder="+254 …"
          />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-medium">
            E-mail{" "}
            {f.method !== "email" && (
              <span className="font-normal text-muted-foreground">(optional)</span>
            )}
          </label>
          <input
            {...aria("email")}
            className={field}
            type="email"
            inputMode="email"
            value={f.email}
            onChange={set("email")}
            maxLength={120}
            autoComplete="email"
          />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          Message <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          {...aria("message")}
          className={`${field} min-h-28 resize-y`}
          value={f.message}
          onChange={set("message")}
          maxLength={1000}
          placeholder={
            vehicle
              ? "Ask about price, availability, condition or shipping…"
              : "Tell us the make, model, budget or body type you are looking for…"
          }
        />
        {err("message")}
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <Button
          type="button"
          variant="whatsapp"
          size="lg"
          onClick={() => send("wa")}
          className="sm:flex-1"
        >
          <MessageCircle /> Continue in WhatsApp
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => send("mail")}
          className="sm:flex-1"
        >
          <Mail /> Continue by e-mail
        </Button>
      </div>

      <div aria-live="polite">
        {opened ? (
          <p className="flex gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <span>
              Your message is ready in {opened === "wa" ? "WhatsApp" : "your e-mail app"}.{" "}
              <strong>Press send there</strong> to deliver it to Canon Motors. Nothing opened? Call{" "}
              <a className="font-semibold underline" href={BUSINESS.phoneHref}>
                {BUSINESS.phoneDisplay}
              </a>{" "}
              or e-mail{" "}
              <a className="font-semibold underline" href={`mailto:${BUSINESS.email}`}>
                {BUSINESS.email}
              </a>
              .
            </span>
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            This opens WhatsApp or your e-mail app with your message ready to send to{" "}
            {BUSINESS.phoneDisplay} / {BUSINESS.email}. Nothing is sent or stored until you press
            send there.{" "}
            <Link to="/privacy" className="underline">
              Privacy
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
