import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/siteUrl";

const paths = ["", "/layanan", "/portfolio", "/testimoni", "/tentang", "/kontak"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path === "/kontak" ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
