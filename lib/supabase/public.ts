import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookieless Supabase client for PUBLIC reads (portfolio, blog, pricing, etc).
 * Because it does not touch cookies/headers, pages using it can be statically
 * cached and revalidated (ISR) instead of rendered fresh on every request.
 * Returns null if env is missing so callers fall back to static content.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createSupabaseClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
