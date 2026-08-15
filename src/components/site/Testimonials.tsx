import { Quote, Star } from "lucide-react";
import { useReviews } from "@/lib/catering-data";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { data: reviews = [], isLoading } = useReviews();

  return (
    <section className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[86rem]">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-10 bg-primary" />
            Guest Voices
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] leading-tight text-charcoal sm:text-[3.2rem]">
            What Our <span className="font-script text-primary">Customers Say</span>
          </h2>
        </Reveal>

        {isLoading ? (
          <p className="mt-14 text-sm text-muted-foreground">Loading reviews…</p>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {reviews.map((review, i) => (
              <Reveal as="li" key={review.id} delay={(i % 4) * 90} className="h-full">
                <article className="flex h-full flex-col rounded-sm border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                  <Quote className="h-7 w-7 text-accent" />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{review.review}”
                  </p>
                  <div className="mt-6 flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={
                          idx < review.rating
                            ? "h-4 w-4 fill-accent text-accent"
                            : "h-4 w-4 text-border"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-4 font-display text-lg text-charcoal">{review.customer_name}</p>
                  <p className="text-[0.62rem] font-bold tracking-[0.2em] text-primary uppercase">
                    {review.event_type}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
