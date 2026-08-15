import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "MENU", href: "#menu" },
  { label: "PACKAGES", href: "#packages" },
  { label: "GALLERY", href: "#gallery" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-charcoal/95 py-3 shadow-lift backdrop-blur" : "bg-transparent py-5",
      )}
    >
      <nav className="mx-auto flex max-w-[86rem] items-center justify-between px-5 sm:px-8">
        <a href="#home" onClick={() => setOpen(false)} aria-label="Annapurnam Catering Service home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-[0.7rem] font-semibold tracking-[0.22em] text-cream/75 transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-cream hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className="hidden rounded-sm bg-primary px-6 py-3 text-[0.7rem] font-bold tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-charcoal sm:inline-block"
          >
            BOOK NOW
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-sm border border-cream/25 text-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden bg-charcoal transition-[max-height] duration-500 lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-cream/10 py-4 text-sm font-semibold tracking-[0.22em] text-cream/80"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-sm bg-primary px-6 py-4 text-center text-xs font-bold tracking-[0.2em] text-primary-foreground"
            >
              BOOK NOW
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
