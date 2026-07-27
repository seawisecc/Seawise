"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type Row = {
  id: string;
  title: string;
  description: string | null;
  industry: string | null;
  project_type: string;
  live_url: string | null;
  screenshot_url: string | null;
  tech_stack: string[] | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

const empty: Omit<Row, "id"> = {
  title: "",
  description: "",
  industry: "",
  project_type: "app",
  live_url: "",
  screenshot_url: "",
  tech_stack: [],
  featured: false,
  sort_order: 0,
  published: true,
};

export default function PortfolioManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Omit<Row, "id"> & { id?: string }) | null>(null);
  const [techInput, setTechInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNew() {
    setEditing({ ...empty });
    setTechInput("");
    setMsg("");
  }

  function startEdit(r: Row) {
    setEditing({ ...r });
    setTechInput((r.tech_stack ?? []).join(", "));
    setMsg("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "portfolio");
      setEditing({ ...editing, screenshot_url: url });
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(
        `Gagal upload gambar — ${detail}. Cek bucket 'media' sudah dibuat (public) dan policy storage sudah dijalankan.`
      );
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!supabase || !editing) return;
    setBusy(true);
    setMsg("");
    const payload = {
      title: editing.title,
      description: editing.description,
      industry: editing.industry,
      project_type: editing.project_type,
      live_url: editing.live_url,
      screenshot_url: editing.screenshot_url,
      tech_stack: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: editing.featured,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published,
    };

    const { error } = editing.id
      ? await supabase.from("portfolio").update(payload).eq("id", editing.id)
      : await supabase.from("portfolio").insert(payload);

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
    if (!confirm("Hapus entry ini?")) return;
    await supabase.from("portfolio").delete().eq("id", id);
    load();
  }

  const label = "text-sm font-medium text-forest-dark";
  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-forest-dark">Portfolio</h1>
        <button
          onClick={startNew}
          className="rounded-full bg-forest-dark px-5 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam"
        >
          + Tambah
        </button>
      </div>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-warm-neutral">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-neutral/50 text-forest-dark/70">
            <tr>
              <th className="px-4 py-3 font-medium">Urutan</th>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Industri</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral">
                <td className="px-4 py-3 text-forest-dark/60">{r.sort_order}</td>
                <td className="px-4 py-3 font-medium text-forest-dark">
                  {r.title}
                  {r.featured && (
                    <span className="ml-2 rounded-full bg-sea-foam/20 px-2 py-0.5 text-xs text-sea-foam">
                      featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-forest-dark/70">{r.industry}</td>
                <td className="px-4 py-3">
                  <span className={r.published ? "text-sea-foam" : "text-forest-dark/40"}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => startEdit(r)} className="text-sea-foam hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="ml-3 text-red-700 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-forest-dark/50">
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-off-white p-6">
            <h2 className="font-display text-xl font-bold text-forest-dark">
              {editing.id ? "Edit" : "Tambah"} Portfolio
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Judul</label>
                <input
                  className={field}
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={label}>Industri</label>
                  <input
                    className={field}
                    value={editing.industry ?? ""}
                    onChange={(e) => setEditing({ ...editing, industry: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Jenis</label>
                  <select
                    className={field}
                    value={editing.project_type}
                    onChange={(e) => setEditing({ ...editing, project_type: e.target.value })}
                  >
                    <option value="app">Aplikasi</option>
                    <option value="website">Website</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Deskripsi (masalah → solusi singkat)</label>
                <textarea
                  className={`${field} resize-y`}
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>URL Aplikasi Live</label>
                <input
                  className={field}
                  placeholder="https://…"
                  value={editing.live_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                />
              </div>
              <div>
                <label className={label}>Tag fitur (pisahkan dengan koma)</label>
                <input
                  className={field}
                  placeholder="Inventori, Pembelian, Laporan"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Screenshot</label>
                <input type="file" accept="image/*" onChange={handleFile} className="mt-1.5 block text-sm" />
                {editing.screenshot_url && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg">
                    <Image src={editing.screenshot_url} alt="" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <div>
                  <label className={label}>Urutan</label>
                  <input
                    type="number"
                    className={`${field} w-24`}
                    value={editing.sort_order}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: Number(e.target.value) })
                    }
                  />
                </div>
                <label className="flex items-center gap-2 pt-7 text-sm text-forest-dark">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 pt-7 text-sm text-forest-dark">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  />
                  Published
                </label>
              </div>
            </div>

            {msg && <p className="mt-4 text-sm text-red-700">{msg}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-forest-dark/70 hover:bg-warm-neutral"
              >
                Batal
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="rounded-full bg-forest-dark px-6 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-60"
              >
                {busy ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
