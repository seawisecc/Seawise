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
};

const empty: Omit<Row, "id"> = {
  client_name: "",
  company: "",
  role: "",
  content: "",
  avatar_url: "",
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
      setEditing({ ...editing, avatar_url: url });
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(
        `Gagal upload — ${detail}. Cek bucket 'media' sudah dibuat (public) dan policy storage sudah dijalankan.`
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-warm-neutral">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-neutral/50 text-forest-dark/70">
            <tr>
              <th className="px-4 py-3 font-medium">Urutan</th>
              <th className="px-4 py-3 font-medium">Klien</th>
              <th className="px-4 py-3 font-medium">Perusahaan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral">
                <td className="px-4 py-3 text-forest-dark/60">{r.sort_order}</td>
                <td className="px-4 py-3 font-medium text-forest-dark">{r.client_name}</td>
                <td className="px-4 py-3 text-forest-dark/70">{r.company}</td>
                <td className="px-4 py-3">
                  <span className={r.published ? "text-sea-foam" : "text-forest-dark/40"}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => { setEditing({ ...r }); setMsg(""); }} className="text-sea-foam hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(r.id)} className="ml-3 text-red-700 hover:underline">
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

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-off-white p-6">
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
              <div>
                <label className={label}>Foto / avatar (opsional)</label>
                <input type="file" accept="image/*" onChange={handleFile} className="mt-1.5 block text-sm" />
                {editing.avatar_url && (
                  <div className="relative mt-2 h-16 w-16 overflow-hidden rounded-full">
                    <Image src={editing.avatar_url} alt="" fill className="object-cover" />
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
