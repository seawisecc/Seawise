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
 * Map the localized fallback content into row shapes, so pages render real
 * design even before Supabase is populated or connected.
 */
function fallbackPortfolioRows(lang: Locale): PortfolioRow[] {
  return getDictionary(lang).fallbackPortfolio.map((p, i) => ({
    id: `fallback-${i}`,
    title: p.title,
    slug: p.slug,
    description: p.summary,
    body: null,
    gallery: null,
    industry: p.industry,
    project_type: p.type,
    live_url: "#",
    screenshot_url: null,
    mobile_url: null,
    cover_url: null,
    tech_stack: p.techStack,
    featured: true,
    sort_order: i,
    published: true,
  }));
}

/**
 * Testimonials have no fallback on purpose: showing invented client quotes on a
 * live site is misleading, so the section stays hidden until real ones exist.
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
  if (!supabase) return fallbackPortfolioRows(lang);

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackPortfolioRows(lang);
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
};

export async function getPosts(): Promise<PostRow[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return data as PostRow[];
}

export async function getPost(slug: string): Promise<PostRow | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as PostRow;
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
