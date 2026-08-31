import Link from "next/link";
import Image from "next/image";
import {
  whatsappUrl,
  whatsappDisplay,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  GOOGLE_BUSINESS_URL,
  MAYALOKA_NAME,
  MAYALOKA_URL,
  MAYALOKA_LOGO,
} from "@/lib/contact";
import {
  WhatsAppIcon,
  MailIcon,
  InstagramIcon,
  GoogleBusinessIcon,
} from "./ContactIcons";
import Logo from "./Logo";
import Wordmark from "./Wordmark";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getSiteSettings } from "@/lib/queries";

export default async function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  // Async server component passed as a prop into SiteChrome, which is a client
  // component. That is the supported shape, and it keeps the read local rather
  // than threading a setting through the layout to get here.
  const { showParentOrg } = await getSiteSettings();

  return (
    <footer className="bg-near-black text-off-white">
      <div className="mx-auto max-w-content px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-off-white">
                <Logo className="h-6 w-6" colorClass="text-forest-dark" />
              </span>
              <Wordmark className="text-xl" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-off-white/70">
              {dict.footer.tagline}
            </p>
            <p className="mt-3 text-sm font-medium text-sea-foam">
              {dict.footer.location}
            </p>
          </div>

          <div>
            <p className="eyebrow text-sea-foam">{dict.footer.navHeading}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-off-white/80">
              <li><Link href={`/${lang}/layanan`} className="hover:text-sea-foam">{dict.nav.services}</Link></li>
              <li><Link href={`/${lang}/jasa-pembuatan-website-bali`} className="hover:text-sea-foam">{dict.landing.website.eyebrow}</Link></li>
              <li><Link href={`/${lang}/jasa-pembuatan-aplikasi-bali`} className="hover:text-sea-foam">{dict.landing.app.eyebrow}</Link></li>
              <li><Link href={`/${lang}/portfolio`} className="hover:text-sea-foam">{dict.nav.portfolio}</Link></li>
              <li><Link href={`/${lang}/testimoni`} className="hover:text-sea-foam">{dict.nav.testimonials}</Link></li>
              <li><Link href={`/${lang}/blog`} className="hover:text-sea-foam">{dict.nav.blog}</Link></li>
              <li><Link href={`/${lang}/tentang`} className="hover:text-sea-foam">{dict.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-sea-foam">{dict.footer.contactHeading}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-off-white/80">
              <li>
                <a href="mailto:hello@seawise.id" className="group flex items-center gap-2.5 hover:text-sea-foam">
                  <MailIcon className="h-4 w-4 shrink-0 text-off-white/45 transition-colors group-hover:text-sea-foam" />
                  hello@seawise.id
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-sea-foam"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-off-white/45 transition-colors group-hover:text-[#25D366]" />
                  WhatsApp {whatsappDisplay()}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-sea-foam"
                >
                  <InstagramIcon className="h-4 w-4 shrink-0 text-off-white/45 transition-colors group-hover:text-[#E1306C]" />
                  Instagram @{INSTAGRAM_HANDLE}
                </a>
              </li>
              {GOOGLE_BUSINESS_URL ? (
                <li>
                  <a
                    href={GOOGLE_BUSINESS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 hover:text-sea-foam"
                  >
                    <GoogleBusinessIcon className="h-4 w-4 shrink-0 text-off-white/45 transition-colors group-hover:text-[#8AB4F8]" />
                    {dict.footer.googleBusiness}
                  </a>
                </li>
              ) : null}
              <li>
                <Link href={`/${lang}/kontak`} className="hover:text-sea-foam">
                  {dict.footer.contactForm}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-off-white/10 pt-6 text-xs text-off-white/50 md:flex-row md:items-center md:justify-between md:gap-2">
          <p>&copy; {new Date().getFullYear()} Seawise Studio. {dict.footer.rights}</p>

          {/* Parent company, switched from /admin/pengaturan. The logo is a
              wide lockup, so it is sized by height and left to find its own
              width; `alt` is empty because the adjacent text already names the
              company, and repeating it would just make a screen reader say it
              twice. */}
          {showParentOrg && (
          <a
            href={MAYALOKA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-100 md:opacity-80"
          >
            <span className="whitespace-nowrap group-hover:text-off-white/80">
              {dict.footer.partOf}
            </span>
            <Image
              src={MAYALOKA_LOGO}
              alt=""
              width={141}
              height={24}
              className="h-6 w-auto"
            />
            <span className="sr-only">{MAYALOKA_NAME}</span>
          </a>
          )}
        </div>
      </div>
    </footer>
  );
}
