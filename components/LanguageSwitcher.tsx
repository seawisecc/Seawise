"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n, localeNames, isLocale, type Locale } from "@/lib/i18n/config";

/** Swaps the locale prefix on the current path, keeping the rest intact. */
export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || "/";

  function pathFor(locale: Locale) {
    const segments = pathname.split("/");
    // segments[0] is "", segments[1] is the current locale.
    if (isLocale(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    return segments.join("/") || `/${locale}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {i18n.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-forest-dark/25">/</span>}
          <Link
            href={pathFor(locale)}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "text-forest-dark"
                : "text-forest-dark/45 hover:text-sea-foam"
            }
          >
            {localeNames[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
