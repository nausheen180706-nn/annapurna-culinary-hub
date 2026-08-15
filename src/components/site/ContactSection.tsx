import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Reveal } from "./Reveal";

const DETAILS = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "hello@annapurnamcatering.in" },
  { icon: MapPin, label: "Location", value: "12, Thendral Street, Anna Nagar, Chennai 600040" },
  { icon: Clock, label: "Business Hours", value: "Monday – Sunday · 8:00 AM – 10:00 PM" },
];

const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=80.19%2C13.06%2C80.24%2C13.10&layer=mapnik&marker=13.0850%2C80.2101";

export function ContactSection() {
  return (
    <section id="contact" className="bg-charcoal px-5 py-24 text-cream sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-10 bg-accent" />
            Say Hello
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight sm:text-[3.2rem]">
            Let's Make Your <span className="font-script text-accent">Event Special</span>
          </h2>

          <ul className="mt-10 space-y-6">
            {DETAILS.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[0.62rem] font-bold tracking-[0.24em] text-cream/45 uppercase">
                    {label}
                  </span>
                  <span className="mt-1 block text-cream/85">{value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent hover:text-charcoal"
            >
              <Phone className="h-4 w-4" /> CALL NOW
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-cream/25 px-7 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <MessageCircle className="h-4 w-4" /> WHATSAPP US
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Anna+Nagar+Chennai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-cream/25 px-7 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-cream transition-colors hover:border-accent hover:text-accent"
            >
              <Navigation className="h-4 w-4" /> GET DIRECTIONS
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="min-h-[24rem]">
          <iframe
            title="Annapurnam Catering Service location map"
            src={MAP_SRC}
            loading="lazy"
            className="h-full min-h-[24rem] w-full rounded-sm border border-cream/12 grayscale-[35%]"
          />
        </Reveal>
      </div>
    </section>
  );
}
