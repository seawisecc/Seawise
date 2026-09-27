"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import Wordmark from "@/components/Wordmark";
import AdminBottomNav from "./AdminBottomNav";
import InstallAppButton from "./InstallAppButton";
import { ExternalIcon, LogoutIcon } from "./AdminIcons";
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

      {/* Sidebar, desktop only. Sticky and exactly one screen tall, so the
          footer actions stay on screen however long the page is. It used to
          stretch with the content and push "Keluar" below the fold. */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-warm-neutral bg-white/60 p-4 md:flex">
        <Link href={base} className="mb-6 flex items-center gap-2.5 px-2 pt-1 text-forest-dark">
          <Logo className="h-7 w-7" colorClass="text-forest-dark" />
          <Wordmark className="text-lg" />
        </Link>

        <nav className="-mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1">
          {ADMIN_SECTIONS.map(({ slug, label, Icon }) => {
            const active = isSectionActive(pathname, base, slug);
            return (
              <Link
                key={slug || "dashboard"}
                href={sectionHref(base, slug)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest-dark text-off-white"
                    : "text-forest-dark/70 hover:bg-warm-neutral/70 hover:text-forest-dark"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-off-white" : "text-forest-dark/50"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 flex flex-col gap-0.5 border-t border-warm-neutral pt-3">
          <Link
            href={`/${lang}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-forest-dark/60 transition-colors hover:bg-warm-neutral/70 hover:text-forest-dark"
          >
            <ExternalIcon className="h-[18px] w-[18px] shrink-0" />
            Lihat website
          </Link>
          {/* Hilang sendiri kalau panel sudah terpasang atau browser tidak
              mendukung. Sengaja hanya di admin, situs publik tidak disentuh. */}
          <InstallAppButton />
          <button
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            <LogoutIcon className="h-[18px] w-[18px] shrink-0" />
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
