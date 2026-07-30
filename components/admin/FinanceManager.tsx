"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WalletIcon, TrendUpIcon, TrendDownIcon } from "./AdminIcons";

type Tx = {
  id: string;
  occurred_on: string; // YYYY-MM-DD
  description: string;
  type: "income" | "expense";
  category: string | null;
  amount: number;
};

const rp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
const today = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: string) => d.slice(0, 7); // YYYY-MM
const monthLabel = (k: string) => {
  const [y, m] = k.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${names[Number(m) - 1]} ${y.slice(2)}`;
};

export default function FinanceManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Tx[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    occurred_on: today(),
    description: "",
    type: "income" as "income" | "expense",
    category: "",
    amount: "",
  });

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("occurred_on", { ascending: false });
    setRows((data as Tx[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg("Supabase belum terkoneksi.");
      return;
    }
    const amount = Number(String(form.amount).replace(/[^\d.-]/g, ""));
    if (!form.description.trim() || !amount) {
      setMsg("Isi keterangan dan jumlah dulu.");
      return;
    }
    setBusy(true);
    setMsg("");
    const { error } = await supabase.from("transactions").insert({
      occurred_on: form.occurred_on,
      description: form.description.trim(),
      type: form.type,
      category: form.category.trim() || null,
      amount,
    });
    setBusy(false);
    if (error) {
      setMsg(`Gagal menyimpan: ${error.message}`);
      return;
    }
    setForm({ occurred_on: today(), description: "", type: form.type, category: "", amount: "" });
    load();
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("Hapus transaksi ini?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    load();
  }

  // ── Derived summaries ────────────────────────────────────────────────
  const { income, expense, balance, byMonth, byCategory } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const byMonth: Record<string, { income: number; expense: number }> = {};
    const byCategory: Record<string, number> = {};

    for (const t of rows) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;

      const mk = monthKey(t.occurred_on);
      byMonth[mk] = byMonth[mk] ?? { income: 0, expense: 0 };
      byMonth[mk][t.type] += t.amount;

      if (t.type === "expense") {
        const c = t.category || "Lainnya";
        byCategory[c] = (byCategory[c] ?? 0) + t.amount;
      }
    }
    return { income, expense, balance: income - expense, byMonth, byCategory };
  }, [rows]);

  const months = useMemo(() => Object.keys(byMonth).sort().slice(-8), [byMonth]);
  const maxBar = useMemo(
    () => Math.max(1, ...months.map((m) => Math.max(byMonth[m].income, byMonth[m].expense))),
    [months, byMonth]
  );
  const categories = useMemo(
    () => Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
    [byCategory]
  );

  const field =
    "w-full rounded-xl border border-warm-neutral bg-white px-3 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none";

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-dark">Keuangan</h1>
      <p className="mt-1.5 text-forest-dark/60">Catatan cash flow, uang masuk & keluar usaha.</p>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-warm-neutral bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-forest-dark/60">Uang masuk</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-foam/15 text-sea-foam">
              <TrendUpIcon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-sea-foam">{rp(income)}</p>
        </div>
        <div className="rounded-2xl border border-warm-neutral bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-forest-dark/60">Uang keluar</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-700">
              <TrendDownIcon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-red-700">{rp(expense)}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-forest-dark to-near-black p-6 text-off-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-off-white/70">Saldo</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-off-white/10 text-off-white">
              <WalletIcon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold">{rp(balance)}</p>
        </div>
      </div>

      {/* Monthly trend chart */}
      {months.length > 0 && (
        <div className="mt-6 rounded-2xl border border-warm-neutral bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-bold text-forest-dark">Tren bulanan</p>
            <div className="flex items-center gap-4 text-xs text-forest-dark/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sea-foam" /> Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-700" /> Keluar
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 180 }}>
            {months.map((m) => {
              const inc = byMonth[m].income;
              const exp = byMonth[m].expense;
              return (
                <div key={m} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-[150px] w-full items-end justify-center gap-1">
                    <div
                      className="w-1/2 rounded-t bg-sea-foam"
                      style={{ height: `${(inc / maxBar) * 100}%` }}
                      title={`Masuk: ${rp(inc)}`}
                    />
                    <div
                      className="w-1/2 rounded-t bg-red-700"
                      style={{ height: `${(exp / maxBar) * 100}%` }}
                      title={`Keluar: ${rp(exp)}`}
                    />
                  </div>
                  <span className="text-xs text-forest-dark/50">{monthLabel(m)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category breakdown (expenses) */}
      {categories.length > 0 && (
        <div className="mt-6 rounded-2xl border border-warm-neutral bg-white/70 p-6">
          <p className="font-display text-lg font-bold text-forest-dark">Pengeluaran per kategori</p>
          <div className="mt-4 space-y-3">
            {categories.map(([cat, total]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-dark/80">{cat}</span>
                  <span className="font-medium text-forest-dark">{rp(total)}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-warm-neutral">
                  <div
                    className="h-full rounded-full bg-sea-foam"
                    style={{ width: `${(total / expense) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add transaction */}
      <form onSubmit={add} className="mt-6 rounded-2xl border border-warm-neutral bg-white/70 p-6">
        <p className="font-display text-lg font-bold text-forest-dark">Tambah transaksi</p>
        <div className="mt-4 grid gap-3 md:grid-cols-6">
          <input type="date" className={`${field} md:col-span-1`} value={form.occurred_on}
            onChange={(e) => setForm({ ...form, occurred_on: e.target.value })} />
          <input className={`${field} md:col-span-2`} placeholder="Keterangan" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className={field} value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}>
            <option value="income">Masuk</option>
            <option value="expense">Keluar</option>
          </select>
          <input className={field} placeholder="Kategori" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className={field} inputMode="numeric" placeholder="Jumlah (Rp)" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button type="submit" disabled={busy}
            className="rounded-full bg-forest-dark px-6 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-60">
            {busy ? "Menyimpan…" : "Tambah"}
          </button>
          {msg && <span className="text-sm text-red-700">{msg}</span>}
        </div>
      </form>

      {/* Transaction list */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-warm-neutral">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-neutral/50 text-forest-dark/70">
            <tr>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Keterangan</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 text-right font-medium">Jumlah</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-warm-neutral">
                <td className="px-4 py-3 text-forest-dark/60">
                  {new Date(t.occurred_on).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 font-medium text-forest-dark">{t.description}</td>
                <td className="px-4 py-3 text-forest-dark/70">{t.category || "—"}</td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    t.type === "income" ? "text-sea-foam" : "text-red-700"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {rp(t.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(t.id)} className="text-red-700 hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-forest-dark/50">
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
