import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquareHeart, Send, X } from "lucide-react";
import { askAnnapurnamAI } from "@/lib/assistant.functions";
import { LeafMark } from "./Logo";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Namaskaram! I'm Annapurnam AI. Tell me your event, guest count and budget — for example “a wedding for 150 people with a budget of ₹75,000” — and I'll plan the menu for you.",
};

const SUGGESTIONS = [
  "Wedding for 150 people, budget ₹75,000",
  "Pure veg menu for a 60 guest housewarming",
  "Corporate lunch for 200 staff",
];

export function AIAssistant() {
  const ask = useServerFn(askAnnapurnamAI);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const result = await ask({
        data: { messages: next.filter((m) => m !== GREETING) },
      });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or call +91 98765 43210.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Annapurnam AI" : "Open Annapurnam AI assistant"}
        className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform duration-300 hover:scale-105 sm:right-8 sm:bottom-8"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquareHeart className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed right-3 bottom-24 z-50 flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-sm bg-charcoal text-cream shadow-lift transition-all duration-300 sm:right-8",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 border-b border-cream/10 bg-charcoal-soft px-5 py-4">
          <LeafMark className="h-6 w-6 text-accent" />
          <div>
            <p className="font-display text-lg leading-none">Annapurnam AI</p>
            <p className="mt-1 text-[0.62rem] tracking-[0.14em] text-cream/50 uppercase">
              Not sure what menu to choose? Let us help you plan.
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[22rem] min-h-[14rem] space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-cream/8 text-cream/85",
              )}
            >
              {m.content}
            </div>
          ))}
          {busy && <p className="text-xs text-cream/45">Annapurnam AI is planning…</p>}
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-sm border border-cream/15 px-3 py-2 text-[0.68rem] text-cream/65 transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 border-t border-cream/10 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about menus, budgets, guests…"
            className="flex-1 rounded-sm bg-cream/8 px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/40"
          />
          <button
            type="submit"
            disabled={busy}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
