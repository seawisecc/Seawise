"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Counts = {
  portfolio: number;
  testimonials: number;
  partners: number;
  newLeads: number;
};

export default function DashboardOverview({ lang }: { lang: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const tables = ["portfolio", "testimonials", "partners"] as const;
      const [p, t, pr, leads] = await Promise.all([
        supabase.from("portfolio").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
      ]);
      void tables;
      setCounts({
        portfolio: p.count ?? 0,
        testimonials: t.count ?? 0,
        partners: pr.count ?? 0,
        newLeads: leads.count ?? 0,
      });
      setReady(true);
    })();
  }, []);

  const cards = [
    { slug: "portfolio", label: "Portfolio", value: counts?.portfolio },
    { slug: "testimonials", label: "Testimoni", value: counts?.testimonials },
    { slug: "partners", label: "Partner", value: counts?.partners },
    { slug: "leads", label: "Pesan baru", value: counts?.newLeads },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-dark">Dashboard</h1>
      <p className="mt-1.5 text-forest-dark/60">Kelola isi website Seawise.</p>

      {ready && !counts && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi. Isi <code>.env.local</code> untuk melihat data.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.slug}
            href={`/${lang}/admin/${c.slug}`}
            className="rounded-2xl border border-warm-neutral bg-white/70 p-6 transition-colors hover:border-sea-foam"
          >
            <p className="text-sm font-medium text-forest-dark/60">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-forest-dark">
              {c.value ?? "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
