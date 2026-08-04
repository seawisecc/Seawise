"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type Row = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  body: string | null;
  gallery: string[] | null;
  industry: string | null;
  project_type: string;
  live_url: string | null;
  screenshot_url: string | null;
  mobile_url: string | null;
  cover_url: string | null;
  tech_stack: string[] | null;
  title_en: string | null;
  description_en: string | null;
  body_en: string | null;
  industry_en: string | null;
  tech_stack_en: string[] | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

const empty: Omit<Row, "id"> = {
  title: "",
  slug: "",
  description: "",
  body: "",
  gallery: [],
  industry: "",
  project_type: "app",
  live_url: "",
  screenshot_url: "",
  mobile_url: "",
  cover_url: "",
  tech_stack: [],
  title_en: "",
  description_en: "",
  body_en: "",
  industry_en: "",
  tech_stack_en: [],
  featured: false,
  sort_order: 0,
  published: true,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PortfolioManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Omit<Row, "id"> & { id?: string }) | null>(null);
  const [techInput, setTechInput] = useState("");
  const [techInputEn, setTechInputEn] = useState("");
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
    setTechInputEn("");
    setMsg("");
  }

  function startEdit(r: Row) {
    setEditing({ ...r });
    setTechInput((r.tech_stack ?? []).join(", "));
    setTechInputEn((r.tech_stack_en ?? []).join(", "));
    setMsg("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "portfolio");
      // Functional update: the modal may have been closed while the upload ran.
      setEditing((prev) => (prev ? { ...prev, screenshot_url: url } : prev));
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(
        `Gagal upload gambar, ${detail}. Cek bucket 'media' sudah dibuat (public) dan policy storage sudah dijalankan.`
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "portfolio");
      setEditing((prev) => (prev ? { ...prev, cover_url: url } : prev));
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(`Gagal upload cover: ${detail}. Cek bucket 'media' & policy storage.`);
    } finally {
      setBusy(false);
    }
  }

  async function handleMobile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !editing) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "portfolio");
      setEditing((prev) => (prev ? { ...prev, mobile_url: url } : prev));
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(`Gagal upload gambar mobile: ${detail}. Cek bucket 'media' & policy storage.`);
    } finally {
      setBusy(false);
    }
  }

  async function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0 || !supabase || !editing) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadImage(supabase, f, "portfolio"));
      // Reading `prev.gallery` also keeps a second batch from dropping the first.
      setEditing((prev) =>
        prev ? { ...prev, gallery: [...(prev.gallery ?? []), ...urls] } : prev
      );
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setMsg(`Gagal upload galeri: ${detail}. Cek bucket 'media' & policy storage.`);
    } finally {
      setBusy(false);
    }
  }

  function removeGalleryImage(url: string) {
    if (!editing) return;
    setEditing({ ...editing, gallery: (editing.gallery ?? []).filter((g) => g !== url) });
  }

  async function save() {
    if (!supabase || !editing) return;
    if (!editing.title.trim()) {
      setMsg("Judul wajib diisi.");
      return;
    }
    setBusy(true);
    setMsg("");
    const payload = {
      title: editing.title,
      slug: (editing.slug || slugify(editing.title)).trim(),
      description: editing.description,
      body: editing.body,
      gallery: editing.gallery ?? [],
      industry: editing.industry,
      project_type: editing.project_type,
      live_url: editing.live_url,
      screenshot_url: editing.screenshot_url,
      mobile_url: editing.mobile_url,
      cover_url: editing.cover_url,
      tech_stack: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      title_en: editing.title_en,
      description_en: editing.description_en,
      body_en: editing.body_en,
      industry_en: editing.industry_en,
      tech_stack_en: techInputEn
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
      <div className="mt-6 overflow-x-auto rounded-2xl border border-warm-neutral bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-warm-neutral/40 text-xs font-semibold uppercase tracking-wider text-forest-dark/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Urutan</th>
              <th className="px-5 py-3 font-semibold">Judul</th>
              <th className="px-5 py-3 font-semibold">Industri</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral/60 transition-colors hover:bg-warm-neutral/20">
                <td className="px-5 py-3.5 text-forest-dark/60">{r.sort_order}</td>
                <td className="px-5 py-3 font-semibold text-forest-dark">
                  {r.title}
                  {r.featured && (
                    <span className="ml-2 rounded-full bg-sea-foam/20 px-2 py-0.5 text-xs text-sea-foam">
                      featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-forest-dark/70">{r.industry}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${r.published ? "bg-sea-foam/15 text-sea-foam" : "bg-warm-neutral text-forest-dark/50"}`}>
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => startEdit(r)} className="rounded-lg px-2.5 py-1 text-sm font-medium text-sea-foam transition-colors hover:bg-sea-foam/10">
                    Edit
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="ml-1 rounded-lg px-2.5 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
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

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-3xl bg-off-white p-6 shadow-2xl md:p-7">
            <h2 className="font-display text-xl font-bold text-forest-dark">
              {editing.id ? "Edit" : "Tambah"} Portfolio
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
                            slug:
                              !prev.id && (!prev.slug || prev.slug === slugify(prev.title))
                                ? slugify(title)
                                : prev.slug,
                          }
                        : prev
                    );
                  }}
                />
              </div>
              <div>
                <label className={label}>Slug (URL detail)</label>
                <input
                  className={field}
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
                <p className="mt-1 text-xs text-forest-dark/50">/portfolio/{editing.slug || "…"}</p>
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
                <label className={label}>Studi kasus (Markdown, opsional)</label>
                <textarea
                  className={`${field} resize-y font-mono text-sm`}
                  rows={8}
                  placeholder={"## Tantangan\n\nCerita masalah klien...\n\n## Solusi\n\nApa yang kami bangun...\n\n## Hasil\n\nDampaknya..."}
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                />
                <p className="mt-1 text-xs text-forest-dark/50">
                  Tampil di halaman detail. Kosongkan kalau cukup deskripsi singkat saja.
                </p>
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
              <div className="rounded-2xl border border-warm-neutral bg-white/60 p-4">
                <p className={label}>Versi Inggris (halaman /en)</p>
                <p className="mt-0.5 text-xs text-forest-dark/50">
                  Kosongkan kalau belum sempat. Yang kosong otomatis pakai teks Indonesia.
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
                    <label className="text-xs font-medium text-forest-dark/70">Industri (EN)</label>
                    <input
                      className={field}
                      placeholder="Manufacturing / Distribution"
                      value={editing.industry_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, industry_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">Deskripsi (EN)</label>
                    <textarea
                      className={`${field} resize-y`}
                      rows={3}
                      value={editing.description_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, description_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Tag fitur EN (pisahkan koma)
                    </label>
                    <input
                      className={field}
                      placeholder="Inventory, Purchasing, Reporting"
                      value={techInputEn}
                      onChange={(e) => setTechInputEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Studi kasus EN (Markdown)
                    </label>
                    <textarea
                      className={`${field} resize-y font-mono text-sm`}
                      rows={6}
                      value={editing.body_en ?? ""}
                      onChange={(e) => setEditing({ ...editing, body_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={label}>Foto cover (tampil di kartu portfolio)</label>
                <input type="file" accept="image/*" onChange={handleCover} className="mt-1.5 block text-sm" />
                {editing.cover_url && (
                  <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden rounded-lg border border-warm-neutral">
                    <Image src={editing.cover_url} alt="" fill sizes="464px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, cover_url: "" })}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <p className="mt-1 text-xs text-forest-dark/50">
                  Kalau kosong, kartu memakai screenshot desktop di bawah.
                </p>
              </div>
              <div className="rounded-2xl border border-warm-neutral bg-white/60 p-4">
                <p className={label}>Gambar showcase</p>
                <p className="mt-0.5 text-xs text-forest-dark/50">
                  Desktop tampil di layar laptop, mobile tampil di HP pada slideshow homepage.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Screenshot Desktop (laptop)
                    </label>
                    <input type="file" accept="image/*" onChange={handleFile} className="mt-1.5 block w-full text-xs" />
                    {editing.screenshot_url && (
                      <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden rounded-lg border border-warm-neutral">
                        <Image src={editing.screenshot_url} alt="" fill sizes="224px" className="object-cover object-top" />
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, screenshot_url: "" })}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-forest-dark/70">
                      Screenshot Mobile (HP)
                    </label>
                    <input type="file" accept="image/*" onChange={handleMobile} className="mt-1.5 block w-full text-xs" />
                    {editing.mobile_url && (
                      <div className="relative mx-auto mt-2 aspect-[9/19] w-20 overflow-hidden rounded-xl border border-warm-neutral">
                        <Image src={editing.mobile_url} alt="" fill sizes="80px" className="object-cover object-top" />
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, mobile_url: "" })}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-forest-dark/45">
                  Isi minimal Desktop. Kalau Mobile dikosongkan, HP ikut memakai gambar desktop.
                </p>
              </div>
              <div>
                <label className={label}>Galeri detail (opsional, bisa banyak)</label>
                <input type="file" accept="image/*" multiple onChange={handleGallery} className="mt-1.5 block text-sm" />
                {(editing.gallery ?? []).length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(editing.gallery ?? []).map((g) => (
                      <div key={g} className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image src={g} alt="" fill sizes="150px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(g)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
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
