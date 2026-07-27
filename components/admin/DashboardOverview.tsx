"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Counts = {
  portfolio: number;
  testimonials: number;
  partners: number;
  newLeads: number;
  balance: number;
};

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

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
      const [p, t, pr, leads, tx] = await Promise.all([
        supabase.from("portfolio").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase.from("transactions").select("type, amount"),
      ]);
      const txRows = (tx.data as { type: string; amount: number }[] | null) ?? [];
      const balance = txRows.reduce(
        (acc, r) => acc + (r.type === "income" ? r.amount : -r.amount),
        0
      );
      setCounts({
        portfolio: p.count ?? 0,
        testimonials: t.count ?? 0,
        partners: pr.count ?? 0,
        newLeads: leads.count ?? 0,
        balance,
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

      <Link
        href={`/${lang}/admin/keuangan`}
        className="mt-8 block rounded-2xl bg-forest-dark p-6 text-off-white transition-colors hover:bg-forest-dark/90"
      >
        <p className="text-sm font-medium text-off-white/70">Saldo kas (cash flow)</p>
        <p className="mt-2 font-display text-3xl font-bold">
          {counts ? rp(counts.balance) : "—"}
        </p>
        <p className="mt-1 text-xs text-off-white/50">Klik untuk kelola keuangan →</p>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
