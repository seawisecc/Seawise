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

/**
 * `@id` of the ProfessionalService node in `components/StructuredData.tsx`.
 * Service nodes point at this instead of repeating the business details, so
 * every page describes one studio rather than a new one per page.
 */
export const STUDIO_ID = `${SITE_URL}/#studio`;

/** Where the studio works. Shared so the sitewide node and every Service agree. */
export const AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Bali" },
  { "@type": "Country", name: "Indonesia" },
];

/**
 * The one entry in `servicesList` that the website pricing packages belong to.
 * The other three are quoted per project and have no published price list.
 */
const WEB_SERVICE_SLUG = "web-dev";

type PriceSpec =
  | { "@type": "PriceSpecification"; price: number; priceCurrency: "IDR" }
  | {
      "@type": "PriceSpecification";
      minPrice: number;
      maxPrice: number;
      priceCurrency: "IDR";
    };

/**
 * One end of a price, in rupiah. `scale` is 1_000_000 when the string carried a
 * "juta"/"M" suffix, otherwise 1.
 */
function parseAmountIDR(raw: string, scale: number): number | null {
  if (scale > 1) {
    // Scaled by a suffix, so at most one decimal separator: "3,5", "3.5", "4".
    if (!/^\d+(?:[.,]\d+)?$/.test(raw)) return null;
    return Math.round(parseFloat(raw.replace(",", ".")) * scale);
  }
  // Plain rupiah. Either unseparated digits, or thousands grouped in threes by
  // a single consistent separator: "2000000", "2.000.000", "2,000,000".
  if (/^\d+$/.test(raw)) return Number(raw);
  if (/^\d{1,3}(?:\.\d{3})+$/.test(raw) || /^\d{1,3}(?:,\d{3})+$/.test(raw)) {
    return Number(raw.replace(/[.,]/g, ""));
  }
  return null;
}

/**
 * Turn a human-written package price into IDR numbers for schema.org.
 *
 * Covers the shapes that actually occur. The `pricing` rows in Supabase are
 * written out in full, `Rp 2.000.000`, while the dictionary fallback uses the
 * short forms `Rp2M` and `Rp3,5–4 juta`. Ranges are supported on both.
 *
 * Strict on purpose: anything it does not recognise returns null and the caller
 * leaves the price out of the JSON-LD entirely. Prices are edited freely in the
 * admin panel, and a number invented by a loose parser is a false claim about
 * the business, so no price is always the better failure. That is why a group
 * of digits only counts as thousands when every group is exactly three long,
 * and why a decimal is only allowed where a multiplier word explains it.
 */
export function parsePriceIDR(price: string | null | undefined) {
  if (!price) return null;

  const text = price.trim().replace(/^Rp\.?\s*/i, "");
  const suffix = text.match(/\s*(?:juta|jt|M)$/i);
  const scale = suffix ? 1_000_000 : 1;
  const numbers = (suffix ? text.slice(0, suffix.index) : text).trim();

  const parts = numbers.split(/\s*[–—-]\s*/);
  if (parts.length > 2) return null;

  const amounts = parts.map((part) => parseAmountIDR(part.trim(), scale));
  if (amounts.some((n) => n === null)) return null;

  const min = amounts[0] as number;
  const max = (amounts[1] ?? min) as number;
  if (min <= 0 || max < min) return null;

  return { min, max };
}

function priceSpecification(price: string | null | undefined): PriceSpec | undefined {
  const parsed = parsePriceIDR(price);
  if (!parsed) return undefined;
  return parsed.min === parsed.max
    ? { "@type": "PriceSpecification", price: parsed.min, priceCurrency: "IDR" }
    : {
        "@type": "PriceSpecification",
        minPrice: parsed.min,
        maxPrice: parsed.max,
        priceCurrency: "IDR",
      };
}

/** A single Service offered by the studio, for pages about one service. */
export function serviceJsonLd(
  lang: Locale,
  path: string,
  { name, description }: { name: string; description: string }
) {
  const url = `${SITE_URL}/${lang}${path ? `/${path}` : ""}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    provider: { "@id": STUDIO_ID },
    areaServed: AREA_SERVED,
  };
}

/**
 * Every main service as its own Service node, with the real website packages
 * attached to the web development one as an OfferCatalog.
 *
 * Names, summaries, and prices all come from the dictionary and the `pricing`
 * table. Nothing here is written by hand, so the markup cannot drift away from
 * what the page itself says.
 */
export function servicesJsonLd(
  lang: Locale,
  {
    services,
    pricing,
    catalogName,
  }: {
    services: readonly { slug: string; title: string; summary: string }[];
    pricing: readonly { name: string; tagline: string | null; price: string | null }[];
    catalogName: string;
  }
) {
  const url = `${SITE_URL}/${lang}/layanan`;
  const webService = services.find((s) => s.slug === WEB_SERVICE_SLUG);

  const offerCatalog =
    pricing.length > 0
      ? {
          "@type": "OfferCatalog",
          name: catalogName,
          itemListElement: pricing.map((p) => {
            const spec = priceSpecification(p.price);
            return {
              "@type": "Offer",
              name: p.name,
              url,
              ...(p.tagline ? { description: p.tagline } : {}),
              ...(spec ? { priceSpecification: spec } : {}),
              itemOffered: {
                "@type": "Service",
                name: p.name,
                ...(webService ? { serviceType: webService.title } : {}),
                provider: { "@id": STUDIO_ID },
              },
            };
          }),
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
      "@type": "Service",
      "@id": `${url}#${s.slug}`,
      name: s.title,
      serviceType: s.title,
      description: s.summary,
      url,
      provider: { "@id": STUDIO_ID },
      areaServed: AREA_SERVED,
      ...(s.slug === WEB_SERVICE_SLUG && offerCatalog
        ? { hasOfferCatalog: offerCatalog }
        : {}),
    })),
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
