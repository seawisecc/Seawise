"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
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

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push(`${base}/login`);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-off-white">
      <aside className="flex w-56 shrink-0 flex-col border-r border-warm-neutral bg-white/60 p-5">
        <Link href={base} className="mb-8 flex items-center gap-2.5 text-forest-dark">
          <Logo className="h-7 w-7" colorClass="text-forest-dark" />
          <Wordmark className="text-lg" />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {sections.map((s) => {
            const href = s.slug ? `${base}/${s.slug}` : base;
            const active = s.slug
              ? pathname.startsWith(href)
              : pathname === base;
            return (
              <Link
                key={s.slug || "dashboard"}
                href={href}
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
      </aside>

      <main className="flex-1 overflow-x-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
