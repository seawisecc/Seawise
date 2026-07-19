import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { i18n } from "@/lib/i18n/config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

function hasLocalePrefix(pathname: string): boolean {
  const seg = pathname.split("/")[1];
  return i18n.locales.includes(seg as (typeof i18n.locales)[number]);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parts = pathname.split("/"); // ["", locale, "admin", ...]

  // 1. No locale prefix → redirect to default locale (English).
  if (!hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = parts[1];
  const isAdmin = parts[2] === "admin";
  const isLoginPage = isAdmin && parts[3] === "login";

  // 2. Protect admin routes (except the login page).
  if (isAdmin && !isLoginPage) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase isn't configured, send to login (which explains the setup).
    if (!url || !anon) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(redirect);
    }

    let response = NextResponse.next({ request });
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(redirect);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
