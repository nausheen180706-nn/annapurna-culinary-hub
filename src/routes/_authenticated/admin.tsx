import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, ClipboardList, Clock, LogOut, Trash2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MENU_CATEGORIES, type MenuItem, type Package, type Review } from "@/lib/catering-data";
import { dishImageKeys } from "@/lib/site-images";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Annapurnam Catering Service" },
      { name: "description", content: "Manage bookings, menu, packages and enquiries." },
      { property: "og:title", content: "Admin Dashboard | Annapurnam Catering Service" },
      { property: "og:description", content: "Manage bookings, menu, packages and enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

type Booking = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  location: string;
  food_preference: string;
  package: string;
  special_requirements: string | null;
  status: string;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

const TABS = ["Bookings", "Menu", "Packages", "Enquiries", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const input =
  "w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("Bookings");

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is_admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });

  const bookings = useQuery({
    queryKey: ["admin", "bookings"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const menu = useQuery({
    queryKey: ["admin", "menu"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
  });

  const packages = useQuery({
    queryKey: ["admin", "packages"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<Package[]> => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Package[];
    },
  });

  const messages = useQuery({
    queryKey: ["admin", "messages"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<ContactMessage[]> => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContactMessage[];
    },
  });

  const reviews = useQuery({
    queryKey: ["admin", "reviews"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    void navigate({ to: "/auth" });
  }

  if (roleLoading) {
    return <p className="grid min-h-screen place-items-center bg-charcoal text-cream">Loading…</p>;
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-charcoal px-5 text-center text-cream">
        <div className="max-w-md">
          <Logo />
          <h1 className="mt-8 font-display text-3xl">Admin access required</h1>
          <p className="mt-3 text-sm text-cream/60">
            This account is signed in but does not have administrator rights.
          </p>
          <button
            onClick={signOut}
            className="mt-8 rounded-sm bg-primary px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-primary-foreground"
          >
            SIGN OUT
          </button>
        </div>
      </main>
    );
  }

  const all = bookings.data ?? [];
  const stats = [
    { label: "Total Bookings", value: all.length, icon: ClipboardList },
    {
      label: "Pending Bookings",
      value: all.filter((b) => b.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Confirmed Bookings",
      value: all.filter((b) => b.status === "confirmed").length,
      icon: CalendarCheck,
    },
    {
      label: "Completed Bookings",
      value: all.filter((b) => b.status === "completed").length,
      icon: UtensilsCrossed,
    },
  ];

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Booking marked ${status}`);
    void qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
  }

  return (
    <div className="min-h-screen bg-charcoal text-cream">
      <header className="border-b border-cream/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[86rem] flex-wrap items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-sm border border-cream/20 px-5 py-3 text-[0.62rem] font-bold tracking-[0.2em] text-cream/70 hover:border-accent hover:text-accent"
            >
              VIEW SITE
            </a>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-[0.62rem] font-bold tracking-[0.2em] text-primary-foreground hover:bg-accent hover:text-charcoal"
            >
              <LogOut className="h-3.5 w-3.5" /> SIGN OUT
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[86rem] px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl">
          Dashboard <span className="font-script text-accent">Overview</span>
        </h1>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <li key={label} className="rounded-sm border border-cream/10 bg-charcoal-soft p-6">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 font-display text-4xl text-accent">{value}</p>
              <p className="mt-1 text-[0.62rem] font-bold tracking-[0.2em] text-cream/50 uppercase">
                {label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-sm border px-5 py-3 text-[0.62rem] font-bold tracking-[0.18em] uppercase transition-colors",
                tab === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-cream/15 text-cream/60 hover:border-accent hover:text-accent",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "Bookings" && (
            <div className="space-y-4">
              {all.length === 0 && <p className="text-sm text-cream/50">No bookings yet.</p>}
              {all.map((b) => (
                <article
                  key={b.id}
                  className="rounded-sm border border-cream/10 bg-charcoal-soft p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl">{b.customer_name}</h3>
                      <p className="mt-1 text-xs text-cream/55">
                        {b.phone} · {b.email}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-sm px-3 py-1.5 text-[0.58rem] font-bold tracking-[0.2em] uppercase",
                        b.status === "confirmed" && "bg-accent text-charcoal",
                        b.status === "pending" && "bg-primary text-primary-foreground",
                        b.status === "rejected" && "bg-destructive text-cream",
                        b.status === "completed" && "bg-cream/15 text-cream",
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                  <dl className="mt-5 grid gap-3 text-sm text-cream/70 sm:grid-cols-3">
                    <div>
                      <dt className="text-[0.58rem] tracking-[0.2em] text-cream/40 uppercase">Event</dt>
                      <dd>
                        {b.event_type} · {b.event_date}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] tracking-[0.2em] text-cream/40 uppercase">
                        Guests / Package
                      </dt>
                      <dd>
                        {b.guest_count} guests · {b.package}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] tracking-[0.2em] text-cream/40 uppercase">
                        Location / Food
                      </dt>
                      <dd>
                        {b.location} · {b.food_preference}
                      </dd>
                    </div>
                  </dl>
                  {b.special_requirements && (
                    <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm whitespace-pre-wrap text-cream/60">
                      {b.special_requirements}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["confirmed", "rejected", "completed", "pending"].map((s) => (
                      <button
                        key={s}
                        onClick={() => void setStatus(b.id, s)}
                        disabled={b.status === s}
                        className="rounded-sm border border-cream/20 px-4 py-2 text-[0.58rem] font-bold tracking-[0.18em] uppercase transition-colors hover:border-accent hover:text-accent disabled:opacity-35"
                      >
                        {s === "confirmed"
                          ? "Accept"
                          : s === "rejected"
                            ? "Reject"
                            : `Mark ${s}`}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === "Menu" && <MenuAdmin items={menu.data ?? []} />}
          {tab === "Packages" && <PackagesAdmin items={packages.data ?? []} />}

          {tab === "Enquiries" && (
            <div className="space-y-4">
              {(messages.data ?? []).length === 0 && (
                <p className="text-sm text-cream/50">No customer enquiries yet.</p>
              )}
              {(messages.data ?? []).map((m) => (
                <article key={m.id} className="rounded-sm border border-cream/10 bg-charcoal-soft p-6">
                  <h3 className="font-display text-lg">{m.name}</h3>
                  <p className="mt-1 text-xs text-cream/55">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ""}
                  </p>
                  <p className="mt-4 text-sm text-cream/70">{m.message}</p>
                </article>
              ))}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="space-y-4">
              {(reviews.data ?? []).length === 0 && (
                <p className="text-sm text-cream/50">No reviews yet.</p>
              )}
              {(reviews.data ?? []).map((r) => (
                <article key={r.id} className="rounded-sm border border-cream/10 bg-charcoal-soft p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg">
                      {r.customer_name}{" "}
                      <span className="text-accent">{"★".repeat(Math.max(1, r.rating))}</span>
                    </h3>
                    <button
                      onClick={async () => {
                        const { error } = await supabase
                          .from("reviews")
                          .update({ is_published: !r.is_published })
                          .eq("id", r.id);
                        if (error) return toast.error(error.message);
                        void qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
                        void qc.invalidateQueries({ queryKey: ["reviews", "published"] });
                      }}
                      className="rounded-sm border border-cream/20 px-4 py-2 text-[0.58rem] font-bold tracking-[0.18em] uppercase hover:border-accent hover:text-accent"
                    >
                      {r.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-cream/70">{r.review}</p>
                  <p className="mt-2 text-[0.6rem] tracking-[0.2em] text-primary uppercase">
                    {r.event_type}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MenuAdmin({ items }: { items: MenuItem[] }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState({
    name: "",
    category: MENU_CATEGORIES[0] as string,
    description: "",
    price: "",
    image_key: dishImageKeys[0] ?? "chicken-biryani",
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "menu"] });
    void qc.invalidateQueries({ queryKey: ["menu_items"] });
  };

  async function add() {
    if (!draft.name.trim()) return toast.error("Dish name is required");
    const { error } = await supabase.from("menu_items").insert({
      name: draft.name.trim(),
      category: draft.category,
      description: draft.description.trim(),
      price: Number(draft.price) || 0,
      image_key: draft.image_key,
      sort_order: items.length + 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Dish added");
    setDraft({ ...draft, name: "", description: "", price: "" });
    refresh();
  }

  async function update(item: MenuItem, patch: Partial<MenuItem>) {
    const { error } = await supabase.from("menu_items").update(patch).eq("id", item.id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dish removed");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-sm border border-cream/10 bg-charcoal-soft p-6 sm:grid-cols-5">
        <input
          className={input}
          placeholder="Dish name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <select
          className={input}
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          {MENU_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className={input}
          placeholder="Description"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <input
          className={input}
          type="number"
          placeholder="Price ₹"
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: e.target.value })}
        />
        <div className="flex gap-2">
          <select
            className={input}
            value={draft.image_key}
            onChange={(e) => setDraft({ ...draft, image_key: e.target.value })}
          >
            {dishImageKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <button
            onClick={() => void add()}
            className="shrink-0 rounded-sm bg-primary px-4 text-[0.6rem] font-bold tracking-[0.16em] text-primary-foreground"
          >
            ADD
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid gap-3 rounded-sm border border-cream/10 bg-charcoal-soft p-4 sm:grid-cols-[1.2fr_1fr_2fr_.6fr_auto] sm:items-center"
          >
            <input
              className={input}
              defaultValue={item.name}
              onBlur={(e) => e.target.value !== item.name && void update(item, { name: e.target.value })}
            />
            <select
              className={input}
              defaultValue={item.category}
              onChange={(e) => void update(item, { category: e.target.value })}
            >
              {MENU_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className={input}
              defaultValue={item.description}
              onBlur={(e) =>
                e.target.value !== item.description && void update(item, { description: e.target.value })
              }
            />
            <input
              className={input}
              type="number"
              defaultValue={item.price}
              onBlur={(e) =>
                Number(e.target.value) !== Number(item.price) &&
                void update(item, { price: Number(e.target.value) })
              }
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void update(item, { is_available: !item.is_available })}
                className="rounded-sm border border-cream/20 px-3 py-2 text-[0.55rem] font-bold tracking-[0.14em] uppercase hover:border-accent hover:text-accent"
              >
                {item.is_available ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => void remove(item.id)}
                aria-label={`Delete ${item.name}`}
                className="grid h-9 w-9 place-items-center rounded-sm border border-cream/20 text-cream/60 hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PackagesAdmin({ items }: { items: Package[] }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState({ name: "", price_label: "", description: "", features: "" });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "packages"] });
    void qc.invalidateQueries({ queryKey: ["packages"] });
  };

  async function add() {
    if (!draft.name.trim() || !draft.price_label.trim())
      return toast.error("Name and price label are required");
    const { error } = await supabase.from("packages").insert({
      name: draft.name.trim(),
      price_label: draft.price_label.trim(),
      description: draft.description.trim(),
      features: draft.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      sort_order: items.length + 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Package added");
    setDraft({ name: "", price_label: "", description: "", features: "" });
    refresh();
  }

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("packages").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Package removed");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-sm border border-cream/10 bg-charcoal-soft p-6 sm:grid-cols-5">
        <input
          className={input}
          placeholder="Package name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <input
          className={input}
          placeholder="₹499 / person"
          value={draft.price_label}
          onChange={(e) => setDraft({ ...draft, price_label: e.target.value })}
        />
        <input
          className={input}
          placeholder="Description"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <input
          className={input}
          placeholder="Features, comma separated"
          value={draft.features}
          onChange={(e) => setDraft({ ...draft, features: e.target.value })}
        />
        <button
          onClick={() => void add()}
          className="rounded-sm bg-primary px-4 py-2.5 text-[0.6rem] font-bold tracking-[0.16em] text-primary-foreground"
        >
          ADD PACKAGE
        </button>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <li key={p.id} className="space-y-3 rounded-sm border border-cream/10 bg-charcoal-soft p-5">
            <input
              className={input}
              defaultValue={p.name}
              onBlur={(e) => e.target.value !== p.name && void update(p.id, { name: e.target.value })}
            />
            <input
              className={input}
              defaultValue={p.price_label}
              onBlur={(e) =>
                e.target.value !== p.price_label && void update(p.id, { price_label: e.target.value })
              }
            />
            <textarea
              className={cn(input, "resize-none")}
              rows={2}
              defaultValue={p.description}
              onBlur={(e) =>
                e.target.value !== p.description && void update(p.id, { description: e.target.value })
              }
            />
            <textarea
              className={cn(input, "resize-none")}
              rows={3}
              defaultValue={p.features.join(", ")}
              onBlur={(e) =>
                void update(p.id, {
                  features: e.target.value
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean),
                })
              }
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => void update(p.id, { is_recommended: !p.is_recommended })}
                className="rounded-sm border border-cream/20 px-4 py-2 text-[0.58rem] font-bold tracking-[0.16em] uppercase hover:border-accent hover:text-accent"
              >
                {p.is_recommended ? "Recommended ✓" : "Mark recommended"}
              </button>
              <button
                onClick={() => void remove(p.id)}
                aria-label={`Delete ${p.name}`}
                className="grid h-9 w-9 place-items-center rounded-sm border border-cream/20 text-cream/60 hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
