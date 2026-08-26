"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreIcon } from "./AdminIcons";
import InstallAppButton from "./InstallAppButton";
import {
  PRIMARY_SECTIONS,
  SECONDARY_SECTIONS,
  isSectionActive,
  sectionHref,
} from "./adminSections";

/**
 * App-style bottom navigation, mobile only (`md:hidden`). Four primary sections
 * plus a "Lainnya" sheet holding the rest, so the eight-item menu fits a phone.
 *
 * Sits at z-30, under the manager edit modals at z-50, so a modal always covers
 * it and its action buttons stay reachable.
 */
export default function AdminBottomNav({
  lang,
  onSignOut,
}: {
  lang: string;
  onSignOut: () => void;
}) {
  const pathname = usePathname() || "";
  const base = `/${lang}/admin`;
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSheetOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  // Keep "Lainnya" lit while one of the hidden sections is the current page.
  const secondaryActive = SECONDARY_SECTIONS.some((s) =>
    isSectionActive(pathname, base, s.slug)
  );

  return (
    <>
      <nav
        aria-label="Menu admin"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-warm-neutral bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid grid-cols-5">
          {PRIMARY_SECTIONS.map(({ slug, label, short, Icon }) => {
            const href = sectionHref(base, slug);
            const active = isSectionActive(pathname, base, slug);
            return (
              <Link
                key={slug || "dashboard"}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2 transition-colors ${
                  active ? "text-sea-foam" : "text-forest-dark/55"
                }`}
              >
                {active && (
                  <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-sea-foam" />
                )}
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap text-[10px] font-medium leading-none">
                  {short ?? label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            className={`relative flex flex-col items-center gap-1 py-2 transition-colors ${
              secondaryActive || sheetOpen ? "text-sea-foam" : "text-forest-dark/55"
            }`}
          >
            {secondaryActive && (
              <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-sea-foam" />
            )}
            <MoreIcon className="h-5 w-5" />
            <span className="whitespace-nowrap text-[10px] font-medium leading-none">
              Lainnya
            </span>
          </button>
        </div>
      </nav>

      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-forest-dark/40 backdrop-blur-sm md:hidden"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-warm-neutral bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl md:hidden">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-warm-neutral" />

            <div className="px-4 pb-4 pt-4">
              <div className="grid grid-cols-2 gap-2">
                {SECONDARY_SECTIONS.map(({ slug, label, Icon }) => {
                  const href = sectionHref(base, slug);
                  const active = isSectionActive(pathname, base, slug);
                  return (
                    <Link
                      key={slug}
                      href={href}
                      onClick={() => setSheetOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-sea-foam/15 text-sea-foam"
                          : "text-forest-dark/75 hover:bg-warm-neutral"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-col gap-1 border-t border-warm-neutral pt-3">
                <Link
                  href={`/${lang}`}
                  onClick={() => setSheetOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-xs font-medium text-forest-dark/60 hover:bg-warm-neutral"
                >
                  ← Lihat website
                </Link>
                {/* Di ponsel inilah pemasangan paling berguna. Komponennya
                    menyembunyikan diri kalau panel sudah terpasang. */}
                <InstallAppButton className="text-[0.75rem]" />
                <button
                  type="button"
                  onClick={() => {
                    setSheetOpen(false);
                    onSignOut();
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
