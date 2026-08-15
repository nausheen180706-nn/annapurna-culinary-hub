import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Menu", href: "#menu" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
  { label: "WhatsApp", icon: MessageCircle, href: "https://wa.me/919876543210" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal px-5 pt-20 pb-10 text-cream sm:px-8">
      <div className="mx-auto max-w-[86rem]">
        <div className="grid gap-12 border-b border-cream/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm font-script text-2xl text-accent">
              Taste That Brings People Together.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              Authentic Indian catering for weddings, corporate events and every celebration that
              deserves a table worth remembering.
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-accent">Explore</h3>
            <ul className="mt-6 space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-cream/70 transition-colors hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-accent">Reach Us</h3>
            <ul className="mt-6 space-y-3 text-sm text-cream/70">
              <li>+91 98765 43210</li>
              <li>hello@annapurnamcatering.in</li>
              <li>Anna Nagar, Chennai, Tamil Nadu 600040</li>
              <li>Mon – Sun · 8:00 AM – 10:00 PM</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-sm border border-cream/20 text-cream/70 transition-all hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-cream/45 sm:flex-row">
          <p>© 2026 Annapurnam Catering Service. All Rights Reserved.</p>
          <a href="/admin" className="tracking-[0.2em] transition-colors hover:text-accent">
            ADMIN
          </a>
        </div>
      </div>
    </footer>
  );
}
