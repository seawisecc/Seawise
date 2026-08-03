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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
