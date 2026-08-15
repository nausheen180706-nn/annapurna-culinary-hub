import { cn } from "@/lib/utils";

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-6 w-6", className)} aria-hidden>
      <path
        d="M27 5C15 5 6 10 6 19c0 3 1.3 5.5 3.4 7.2C13 22 17.6 18.4 23 16c-4.6 3.2-8.5 7.2-11.2 11.7 1.6.8 3.4 1.3 5.2 1.3 6 0 10-5.6 10-13 0-4.3-.4-8-.4-11Z"
        fill="currentColor"
      />
      <path d="M5 27c2-2.4 3.6-4.4 5.6-6.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3">
      <LeafMark className={tone === "light" ? "text-accent" : "text-primary"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-[0.22em] sm:text-2xl",
            tone === "light" ? "text-cream" : "text-foreground",
          )}
        >
          ANNAPURNAM
        </span>
        <span
          className={cn(
            "mt-1 text-[0.58rem] font-semibold tracking-[0.4em]",
            tone === "light" ? "text-cream/60" : "text-muted-foreground",
          )}
        >
          CATERING SERVICE
        </span>
      </span>
    </span>
  );
}
