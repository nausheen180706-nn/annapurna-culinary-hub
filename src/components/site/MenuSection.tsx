import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { MENU_CATEGORIES, useMenuItems } from "@/lib/catering-data";
import { dishImage } from "@/lib/site-images";
import { useEnquiry } from "@/lib/enquiry";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MenuSection() {
  const [active, setActive] = useState<string>(MENU_CATEGORIES[0]);
  const { data: items = [], isLoading } = useMenuItems();
  const enquiry = useEnquiry();

  const visible = items.filter((i) => i.category === active && i.is_available);

  return (
    <section id="menu" className="bg-charcoal px-5 py-24 text-cream sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-accent">
            <span className="h-px w-10 bg-accent" />
            Handpicked Dishes
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight sm:text-[3.2rem]">
            Our <span className="font-script text-accent">Special Menu</span>
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-sm border px-5 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase transition-all duration-300",
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-cream/18 text-cream/60 hover:border-accent hover:text-accent",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-16 text-sm text-cream/50">Loading the menu…</p>
        ) : visible.length === 0 ? (
          <p className="mt-16 text-sm text-cream/50">
            Dishes for this category are being updated. Ask us for the full list.
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, i) => {
              const added = enquiry.has(item.name);
              return (
                <Reveal as="li" key={item.id} delay={(i % 3) * 90}>
                  <article className="group flex h-full gap-5 rounded-sm border border-cream/10 bg-charcoal-soft p-4 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm">
                      <img
                        src={dishImage(item.image_key)}
                        alt={item.name}
                        loading="lazy"
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg leading-tight">{item.name}</h3>
                        <span className="shrink-0 font-display text-lg text-accent">
                          ₹{Number(item.price).toFixed(0)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-cream/55">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => {
                          enquiry.toggle(item.name);
                          toast[added ? "info" : "success"](
                            added ? `${item.name} removed from enquiry` : `${item.name} added to enquiry`,
                          );
                        }}
                        className={cn(
                          "mt-auto inline-flex w-fit items-center gap-2 pt-4 text-[0.62rem] font-bold tracking-[0.2em] transition-colors",
                          added ? "text-accent" : "text-primary hover:text-accent",
                        )}
                      >
                        {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {added ? "ADDED TO ENQUIRY" : "ADD TO ENQUIRY"}
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}

        {enquiry.items.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-4 rounded-sm border border-accent/30 bg-cream/5 p-6">
            <p className="text-sm text-cream/70">
              <span className="font-display text-xl text-accent">{enquiry.items.length}</span> dishes in
              your enquiry list
            </p>
            <a
              href="#booking"
              className="ml-auto rounded-sm bg-primary px-7 py-3 text-[0.65rem] font-bold tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent hover:text-charcoal"
            >
              SEND ENQUIRY
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
