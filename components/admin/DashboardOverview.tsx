"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBar } from "./AdminSkeleton";
import {
  WalletIcon,
  TrendUpIcon,
  TrendDownIcon,
  LayersIcon,
  QuoteIcon,
  UsersIcon,
  InboxIcon,
  ArticleIcon,
} from "./AdminIcons";

type Stats = {
  portfolio: number;
  testimonials: number;
  partners: number;
  posts: number;
  newLeads: number;
  income: number;
  expense: number;
};

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

export default function DashboardOverview({ lang }: { lang: string }) {
  const [s, setS] = useState<Stats | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [p, t, pr, po, leads, tx] = await Promise.all([
        supabase.from("portfolio").select("id", head),
        supabase.from("testimonials").select("id", head),
        supabase.from("partners").select("id", head),
        supabase.from("posts").select("id", head),
        supabase.from("leads").select("id", head).eq("status", "new"),
        supabase.from("transactions").select("type, amount"),
      ]);
      const txRows = (tx.data as { type: string; amount: number }[] | null) ?? [];
      let income = 0;
      let expense = 0;
      for (const r of txRows) {
        if (r.type === "income") income += r.amount;
        else expense += r.amount;
      }
      setS({
        portfolio: p.count ?? 0,
        testimonials: t.count ?? 0,
        partners: pr.count ?? 0,
        posts: po.count ?? 0,
        newLeads: leads.count ?? 0,
        income,
        expense,
      });
      setReady(true);
    })();
  }, []);

  const balance = s ? s.income - s.expense : 0;

  const cards = [
    { slug: "portfolio", label: "Portfolio", value: s?.portfolio, Icon: LayersIcon },
    { slug: "blog", label: "Artikel", value: s?.posts, Icon: ArticleIcon },
    { slug: "testimonials", label: "Testimoni", value: s?.testimonials, Icon: QuoteIcon },
    { slug: "partners", label: "Partner", value: s?.partners, Icon: UsersIcon },
    { slug: "leads", label: "Pesan baru", value: s?.newLeads, Icon: InboxIcon },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-dark">Dashboard</h1>
          <p className="mt-1 text-forest-dark/60">Ringkasan bisnis Seawise Studio.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${lang}/admin/blog`} className="rounded-full bg-forest-dark px-4 py-2 text-sm font-medium text-off-white hover:bg-sea-foam">
            + Artikel
          </Link>
          <Link href={`/${lang}/admin/portfolio`} className="rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam">
            + Portfolio
          </Link>
        </div>
      </div>

      {ready && !s && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi. Isi <code>.env.local</code> untuk melihat data.
        </p>
      )}

      {/* Hero saldo */}
      <Link
        href={`/${lang}/admin/keuangan`}
        className="mt-6 block overflow-hidden rounded-3xl bg-gradient-to-br from-forest-dark to-near-black p-5 text-off-white transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(19,42,34,0.6)] sm:mt-8 sm:p-7 md:p-8"
      >
        <div className="flex items-center gap-2 text-off-white/70">
          <WalletIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Saldo kas</span>
        </div>
        <p className="mt-2 font-display text-3xl font-bold sm:mt-3 sm:text-4xl md:text-5xl">
          {s ? rp(balance) : <SkeletonBar className="h-9 w-48 bg-off-white/20" />}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-off-white/10 pt-4 sm:mt-6 sm:flex sm:flex-wrap sm:gap-6 sm:pt-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea-foam/20 text-sea-foam sm:h-9 sm:w-9">
              <TrendUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-off-white/60">Uang masuk</p>
              <p className="font-display text-base font-bold text-sea-foam sm:text-lg">
                {s ? rp(s.income) : <SkeletonBar className="h-5 w-24 bg-off-white/20" />}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-300 sm:h-9 sm:w-9">
              <TrendDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-off-white/60">Uang keluar</p>
              <p className="font-display text-base font-bold text-red-300 sm:text-lg">
                {s ? rp(s.expense) : <SkeletonBar className="h-5 w-24 bg-off-white/20" />}
              </p>
            </div>
          </div>
          <span className="col-span-2 text-sm font-medium text-off-white/70 sm:w-full md:ml-auto md:w-auto md:self-center">
            Kelola keuangan →
          </span>
        </div>
      </Link>

      {/* Konten stats */}
      <p className="eyebrow mt-6 text-forest-dark/50 sm:mt-8">Konten</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ slug, label, value, Icon }) => (
          <Link
            key={slug}
            href={`/${lang}/admin/${slug}`}
            className="group rounded-2xl border border-warm-neutral bg-white/70 p-4 transition-colors hover:border-sea-foam sm:p-5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-neutral text-forest-dark transition-colors group-hover:bg-sea-foam group-hover:text-off-white sm:h-10 sm:w-10">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-forest-dark sm:mt-4 md:text-3xl">
              {value ?? (ready ? "0" : <SkeletonBar className="h-7 w-10" />)}
            </p>
            <p className="mt-0.5 text-sm text-forest-dark/60">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
