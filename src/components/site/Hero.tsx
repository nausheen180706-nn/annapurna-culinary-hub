import { heroBiryani } from "@/lib/site-images";
import { BrushDivider } from "./BrushDivider";
import { LeafMark } from "./Logo";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-charcoal pt-28 sm:pt-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{ backgroundImage: "var(--gradient-dark)" }}
      />
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full blur-[140px]"
        style={{ background: "color-mix(in oklab, var(--ember) 26%, transparent)" }}
      />
      <LeafMark
        aria-hidden
        className="absolute top-40 left-[-2rem] hidden h-40 w-40 rotate-[18deg] text-accent/10 lg:block"
      />
      <LeafMark
        aria-hidden
        className="absolute bottom-40 left-1/2 hidden h-24 w-24 -rotate-45 text-accent/10 xl:block"
      />

      <div className="relative mx-auto grid max-w-[86rem] items-center gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-36">
        <div className="max-w-xl">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-10 bg-accent" />
            Premium Indian Catering
          </p>

          <h1 className="mt-7">
            <span className="block font-script text-[3rem] leading-[1.05] text-cream sm:text-[4.4rem] lg:text-[5.2rem]">
              Delicious Food
            </span>
            <span className="mt-2 block font-display text-[2.1rem] leading-[1.1] font-light tracking-[0.04em] text-cream/95 uppercase sm:text-[2.9rem] lg:text-[3.3rem]">
              For Your Special
              <span className="ml-3 text-primary italic">Occasions</span>
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-[0.98rem] leading-relaxed text-cream/65">
            From intimate gatherings to grand celebrations, Annapurnam Catering Service brings
            authentic flavors, beautiful presentation and heartfelt hospitality to your special
            moments.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#booking"
              className="group inline-flex items-center justify-center rounded-sm bg-primary px-9 py-4 text-xs font-bold tracking-[0.22em] text-primary-foreground shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-charcoal"
            >
              BOOK YOUR EVENT
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center rounded-sm border border-cream/30 px-9 py-4 text-xs font-bold tracking-[0.22em] text-cream transition-all duration-300 hover:border-accent hover:text-accent"
            >
              EXPLORE MENU
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-cream/12 pt-8">
            {[
              ["1200+", "Events Served"],
              ["18 yrs", "Of Cooking"],
              ["4.9★", "Guest Rating"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl text-accent sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-[0.65rem] tracking-[0.18em] text-cream/50 uppercase">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-6 rounded-full blur-[80px]"
            style={{ background: "color-mix(in oklab, var(--gold) 22%, transparent)" }}
          />
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <img
              src={heroBiryani}
              alt="Hyderabadi chicken biryani served in a copper handi"
              width={1200}
              height={1200}
              className="h-full w-full rounded-full object-cover"
              style={{
                maskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 76%)",
                WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 76%)",
              }}
            />
            <div className="absolute right-2 bottom-6 rounded-sm bg-cream/95 px-5 py-4 shadow-lift sm:right-6">
              <p className="font-script text-2xl text-primary">Signature</p>
              <p className="mt-1 text-[0.62rem] font-bold tracking-[0.2em] text-charcoal/70">
                DUM BIRYANI
              </p>
            </div>
          </div>
        </div>
      </div>

      <BrushDivider className="relative -mb-px" />
    </section>
  );
}
