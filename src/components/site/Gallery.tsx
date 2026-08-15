import {
  aboutFeast,
  galStaff,
  galSweets,
  heroBiryani,
  svcBirthday,
  svcCorporate,
  svcCustom,
  svcWedding,
} from "@/lib/site-images";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const SHOTS = [
  { src: svcWedding, alt: "Golden wedding buffet vessels", span: "sm:col-span-2 sm:row-span-2" },
  { src: heroBiryani, alt: "Copper handi of dum biryani", span: "" },
  { src: galSweets, alt: "Indian sweets on a brass plate", span: "" },
  { src: galStaff, alt: "Chefs plating dishes in the kitchen", span: "sm:row-span-2" },
  { src: aboutFeast, alt: "Banana leaf sadhya spread", span: "" },
  { src: svcBirthday, alt: "Birthday dessert and snack table", span: "" },
  { src: svcCorporate, alt: "Corporate lunch buffet line", span: "sm:col-span-2" },
  { src: svcCustom, alt: "Live cooking counter at an event", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            From Our Events
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight text-charcoal sm:text-[3.2rem]">
            A Glimpse of <span className="font-script text-primary">Our Tables</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid auto-rows-[11rem] grid-cols-1 gap-4 sm:auto-rows-[13rem] sm:grid-cols-4">
          {SHOTS.map((shot, i) => (
            <Reveal
              key={shot.alt}
              delay={(i % 4) * 80}
              className={cn("group overflow-hidden rounded-sm shadow-soft", shot.span)}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-115"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
