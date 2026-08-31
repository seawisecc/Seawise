"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/siteUrl";
import { i18n } from "@/lib/i18n/config";
import PromoCopyEditor from "./PromoCopyEditor";

/**
 * Reference card for the paid-ads landing pages.
 *
 * Read only on purpose. These pages are reachable only from an ad, so the thing
 * the owner actually needs from the panel is not a switch, it is the address,
 * ready to paste into Meta or Google with the source already attached.
 *
 * The headline shown for each page is read from the dictionary rather than
 * retyped here. That way the reminder cannot drift from what the page really
 * says: change the hook and this card changes with it.
 */

const AD_SOURCE_PRESETS = [
  "meta-ads",
  "google-ads",
  "tiktok-ads",
  "instagram-bio",
];

/** Admin is Indonesian only, so the reminder text is read from the id dictionary.
 *  The English one is needed for the optional English boxes in the editor. */
const dict = getDictionary("id");
const dictEn = getDictionary("en");

const LANDING_PAGES = [
  {
    path: "promo",
    label: "Iklan Website",
    hook: dict.promo.title,
    note: "Membuka dengan harga dan waktu pengerjaan. Untuk orang yang sedang membandingkan penawaran website.",
    defaults: {
      title: dict.promo.title,
      subtitle: dict.promo.subtitle,
      titleEn: dictEn.promo.title,
      subtitleEn: dictEn.promo.subtitle,
    },
  },
  {
    path: "promo-aplikasi",
    label: "Iklan Aplikasi",
    hook: dict.promoApp.title,
    note: "Membuka dengan masalah, bukan harga. Untuk pemilik usaha yang sistemnya sudah ada tapi tidak dipakai.",
    defaults: {
      title: dict.promoApp.title,
      subtitle: dict.promoApp.subtitle,
      titleEn: dictEn.promoApp.title,
      subtitleEn: dictEn.promoApp.subtitle,
    },
  },
];

export default function LandingPagesCard() {
  const [source, setSource] = useState(AD_SOURCE_PRESETS[0]);
  const [copied, setCopied] = useState<string | null>(null);

  /** Empty source gives a clean URL rather than a dangling `?utm_source=`. */
  function urlFor(lang: string, path: string) {
    const clean = source.trim();
    const query = clean ? `?utm_source=${encodeURIComponent(clean)}` : "";
    return `${SITE_URL}/${lang}/${path}${query}`;
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1600);
    } catch {
      // Clipboard is blocked in some contexts. The URL is on screen and
      // selectable, so there is nothing to recover from, just no confirmation.
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-warm-neutral bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-forest-dark">
        Halaman iklan
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest-dark/70">
        Dua landing page khusus iklan berbayar. Keduanya sengaja{" "}
        <code className="rounded bg-warm-neutral/60 px-1.5 py-0.5 text-xs">
          noindex
        </code>
        , jadi tidak muncul di pencarian Google dan tidak berebut kata kunci
        dengan halaman SEO kamu. Satu-satunya jalan masuk ke sini adalah link
        yang kamu pasang di iklan.
      </p>

      <div className="mt-6 border-t border-warm-neutral pt-5">
        <label
          htmlFor="ad-source"
          className="text-sm font-medium text-forest-dark"
        >
          Sumber iklan
        </label>
        <p className="mt-1 text-sm leading-relaxed text-forest-dark/60">
          Ditempelkan ke link sebagai <code className="text-xs">utm_source</code>
          , lalu muncul di kolom Sumber di Pesan Masuk. Ini yang memberi tahu
          kamu iklan mana yang menghasilkan.
        </p>
        <input
          id="ad-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="meta-ads"
          className="mt-3 w-full max-w-xs rounded-xl border border-warm-neutral bg-white px-4 py-2.5 text-forest-dark focus:border-sea-foam focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {AD_SOURCE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSource(preset)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                source === preset
                  ? "bg-forest-dark text-off-white"
                  : "bg-warm-neutral text-forest-dark/70 hover:bg-warm-neutral/70"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5 border-t border-warm-neutral pt-5">
        {LANDING_PAGES.map((page) => (
          <div
            key={page.path}
            className="rounded-xl border border-warm-neutral bg-warm-neutral/30 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-forest-dark">
                  {page.label}
                </h3>
                <p className="mt-1.5 max-w-lg text-sm italic leading-relaxed text-forest-dark/70">
                  “{page.hook}”
                </p>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-forest-dark/50">
                  {page.note}
                </p>
              </div>
              <a
                href={urlFor(i18n.defaultLocale, page.path)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-forest-dark/20 px-4 py-1.5 text-xs font-medium text-forest-dark transition-colors hover:border-sea-foam hover:text-sea-foam"
              >
                Buka halaman
              </a>
            </div>

            <div className="mt-4 space-y-2">
              {["id", "en"].map((lang) => {
                const url = urlFor(lang, page.path);
                return (
                  <div
                    key={lang}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2"
                  >
                    <span className="w-7 shrink-0 text-xs font-semibold uppercase text-forest-dark/40">
                      {lang}
                    </span>
                    <code className="min-w-0 flex-1 truncate text-xs text-forest-dark/80">
                      {url}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(url)}
                      className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-sea-foam transition-colors hover:bg-sea-foam/10"
                    >
                      {copied === url ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Path apa adanya, tanpa mengganti tanda hubung. `resolvePromoCopy`
                mencari lewat path yang sama, jadi mengubahnya di sini membuat
                simpan tampak berhasil tapi halamannya tidak pernah berubah. */}
            <PromoCopyEditor
              settingKey={`copy_${page.path}`}
              defaults={page.defaults}
            />
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-forest-dark/50">
        Alamat dan judulnya dibaca langsung dari halamannya, jadi kartu ini tidak
        bisa basi. Kalau nanti ada halaman iklan baru, dia muncul di sini setelah
        didaftarkan sekali di berkas komponen ini.
      </p>
    </div>
  );
}
