"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { SkeletonRows } from "./AdminSkeleton";
import { uploadImage } from "@/lib/uploadImage";
import { DEFAULT_AUTHOR } from "@/lib/author";
import { revalidatePublicPages } from "@/lib/revalidate";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published: boolean;
  published_at: string | null;
  updated_at: string | null;
  author_name: string | null;
  author_title: string | null;
  author_title_en: string | null;
  title_en: string | null;
  excerpt_en: string | null;
  content_en: string | null;
};

const empty: Omit<Row, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_url: "",
  published: false,
  published_at: null,
  updated_at: null,
  // Diisi otomatis untuk artikel baru supaya tidak perlu diketik ulang tiap
  // kali. Bisa diganti per artikel kalau ada penulis tamu.
  author_name: DEFAULT_AUTHOR.name,
  author_title: DEFAULT_AUTHOR.title,
  author_title_en: DEFAULT_AUTHOR.titleEn,
  title_en: "",
  excerpt_en: "",
  content_en: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Omit<Row, "id"> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "blog");
      // Functional update: the modal may have been closed while the upload ran.
      setEditing((prev) => (prev ? { ...prev, cover_url: url } : prev));
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(`Gagal upload cover: ${detail}. Cek bucket 'media' & policy storage.`);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!supabase || !editing) return;
    if (!editing.title.trim()) {
      setMsg("Judul wajib diisi.");
      return;
    }
    setBusy(true);
    setMsg("");
    const slug = (editing.slug || slugify(editing.title)).trim();
    const publishedAt =
      editing.published && !editing.published_at
        ? new Date().toISOString()
        : editing.published_at;

    const payload = {
      slug,
      title: editing.title,
      excerpt: editing.excerpt,
      content: editing.content,
      cover_url: editing.cover_url,
      published: editing.published,
      published_at: publishedAt,
      // Tanggal pembaruan untuk `dateModified` di JSON-LD. Ditulis di sini,
      // bukan lewat trigger database, karena panel admin adalah satu-satunya
      // yang menulis ke tabel ini, sama seperti published_at di atas.
      updated_at: new Date().toISOString(),
      author_name: editing.author_name,
      author_title: editing.author_title,
      author_title_en: editing.author_title_en,
      title_en: editing.title_en,
      excerpt_en: editing.excerpt_en,
      content_en: editing.content_en,
    };

    const { error } = editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);

    setBusy(false);
    if (error) {
      setMsg(`Gagal menyimpan: ${error.message}`);
      return;
    }
    setEditing(null);
    load();
    setNotice(await revalidatePublicPages());
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("Hapus artikel ini?")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
    setNotice(await revalidatePublicPages());
  }

  const label = "text-sm font-medium text-forest-dark";
  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-forest-dark">Blog</h1>
        <button
          onClick={() => { setEditing({ ...empty }); setMsg(""); }}
          className="rounded-full bg-forest-dark px-5 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam"
        >
          + Tulis Artikel
        </button>
      </div>
      <p className="mt-1.5 text-forest-dark/60">Artikel tampil di halaman /blog dan diindeks Google.</p>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      {notice && (
        <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {notice} Data sudah tersimpan, halaman publik akan menyusul sendiri paling lama 2 menit.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-warm-neutral bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-warm-neutral/40 text-xs font-semibold uppercase tracking-wider text-forest-dark/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Judul</th>
              <th className="px-5 py-3 font-semibold">Slug</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral/60 transition-colors hover:bg-warm-neutral/20">
                <td className="px-5 py-3 font-semibold text-forest-dark">{r.title}</td>
                <td className="px-5 py-3.5 text-forest-dark/60">/{r.slug}</td>
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
            {loading && <SkeletonRows cols={4} />}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-forest-dark/50">
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-off-white p-6 shadow-2xl md:p-7">
            <h2 className="font-display text-xl font-bold text-forest-dark">
              {editing.id ? "Edit" : "Tulis"} Artikel
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={label}>Judul</label>
                <input
                  className={field}
                  value={editing.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setEditing((prev) =>
                      prev
                        ? {
                            ...prev,
                            title,
                            // auto-isi slug selama belum diedit manual
                            slug: !prev.id && (!prev.slug || prev.slug === slugify(prev.title))
                              ? slugify(title)
                              : prev.slug,
                          }
                        : prev
                    );
                  }}
                />
              </div>
              <div>
                <label className={label}>Slug (URL)</label>
                <input
                  className={field}
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
                <p className="mt-1 text-xs text-forest-dark/50">/blog/{editing.slug || "…"}</p>
              </div>
              <div>
                <label className={label}>Ringkasan (excerpt)</label>
                <textarea
                  className={`${field} resize-y`}
                  rows={2}
                  placeholder="1–2 kalimat, dipakai untuk kartu & deskripsi Google"
                  value={editing.excerpt ?? ""}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Penulis</label>
                  <input
                    className={field}
                    placeholder="Nama yang tampil sebagai penulis"
                    value={editing.author_name ?? ""}
                    onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Jabatan penulis</label>
                  <input
                    className={field}
                    placeholder="mis. Founder Seawise Studio"
                    value={editing.author_title ?? ""}
                    onChange={(e) => setEditing({ ...editing, author_title: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className={label}>Isi artikel (Markdown)</label>
                <textarea
                  className={`${field} resize-y font-mono text-sm`}
                  rows={12}
                  placeholder={"## Sub judul\n\nParagraf...\n\n- poin satu\n- poin dua\n\n**tebal**, [tautan](https://...)"}
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                />
              </div>
              <div className="rounded-2xl border border-warm-neutral bg-white/60 p-4">
                <p className={label}>Versi Inggris (halaman /en)</p>
                <p className="mt-0.5 text-xs text-forest-dark/50">
                  Terjemahan artikel. Kosongkan kalau belum sempat, halaman /en
                  otomatis memakai versi Indonesia.
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">Judul (EN)</label>
                    <input
                      className={field}
                      value={editing.title_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">Ringkasan (EN)</label>
                    <textarea
                      className={`${field} resize-y`}
                      rows={2}
                      value={editing.excerpt_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, excerpt_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Jabatan penulis (EN)
                    </label>
                    <input
                      className={field}
                      value={editing.author_title_en ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, author_title_en: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Isi artikel (EN, Markdown)
                    </label>
                    <textarea
                      className={`${field} resize-y font-mono text-sm`}
                      rows={12}
                      value={editing.content_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, content_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={label}>Cover</label>
                <input type="file" accept="image/*" onChange={handleCover} className="mt-1.5 block text-sm" />
                {editing.cover_url && (
                  <div className="relative mt-2 aspect-[16/9] w-full max-w-xs overflow-hidden rounded-lg">
                    <Image src={editing.cover_url} alt="" fill sizes="320px" className="object-cover" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-forest-dark">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                Published (tampil di website & Google)
              </label>
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
