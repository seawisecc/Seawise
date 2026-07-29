"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Wordmark from "./Wordmark";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function Navbar({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${lang}/layanan`, label: dict.nav.services },
    { href: `/${lang}/portfolio`, label: dict.nav.portfolio },
    { href: `/${lang}/testimoni`, label: dict.nav.testimonials },
    { href: `/${lang}/tentang`, label: dict.nav.about },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
        scrolled
          ? "border-warm-neutral/60 bg-off-white/70 shadow-[0_1px_20px_-8px_rgba(19,42,34,0.25)]"
          : "border-transparent bg-off-white/45"
      }`}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5 text-forest-dark"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-8 w-8" colorClass="text-forest-dark" />
          <Wordmark className="text-xl" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-forest-dark/80 transition-colors hover:text-forest-dark"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-sea-foam transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitcher current={lang} />
          <Link
            href={`/${lang}/kontak`}
            className="rounded-full bg-forest-dark px-5 py-2.5 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam"
          >
            {dict.nav.contact}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span className={`absolute left-0 block h-0.5 w-6 bg-forest-dark transition-transform ${open ? "top-2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-2 block h-0.5 w-6 bg-forest-dark transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 block h-0.5 w-6 bg-forest-dark transition-transform ${open ? "top-2 -rotate-45" : "top-4"}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-warm-neutral/50 bg-off-white/80 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-forest-dark hover:bg-warm-neutral"
              >
                {l.label}
              </Link>
            ))}
            <div className="px-3 py-3">
              <LanguageSwitcher current={lang} />
            </div>
            <Link
              href={`/${lang}/kontak`}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-forest-dark px-5 py-3 text-center text-base font-medium text-off-white"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
