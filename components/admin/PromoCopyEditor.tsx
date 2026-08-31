"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicPages } from "@/lib/revalidate";

/**
 * Editor for one landing page's hook.
 *
 * Writes a `copy_<page>` row into the same `site_settings` key/value table, so
 * this needed no migration. The reader is `resolvePromoCopy()` in
 * lib/queries.ts, which also holds the fallback rules.
 *
 * Two rules keep the page from ever ending up blank or accidentally frozen:
 *
 * 1. An empty field is stored as null, and null falls back to the text in the
 *    code. Clearing a box is how you undo, not how you break the page.
 * 2. A field left exactly as the code text is also stored as null. Without
 *    this, opening the form and pressing Simpan would silently pin today's
 *    wording forever, and a later copy change in the repo would never appear.
 */

type Fields = {
  title: string;
  subtitle: string;
  title_en: string;
  subtitle_en: string;
};

export type PromoCopyDefaults = {
  title: string;
  subtitle: string;
  titleEn: string;
  subtitleEn: string;
};

const EMPTY: Fields = { title: "", subtitle: "", title_en: "", subtitle_en: "" };

export default function PromoCopyEditor({
  settingKey,
  defaults,
}: {
  /** Row key in `site_settings`, e.g. `copy_promo`. */
  settingKey: string;
  /** Dictionary copy. Shown when nothing is overridden, and used as the reset target. */
  defaults: PromoCopyDefaults;
}) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [overridden, setOverridden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", settingKey)
        .maybeSingle();

      const value = (data as { value?: Partial<Fields> } | null)?.value;
      const has =
        !!value &&
        typeof value === "object" &&
        Object.values(value).some((v) => typeof v === "string" && v.trim());

      setOverridden(has);
      // Boxes always start from what the visitor currently sees, so the owner
      // edits the live wording rather than an empty form.
      setFields({
        title: value?.title?.trim() || defaults.title,
        subtitle: value?.subtitle?.trim() || defaults.subtitle,
        title_en: value?.title_en?.trim() || defaults.titleEn,
        subtitle_en: value?.subtitle_en?.trim() || defaults.subtitleEn,
      });
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingKey]);

  /** Blank or unchanged from the code text both mean "follow the code". */
  function stored(value: string, fallback: string): string | null {
    const clean = value.trim();
    return !clean || clean === fallback.trim() ? null : clean;
  }

  async function save() {
    if (!supabase) return;
    setBusy(true);
    setMsg("");

    const payload = {
      title: stored(fields.title, defaults.title),
      subtitle: stored(fields.subtitle, defaults.subtitle),
      title_en: stored(fields.title_en, defaults.titleEn),
      subtitle_en: stored(fields.subtitle_en, defaults.subtitleEn),
    };
    const anySet = Object.values(payload).some((v) => v !== null);

    // Nothing left to override: drop the row rather than keeping one full of
    // nulls, so the table stays readable in the Supabase editor.
    const { error } = anySet
      ? await supabase.from("site_settings").upsert(
          { key: settingKey, value: payload, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )
      : await supabase.from("site_settings").delete().eq("key", settingKey);

    setBusy(false);
    if (error) {
      setMsg(`Gagal menyimpan: ${error.message}`);
      return;
    }
    setOverridden(anySet);
    setNotice(await revalidatePublicPages());
  }

  async function reset() {
    if (!supabase) return;
    if (!confirm("Kembalikan semua teks halaman ini ke teks asli di kode?")) return;

    setBusy(true);
    setMsg("");
    const { error } = await supabase
      .from("site_settings")
      .delete()
      .eq("key", settingKey);
    setBusy(false);

    if (error) {
      setMsg(`Gagal mengembalikan: ${error.message}`);
      return;
    }
    setFields({
      title: defaults.title,
      subtitle: defaults.subtitle,
      title_en: defaults.titleEn,
      subtitle_en: defaults.subtitleEn,
    });
    setOverridden(false);
    setNotice(await revalidatePublicPages());
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-sm text-forest-dark focus:border-sea-foam focus:outline-none";
  const label = "text-xs font-semibold uppercase tracking-wider text-forest-dark/50";

  return (
    <div className="mt-4 border-t border-warm-neutral/70 pt-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={loading}
          className="rounded-full border border-forest-dark/20 px-4 py-1.5 text-xs font-medium text-forest-dark transition-colors hover:border-sea-foam hover:text-sea-foam disabled:opacity-50"
        >
          {open ? "Tutup editor" : "Edit teks"}
        </button>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            overridden
              ? "bg-sea-foam/15 text-sea-foam"
              : "bg-warm-neutral text-forest-dark/50"
          }`}
        >
          {loading
            ? "memuat..."
            : overridden
              ? "diubah manual"
              : "mengikuti teks asli"}
        </span>
      </div>

      {open && (
        <div className="mt-4">
          {msg && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {msg}
            </p>
          )}
          {notice && (
            <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {notice} Teks sudah tersimpan, halaman publik menyusul paling lama
              2 menit.
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className={label}>Judul (Indonesia)</label>
              <textarea
                rows={2}
                value={fields.title}
                onChange={(e) => setFields({ ...fields, title: e.target.value })}
                className={`${field} resize-y`}
              />
            </div>
            <div>
              <label className={label}>Subjudul (Indonesia)</label>
              <textarea
                rows={2}
                value={fields.subtitle}
                onChange={(e) =>
                  setFields({ ...fields, subtitle: e.target.value })
                }
                className={`${field} resize-y`}
              />
            </div>
            <div>
              <label className={label}>Judul (English, opsional)</label>
              <textarea
                rows={2}
                value={fields.title_en}
                onChange={(e) =>
                  setFields({ ...fields, title_en: e.target.value })
                }
                className={`${field} resize-y`}
              />
            </div>
            <div>
              <label className={label}>Subjudul (English, opsional)</label>
              <textarea
                rows={2}
                value={fields.subtitle_en}
                onChange={(e) =>
                  setFields({ ...fields, subtitle_en: e.target.value })
                }
                className={`${field} resize-y`}
              />
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-forest-dark/50">
            Kosongkan sebuah kotak untuk memakai teks asli di kode. Kotak yang
            kamu biarkan sama persis dengan teks asli juga tidak akan disimpan,
            jadi menekan Simpan tanpa mengubah apa pun tidak membekukan teksmu.
          </p>

          {/* Pratinjau di atas warna hero asli, supaya panjang judul terlihat
              apa adanya sebelum naik ke halaman berbayar. */}
          <div className="mt-5">
            <p className={label}>Pratinjau hero</p>
            <div className="mt-2 rounded-2xl bg-gradient-to-b from-forest-dark to-near-black px-6 py-8">
              <h3 className="font-display text-2xl font-bold leading-[1.1] tracking-tight text-off-white md:text-3xl">
                {fields.title.trim() || defaults.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-off-white/75">
                {fields.subtitle.trim() || defaults.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy || !supabase}
              className="rounded-full bg-forest-dark px-5 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam disabled:opacity-50"
            >
              {busy ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={busy || !supabase || !overridden}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-forest-dark/70 transition-colors hover:bg-warm-neutral disabled:opacity-40"
            >
              Kembalikan ke teks asli
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
