import { ArrowUpRight } from "lucide-react";
import {
  svcBirthday,
  svcCollege,
  svcCorporate,
  svcCustom,
  svcEngagement,
  svcFamily,
  svcReligious,
  svcWedding,
} from "@/lib/site-images";
import { Reveal } from "./Reveal";

const SERVICES = [
  {
    name: "Wedding Catering",
    image: svcWedding,
    description: "Grand multi-cuisine spreads, live counters and flawless service for the big day.",
  },
  {
    name: "Birthday Catering",
    image: svcBirthday,
    description: "Playful menus, dessert tables and snack counters that keep every guest happy.",
  },
  {
    name: "Corporate Events",
    image: svcCorporate,
    description: "Punctual, neatly plated lunches and hi-tea for conferences and office days.",
  },
  {
    name: "Engagement Functions",
    image: svcEngagement,
    description: "Elegant appetizers and sweet counters styled for photographs and family.",
  },
  {
    name: "Religious Functions",
    image: svcReligious,
    description: "Pure-veg satvik cooking, prasadam and traditional banana leaf meals.",
  },
  {
    name: "College Events",
    image: svcCollege,
    description: "High-volume street food counters priced for student budgets.",
  },
  {
    name: "Family Gatherings",
    image: svcFamily,
    description: "Home-style regional cooking served warm at reunions and house warmings.",
  },
  {
    name: "Custom Events",
    image: svcCustom,
    description: "Tell us the theme and headcount — we design the menu around you.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-secondary px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            What We Do
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight text-charcoal sm:text-[3.2rem]">
            Catering For <span className="font-script text-primary">Every Occasion</span>
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.name} delay={(i % 4) * 90}>
              <article className="group h-full overflow-hidden rounded-sm bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-charcoal/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-charcoal">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <a
                    href="#booking"
                    className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.2em] text-primary transition-colors hover:text-charcoal"
                  >
                    EXPLORE <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
