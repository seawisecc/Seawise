import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/** Row shapes mirror the Supabase tables (see README schema). */
export type PortfolioRow = {
  id: string;
  title: string;
  description: string | null;
  industry: string | null;
  live_url: string | null;
  screenshot_url: string | null;
  tech_stack: string[] | null;
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
    description: p.summary,
    industry: p.industry,
    live_url: "#",
    screenshot_url: null,
    tech_stack: p.techStack,
    featured: true,
    sort_order: i,
    published: true,
  }));
}

function fallbackTestimonialRows(lang: Locale): TestimonialRow[] {
  return getDictionary(lang).fallbackTestimonials.map((t, i) => ({
    id: `fallback-${i}`,
    client_name: t.clientName,
    company: t.company,
    role: t.role,
    content: t.content,
    avatar_url: null,
    published: true,
    sort_order: i,
  }));
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
  return data as PortfolioRow[];
}

export async function getTestimonials(lang: Locale): Promise<TestimonialRow[]> {
  const supabase = createClient();
  if (!supabase) return fallbackTestimonialRows(lang);

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackTestimonialRows(lang);
  return data as TestimonialRow[];
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
