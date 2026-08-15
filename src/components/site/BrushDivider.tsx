import { cn } from "@/lib/utils";

/**
 * Painted brush-stroke transition between the dark hero and the cream sections.
 * `flip` renders the mirrored stroke (cream -> dark).
 */
export function BrushDivider({
  className,
  flip = false,
  fill = "var(--cream)",
}: {
  className?: string;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none w-full leading-[0]", flip && "rotate-180", className)}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[54px] w-full sm:h-[80px] md:h-[110px]"
      >
        <path
          fill={fill}
          d="M0,74 C60,52 118,96 186,88 C258,79 300,42 372,46 C446,50 480,96 556,98 C632,100 668,60 744,54 C826,47 872,90 950,92 C1030,94 1074,54 1152,50 C1228,46 1276,84 1344,86 C1382,87 1414,80 1440,68 L1440,120 L0,120 Z"
        />
        <path
          fill={fill}
          opacity="0.55"
          d="M0,96 C90,70 150,104 236,100 C330,95 372,66 470,72 C560,77 604,106 700,104 C800,102 846,72 944,76 C1040,80 1090,106 1188,102 C1274,99 1350,78 1440,88 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
