"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBar } from "./AdminSkeleton";
import { HOME_FEATURED_LIMIT } from "./PortfolioManager";
import { AreaChart, ColumnChart, ShareBars, CHART_COLORS } from "./DashboardCharts";
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

type Tx = {
  id: string;
  occurred_on: string;
  description: string;
  type: "income" | "expense";
  category: string | null;
  amount: number;
};
type Lead = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  source: string | null;
};
type Flagged = { published: boolean | null; featured?: boolean | null };
type Post = { id: string; title: string; published: boolean | null };

type Data = {
  tx: Tx[];
  leads: Lead[];
  portfolio: Flagged[];
  testimonials: Flagged[];
  partners: Flagged[];
  posts: Post[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const RANGES = [
  { months: 6, label: "6 bulan" },
  { months: 12, label: "12 bulan" },
];

const rp = (n: number) => (n < 0 ? "−" : "") + "Rp" + Math.round(Math.abs(n)).toLocaleString("id-ID");

/** Axis labels: "Rp12 jt", "Rp500 rb". Full figures live in the tooltip and table. */
function rpShort(n: number) {
  if (n >= 1e9) return `Rp${+(n / 1e9).toFixed(1)} M`;
  if (n >= 1e6) return `Rp${+(n / 1e6).toFixed(1)} jt`;
  if (n >= 1e3) return `Rp${Math.round(n / 1e3)} rb`;
  return `Rp${n}`;
}

/** Local-time YYYY-MM, so a lead at 01.00 WITA on the 1st lands in the new month. */
function monthKeyOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string, withYear = false) {
  const [y, m] = key.split("-");
  return `${MONTHS[Number(m) - 1]}${withYear ? ` ${y}` : ` ${y.slice(2)}`}`;
}
/** The last `n` month keys ending with the current month, empty months included. */
function lastMonths(n: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(monthKeyOf(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  return out;
}

function relTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/** Percentage change, null when there is nothing to compare against. */
function pctChange(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

export default function DashboardOverview({ lang }: { lang: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [ready, setReady] = useState(false);
  const [range, setRange] = useState(6);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const [tx, leads, portfolio, testimonials, partners, posts] = await Promise.all([
        supabase.from("transactions").select("id, occurred_on, description, type, category, amount").order("occurred_on", { ascending: false }),
        supabase.from("leads").select("id, name, status, created_at, source").order("created_at", { ascending: false }),
        supabase.from("portfolio").select("published, featured"),
        supabase.from("testimonials").select("published"),
        supabase.from("partners").select("published"),
        supabase.from("posts").select("id, title, published"),
      ]);
      // A table that fails to read shows as empty rather than taking the whole dashboard down.
      setData({
        tx: (tx.data as Tx[] | null) ?? [],
        leads: (leads.data as Lead[] | null) ?? [],
        portfolio: (portfolio.data as Flagged[] | null) ?? [],
        testimonials: (testimonials.data as Flagged[] | null) ?? [],
        partners: (partners.data as Flagged[] | null) ?? [],
        posts: (posts.data as Post[] | null) ?? [],
      });
      setReady(true);
    })();
  }, []);

  const m = useMemo(() => {
    if (!data) return null;
    const months = lastMonths(range);
    const inRange = new Set(months);
    const thisMonth = months[months.length - 1];
    const prevMonth = monthKeyOf(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));

    const flow: Record<string, { income: number; expense: number }> = {};
    const categories: Record<string, number> = {};
    let income = 0;
    let expense = 0;
    for (const t of data.tx) {
      const amount = Number(t.amount) || 0;
      if (t.type === "income") income += amount;
      else expense += amount;
      const k = t.occurred_on.slice(0, 7);
      flow[k] = flow[k] ?? { income: 0, expense: 0 };
      flow[k][t.type] += amount;
      if (t.type === "expense" && inRange.has(k)) {
        const c = t.category?.trim() || "Lainnya";
        categories[c] = (categories[c] ?? 0) + amount;
      }
    }
    const get = (k: string) => flow[k] ?? { income: 0, expense: 0 };

    const periodIncome = months.reduce((a, k) => a + get(k).income, 0);
    const periodExpense = months.reduce((a, k) => a + get(k).expense, 0);

    // Top 5 categories, the tail folded into one row so the list stays short.
    const catSorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const catItems = catSorted.slice(0, 5).map(([label, value]) => ({ label, value }));
    const rest = catSorted.slice(5).reduce((a, [, v]) => a + v, 0);
    if (rest > 0) catItems.push({ label: "Kategori lain", value: rest });

    const leadsByMonth: Record<string, number> = {};
    const sources: Record<string, number> = {};
    let leadsPeriod = 0;
    for (const l of data.leads) {
      const k = monthKeyOf(new Date(l.created_at));
      leadsByMonth[k] = (leadsByMonth[k] ?? 0) + 1;
      if (inRange.has(k)) {
        leadsPeriod++;
        const s = l.source?.trim() || "Langsung / organik";
        sources[s] = (sources[s] ?? 0) + 1;
      }
    }
    const srcSorted = Object.entries(sources).sort((a, b) => b[1] - a[1]);
    const srcItems = srcSorted.slice(0, 5).map(([label, value]) => ({ label, value }));
    const srcRest = srcSorted.slice(5).reduce((a, [, v]) => a + v, 0);
    if (srcRest > 0) srcItems.push({ label: "Sumber lain", value: srcRest });

    const count = (rows: Flagged[] | Post[]) => ({
      total: rows.length,
      live: rows.filter((r) => r.published).length,
    });

    return {
      months,
      balance: income - expense,
      cur: get(thisMonth),
      prev: get(prevMonth),
      thisMonth,
      periodIncome,
      periodExpense,
      periodNet: periodIncome - periodExpense,
      flowSeries: months.map((k) => ({ label: monthLabel(k), values: [get(k).income, get(k).expense] })),
      catItems,
      leadSeries: months.map((k) => ({ label: monthLabel(k), value: leadsByMonth[k] ?? 0 })),
      leadsPeriod,
      leadsThisMonth: leadsByMonth[thisMonth] ?? 0,
      leadsPrevMonth: leadsByMonth[prevMonth] ?? 0,
      newLeads: data.leads.filter((l) => l.status === "new").length,
      srcItems,
      recentLeads: data.leads.slice(0, 5),
      recentTx: data.tx.slice(0, 5),
      portfolio: { ...count(data.portfolio), featured: data.portfolio.filter((p) => p.published && p.featured).length },
      testimonials: count(data.testimonials),
      partners: count(data.partners),
      posts: count(data.posts),
      drafts: data.posts.filter((p) => !p.published),
    };
  }, [data, range]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const admin = (slug: string) => `/${lang}/admin/${slug}`;
  const loading = !ready;

  return (
    <div>
      <style>{DASH_CSS}</style>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-forest-dark/50 first-letter:uppercase">{today}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-forest-dark">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link href={admin("blog")} className="rounded-full bg-forest-dark px-4 py-2 text-sm font-medium text-off-white hover:bg-sea-foam">
            + Artikel
          </Link>
          <Link href={admin("keuangan")} className="rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam">
            + Transaksi
          </Link>
        </div>
      </div>

      {ready && !data && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi. Isi <code>.env.local</code> untuk melihat data.
        </p>
      )}

      {/* KPI */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
        <Link
          href={admin("keuangan")}
          className="col-span-2 rounded-2xl bg-gradient-to-br from-forest-dark to-near-black p-4 text-off-white transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(19,42,34,0.6)] sm:p-5 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-off-white/70 sm:text-sm">Saldo kas</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white/10">
              <WalletIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold sm:text-[1.7rem]">
            {m ? rp(m.balance) : <SkeletonBar className="h-8 w-40 bg-off-white/20" />}
          </p>
          <p className="mt-1 text-xs text-off-white/55">Semua transaksi tercatat</p>
        </Link>

        <Kpi
          label={`Masuk ${m ? monthLabel(m.thisMonth, true) : "bulan ini"}`}
          value={m ? rp(m.cur.income) : null}
          delta={m ? pctChange(m.cur.income, m.prev.income) : null}
          goodWhenUp
          Icon={TrendUpIcon}
          href={admin("keuangan")}
        />
        <Kpi
          label={`Keluar ${m ? monthLabel(m.thisMonth, true) : "bulan ini"}`}
          value={m ? rp(m.cur.expense) : null}
          delta={m ? pctChange(m.cur.expense, m.prev.expense) : null}
          goodWhenUp={false}
          Icon={TrendDownIcon}
          href={admin("keuangan")}
        />
        <Kpi
          label="Pesan belum dibalas"
          value={m ? String(m.newLeads) : null}
          note={m ? `${m.leadsThisMonth} pesan masuk bulan ini` : undefined}
          Icon={InboxIcon}
          href={admin("leads")}
          highlight={!!m && m.newLeads > 0}
        />
      </div>

      {/* Period filter, scopes every chart below */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow text-forest-dark/50">Performa</p>
        <div role="group" aria-label="Rentang waktu" className="inline-flex rounded-full border border-warm-neutral bg-white/70 p-1">
          {RANGES.map((r) => (
            <button
              key={r.months}
              type="button"
              aria-pressed={range === r.months}
              onClick={() => setRange(r.months)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                range === r.months ? "bg-forest-dark text-off-white" : "text-forest-dark/60 hover:text-forest-dark"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cash flow + expense categories */}
      <div className="mt-3 grid gap-3 sm:gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Arus kas</CardTitle>
              <p className="mt-0.5 text-sm text-forest-dark/55">Uang masuk dan keluar per bulan</p>
            </div>
            <Legend
              items={[
                { color: CHART_COLORS.income, label: "Masuk" },
                { color: CHART_COLORS.expense, label: "Keluar" },
              ]}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-warm-neutral/35 p-3 sm:gap-4 sm:p-4">
            <Mini label="Total masuk" value={m ? rp(m.periodIncome) : null} />
            <Mini label="Total keluar" value={m ? rp(m.periodExpense) : null} />
            <Mini
              label="Laba bersih"
              value={m ? rp(m.periodNet) : null}
              sub={m && m.periodIncome > 0 ? `Margin ${Math.round((m.periodNet / m.periodIncome) * 100)}%` : undefined}
              tone={m ? (m.periodNet >= 0 ? "good" : "bad") : undefined}
            />
          </div>

          <div className="mt-4">
            {m ? (
              m.periodIncome + m.periodExpense > 0 ? (
                <AreaChart
                  key={range}
                  data={m.flowSeries}
                  series={[
                    { name: "Masuk", color: CHART_COLORS.income },
                    { name: "Keluar", color: CHART_COLORS.expense },
                  ]}
                  format={rp}
                  formatAxis={rpShort}
                />
              ) : (
                <Empty>Belum ada transaksi di {range} bulan terakhir.</Empty>
              )
            ) : (
              <SkeletonBar className="h-[240px] w-full rounded-xl" />
            )}
          </div>

          {m && m.periodIncome + m.periodExpense > 0 && (
            <details className="group mt-3 text-sm">
              <summary className="cursor-pointer list-none text-forest-dark/55 hover:text-forest-dark">
                <span className="group-open:hidden">Lihat sebagai tabel</span>
                <span className="hidden group-open:inline">Sembunyikan tabel</span>
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-forest-dark/45">
                    <tr>
                      <th className="py-2 font-semibold">Bulan</th>
                      <th className="py-2 text-right font-semibold">Masuk</th>
                      <th className="py-2 text-right font-semibold">Keluar</th>
                      <th className="py-2 text-right font-semibold">Selisih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.flowSeries.map((row) => (
                      <tr key={row.label} className="border-t border-warm-neutral/60">
                        <td className="py-2 text-forest-dark/70">{row.label}</td>
                        <td className="py-2 text-right tabular-nums">{rp(row.values[0])}</td>
                        <td className="py-2 text-right tabular-nums">{rp(row.values[1])}</td>
                        <td className="py-2 text-right font-medium tabular-nums">{rp(row.values[0] - row.values[1])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </Card>

        <Card>
          <CardTitle>Pengeluaran per kategori</CardTitle>
          <p className="mt-0.5 text-sm text-forest-dark/55">{range} bulan terakhir</p>
          <div className="mt-5">
            {m ? (
              m.catItems.length ? (
                <ShareBars items={m.catItems} color={CHART_COLORS.expense} format={rpShort} />
              ) : (
                <Empty>Belum ada pengeluaran.</Empty>
              )
            ) : (
              <BarsSkeleton />
            )}
          </div>
        </Card>
      </div>

      {/* Leads */}
      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Pesan masuk</CardTitle>
              <p className="mt-0.5 text-sm text-forest-dark/55">Jumlah prospek dari form kontak per bulan</p>
            </div>
            {m && (
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-forest-dark">{m.leadsPeriod}</p>
                <p className="text-xs text-forest-dark/50">dalam {range} bulan</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            {m ? (
              m.leadsPeriod > 0 ? (
                <ColumnChart key={range} data={m.leadSeries} color={CHART_COLORS.leads} name="pesan" />
              ) : (
                <Empty>Belum ada pesan di {range} bulan terakhir.</Empty>
              )
            ) : (
              <SkeletonBar className="h-[200px] w-full rounded-xl" />
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Sumber prospek</CardTitle>
          <p className="mt-0.5 text-sm text-forest-dark/55">Dari link iklan (utm_source), situs perujuk, atau langsung</p>
          <div className="mt-5">
            {m ? (
              m.srcItems.length ? (
                <ShareBars items={m.srcItems} color={CHART_COLORS.leads} format={(n) => `${n} pesan`} />
              ) : (
                <Empty>Belum ada data sumber.</Empty>
              )
            ) : (
              <BarsSkeleton />
            )}
          </div>
        </Card>
      </div>

      {/* Activity */}
      <p className="eyebrow mt-8 text-forest-dark/50">Aktivitas terbaru</p>
      <div className="mt-3 grid gap-3 sm:gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Pesan terbaru</CardTitle>
            <Link href={admin("leads")} className="text-sm font-medium text-sea-foam hover:underline">
              Semua →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-warm-neutral/70">
            {m?.recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-neutral font-display text-sm font-bold text-forest-dark">
                  {l.name.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-forest-dark">{l.name}</p>
                  <p className="truncate text-xs text-forest-dark/50">
                    {relTime(l.created_at)}
                    {l.source ? ` · ${l.source}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    l.status === "new" ? "bg-amber-100 text-amber-800" : "bg-warm-neutral text-forest-dark/60"
                  }`}
                >
                  {l.status === "new" ? "● Baru" : "✓ Dibalas"}
                </span>
              </li>
            ))}
            {m && m.recentLeads.length === 0 && <Empty>Belum ada pesan.</Empty>}
            {!m && loading && <ListSkeleton />}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Transaksi terbaru</CardTitle>
            <Link href={admin("keuangan")} className="text-sm font-medium text-sea-foam hover:underline">
              Semua →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-warm-neutral/70">
            {m?.recentTx.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    t.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {t.type === "income" ? <TrendUpIcon className="h-4 w-4" /> : <TrendDownIcon className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-forest-dark">{t.description}</p>
                  <p className="truncate text-xs text-forest-dark/50">
                    {new Date(t.occurred_on).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    {t.category ? ` · ${t.category}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-display text-sm font-bold tabular-nums ${
                    t.type === "income" ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {rp(Number(t.amount) || 0)}
                </span>
              </li>
            ))}
            {m && m.recentTx.length === 0 && <Empty>Belum ada transaksi.</Empty>}
            {!m && loading && <ListSkeleton />}
          </ul>
        </Card>
      </div>

      {/* Content health */}
      <p className="eyebrow mt-8 text-forest-dark/50">Konten situs</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <ContentCard
          href={admin("portfolio")}
          Icon={LayersIcon}
          label="Portfolio"
          stat={m?.portfolio}
          loading={loading}
          note={
            m
              ? m.portfolio.featured > HOME_FEATURED_LIMIT
                ? `${m.portfolio.featured} featured, beranda hanya memuat ${HOME_FEATURED_LIMIT}`
                : `${m.portfolio.featured} dari ${HOME_FEATURED_LIMIT} slot featured beranda`
              : undefined
          }
          warn={!!m && m.portfolio.featured > HOME_FEATURED_LIMIT}
        />
        <ContentCard
          href={admin("blog")}
          Icon={ArticleIcon}
          label="Artikel"
          stat={m?.posts}
          loading={loading}
          note={m ? (m.drafts.length ? `${m.drafts.length} draft menunggu review` : "Tidak ada draft") : undefined}
          warn={!!m && m.drafts.length > 0}
        />
        <ContentCard href={admin("testimonials")} Icon={QuoteIcon} label="Testimoni" stat={m?.testimonials} loading={loading} />
        <ContentCard href={admin("partners")} Icon={UsersIcon} label="Partner" stat={m?.partners} loading={loading} />
      </div>

      {m && m.drafts.length > 0 && (
        <Card className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between">
            <CardTitle>Draft artikel</CardTitle>
            <Link href={admin("blog")} className="text-sm font-medium text-sea-foam hover:underline">
              Buka blog →
            </Link>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {m.drafts.map((p) => (
              <li key={p.id} className="max-w-full truncate rounded-full border border-warm-neutral bg-white px-3 py-1.5 text-sm text-forest-dark/80">
                {p.title}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-warm-neutral bg-white/80 p-4 shadow-[0_1px_2px_rgba(19,42,34,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-base font-bold text-forest-dark sm:text-lg">{children}</h2>;
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-4 text-xs text-forest-dark/60">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

function Mini({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | null;
  sub?: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-forest-dark/55 sm:text-xs">{label}</p>
      <p
        className={`mt-0.5 truncate font-display text-sm font-bold tabular-nums sm:text-lg ${
          tone === "bad" ? "text-red-700" : "text-forest-dark"
        }`}
      >
        {value ?? <SkeletonBar className="h-5 w-20" />}
      </p>
      {sub && <p className="text-[11px] text-forest-dark/50 sm:text-xs">{sub}</p>}
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  goodWhenUp,
  note,
  Icon,
  href,
  highlight,
}: {
  label: string;
  value: string | null;
  delta?: number | null;
  goodWhenUp?: boolean;
  note?: string;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
  highlight?: boolean;
}) {
  const hasDelta = delta !== undefined && delta !== null && Number.isFinite(delta);
  const up = hasDelta && delta! >= 0;
  const good = hasDelta && (goodWhenUp ? up : !up);
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-warm-neutral bg-white/80 p-4 transition-colors hover:border-sea-foam sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-forest-dark/60 sm:text-sm">{label}</p>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            highlight ? "bg-amber-100 text-amber-800" : "bg-warm-neutral text-forest-dark group-hover:bg-sea-foam group-hover:text-off-white"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 truncate font-display text-xl font-bold tabular-nums text-forest-dark sm:text-2xl">
        {value ?? <SkeletonBar className="h-7 w-28" />}
      </p>
      <p className="mt-1 truncate text-xs text-forest-dark/50">
        {hasDelta ? (
          <>
            <span className={good ? "font-medium text-emerald-700" : "font-medium text-red-700"}>
              {up ? "▲" : "▼"} {Math.abs(Math.round(delta!))}%
            </span>{" "}
            vs bulan lalu
          </>
        ) : (
          note ?? (value !== null ? "Belum ada pembanding bulan lalu" : "")
        )}
      </p>
    </Link>
  );
}

function ContentCard({
  href,
  Icon,
  label,
  stat,
  note,
  warn,
  loading,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  stat?: { total: number; live: number };
  note?: string;
  warn?: boolean;
  loading: boolean;
}) {
  const pct = stat && stat.total ? (stat.live / stat.total) * 100 : 0;
  return (
    <Link href={href} className="group rounded-2xl border border-warm-neutral bg-white/80 p-4 transition-colors hover:border-sea-foam sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-neutral text-forest-dark transition-colors group-hover:bg-sea-foam group-hover:text-off-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs text-forest-dark/45">{label}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-forest-dark md:text-3xl">
        {stat ? stat.live : loading ? <SkeletonBar className="h-7 w-10" /> : "0"}
        {stat && stat.total !== stat.live && (
          <span className="ml-1 text-base font-medium text-forest-dark/40">/ {stat.total}</span>
        )}
      </p>
      <p className="text-xs text-forest-dark/55">tayang di situs</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-warm-neutral/70">
        <div className="dash-grow-x h-full rounded-full bg-sea-foam" style={{ width: `${pct}%` }} />
      </div>
      {note && (
        <p className={`mt-2.5 text-xs leading-snug ${warn ? "text-amber-800" : "text-forest-dark/50"}`}>
          {warn ? "⚠ " : ""}
          {note}
        </p>
      )}
    </Link>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-warm-neutral px-4 py-8 text-center text-sm text-forest-dark/50">
      {children}
    </div>
  );
}

function BarsSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <SkeletonBar className="h-3.5 w-1/2" />
          <SkeletonBar className="mt-2 h-1.5" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <SkeletonBar className="h-9 w-9 rounded-full" />
          <div className="flex-1">
            <SkeletonBar className="h-4 w-1/2" />
            <SkeletonBar className="mt-1.5 h-3 w-1/3" />
          </div>
        </li>
      ))}
    </>
  );
}

/** Entry animations for the charts. Scoped to class names only the dashboard uses,
 *  and switched off for people who asked their OS for less motion. */
const DASH_CSS = `
.dash-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: dash-draw 1.1s cubic-bezier(.33,1,.68,1) forwards; }
.dash-fade { opacity: 0; animation: dash-fade .9s ease-out .25s forwards; }
.dash-grow { transform-box: view-box; transform: scaleY(0); animation: dash-grow .7s cubic-bezier(.33,1,.68,1) forwards; }
.dash-grow-x { transform-origin: left; transform: scaleX(0); animation: dash-grow-x .8s cubic-bezier(.33,1,.68,1) forwards; }
@keyframes dash-draw { to { stroke-dashoffset: 0; } }
@keyframes dash-fade { to { opacity: 1; } }
@keyframes dash-grow { to { transform: scaleY(1); } }
@keyframes dash-grow-x { to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) {
  .dash-draw, .dash-fade, .dash-grow, .dash-grow-x { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
}
`;
