import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";

/**
 * Web app manifest, served by Next at `/manifest.webmanifest`.
 *
 * `start_url` points at the default locale rather than `/` on purpose: the
 * middleware redirects any path without a locale prefix, and a start_url that
 * redirects costs the installed app a round trip on every cold launch.
 *
 * The manifest route sits outside the middleware matcher because its path
 * contains a dot, same as `sw.js`. Do not rename either to a dotless path.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seawise Studio",
    short_name: "Seawise",
    description:
      "Studio pembuatan aplikasi dan website di Bali. Panel admin dan situs Seawise Studio dalam satu aplikasi yang bisa dipasang.",
    id: "/",
    start_url: `/${i18n.defaultLocale}`,
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    // Splash background matches `off-white`, the site background, so the
    // launch screen does not flash a different colour before paint.
    background_color: "#FAFAF8",
    theme_color: "#FAFAF8",
    categories: ["business", "productivity"],
    lang: i18n.defaultLocale,
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Padded to roughly 62% of the canvas so Android can crop it to a
        // circle or a squircle without clipping the whale.
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Pesan Masuk",
        short_name: "Pesan",
        url: "/id/admin/leads",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Keuangan",
        short_name: "Keuangan",
        url: "/id/admin/keuangan",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Portfolio",
        short_name: "Portfolio",
        url: "/id/admin/portfolio",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
