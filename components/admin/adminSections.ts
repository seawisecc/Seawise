import type { ComponentType } from "react";
import {
  GridIcon,
  WalletIcon,
  LayersIcon,
  TagIcon,
  QuoteIcon,
  UsersIcon,
  ArticleIcon,
  InboxIcon,
} from "./AdminIcons";

/**
 * Single source of truth for the admin menu. The desktop sidebar and the mobile
 * bottom bar both read this, so the two can never drift apart.
 */
export type AdminSection = {
  /** Path after `/[lang]/admin`. Empty string is the dashboard itself. */
  slug: string;
  label: string;
  /** Shorter label for the bottom bar, where each slot is only ~1/5 of screen. */
  short?: string;
  Icon: ComponentType<{ className?: string }>;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { slug: "", label: "Dashboard", Icon: GridIcon },
  { slug: "keuangan", label: "Keuangan", Icon: WalletIcon },
  { slug: "portfolio", label: "Portfolio", Icon: LayersIcon },
  { slug: "pricing", label: "Price List", Icon: TagIcon },
  { slug: "testimonials", label: "Testimoni", Icon: QuoteIcon },
  { slug: "partners", label: "Partner", Icon: UsersIcon },
  { slug: "blog", label: "Blog", Icon: ArticleIcon },
  { slug: "leads", label: "Pesan Masuk", short: "Pesan", Icon: InboxIcon },
];

/** The four opened reactively (something happened), so they get a bottom slot. */
const PRIMARY_SLUGS: string[] = ["", "keuangan", "portfolio", "leads"];

export const PRIMARY_SECTIONS = ADMIN_SECTIONS.filter((s) =>
  PRIMARY_SLUGS.includes(s.slug)
);

/** The rest, reached through the "Lainnya" sheet. */
export const SECONDARY_SECTIONS = ADMIN_SECTIONS.filter(
  (s) => !PRIMARY_SLUGS.includes(s.slug)
);

export function sectionHref(base: string, slug: string): string {
  return slug ? `${base}/${slug}` : base;
}

export function isSectionActive(
  pathname: string,
  base: string,
  slug: string
): boolean {
  return slug ? pathname.startsWith(`${base}/${slug}`) : pathname === base;
}

/** Page name for the mobile top bar. Falls back to the dashboard label. */
export function activeSectionLabel(pathname: string, base: string): string {
  const match = ADMIN_SECTIONS.find(
    (s) => s.slug && isSectionActive(pathname, base, s.slug)
  );
  return match ? match.label : ADMIN_SECTIONS[0].label;
}
