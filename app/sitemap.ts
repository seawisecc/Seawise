import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/siteUrl";
import { getPosts, getPortfolio } from "@/lib/queries";

const paths = [
  "",
  "/layanan",
  "/jasa-pembuatan-website-bali",
  "/jasa-pembuatan-aplikasi-bali",
  "/portfolio",
  "/testimoni",
  "/blog",
  "/tentang",
  "/kontak",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages, per locale.
  for (const locale of i18n.locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority:
          path === ""
            ? 1
            : path === "/kontak" || path.includes("jasa-pembuatan")
              ? 0.8
              : 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  // Portfolio case studies, per locale.
  const portfolio = await getPortfolio(i18n.defaultLocale);
  for (const item of portfolio) {
    if (!item.slug) continue;
    for (const locale of i18n.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/portfolio/${item.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${SITE_URL}/${l}/portfolio/${item.slug}`])
          ),
        },
      });
    }
  }

  // Blog articles, per locale.
  const posts = await getPosts(i18n.defaultLocale);
  for (const post of posts) {
    // `updated_at` first: an article revised after publishing should tell
    // crawlers to come back, and the publish date alone never would.
    const lastMod = post.updated_at ?? post.published_at ?? post.created_at;
    for (const locale of i18n.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: lastMod ? new Date(lastMod) : now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
