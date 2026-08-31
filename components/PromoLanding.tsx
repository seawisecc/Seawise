import Link from "next/link";
import Reveal from "./Reveal";
import FaqSection from "./FaqSection";
import {
  PromoHeader,
  PromoQuoteSection,
  CheckMark,
  QUOTE_ANCHOR,
} from "./PromoShell";
import { whatsappUrlFor } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PricingRow, PortfolioRow } from "@/lib/queries";

/**
 * Paid-ads landing page.
 *
 * Deliberately not built on `LandingPage`. That component serves the two
 * keyword pages, which want the full site navigation and every internal link
 * they can carry, because their job is search. This page is the opposite: cold
 * traffic that already clicked an ad, where every link that is not the form is
 * a way to leave. So it renders its own minimal header instead of the navbar
 * (see the exception in `SiteChrome`), keeps the quote form on the page rather
 * than linking to /kontak, and repeats the CTA at each section break.
 *
 * Content rules still apply: prices come from the `pricing` table, proof comes
 * from real `portfolio` rows and hides itself when there are none, and no
 * figure on this page is written by hand.
 */

const PACKAGES_ANCHOR = "paket";

export default function PromoLanding({
  lang,
  dict,
  pricing,
  portfolio,
  copy,
}: {
  lang: Locale;
  dict: Dictionary;
  pricing: PricingRow[];
  portfolio: PortfolioRow[];
  /** Hook aktif: override dari /admin/pengaturan, atau teks dictionary. */
  copy: { title: string; subtitle: string };
}) {
  const t = dict.promo;
  const waUrl = whatsappUrlFor(`/${lang}/promo`);

  return (
    <>
      <PromoHeader waUrl={waUrl} waLabel={t.ctaSecondary} />

      {/* Hero.
          No `Reveal` here, on purpose, and this is the one place on the page
          where that matters. Reveal starts at opacity 0 and waits for framer
          motion to hydrate and an IntersectionObserver to fire. Everywhere else
          that is invisible, because the visitor has to scroll to reach it and
          hydration has long finished. Above the fold it means the headline and
          the CTA of a page you pay for per click are blank until JavaScript
          runs, and stay blank if it never does. So the first screen is plain
          server-rendered markup; the animation resumes below. */}
      <section className="bg-gradient-to-b from-forest-dark to-near-black text-off-white">
        <div className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow text-sea-foam">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-off-white/75">
            {copy.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {/* Off-white, not the usual sea-foam. On a dark panel, near-black
                text on sea-foam lands at about 4.4:1 while the outlined button
                beside it is near 15:1, so the brand pairing made the primary
                CTA read as the weaker of the two. Off-white is already the
                hover colour of that same button, so the palette is unchanged,
                the contrast order just matches the intent now. */}
            <a
              href={`#${QUOTE_ANCHOR}`}
              className="rounded-full bg-off-white px-7 py-3.5 text-sm font-semibold text-near-black transition-colors hover:bg-sea-foam"
            >
              {t.ctaPrimary}
            </a>
            {/* Not a second WhatsApp button: the header already carries one
                and keeps it on screen the whole way down. Price is the first
                question this audience asks, so the secondary CTA answers it
                in place rather than sending anyone off the page. */}
            <a
              href={`#${PACKAGES_ANCHOR}`}
              className="rounded-full border border-off-white/25 px-7 py-3.5 text-sm font-semibold text-off-white transition-colors hover:border-sea-foam hover:text-sea-foam"
            >
              {t.ctaPackages}
            </a>
          </div>

          <ul className="mt-10 flex flex-col gap-3 border-t border-off-white/10 pt-8 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {t.trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-off-white/70"
              >
                <CheckMark />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem framing */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.painEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.painTitle}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.painItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-6">
                  <h3 className="font-display text-lg font-bold text-forest-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-forest-dark/70">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages, straight from the pricing table */}
      <section
        id={PACKAGES_ANCHOR}
        className="mx-4 my-8 scroll-mt-20 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black text-off-white md:mx-6 md:my-12 md:rounded-[2.5rem]"
      >
        <div className="mx-auto max-w-content px-6 py-16 md:px-10 md:py-20">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.packagesEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t.packagesTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 0.06} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    tier.featured
                      ? "border-sea-foam bg-sea-foam/10"
                      : "border-off-white/10 bg-off-white/[0.03]"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                  {tier.tagline && (
                    <p className="mt-1.5 text-sm leading-relaxed text-off-white/60">
                      {tier.tagline}
                    </p>
                  )}
                  {tier.price && (
                    <p className="mt-5 font-display text-2xl font-bold text-sea-foam">
                      {tier.price}
                      {tier.price_note && (
                        <span className="ml-1 text-sm font-normal text-off-white/50">
                          {tier.price_note}
                        </span>
                      )}
                    </p>
                  )}
                  {tier.features && tier.features.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex gap-2.5 text-sm leading-relaxed text-off-white/75"
                        >
                          <CheckMark className="mt-1 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto pt-6">
                    <a
                      href={`#${QUOTE_ANCHOR}`}
                      className={`inline-block w-full rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                        tier.featured
                          ? "bg-off-white text-near-black hover:bg-sea-foam"
                          : "border border-off-white/25 text-off-white hover:border-sea-foam hover:text-sea-foam"
                      }`}
                    >
                      {t.packagesCta}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-off-white/50">
            {t.packagesNote}
          </p>
        </div>
      </section>

      {/* Proof. Hidden entirely when there is nothing real to show. */}
      {portfolio.length > 0 && (
        <section className="bg-off-white">
          <div className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-20">
            <Reveal>
              <p className="eyebrow text-sea-foam">{t.proofEyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
                {t.proofTitle}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-forest-dark/70">
                {t.proofBody}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {portfolio.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-warm-neutral bg-white/60 p-6">
                    {item.industry && (
                      <p className="eyebrow text-sea-foam">{item.industry}</p>
                    )}
                    <h3 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug text-forest-dark">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-dark/70">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-auto pt-5">
                      {item.live_url && item.live_url !== "#" ? (
                        <a
                          href={item.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-sea-foam hover:underline"
                        >
                          {t.proofLive}
                        </a>
                      ) : item.slug ? (
                        <Link
                          href={`/${lang}/portfolio/${item.slug}`}
                          className="text-sm font-medium text-sea-foam hover:underline"
                        >
                          {t.proofLive}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-16 md:px-8 md:pb-20">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.stepsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.stepsTitle}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="h-full">
                <li className="flex h-full flex-col rounded-2xl border border-warm-neutral bg-white/60 p-6">
                  <span className="font-display text-sm font-bold text-sea-foam">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-forest-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-dark/70">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection title={t.faqTitle} items={t.faq} />

      <PromoQuoteSection
        lang={lang}
        dict={dict}
        waUrl={waUrl}
        eyebrow={t.formEyebrow}
        title={t.formTitle}
        body={t.formBody}
        aside={t.formAside}
        trust={t.trust}
      />
    </>
  );
}
