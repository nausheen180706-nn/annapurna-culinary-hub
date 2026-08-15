import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

const TITLE = "Admin Sign In | Annapurnam Catering Service";
const DESCRIPTION = "Secure sign in for the Annapurnam Catering Service admin dashboard.";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      void navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: { full_name: fullName },
        },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. You can sign in now.");
      setMode("signin");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-charcoal px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-10 rounded-sm bg-card p-8 shadow-lift">
          <h1 className="font-display text-3xl text-charcoal">
            {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access bookings, menu and packages."
              : "The first account created becomes the administrator."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="eyebrow text-muted-foreground">Full Name</span>
                <input
                  className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>
            )}
            <label className="block">
              <span className="eyebrow text-muted-foreground">Email</span>
              <input
                type="email"
                className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Password</span>
              <input
                type="password"
                minLength={6}
                className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-primary px-8 py-4 text-[0.68rem] font-bold tracking-[0.22em] text-primary-foreground transition-colors hover:bg-charcoal disabled:opacity-60"
            >
              {busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-xs tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
        <a
          href="/"
          className="mt-8 block text-center text-[0.65rem] tracking-[0.2em] text-cream/50 uppercase hover:text-accent"
        >
          ← Back to website
        </a>
      </div>
    </main>
  );
}
