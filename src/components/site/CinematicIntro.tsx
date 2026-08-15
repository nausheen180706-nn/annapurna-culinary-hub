import { useEffect, useRef, useState } from "react";
import { LeafMark } from "./Logo";

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [startLeaf, setStartLeaf] = useState(false);
  const [startTitle, setStartTitle] = useState(false);
  const [startSub, setStartSub] = useState(false);
  const [startLine, setStartLine] = useState(false);

  // Animation staging timeouts
  useEffect(() => {
    // 1. Black screen & particles start immediately (t = 0)
    
    // 2. Leaf logo fades in (t = 300ms)
    const leafTimeout = setTimeout(() => setStartLeaf(true), 300);

    // 3. Title letter-by-letter starts (t = 800ms)
    const titleTimeout = setTimeout(() => setStartTitle(true), 800);

    // 4. Thin line expands (t = 1500ms)
    const lineTimeout = setTimeout(() => setStartLine(true), 1500);

    // 5. Subtitle "CATERING SERVICE" fades in (t = 1800ms)
    const subTimeout = setTimeout(() => setStartSub(true), 1800);

    // 6. Intro slide-up & fade-out begins (t = 2800ms)
    const exitTimeout = setTimeout(() => {
      setIsExiting(true);
      onComplete(); // Trigger Hero entry animation simultaneously
    }, 2800);

    return () => {
      clearTimeout(leafTimeout);
      clearTimeout(titleTimeout);
      clearTimeout(lineTimeout);
      clearTimeout(subTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  // Canvas particle animation (Warm gold/orange embers)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle definition
    interface Ember {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
    }

    const embers: Ember[] = [];
    const maxEmbers = 45;

    // Helper to spawn an ember
    const createEmber = (startYAtBottom = false): Ember => {
      const isOrange = Math.random() > 0.45;
      // Ember colors (Gold/Orange)
      const color = isOrange
        ? `oklch(0.65 0.18 42 / ` // Ember orange base
        : `oklch(0.78 0.14 72 / `; // Gold base

      return {
        x: Math.random() * width,
        y: startYAtBottom ? height + 10 : Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.9 + 0.4), // drift upwards
        alpha: Math.random() * 0.5 + 0.3,
        decay: Math.random() * 0.003 + 0.0015,
        color,
      };
    };

    // Initialize particles across screen
    for (let i = 0; i < maxEmbers; i++) {
      embers.push(createEmber(false));
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background vignette/glow in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.8
      );
      gradient.addColorStop(0, "rgba(224, 106, 59, 0.04)"); // subtle ember orange glow center
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw and update embers
      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];
        
        // Render glowing blur shadow
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color.includes("0.65") ? "#e06a3b" : "#c5a880";
        
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Update physics
        p.x += p.vx + Math.sin(p.y / 30) * 0.15; // gentle swaying
        p.y += p.vy;
        p.alpha -= p.decay;

        // Reset particle if it leaves screen or fades out
        if (p.y < -10 || p.alpha <= 0 || p.x < 0 || p.x > width) {
          embers[i] = createEmber(true);
        }
      }

      // Reset shadow for subsequent drawings
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const titleText = "ANNAPURNAM";

  return (
    <div
      className={`fixed inset-0 z-55 flex flex-col items-center justify-center bg-black transition-all duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) select-none ${
        isExiting ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Background Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />

      {/* Cinematic Logo Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* 1. Leaf Icon */}
        <div
          className={`transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1) transform ${
            startLeaf ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-[0.6] rotate-[-15deg]"
          }`}
        >
          <LeafMark className="h-16 w-16 text-accent mb-6 drop-shadow-[0_0_15px_rgba(197,168,128,0.25)]" />
        </div>

        {/* 2. Main Title - Letter by letter */}
        <h1 className="font-display text-4xl font-semibold tracking-[0.25em] text-cream sm:text-5xl uppercase leading-none min-h-[3rem]">
          {startTitle &&
            titleText.split("").map((char, index) => (
              <span
                key={index}
                className="cin-animate-letter inline-block"
                style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
        </h1>

        {/* 3. Horizontal Expanding Gold Line */}
        <div className="w-[14rem] h-[1px] overflow-hidden my-3 relative">
          {startLine && (
            <div className="h-full bg-gradient-to-r from-transparent via-accent/70 to-transparent cin-line-expand" />
          )}
        </div>

        {/* 4. Subtitle */}
        <div className="min-h-[1.5rem] overflow-hidden">
          {startSub && (
            <p className="cin-animate-fade-up text-[0.68rem] font-bold tracking-[0.45em] text-cream/70 uppercase">
              CATERING SERVICE
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
