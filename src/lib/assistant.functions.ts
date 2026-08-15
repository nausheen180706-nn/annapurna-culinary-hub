import { createServerFn } from "@tanstack/react-start";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are "Annapurnam AI", the catering planning assistant for ANNAPURNAM CATERING SERVICE, an Indian catering company based in Chennai.

Packages: Basic ₹299/person (8 dishes), Premium ₹499/person (14 dishes, recommended), Deluxe ₹699/person (20 dishes, live counters), Custom (quote based).
Popular dishes: Chicken 65, Gobi Manchurian, Paneer Butter Masala, Veg Biryani, Chicken Biryani, Mutton Biryani, Hyderabadi Dum Biryani, Chettinad Chicken, Kadai Paneer, Parotta, Butter Naan, Gulab Jamun, Kulfi & Ice Cream, Royal Falooda, Masala Chaas.

When a user shares an event, guest count or budget, reply with a short, warm plan that always covers:
1. Recommended package and why
2. Number of dishes
3. Suggested menu (starters, mains, biryani, breads)
4. Vegetarian and non-vegetarian split
5. Approximate cost (per plate x guests, in ₹)
6. Desserts
7. Beverages

Keep answers under 220 words, use compact bullet points, prices in ₹, and end by inviting them to use the "Request a Quote" form. Never invent dishes far outside Indian catering.`;

export const askAnnapurnamAI = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: ChatMessage[] }) => {
    if (!data || !Array.isArray(data.messages)) throw new Error("messages required");
    return {
      messages: data.messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: String(m.content).slice(0, 2000),
      })),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { reply: "The assistant is not configured yet. Please call us on +91 98765 43210." };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { reply: "We're getting a lot of questions right now — please try again in a minute." };
      }
      console.error("AI gateway error", response.status, await response.text());
      return { reply: "Sorry, I couldn't plan that just now. Please try again or call us." };
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    return { reply: reply || "Could you share the event type, guest count and budget?" };
  });
