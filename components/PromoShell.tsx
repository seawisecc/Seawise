import Logo from "./Logo";
import Wordmark from "./Wordmark";
import ContactForm from "./ContactForm";
import { WhatsAppIcon, MailIcon } from "./ContactIcons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Pieces shared by the paid-ads landing pages (`PromoLanding` for websites,
 * `PromoAppLanding` for custom applications).
 *
 * Only what is genuinely identical lives here. The middle of each page differs
 * a lot, a price table on one and a "why there is no price" block on the other,
 * so those stay in their own components rather than being forced through a
 * union of props nobody can read.
 */

/** Anchor ids, shared so a CTA in either page can never point at nothing. */
export const QUOTE_ANCHOR = "penawaran";
export const PROOF_ANCHOR = "bukti";

/**
 * Brand only, no navigation, plus a CTA that stays reachable while scrolling.
 * The navbar is hidden on these routes, see the exception in `SiteChrome`, so
 * this is the only chrome at the top of the page.
 */
export function PromoHeader({
  waUrl,
  waLabel,
}: {
  waUrl: string;
  waLabel: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-off-white/10 bg-near-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-3 md:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-off-white">
            <Logo className="h-5 w-5" colorClass="text-forest-dark" />
          </span>
          <Wordmark className="text-lg text-off-white" />
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{waLabel}</span>
        </a>
      </div>
    </header>
  );
}

/** Small tick used in trust strips and feature lists. */
export function CheckMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 text-sea-foam ${className}`}
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The one exit these pages want a visitor to take. The form is on the page
 * rather than a link to /kontak: on traffic paid for per click, a second
 * navigation is a place to lose people for no gain.
 */
export function PromoQuoteSection({
  lang,
  dict,
  waUrl,
  eyebrow,
  title,
  body,
  aside,
  trust,
}: {
  lang: Locale;
  dict: Dictionary;
  waUrl: string;
  eyebrow: string;
  title: string;
  body: string;
  aside: string;
  trust: readonly string[];
}) {
  return (
    <section id={QUOTE_ANCHOR} className="scroll-mt-20 bg-off-white pb-24">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <div className="rounded-[2rem] border border-warm-neutral bg-warm-neutral/40 p-8 md:rounded-[2.5rem] md:p-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow text-sea-foam">{eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-forest-dark/70">
                {body}
              </p>
              <div className="mt-8">
                <ContactForm lang={lang} dict={dict} />
              </div>
            </div>

            <div className="md:border-l md:border-warm-neutral md:pl-10">
              <p className="eyebrow text-forest-dark/50">{aside}</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-forest-dark/80 hover:text-sea-foam"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0 text-forest-dark/40 transition-colors group-hover:text-[#25D366]" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@seawise.id"
                    className="group flex items-center gap-2.5 text-forest-dark/80 hover:text-sea-foam"
                  >
                    <MailIcon className="h-4 w-4 shrink-0 text-forest-dark/40 transition-colors group-hover:text-sea-foam" />
                    hello@seawise.id
                  </a>
                </li>
              </ul>
              <ul className="mt-8 space-y-2.5 border-t border-warm-neutral pt-6">
                {trust.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-forest-dark/70"
                  >
                    <CheckMark className="mt-1 shrink-0 text-sea-foam" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
