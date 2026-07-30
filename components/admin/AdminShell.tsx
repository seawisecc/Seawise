"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import Wordmark from "@/components/Wordmark";

const sections = [
  { slug: "", label: "Dashboard" },
  { slug: "keuangan", label: "Keuangan" },
  { slug: "portfolio", label: "Portfolio" },
  { slug: "pricing", label: "Price List" },
  { slug: "testimonials", label: "Testimoni" },
  { slug: "partners", label: "Partner" },
  { slug: "blog", label: "Blog" },
  { slug: "leads", label: "Pesan Masuk" },
];

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
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push(`${base}/login`);
    router.refresh();
  }

  const nav = (
    <>
      <Link
        href={base}
        onClick={() => setOpen(false)}
        className="mb-8 flex items-center gap-2.5 text-forest-dark"
      >
        <Logo className="h-7 w-7" colorClass="text-forest-dark" />
        <Wordmark className="text-lg" />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {sections.map((s) => {
          const href = s.slug ? `${base}/${s.slug}` : base;
          const active = s.slug ? pathname.startsWith(href) : pathname === base;
          return (
            <Link
              key={s.slug || "dashboard"}
              href={href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest-dark text-off-white"
                  : "text-forest-dark/75 hover:bg-warm-neutral"
              }`}
            >
              {s.label}
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
        <button
          onClick={signOut}
          className="rounded-lg px-3 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50"
        >
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-off-white md:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-warm-neutral bg-off-white/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href={base} className="flex items-center gap-2 text-forest-dark">
          <Logo className="h-7 w-7" colorClass="text-forest-dark" />
          <Wordmark className="text-base" />
        </Link>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-warm-neutral text-forest-dark"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar: static on desktop, slide-in drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-warm-neutral bg-white p-5 transition-transform duration-300 md:static md:z-auto md:w-56 md:translate-x-0 md:bg-white/60 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-forest-dark/50 md:hidden"
        >
          ✕
        </button>
        {nav}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-forest-dark/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="min-w-0 flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}
