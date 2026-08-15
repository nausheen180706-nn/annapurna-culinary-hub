import { Check } from "lucide-react";
import { aboutFeast, galSweets } from "@/lib/site-images";
import { Reveal } from "./Reveal";
import { LeafMark } from "./Logo";

const POINTS = [
  "Fresh Ingredients",
  "Authentic Flavors",
  "Experienced Chefs",
  "Hygienic Preparation",
  "Professional Service",
];

export function About() {
  return (
    <section id="about" className="relative bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[86rem] items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <Reveal className="relative">
          <LeafMark className="absolute -top-8 -left-4 h-20 w-20 -rotate-12 text-accent/35" />
          <img
            src={aboutFeast}
            alt="Traditional South Indian banana leaf feast with many small curries"
            loading="lazy"
            width={1008}
            height={1200}
            className="relative w-full max-w-lg rounded-sm object-cover shadow-lift"
          />
          <img
            src={galSweets}
            alt="Assorted Indian sweets on a brass plate"
            loading="lazy"
            width={800}
            height={800}
            className="absolute -right-2 -bottom-10 hidden w-44 rounded-sm border-8 border-background object-cover shadow-lift sm:block lg:-right-10 lg:w-56"
          />
          <LeafMark className="absolute right-24 -bottom-16 h-16 w-16 rotate-[140deg] text-accent/30" />
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            Our Story
          </p>
          <h2 className="mt-5 font-script text-[2.8rem] leading-tight text-charcoal sm:text-[3.6rem]">
            The Taste of Annapurnam
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            At Annapurnam Catering Service, every dish is prepared with care, quality ingredients and
            authentic flavors. Whether it is a wedding, birthday, corporate event or family
            celebration, we make every occasion memorable through delicious food and professional
            service.
          </p>

          <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{point}</span>
              </li>
            ))}
          </ul>

          <a
            href="#services"
            className="mt-11 inline-flex items-center rounded-sm bg-charcoal px-9 py-4 text-xs font-bold tracking-[0.22em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary"
          >
            LEARN MORE
          </a>
        </Reveal>
      </div>
    </section>
  );
}
