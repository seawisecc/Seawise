"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import Wordmark from "@/components/Wordmark";
import AdminBottomNav from "./AdminBottomNav";
import InstallAppButton from "./InstallAppButton";
import {
  ADMIN_SECTIONS,
  activeSectionLabel,
  isSectionActive,
  sectionHref,
} from "./adminSections";

export default function AdminShell({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const base = `/${lang}/admin`;

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push(`${base}/login`);
    router.refresh();
  }

  // The login screen sits inside the admin segment but must not get the chrome.
  // Same pattern SiteChrome already uses to opt the admin panel out of the
  // marketing navbar and footer.
  if (pathname.startsWith(`${base}/login`)) return <>{children}</>;

  return (
    <div className="min-h-screen bg-off-white md:flex">
      {/* Mobile top bar: brand + current page. Menu lives in the bottom bar. */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-warm-neutral bg-off-white/90 px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur md:hidden">
        <Link href={base} className="flex items-center gap-2 text-forest-dark">
          <Logo className="h-7 w-7" colorClass="text-forest-dark" />
          <Wordmark className="text-base" />
        </Link>
        <span className="truncate pl-3 text-sm font-medium text-forest-dark/60">
          {activeSectionLabel(pathname, base)}
        </span>
      </div>

      {/* Sidebar, desktop only. */}
      <aside className="hidden w-56 flex-col border-r border-warm-neutral bg-white/60 p-5 md:flex">
        <Link href={base} className="mb-8 flex items-center gap-2.5 text-forest-dark">
          <Logo className="h-7 w-7" colorClass="text-forest-dark" />
          <Wordmark className="text-lg" />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {ADMIN_SECTIONS.map(({ slug, label }) => {
            const active = isSectionActive(pathname, base, slug);
            return (
              <Link
                key={slug || "dashboard"}
                href={sectionHref(base, slug)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest-dark text-off-white"
                    : "text-forest-dark/75 hover:bg-warm-neutral"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-warm-neutral pt-4">
          <Link
            href={`/${lang}`}
            className="rounded-lg px-3 py-2 text-xs font-medium text-forest-dark/60 hover:bg-warm-neutral"
          >
            ← Lihat website
          </Link>
          {/* Hilang sendiri kalau panel sudah terpasang atau browser tidak
              mendukung. Sengaja hanya di admin, situs publik tidak disentuh. */}
          <InstallAppButton />
          <button
            onClick={signOut}
            className="rounded-lg px-3 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Bottom padding clears the mobile bottom bar + iPhone safe area. */}
      <main className="min-w-0 flex-1 p-5 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:p-10 md:pb-10">
        {children}
      </main>

      <AdminBottomNav lang={lang} onSignOut={signOut} />
    </div>
  );
}
