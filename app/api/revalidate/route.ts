import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";

/**
 * On-demand revalidation for the admin panel.
 *
 * Public pages use `revalidate = 120` with stale-while-revalidate, so the first
 * visit after an edit still serves the old HTML while Next regenerates in the
 * background. That reads as "my edit did not save". This route lets the admin
 * purge those entries the moment a row is written, so the next load is fresh.
 *
 * Auth reuses the Supabase session cookie the admin panel already sets, so no
 * extra secret has to be configured in Vercel.
 */

export const dynamic = "force-dynamic";

/**
 * Type "layout" on "/" purges every page nested below the root layout: all 11
 * public pages in both locales, plus the portfolio and blog detail routes, so
 * no slug has to be enumerated here. The two generated files sit outside that
 * tree and read from Supabase themselves, so they are listed explicitly.
 */
const TARGETS: Array<[string, "page" | "layout"]> = [
  ["/", "layout"],
  ["/llms.txt", "page"],
  ["/sitemap.xml", "page"],
];

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi di environment." },
      { status: 500 }
    );
  }

  const cookieStore = cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Read-only: this route never refreshes the session, so nothing to write.
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sesi admin tidak ditemukan, silakan login ulang." },
      { status: 401 }
    );
  }

  for (const [path, type] of TARGETS) revalidatePath(path, type);

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
