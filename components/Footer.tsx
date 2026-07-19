import Link from "next/link";
import Logo from "./Logo";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="bg-near-black text-off-white">
      <div className="mx-auto max-w-content px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" colorClass="text-off-white" />
              <span className="font-display text-xl font-bold tracking-tight">
                SEAWISE
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-off-white/70">
              {dict.footer.tagline}
            </p>
          </div>

          <div>
            <p className="eyebrow text-sea-foam">{dict.footer.navHeading}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-off-white/80">
              <li><Link href={`/${lang}/layanan`} className="hover:text-sea-foam">{dict.nav.services}</Link></li>
              <li><Link href={`/${lang}/portfolio`} className="hover:text-sea-foam">{dict.nav.portfolio}</Link></li>
              <li><Link href={`/${lang}/testimoni`} className="hover:text-sea-foam">{dict.nav.testimonials}</Link></li>
              <li><Link href={`/${lang}/tentang`} className="hover:text-sea-foam">{dict.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-sea-foam">{dict.footer.contactHeading}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-off-white/80">
              <li>
                <a href="mailto:hello@seawise.id" className="hover:text-sea-foam">
                  hello@seawise.id
                </a>
              </li>
              <li>
                <Link href={`/${lang}/kontak`} className="hover:text-sea-foam">
                  {dict.footer.contactForm}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-off-white/10 pt-6 text-xs text-off-white/50 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Seawise. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
