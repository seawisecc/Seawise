"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type Row = {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  content: string;
  avatar_url: string | null;
  published: boolean;
  sort_order: number;
  content_en: string | null;
  role_en: string | null;
};

const empty: Omit<Row, "id"> = {
  client_name: "",
  company: "",
  role: "",
  content: "",
  avatar_url: "",
  content_en: "",
  role_en: "",
  published: false,
  sort_order: 0,
};

export default function TestimonialManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Omit<Row, "id"> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "testimonials");
      // Functional update: the modal may have been closed while the upload ran.
      setEditing((prev) => (prev ? { ...prev, avatar_url: url } : prev));
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(
        `Gagal upload, ${detail}. Cek bucket 'media' sudah dibuat (public) dan policy storage sudah dijalankan.`
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
      client_name: editing.client_name,
      company: editing.company,
      role: editing.role,
      content: editing.content,
      content_en: editing.content_en,
      role_en: editing.role_en,
      avatar_url: editing.avatar_url,
      published: editing.published,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
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
    if (!confirm("Hapus testimoni ini?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  const label = "text-sm font-medium text-forest-dark";
  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-forest-dark">Testimoni</h1>
        <button
          onClick={() => { setEditing({ ...empty }); setMsg(""); }}
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-warm-neutral bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-warm-neutral/40 text-xs font-semibold uppercase tracking-wider text-forest-dark/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Urutan</th>
              <th className="px-5 py-3 font-semibold">Klien</th>
              <th className="px-5 py-3 font-semibold">Perusahaan</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral/60 transition-colors hover:bg-warm-neutral/20">
                <td className="px-5 py-3.5 text-forest-dark/60">{r.sort_order}</td>
                <td className="px-5 py-3 font-semibold text-forest-dark">{r.client_name}</td>
                <td className="px-5 py-3.5 text-forest-dark/70">{r.company}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${r.published ? "bg-sea-foam/15 text-sea-foam" : "bg-warm-neutral text-forest-dark/50"}`}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => { setEditing({ ...r }); setMsg(""); }} className="rounded-lg px-2.5 py-1 text-sm font-medium text-sea-foam transition-colors hover:bg-sea-foam/10">
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
                  Belum ada data.
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
              {editing.id ? "Edit" : "Tambah"} Testimoni
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Nama klien</label>
                <input className={field} value={editing.client_name}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={label}>Perusahaan</label>
                  <input className={field} value={editing.company ?? ""}
                    onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className={label}>Jabatan</label>
                  <input className={field} value={editing.role ?? ""}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={label}>Isi testimoni</label>
                <textarea className={`${field} resize-y`} rows={4} value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
              </div>
              <div className="rounded-2xl border border-warm-neutral bg-white/60 p-4">
                <p className={label}>Versi Inggris (halaman /en)</p>
                <p className="mt-0.5 text-xs text-forest-dark/50">
                  Terjemahan kutipan klien. Kosongkan kalau mau tetap tampil apa adanya.
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">Jabatan (EN)</label>
                    <input className={field} value={editing.role_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, role_en: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">Isi testimoni (EN)</label>
                    <textarea className={`${field} resize-y`} rows={4} value={editing.content_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, content_en: e.target.value })} />
                  </div>
                </div>
              </div>
              <div>
                <label className={label}>Foto / avatar (opsional)</label>
                <input type="file" accept="image/*" onChange={handleFile} className="mt-1.5 block text-sm" />
                {editing.avatar_url && (
                  <div className="relative mt-2 h-16 w-16 overflow-hidden rounded-full">
                    <Image src={editing.avatar_url} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-6">
                <div>
                  <label className={label}>Urutan</label>
                  <input type="number" className={`${field} w-24`} value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
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
