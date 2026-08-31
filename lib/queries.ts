import { cache } from "react";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Bilingual content lives in one row: Indonesian in the base column, English in
 * a matching `*_en` column. When the English value is blank we fall back to the
 * Indonesian one, so a half-translated row never renders as an empty page.
 */
type EnFields = Record<string, unknown>;

function pickText(lang: Locale, base: string | null, en: unknown): string | null {
  if (lang === "en" && typeof en === "string" && en.trim()) return en;
  return base;
}

function pickList(lang: Locale, base: string[] | null, en: unknown): string[] | null {
  if (lang === "en" && Array.isArray(en) && en.length > 0) return en as string[];
  return base;
}

/** Row shapes mirror the Supabase tables (see README schema). */
export type PortfolioRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  body: string | null;
  gallery: string[] | null;
  industry: string | null;
  project_type: string; // 'app' | 'website'
  live_url: string | null;
  screenshot_url: string | null;
  mobile_url: string | null;
  cover_url: string | null;
  tech_stack: string[] | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type PricingRow = {
  id: string;
  name: string;
  tagline: string | null;
  price: string | null;
  price_note: string | null;
  features: string[] | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type TestimonialRow = {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  content: string;
  avatar_url: string | null;
  published: boolean;
  sort_order: number;
};

export type PartnerRow = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  published: boolean;
};

/**
 * Portfolio and testimonials have no fallback on purpose. Placeholder rows used
 * to be rendered here, but they carried slugs whose detail pages do not exist,
 * so every card linked to a 404 and those URLs leaked into sitemap.xml. Callers
 * hide their section when the list comes back empty. Use `supabase-seed.sql` to
 * populate a fresh database instead.
 */

function localizePortfolio(row: PortfolioRow & EnFields, lang: Locale): PortfolioRow {
  return {
    ...row,
    title: pickText(lang, row.title, row.title_en) ?? row.title,
    description: pickText(lang, row.description, row.description_en),
    body: pickText(lang, row.body, row.body_en),
    industry: pickText(lang, row.industry, row.industry_en),
    tech_stack: pickList(lang, row.tech_stack, row.tech_stack_en),
  };
}

export async function getPortfolio(lang: Locale): Promise<PortfolioRow[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as (PortfolioRow & EnFields)[]).map((r) => localizePortfolio(r, lang));
}

export async function getPortfolioItem(
  slug: string,
  lang: Locale
): Promise<PortfolioRow | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return localizePortfolio(data as PortfolioRow & EnFields, lang);
}

export async function getTestimonials(lang: Locale): Promise<TestimonialRow[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as (TestimonialRow & EnFields)[]).map((r) => ({
    ...r,
    content: pickText(lang, r.content, r.content_en) ?? r.content,
    role: pickText(lang, r.role, r.role_en),
  }));
}

function fallbackPricingRows(lang: Locale): PricingRow[] {
  return getDictionary(lang).fallbackPricing.map((p, i) => ({
    id: `fallback-${i}`,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    price_note: p.priceNote,
    features: p.features,
    featured: p.featured,
    sort_order: i,
    published: true,
  }));
}

export async function getPricing(lang: Locale): Promise<PricingRow[]> {
  const supabase = createClient();
  if (!supabase) return fallbackPricingRows(lang);

  const { data, error } = await supabase
    .from("pricing")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackPricingRows(lang);
  return (data as (PricingRow & EnFields)[]).map((r) => ({
    ...r,
    tagline: pickText(lang, r.tagline, r.tagline_en),
    price_note: pickText(lang, r.price_note, r.price_note_en),
    features: pickList(lang, r.features, r.features_en),
  }));
}

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  author_name: string | null;
  author_title: string | null;
};

function localizePost(row: PostRow & EnFields, lang: Locale): PostRow {
  return {
    ...row,
    title: pickText(lang, row.title, row.title_en) ?? row.title,
    excerpt: pickText(lang, row.excerpt, row.excerpt_en),
    content: pickText(lang, row.content, row.content_en),
    author_title: pickText(lang, row.author_title, row.author_title_en),
  };
}

export async function getPosts(lang: Locale): Promise<PostRow[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return (data as (PostRow & EnFields)[]).map((r) => localizePost(r, lang));
}

export async function getPost(slug: string, lang: Locale): Promise<PostRow | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return localizePost(data as PostRow & EnFields, lang);
}

export async function getPartners(): Promise<PartnerRow[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as PartnerRow[];
}

/**
 * Site-wide switches the owner flips in /admin/pengaturan.
 *
 * Stored key/value in `site_settings` (migration v12) rather than a column per
 * switch, so a new toggle costs a row instead of a migration. The untyped jsonb
 * stops here: callers get this object, with a default for every field.
 *
 * Every default is the behaviour the site had before the switch existed. That
 * matters because the defaults are also what gets returned when the table is
 * missing or unreadable: a database problem must never silently strip content
 * off the public site.
 */
export type SiteSettings = {
  /** "Part of Mayaloka Digital" in the footer, and `parentOrganization` in JSON-LD. */
  showParentOrg: boolean;
};

const SETTINGS_DEFAULTS: SiteSettings = { showParentOrg: true };

/** Database key to field. A key that is not listed here is ignored. */
const SETTING_FIELDS: Record<string, keyof SiteSettings> = {
  show_parent_org: "showParentOrg",
};

/**
 * `cache` dedupes this across one render: the footer and the JSON-LD both ask,
 * and they must agree anyway, so they should not be two round trips.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createClient();
  if (!supabase) return SETTINGS_DEFAULTS;

  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error || !data) return SETTINGS_DEFAULTS;

  const settings = { ...SETTINGS_DEFAULTS };
  for (const row of data as { key: string; value: unknown }[]) {
    const field = SETTING_FIELDS[row.key];
    // Only a real boolean wins. Anything else leaves the default in place,
    // so a hand-edited row cannot render the site in an undefined state.
    if (field && typeof row.value === "boolean") settings[field] = row.value;
  }
  return settings;
});

/**
 * Per-page hook overrides for the paid-ads landing pages, edited in
 * /admin/pengaturan. Stored in the same `site_settings` table under
 * `copy_<page>` keys, so adding this needed no migration.
 *
 * Why overridable at all, when rule 1 says visitor text lives in the
 * dictionary: the headline is the one line an operator changes while an ad is
 * running, and going through a deploy for it makes testing hooks impractical.
 * The dictionary stays the source of truth and the fallback; an override is a
 * temporary pin on top of it, and clearing the field returns the page to code.
 *
 * Locale follows the same convention as the `*_en` columns elsewhere in the
 * schema: the base field is Indonesian, `*_en` is optional, and an empty
 * English value falls back to Indonesian rather than to the dictionary. That
 * matches what an operator expects after editing only the Indonesian box.
 */
export type PromoCopyOverride = {
  title?: string | null;
  subtitle?: string | null;
  title_en?: string | null;
  subtitle_en?: string | null;
};

/** `copy_promo`, `copy_promo_aplikasi`, and any page added later. */
const COPY_KEY_PREFIX = "copy_";

const getPromoCopyOverrides = cache(
  async (): Promise<Record<string, PromoCopyOverride>> => {
    const supabase = createClient();
    if (!supabase) return {};

    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .like("key", `${COPY_KEY_PREFIX}%`);
    if (error || !data) return {};

    const out: Record<string, PromoCopyOverride> = {};
    for (const row of data as { key: string; value: unknown }[]) {
      // Anything that is not an object is ignored, so a hand-edited row cannot
      // put the page into a shape the renderer does not expect.
      if (row.value && typeof row.value === "object" && !Array.isArray(row.value)) {
        out[row.key.slice(COPY_KEY_PREFIX.length)] = row.value as PromoCopyOverride;
      }
    }
    return out;
  }
);

/** Trimmed value, or null when the field is absent or blank. */
function usable(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Effective hook for one landing page. `fallback` is the dictionary copy, which
 * is what renders whenever no override is set, the table is unreachable, or the
 * stored value is blank.
 */
export async function resolvePromoCopy(
  lang: Locale,
  page: string,
  fallback: { title: string; subtitle: string }
): Promise<{ title: string; subtitle: string }> {
  const override = (await getPromoCopyOverrides())[page];
  if (!override) return fallback;

  const pick = (base: unknown, en: unknown) =>
    lang === "en" ? usable(en) ?? usable(base) : usable(base);

  return {
    title: pick(override.title, override.title_en) ?? fallback.title,
    subtitle: pick(override.subtitle, override.subtitle_en) ?? fallback.subtitle,
  };
}
