import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Per-page canonical + hreflang.
 *
 * Without this, every page inherits the layout's canonical (which points at the
 * homepage) and Google treats the whole site as duplicates of `/`.
 *
 * @param lang current locale
 * @param path route after the locale, e.g. "layanan" or "" for the homepage
 */
export function pageAlternates(lang: Locale, path: string): Metadata["alternates"] {
  const suffix = path ? `/${path}` : "";
  return {
    canonical: `/${lang}${suffix}`,
    languages: {
      en: `/en${suffix}`,
      id: `/id${suffix}`,
      "x-default": `/en${suffix}`,
    },
  };
}

/**
 * Site-wide share image. Setting `openGraph` on a page overrides Next's
 * file-based `opengraph-image.png` convention, so every page that calls
 * `pageSeo` has to name the image itself or it ships with no preview at all.
 */
export const OG_IMAGE = `${SITE_URL}/opengraph-image.png`;

/** Trim to `max` characters on a word boundary, for meta descriptions. */
export function clampDescription(text: string | null | undefined, max = 155) {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}…`;
}

/**
 * Absolute URL to a Supabase-hosted image, resized through Next's optimizer.
 * Social scrapers fetch the raw URL otherwise, and the source screenshots run
 * from 400KB to 3.5MB, which WhatsApp silently refuses to render as a preview.
 */
export function ogImageUrl(src: string | null | undefined) {
  if (!src) return OG_IMAGE;
  if (!src.startsWith("http")) return OG_IMAGE;
  // Width 640, not the usual 1200. Social scrapers send `Accept: */*`, so the
  // optimizer hands back the source format, and these sources are lossless PNG
  // screenshots where `q` changes nothing. Only width moves the byte count.
  // 640 keeps it under WhatsApp's ~300KB preview ceiling while still clearing
  // the 600x315 minimum Facebook needs to render a large card. A preview that
  // always appears beats a sharper one that silently does not.
  return `${SITE_URL}/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;
}

/** Canonical + matching Open Graph url, for pages that set their own OG data. */
export function pageSeo(
  lang: Locale,
  path: string,
  { title, description }: { title: string; description: string }
): Metadata {
  const suffix = path ? `/${path}` : "";
  return {
    title,
    description,
    alternates: pageAlternates(lang, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}${suffix}`,
      siteName: "Seawise Studio",
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** BreadcrumbList JSON-LD. Google still renders these in search results. */
export function breadcrumbJsonLd(
  lang: Locale,
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${lang}${item.path ? `/${item.path}` : ""}`,
    })),
  };
}
