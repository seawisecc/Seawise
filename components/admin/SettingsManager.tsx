"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicPages } from "@/lib/revalidate";
import { MAYALOKA_LOGO, MAYALOKA_NAME } from "@/lib/contact";
import LandingPagesCard from "./LandingPagesCard";

/**
 * Site-wide switches. Reads and writes the `site_settings` key/value table
 * (migration v12); `getSiteSettings()` in lib/queries.ts is the reader on the
 * public side, and it holds the defaults.
 *
 * Saves on the flip rather than behind a Simpan button. With one switch a save
 * step is just a second click that can be forgotten, and the row is small
 * enough that a failed write is easy to undo by flipping back.
 */

/** Keys live here, not inline, so a typo cannot write a row nothing reads. */
const KEY_PARENT_ORG = "show_parent_org";

export default function SettingsManager() {
  const supabase = createClient();
  const [showParentOrg, setShowParentOrg] = useState(true);
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
        .select("key, value")
        .eq("key", KEY_PARENT_ORG)
        .maybeSingle();

      // No row yet means the migration seed has not run. Default to showing it,
      // which is what the public side does too, so the panel never claims the
      // footer is hiding something it is actually still rendering.
      const value = (data as { value?: unknown } | null)?.value;
      setShowParentOrg(typeof value === "boolean" ? value : true);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleParentOrg() {
    if (!supabase || busy) return;
    const next = !showParentOrg;

    setBusy(true);
    setMsg("");
    // Optimistic: the switch moves now, and rolls back below if the write fails.
    setShowParentOrg(next);

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: KEY_PARENT_ORG, value: next, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    setBusy(false);

    if (error) {
      setShowParentOrg(!next);
      setMsg(
        `Gagal menyimpan: ${error.message}. Kalau tabelnya belum ada, jalankan supabase-migration-v12.sql dulu di Supabase.`
      );
      return;
    }

    setNotice(await revalidatePublicPages());
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-dark">
        Pengaturan
      </h1>
      <p className="mt-2 text-sm text-forest-dark/60">
        Saklar yang mempengaruhi seluruh situs publik.
      </p>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      {msg && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {msg}
        </p>
      )}

      {notice && (
        <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {notice} Setelan sudah tersimpan, halaman publik akan menyusul sendiri
          paling lama 2 menit.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-warm-neutral bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-forest-dark">
              Tampilkan induk perusahaan di footer
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-dark/70">
              Menampilkan baris <span className="font-medium">Part of</span> plus
              logo {MAYALOKA_NAME} di bar bawah footer, di semua halaman publik.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest-dark/60">
              Saklar ini juga mengatur <code className="rounded bg-warm-neutral/60 px-1.5 py-0.5 text-xs">parentOrganization</code>{" "}
              di structured data. Sengaja jadi satu: kalau barisnya disembunyikan
              tapi datanya tetap dikirim, halamanmu bercerita beda ke pengunjung
              dan ke Google.
            </p>
          </div>

          <Switch
            checked={showParentOrg}
            disabled={loading || busy || !supabase}
            onChange={toggleParentOrg}
            label="Tampilkan induk perusahaan di footer"
          />
        </div>

        {/* Pratinjau persis seperti yang dirender footer, di atas warna footer. */}
        <div className="mt-6 border-t border-warm-neutral pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-dark/40">
            Pratinjau
          </p>
          <div className="mt-3 rounded-xl bg-near-black px-5 py-4">
            {showParentOrg ? (
              <div className="flex items-center justify-end gap-2.5 text-xs text-off-white/50">
                <span className="whitespace-nowrap">Part of</span>
                <Image
                  src={MAYALOKA_LOGO}
                  alt={MAYALOKA_NAME}
                  width={141}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
            ) : (
              <p className="text-right text-xs italic text-off-white/30">
                Tidak ditampilkan
              </p>
            )}
          </div>
        </div>
      </div>

      <LandingPagesCard />
    </div>
  );
}

/** Accessible on/off switch in the site palette. */
function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-sea-foam" : "bg-warm-neutral"
      }`}
    >
      {/* `left-1` wajib ada. Tanpa itu knob memakai static position, dan karena
          <button> rata tengah, titik nolnya ikut ke tengah track lalu geserannya
          melempar knob keluar dari pil. Track 48px, knob 20px, sisa 4px di tiap
          sisi, jadi jarak tempuhnya tepat 20px = translate-x-5. */}
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
