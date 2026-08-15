import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePackages } from "@/lib/catering-data";
import { useEnquiry } from "@/lib/enquiry";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Engagement",
  "Religious Function",
  "College Event",
  "Family Gathering",
  "Other",
];

const FOOD_PREFERENCES = ["Vegetarian", "Non-Vegetarian", "Both"];

type Values = {
  customer_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  guest_count: string;
  location: string;
  food_preference: string;
  package: string;
  special_requirements: string;
};

const EMPTY: Values = {
  customer_name: "",
  phone: "",
  email: "",
  event_type: "",
  event_date: "",
  guest_count: "",
  location: "",
  food_preference: "",
  package: "",
  special_requirements: "",
};

function validate(v: Values): Partial<Record<keyof Values, string>> {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (v.customer_name.trim().length < 2) errors.customer_name = "Please enter your full name";
  if (!/^[+]?[\d\s-]{10,15}$/.test(v.phone.trim())) errors.phone = "Enter a valid phone number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = "Enter a valid email";
  if (!v.event_type) errors.event_type = "Select an event type";
  if (!v.event_date) errors.event_date = "Pick your event date";
  else if (new Date(v.event_date) < new Date(new Date().toDateString()))
    errors.event_date = "Choose a future date";
  const guests = Number(v.guest_count);
  if (!v.guest_count || Number.isNaN(guests) || guests < 10)
    errors.guest_count = "Minimum 10 guests";
  if (v.location.trim().length < 3) errors.location = "Where is the event?";
  if (!v.food_preference) errors.food_preference = "Select a food preference";
  if (!v.package) errors.package = "Select a package";
  return errors;
}

const fieldClass =
  "w-full rounded-sm border bg-card px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

export function BookingSection({
  selectedPackage,
  onPackageChange,
}: {
  selectedPackage: string;
  onPackageChange: (name: string) => void;
}) {
  const { data: packages = [] } = usePackages();
  const enquiry = useEnquiry();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const packageValue = values.package || selectedPackage;

  const set = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = { ...values, package: packageValue };
    const found = validate(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    const requirements = [
      payload.special_requirements.trim(),
      enquiry.items.length ? `Dishes of interest: ${enquiry.items.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabase.from("bookings").insert({
      customer_name: payload.customer_name.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      event_type: payload.event_type,
      event_date: payload.event_date,
      guest_count: Number(payload.guest_count),
      location: payload.location.trim(),
      food_preference: payload.food_preference,
      package: payload.package,
      special_requirements: requirements || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not send your request. Please try again.");
      return;
    }

    setValues(EMPTY);
    onPackageChange("");
    enquiry.clear();
    setDone(true);
    toast.success("Thank you! Our team will contact you shortly.");
  }

  return (
    <section id="booking" className="bg-secondary px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[70rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            Get A Quote
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight text-charcoal sm:text-[3.2rem]">
            Plan Your <span className="font-script text-primary">Perfect Event</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Share a few details and our event team will call you back within one working day with a
            tailored menu and quotation.
          </p>
        </Reveal>

        {done ? (
          <Reveal className="mt-12 rounded-sm border border-primary/30 bg-card p-12 text-center shadow-soft">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-6 font-display text-3xl text-charcoal">
              Thank you! Our team will contact you shortly.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-8 rounded-sm bg-charcoal px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-cream transition-colors hover:bg-primary"
            >
              SEND ANOTHER REQUEST
            </button>
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-12 grid gap-5 rounded-sm bg-card p-6 shadow-soft sm:grid-cols-2 sm:p-10"
            >
              <Field label="Full Name" error={errors.customer_name}>
                <input
                  className={cn(fieldClass, errors.customer_name ? "border-destructive" : "border-border")}
                  value={values.customer_name}
                  onChange={(e) => set("customer_name", e.target.value)}
                  placeholder="Your name"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <input
                  type="tel"
                  className={cn(fieldClass, errors.phone ? "border-destructive" : "border-border")}
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  className={cn(fieldClass, errors.email ? "border-destructive" : "border-border")}
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@email.com"
                />
              </Field>

              <Field label="Event Type" error={errors.event_type}>
                <select
                  className={cn(fieldClass, errors.event_type ? "border-destructive" : "border-border")}
                  value={values.event_type}
                  onChange={(e) => set("event_type", e.target.value)}
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Event Date" error={errors.event_date}>
                <input
                  type="date"
                  className={cn(fieldClass, errors.event_date ? "border-destructive" : "border-border")}
                  value={values.event_date}
                  onChange={(e) => set("event_date", e.target.value)}
                />
              </Field>

              <Field label="Number of Guests" error={errors.guest_count}>
                <input
                  type="number"
                  min={10}
                  className={cn(fieldClass, errors.guest_count ? "border-destructive" : "border-border")}
                  value={values.guest_count}
                  onChange={(e) => set("guest_count", e.target.value)}
                  placeholder="150"
                />
              </Field>

              <Field label="Event Location" error={errors.location}>
                <input
                  className={cn(fieldClass, errors.location ? "border-destructive" : "border-border")}
                  value={values.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Venue, city"
                />
              </Field>

              <Field label="Food Preference" error={errors.food_preference}>
                <select
                  className={cn(
                    fieldClass,
                    errors.food_preference ? "border-destructive" : "border-border",
                  )}
                  value={values.food_preference}
                  onChange={(e) => set("food_preference", e.target.value)}
                >
                  <option value="">Select preference</option>
                  {FOOD_PREFERENCES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Select Package" error={errors.package} className="sm:col-span-2">
                <select
                  className={cn(fieldClass, errors.package ? "border-destructive" : "border-border")}
                  value={packageValue}
                  onChange={(e) => {
                    set("package", e.target.value);
                    onPackageChange(e.target.value);
                  }}
                >
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} — {p.price_label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Special Requirements" className="sm:col-span-2">
                <textarea
                  rows={4}
                  className={cn(fieldClass, "resize-none border-border")}
                  value={values.special_requirements}
                  onChange={(e) => set("special_requirements", e.target.value)}
                  placeholder="Jain food, live counters, serving time…"
                />
              </Field>

              {enquiry.items.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="eyebrow text-muted-foreground">Dishes in your enquiry</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {enquiry.items.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => enquiry.remove(item)}
                          className="inline-flex items-center gap-2 rounded-sm bg-secondary px-3 py-2 text-xs text-foreground transition-colors hover:text-primary"
                        >
                          {item}
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-sm bg-primary px-8 py-4 text-[0.68rem] font-bold tracking-[0.22em] text-primary-foreground transition-all duration-300 hover:bg-charcoal disabled:opacity-60 sm:col-span-2"
              >
                {submitting ? "SENDING…" : "REQUEST A QUOTE"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="eyebrow text-muted-foreground">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-2 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
