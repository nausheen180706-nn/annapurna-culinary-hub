import { Check } from "lucide-react";
import { usePackages } from "@/lib/catering-data";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Packages({ onChoose }: { onChoose: (name: string) => void }) {
  const { data: packages = [], isLoading } = usePackages();

  return (
    <section id="packages" className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            Transparent Pricing
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight text-charcoal sm:text-[3.2rem]">
            Choose Your <span className="font-script text-primary">Perfect Package</span>
          </h2>
        </Reveal>

        {isLoading ? (
          <p className="mt-14 text-sm text-muted-foreground">Loading packages…</p>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg, i) => (
              <Reveal as="li" key={pkg.id} delay={i * 90} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-sm p-8 transition-all duration-500 hover:-translate-y-2",
                    pkg.is_recommended
                      ? "bg-charcoal text-cream shadow-lift"
                      : "border border-border bg-card shadow-soft",
                  )}
                >
                  {pkg.is_recommended && (
                    <span className="mb-5 w-fit rounded-sm bg-primary px-3 py-1.5 text-[0.58rem] font-bold tracking-[0.2em] text-primary-foreground">
                      MOST RECOMMENDED
                    </span>
                  )}
                  <h3
                    className={cn(
                      "text-[0.72rem] font-bold tracking-[0.3em]",
                      pkg.is_recommended ? "text-accent" : "text-primary",
                    )}
                  >
                    {pkg.name.toUpperCase()}
                  </h3>
                  <p className="mt-4 font-display text-4xl">{pkg.price_label}</p>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-relaxed",
                      pkg.is_recommended ? "text-cream/60" : "text-muted-foreground",
                    )}
                  >
                    {pkg.description}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            pkg.is_recommended ? "text-accent" : "text-primary",
                          )}
                        />
                        <span className={pkg.is_recommended ? "text-cream/80" : "text-foreground"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onChoose(pkg.name)}
                    className={cn(
                      "mt-8 w-full rounded-sm px-6 py-4 text-[0.65rem] font-bold tracking-[0.2em] transition-all duration-300",
                      pkg.is_recommended
                        ? "bg-primary text-primary-foreground hover:bg-accent hover:text-charcoal"
                        : "bg-charcoal text-cream hover:bg-primary",
                    )}
                  >
                    CHOOSE PACKAGE
                  </button>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
