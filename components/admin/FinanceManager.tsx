"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBar } from "./AdminSkeleton";
import { WalletIcon, TrendUpIcon, TrendDownIcon, PlusIcon, DownloadIcon, ArrowUpIcon, ArrowDownIcon } from "./AdminIcons";
import { AreaChart, ShareBars, ChartStyles, CHART_COLORS } from "./DashboardCharts";
import {
  MONTHS,
  rp,
  rpShort,
  monthKeyOf,
  monthLabel,
  monthLabelLong,
  lastMonths,
  monthsSince,
  todayKey,
  pctChange,
} from "./financeFormat";

type TxType = "income" | "expense";
type Tx = {
  id: string;
  occurred_on: string; // YYYY-MM-DD
  description: string;
  type: TxType;
  category: string | null;
  amount: number;
};

type Draft = {
  id?: string;
  occurred_on: string;
  description: string;
  type: TxType;
  category: string;
  /** Digits only. Shown with thousand separators, stored as a plain number. */
  amount: string;
};

type Range = "1" | "3" | "6" | "12" | "all";
const RANGES: { key: Range; label: string }[] = [
  { key: "1", label: "Bulan ini" },
  { key: "3", label: "3 bulan" },
  { key: "6", label: "6 bulan" },
  { key: "12", label: "12 bulan" },
  { key: "all", label: "Semua" },
];

const TYPE_LABEL: Record<TxType, string> = { income: "Masuk", expense: "Keluar" };

const emptyDraft = (type: TxType = "income"): Draft => ({
  occurred_on: todayKey(),
  description: "",
  type,
  category: "",
  amount: "",
});

const digits = (s: string) => s.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
const withDots = (d: string) => (d ? Number(d).toLocaleString("id-ID") : "");

function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export default function FinanceManager() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [range, setRange] = useState<Range>("6");
  const [catTab, setCatTab] = useState<TxType>("expense");
  const [typeFilter, setTypeFilter] = useState<"all" | TxType>("all");
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();

  async function load() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("transactions")
      .select("id, occurred_on, description, type, category, amount")
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    // numeric(14,2) comes back as a string from PostgREST.
    setRows(((data as Tx[] | null) ?? []).map((t) => ({ ...t, amount: Number(t.amount) || 0 })));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flash(text: string) {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2400);
  }

  // Escape closes the editor, unless a save is in flight.
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && setEditing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, busy]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !editing) return;
    const amount = Number(editing.amount);
    if (!editing.description.trim()) return setFormMsg("Isi keterangan dulu.");
    if (!amount) return setFormMsg("Isi jumlah dulu.");
    setBusy(true);
    setFormMsg("");
    const payload = {
      occurred_on: editing.occurred_on,
      description: editing.description.trim(),
      type: editing.type,
      category: editing.category.trim() || null,
      amount,
    };
    const { error } = editing.id
      ? await supabase.from("transactions").update(payload).eq("id", editing.id)
      : await supabase.from("transactions").insert(payload);
    setBusy(false);
    if (error) return setFormMsg(`Gagal menyimpan: ${error.message}`);
    flash(editing.id ? "Transaksi diperbarui." : "Transaksi ditambahkan.");
    setEditing(null);
    load();
  }

  async function remove(t: Tx) {
    if (!supabase) return;
    if (!confirm(`Hapus "${t.description}" (${rp(t.amount)})?`)) return;
    const { error } = await supabase.from("transactions").delete().eq("id", t.id);
    if (error) return flash(`Gagal menghapus: ${error.message}`);
    flash("Transaksi dihapus.");
    load();
  }

  // ── Derived ────────────────────────────────────────────────────────────
  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category?.trim()).filter(Boolean) as string[])).sort(),
    [rows]
  );

  const view = useMemo(() => {
    const thisMonth = monthKeyOf(new Date());
    const earliest = rows.length ? rows[rows.length - 1].occurred_on.slice(0, 7) : thisMonth;

    let months: string[];
    if (range === "all") {
      months = monthsSince(earliest);
      if (months.length < 6) months = lastMonths(6);
    } else {
      months = lastMonths(Number(range));
    }
    const start = range === "all" ? "" : `${months[0]}-01`;
    // Same-length window right before this one, for the "vs sebelumnya" line.
    const n = Number(range);
    const prevMonths = range === "all" ? [] : lastMonths(n * 2).slice(0, n);
    const prevStart = prevMonths.length ? `${prevMonths[0]}-01` : "";

    let balance = 0;
    let income = 0;
    let expense = 0;
    let prevIncome = 0;
    let prevExpense = 0;
    const byMonth: Record<string, { income: number; expense: number }> = {};
    const byDay: Record<string, { income: number; expense: number }> = {};
    const cats: Record<TxType, Record<string, number>> = { income: {}, expense: {} };
    const inPeriod: Tx[] = [];

    for (const t of rows) {
      balance += t.type === "income" ? t.amount : -t.amount;
      const d = t.occurred_on;
      if (!start || d >= start) {
        inPeriod.push(t);
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
        const mk = d.slice(0, 7);
        byMonth[mk] = byMonth[mk] ?? { income: 0, expense: 0 };
        byMonth[mk][t.type] += t.amount;
        byDay[d] = byDay[d] ?? { income: 0, expense: 0 };
        byDay[d][t.type] += t.amount;
        const c = t.category?.trim() || "Tanpa kategori";
        cats[t.type][c] = (cats[t.type][c] ?? 0) + t.amount;
      } else if (prevStart && d >= prevStart) {
        if (t.type === "income") prevIncome += t.amount;
        else prevExpense += t.amount;
      }
    }

    // "Bulan ini" is drawn as a running total per day. Raw daily amounts are
    // mostly zeros with a few spikes, which reads as noise, not as a month.
    let chart: { label: string; values: number[] }[];
    let unit = "bulan";
    if (range === "1") {
      unit = "hari";
      const now = new Date();
      let runIn = 0;
      let runOut = 0;
      chart = Array.from({ length: now.getDate() }, (_, i) => {
        const key = `${thisMonth}-${String(i + 1).padStart(2, "0")}`;
        const v = byDay[key] ?? { income: 0, expense: 0 };
        runIn += v.income;
        runOut += v.expense;
        return { label: `${i + 1} ${MONTHS[now.getMonth()]}`, values: [runIn, runOut] };
      });
    } else {
      chart = months.map((k) => {
        const v = byMonth[k] ?? { income: 0, expense: 0 };
        return { label: monthLabel(k), values: [v.income, v.expense] };
      });
    }

    const catItems = (type: TxType) => {
      const sorted = Object.entries(cats[type]).sort((a, b) => b[1] - a[1]);
      const items = sorted.slice(0, 6).map(([label, value]) => ({ label, value }));
      const rest = sorted.slice(6).reduce((a, [, v]) => a + v, 0);
      if (rest > 0) items.push({ label: "Kategori lain", value: rest });
      return items;
    };

    return {
      balance,
      income,
      expense,
      net: income - expense,
      prevIncome,
      prevExpense,
      hasPrev: range !== "all",
      chart,
      unit,
      catItems: { income: catItems("income"), expense: catItems("expense") },
      inPeriod,
      periodLabel:
        range === "1"
          ? monthLabelLong(thisMonth)
          : `${monthLabel(months[0], true)} – ${monthLabel(months[months.length - 1], true)}`,
    };
  }, [rows, range]);

  const listed = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return view.inPeriod.filter(
      (t) =>
        (typeFilter === "all" || t.type === typeFilter) &&
        (!needle ||
          t.description.toLowerCase().includes(needle) ||
          (t.category ?? "").toLowerCase().includes(needle))
    );
  }, [view.inPeriod, typeFilter, q]);

  const groups = useMemo(() => {
    const out: { key: string; items: Tx[]; income: number; expense: number }[] = [];
    for (const t of listed) {
      const key = t.occurred_on.slice(0, 7);
      let g = out[out.length - 1];
      if (!g || g.key !== key) {
        g = { key, items: [], income: 0, expense: 0 };
        out.push(g);
      }
      g.items.push(t);
      g[t.type] += t.amount;
    }
    return out;
  }, [listed]);

  function exportCsv() {
    // Semicolons, because Excel with Indonesian regional settings splits on them.
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      ["Tanggal", "Keterangan", "Jenis", "Kategori", "Jumlah"].join(";"),
      ...listed.map((t) =>
        [t.occurred_on, esc(t.description), TYPE_LABEL[t.type], esc(t.category ?? ""), String(t.amount)].join(";")
      ),
    ];
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaksi-seawise-${todayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const field =
    "w-full rounded-xl border border-warm-neutral bg-white px-3.5 py-2.5 text-forest-dark placeholder:text-forest-dark/35 focus:border-sea-foam focus:outline-none focus:ring-2 focus:ring-sea-foam/15";
  const ready = !loading;
  const margin = view.income > 0 ? Math.round((view.net / view.income) * 100) : null;

  return (
    <div>
      <ChartStyles />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-dark">Keuangan</h1>
          <p className="mt-1.5 text-forest-dark/60">Arus kas usaha, uang masuk dan keluar.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!listed.length}
            className="inline-flex items-center gap-1.5 rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam disabled:opacity-40"
          >
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setFormMsg("");
              setEditing(emptyDraft());
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-4 py-2 text-sm font-medium text-off-white hover:bg-sea-foam"
          >
            <PlusIcon className="h-4 w-4" />
            Transaksi
          </button>
        </div>
      </div>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}
      {loadError && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Gagal memuat transaksi: {loadError}
        </p>
      )}

      {/* Period filter, scopes everything below */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-8">
        <div role="group" aria-label="Periode" className="flex max-w-full overflow-x-auto rounded-full border border-warm-neutral bg-white/70 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                range === r.key ? "bg-forest-dark text-off-white" : "text-forest-dark/60 hover:text-forest-dark"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-forest-dark/50">{ready && view.periodLabel}</p>
      </div>

      {/* KPI */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Uang masuk"
          value={ready ? rp(view.income) : null}
          Icon={TrendUpIcon}
          iconClass="bg-emerald-50 text-emerald-700"
          delta={view.hasPrev ? pctChange(view.income, view.prevIncome) : null}
          goodWhenUp
        />
        <Stat
          label="Uang keluar"
          value={ready ? rp(view.expense) : null}
          Icon={TrendDownIcon}
          iconClass="bg-red-50 text-red-700"
          delta={view.hasPrev ? pctChange(view.expense, view.prevExpense) : null}
          goodWhenUp={false}
        />
        <Stat
          label="Laba bersih"
          value={ready ? rp(view.net) : null}
          valueClass={view.net < 0 ? "text-red-700" : undefined}
          Icon={WalletIcon}
          iconClass="bg-warm-neutral text-forest-dark"
          note={margin !== null ? `Margin ${margin}% dari uang masuk` : "Belum ada uang masuk"}
        />
        <div className="rounded-2xl bg-gradient-to-br from-forest-dark to-near-black p-4 text-off-white sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-off-white/70 sm:text-sm">Saldo kas</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white/10">
              <WalletIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 truncate font-display text-xl font-bold tabular-nums sm:text-2xl">
            {ready ? rp(view.balance) : <SkeletonBar className="h-7 w-32 bg-off-white/20" />}
          </p>
          <p className="mt-1 text-xs text-off-white/55">Semua transaksi, tanpa filter</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Arus kas</CardTitle>
              <p className="mt-0.5 text-sm text-forest-dark/55">
                {view.unit === "hari"
                  ? "Akumulasi uang masuk dan keluar sepanjang bulan ini"
                  : "Uang masuk dan keluar per bulan"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-forest-dark/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS.income }} /> Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS.expense }} /> Keluar
              </span>
            </div>
          </div>
          <div className="mt-5">
            {!ready ? (
              <SkeletonBar className="h-[260px] w-full rounded-xl" />
            ) : view.income + view.expense > 0 ? (
              <AreaChart
                key={range}
                data={view.chart}
                series={[
                  { name: "Masuk", color: CHART_COLORS.income },
                  { name: "Keluar", color: CHART_COLORS.expense },
                ]}
                format={rp}
                formatAxis={rpShort}
                height={260}
                unit={view.unit}
              />
            ) : (
              <Empty>Belum ada transaksi di periode ini.</Empty>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Per kategori</CardTitle>
            <div role="tablist" className="inline-flex rounded-full bg-warm-neutral/60 p-0.5 text-xs">
              {(["expense", "income"] as TxType[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={catTab === t}
                  onClick={() => setCatTab(t)}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    catTab === t ? "bg-white text-forest-dark shadow-sm" : "text-forest-dark/55"
                  }`}
                >
                  {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            {!ready ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <SkeletonBar className="h-3.5 w-1/2" />
                    <SkeletonBar className="mt-2 h-1.5" />
                  </div>
                ))}
              </div>
            ) : view.catItems[catTab].length ? (
              <ShareBars
                key={catTab + range}
                items={view.catItems[catTab]}
                color={catTab === "income" ? CHART_COLORS.income : CHART_COLORS.expense}
                format={rpShort}
              />
            ) : (
              <Empty>Belum ada uang {TYPE_LABEL[catTab].toLowerCase()} di periode ini.</Empty>
            )}
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="mt-3 !p-0 sm:mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-neutral/70 p-4 sm:p-6 sm:pb-4">
          <div>
            <CardTitle>Transaksi</CardTitle>
            <p className="mt-0.5 text-sm text-forest-dark/55">
              {ready ? `${listed.length} transaksi di periode ini` : "Memuat…"}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari keterangan atau kategori"
              className={`${field} !py-2 text-sm sm:w-64`}
            />
            <div role="group" aria-label="Jenis" className="inline-flex rounded-full border border-warm-neutral bg-white p-0.5 text-xs">
              {(["all", "income", "expense"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={typeFilter === t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                    typeFilter === t ? "bg-forest-dark text-off-white" : "text-forest-dark/60 hover:text-forest-dark"
                  }`}
                >
                  {t === "all" ? "Semua" : TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!ready && (
          <ul className="divide-y divide-warm-neutral/60 px-4 sm:px-6">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 py-3.5">
                <SkeletonBar className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <SkeletonBar className="h-4 w-1/2" />
                  <SkeletonBar className="mt-1.5 h-3 w-1/4" />
                </div>
                <SkeletonBar className="h-4 w-24" />
              </li>
            ))}
          </ul>
        )}

        {ready && groups.length === 0 && (
          <div className="p-4 sm:p-6">
            <Empty>
              {rows.length === 0 ? (
                <span>
                  Belum ada transaksi.{" "}
                  <button type="button" onClick={() => setEditing(emptyDraft())} className="font-medium text-sea-foam hover:underline">
                    Catat yang pertama
                  </button>
                </span>
              ) : (
                "Tidak ada transaksi yang cocok dengan filter."
              )}
            </Empty>
          </div>
        )}

        {groups.map((g) => (
          <section key={g.key}>
            <div className="flex items-center justify-between gap-3 bg-warm-neutral/40 px-4 py-2 text-xs sm:px-6">
              <span className="font-semibold uppercase tracking-wider text-forest-dark/60">{monthLabelLong(g.key)}</span>
              <span className="tabular-nums text-forest-dark/55">
                <span className="text-emerald-700">+{rpShort(g.income)}</span>
                <span className="mx-1.5 text-forest-dark/25">/</span>
                <span className="text-red-700">−{rpShort(g.expense)}</span>
                <span className="ml-2 font-semibold text-forest-dark">= {rpShort(g.income - g.expense)}</span>
              </span>
            </div>
            <ul className="divide-y divide-warm-neutral/60">
              {g.items.map((t) => (
                <li key={t.id} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-warm-neutral/15 sm:px-6">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      t.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                    aria-label={TYPE_LABEL[t.type]}
                  >
                    {t.type === "income" ? <TrendUpIcon className="h-4 w-4" /> : <TrendDownIcon className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-forest-dark">{t.description}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-forest-dark/50">
                      {shortDate(t.occurred_on)}
                      {t.category && (
                        <span className="rounded-full bg-warm-neutral/70 px-2 py-0.5 text-[11px] text-forest-dark/65">
                          {t.category}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`font-display text-sm font-bold tabular-nums sm:text-base ${
                        t.type === "income" ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {rp(t.amount)}
                    </p>
                    <div className="mt-0.5 flex justify-end gap-1 text-xs sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setFormMsg("");
                          setEditing({
                            id: t.id,
                            occurred_on: t.occurred_on,
                            description: t.description,
                            type: t.type,
                            category: t.category ?? "",
                            amount: String(Math.round(t.amount)),
                          });
                        }}
                        className="rounded-md px-1.5 py-0.5 font-medium text-sea-foam hover:bg-sea-foam/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(t)}
                        className="rounded-md px-1.5 py-0.5 font-medium text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Card>

      {/* Editor */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && !busy && setEditing(null)}
        >
          <form
            onSubmit={save}
            className="my-8 w-full max-w-md rounded-3xl bg-off-white p-6 shadow-2xl md:p-7"
            role="dialog"
            aria-modal="true"
            aria-label={editing.id ? "Edit transaksi" : "Tambah transaksi"}
          >
            <h2 className="font-display text-xl font-bold text-forest-dark">
              {editing.id ? "Edit transaksi" : "Tambah transaksi"}
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-warm-neutral/60 p-1">
              {(["income", "expense"] as TxType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={editing.type === t}
                  onClick={() => setEditing((p) => (p ? { ...p, type: t } : p))}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                    editing.type === t
                      ? t === "income"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "bg-white text-red-700 shadow-sm"
                      : "text-forest-dark/55"
                  }`}
                >
                  {t === "income" ? <TrendUpIcon className="h-4 w-4" /> : <TrendDownIcon className="h-4 w-4" />}
                  Uang {TYPE_LABEL[t].toLowerCase()}
                </button>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-forest-dark/70">Jumlah</span>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-forest-dark/40">
                  Rp
                </span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={withDots(editing.amount)}
                  onChange={(e) => {
                    const v = digits(e.target.value);
                    setEditing((p) => (p ? { ...p, amount: v } : p));
                  }}
                  placeholder="0"
                  className={`${field} pl-12 font-display text-2xl font-bold tabular-nums`}
                />
              </div>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-forest-dark/70">Keterangan</span>
              <input
                value={editing.description}
                onChange={(e) => {
                  const v = e.target.value;
                  setEditing((p) => (p ? { ...p, description: v } : p));
                }}
                placeholder={editing.type === "income" ? "Contoh: DP website klien" : "Contoh: Langganan hosting"}
                className={`${field} mt-1.5`}
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-forest-dark/70">Tanggal</span>
                <input
                  type="date"
                  value={editing.occurred_on}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEditing((p) => (p ? { ...p, occurred_on: v } : p));
                  }}
                  className={`${field} mt-1.5`}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-forest-dark/70">Kategori</span>
                <input
                  list="finance-categories"
                  value={editing.category}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEditing((p) => (p ? { ...p, category: v } : p));
                  }}
                  placeholder="Opsional"
                  className={`${field} mt-1.5`}
                />
                <datalist id="finance-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
            </div>

            {formMsg && <p className="mt-4 text-sm text-red-700">{formMsg}</p>}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={busy}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-forest-dark/60 hover:text-forest-dark"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-forest-dark px-6 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-60"
              >
                {busy ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast, above the mobile bottom bar */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 transition-all duration-300 md:bottom-8 ${
          notice ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {notice && (
          <p className="rounded-full bg-forest-dark px-4 py-2 text-sm text-off-white shadow-lg">{notice}</p>
        )}
      </div>
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

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-warm-neutral px-4 py-8 text-center text-sm text-forest-dark/50">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
  Icon,
  iconClass,
  delta,
  goodWhenUp,
  note,
}: {
  label: string;
  value: string | null;
  valueClass?: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  delta?: number | null;
  goodWhenUp?: boolean;
  note?: string;
}) {
  const hasDelta = delta !== undefined && delta !== null && Number.isFinite(delta);
  const up = hasDelta && delta! >= 0;
  const good = goodWhenUp ? up : !up;
  return (
    <div className="rounded-2xl border border-warm-neutral bg-white/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-forest-dark/60 sm:text-sm">{label}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className={`mt-3 truncate font-display text-xl font-bold tabular-nums sm:text-2xl ${valueClass ?? "text-forest-dark"}`}>
        {value ?? <SkeletonBar className="h-7 w-28" />}
      </p>
      <p className="mt-1 truncate text-xs text-forest-dark/50">
        {hasDelta ? (
          <>
            <span className={`inline-flex items-center gap-0.5 align-bottom font-medium ${good ? "text-emerald-700" : "text-red-700"}`}>
              {up ? <ArrowUpIcon className="h-3.5 w-3.5" /> : <ArrowDownIcon className="h-3.5 w-3.5" />}
              {Math.abs(Math.round(delta!))}%
            </span>{" "}
            vs periode sebelumnya
          </>
        ) : (
          note ?? (value !== null ? "Tidak ada pembanding" : "")
        )}
      </p>
    </div>
  );
}
