import {
  BadgeIndianRupee,
  ChefHat,
  Clock,
  Leaf,
  ShieldCheck,
  Soup,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Reveal } from "./Reveal";

const REASONS = [
  { icon: Leaf, title: "Fresh & Quality Ingredients", text: "Sourced every morning from trusted local markets." },
  { icon: ChefHat, title: "Experienced Chefs", text: "Regional specialists with decades behind the pot." },
  { icon: Soup, title: "Authentic Taste", text: "Hand-ground masalas, no shortcuts, no premixes." },
  { icon: ShieldCheck, title: "Hygienic Preparation", text: "FSSAI-compliant kitchens and sealed transport." },
  { icon: Sparkles, title: "Professional Service", text: "Uniformed, briefed and courteous service teams." },
  { icon: UtensilsCrossed, title: "Customized Menus", text: "Built around your community, diet and budget." },
  { icon: Clock, title: "On-Time Delivery", text: "Counters set and hot food ready before guests arrive." },
  { icon: BadgeIndianRupee, title: "Affordable Packages", text: "Clear per-plate pricing with no hidden extras." },
];

export function WhyUs() {
  return (
    <section className="bg-charcoal px-5 py-24 text-cream sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-10 bg-accent" />
            The Difference
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight sm:text-[3.2rem]">
            Why Choose <span className="font-script text-accent">Annapurnam?</span>
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 4) * 80}>
              <div className="group h-full bg-charcoal p-8 transition-colors duration-500 hover:bg-charcoal-soft">
                <Icon className="h-7 w-7 text-primary transition-transform duration-500 group-hover:-translate-y-1 group-hover:text-accent" />
                <h3 className="mt-5 font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/55">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
