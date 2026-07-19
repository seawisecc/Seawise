"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Supabase belum dikonfigurasi. Isi .env.local dengan URL & anon key lalu restart server."
      );
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    router.push(`/${lang}/admin`);
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-3 text-forest-dark placeholder:text-forest-dark/40 focus:border-sea-foam focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5 text-forest-dark">
          <Logo className="h-8 w-8" colorClass="text-forest-dark" />
          <span className="font-display text-xl font-bold tracking-tight">
            SEAWISE
          </span>
        </div>

        <div className="rounded-2xl border border-warm-neutral bg-white/70 p-8">
          <h1 className="font-display text-2xl font-bold text-forest-dark">
            Admin Login
          </h1>
          <p className="mt-1.5 text-sm text-forest-dark/60">
            Masuk untuk mengelola isi website.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-forest-dark">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="admin@seawise.id"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-forest-dark">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest-dark px-6 py-3 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam disabled:opacity-60"
            >
              {loading ? "Masuk…" : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
