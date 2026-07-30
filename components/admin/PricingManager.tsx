"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id: string;
  name: string;
  tagline: string | null;
  price: string | null;
  price_note: string | null;
  features: string[] | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

const empty: Omit<Row, "id"> = {
  name: "",
  tagline: "",
  price: "",
  price_note: "",
  features: [],
  featured: false,
  sort_order: 0,
  published: true,
};

export default function PricingManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Omit<Row, "id"> & { id?: string }) | null>(null);
  const [featInput, setFeatInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("pricing")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start(row: Row | null) {
    const base = row ?? { ...empty };
    setEditing(row ? { ...row } : base);
    setFeatInput(((row?.features ?? []) as string[]).join("\n"));
    setMsg("");
  }

  async function save() {
    if (!supabase || !editing) return;
    setBusy(true);
    setMsg("");
    const payload = {
      name: editing.name,
      tagline: editing.tagline,
      price: editing.price,
      price_note: editing.price_note,
      features: featInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: editing.featured,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published,
    };
    const { error } = editing.id
      ? await supabase.from("pricing").update(payload).eq("id", editing.id)
      : await supabase.from("pricing").insert(payload);
    setBusy(false);
    if (error) {
      setMsg(`Gagal menyimpan: ${error.message}`);
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("Hapus paket ini?")) return;
    await supabase.from("pricing").delete().eq("id", id);
    load();
  }

  const label = "text-sm font-medium text-forest-dark";
  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-forest-dark">Price List</h1>
        <button
          onClick={() => start(null)}
          className="rounded-full bg-forest-dark px-5 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam"
        >
          + Tambah
        </button>
      </div>
      <p className="mt-1.5 text-forest-dark/60">Paket pengembangan website (tampil di halaman Layanan).</p>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-warm-neutral bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-warm-neutral/40 text-xs font-semibold uppercase tracking-wider text-forest-dark/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Urutan</th>
              <th className="px-5 py-3 font-semibold">Paket</th>
              <th className="px-5 py-3 font-semibold">Harga</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral/60 transition-colors hover:bg-warm-neutral/20">
                <td className="px-5 py-3.5 text-forest-dark/60">{r.sort_order}</td>
                <td className="px-5 py-3 font-semibold text-forest-dark">
                  {r.name}
                  {r.featured && (
                    <span className="ml-2 rounded-full bg-sea-foam/20 px-2 py-0.5 text-xs text-sea-foam">
                      populer
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-forest-dark/70">
                  {r.price} {r.price_note}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${r.published ? "bg-sea-foam/15 text-sea-foam" : "bg-warm-neutral text-forest-dark/50"}`}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => start(r)} className="rounded-lg px-2.5 py-1 text-sm font-medium text-sea-foam transition-colors hover:bg-sea-foam/10">
                    Edit
                  </button>
                  <button onClick={() => remove(r.id)} className="ml-1 rounded-lg px-2.5 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-forest-dark/50">
                  Belum ada paket.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-3xl bg-off-white p-6 shadow-2xl md:p-7">
            <h2 className="font-display text-xl font-bold text-forest-dark">
              {editing.id ? "Edit" : "Tambah"} Paket
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Nama paket</label>
                <input className={field} value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className={label}>Cocok untuk (tagline)</label>
                <input className={field} placeholder="mis. UMKM yang butuh company profile utuh"
                  value={editing.tagline ?? ""}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={label}>Harga</label>
                  <input className={field} placeholder="Mulai Rp5.000.000" value={editing.price ?? ""}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className={label}>Catatan harga</label>
                  <input className={field} placeholder="/ proyek" value={editing.price_note ?? ""}
                    onChange={(e) => setEditing({ ...editing, price_note: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={label}>Fitur (satu per baris)</label>
                <textarea className={`${field} resize-y`} rows={5} value={featInput}
                  placeholder={"Hingga 5 halaman\nDesain responsif\nForm kontak"}
                  onChange={(e) => setFeatInput(e.target.value)} />
              </div>
              <div className="flex gap-6">
                <div>
                  <label className={label}>Urutan</label>
                  <input type="number" className={`${field} w-24`} value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
                <label className="flex items-center gap-2 pt-7 text-sm text-forest-dark">
                  <input type="checkbox" checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Populer
                </label>
                <label className="flex items-center gap-2 pt-7 text-sm text-forest-dark">
                  <input type="checkbox" checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                  Published
                </label>
              </div>
            </div>

            {msg && <p className="mt-4 text-sm text-red-700">{msg}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-forest-dark/70 hover:bg-warm-neutral">
                Batal
              </button>
              <button onClick={save} disabled={busy}
                className="rounded-full bg-forest-dark px-6 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-60">
                {busy ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
