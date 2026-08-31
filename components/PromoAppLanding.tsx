import Link from "next/link";
import Reveal from "./Reveal";
import FaqSection from "./FaqSection";
import {
  PromoHeader,
  PromoQuoteSection,
  CheckMark,
  QUOTE_ANCHOR,
  PROOF_ANCHOR,
} from "./PromoShell";
import { whatsappUrlFor } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PortfolioRow } from "@/lib/queries";

/**
 * Paid-ads landing page for custom applications.
 *
 * Shaped differently from the website page on purpose. That one leads with a
 * price, because a business owner shopping for a website is comparing numbers.
 * Nobody shops for an ERP that way, so this one leads with the failure they
 * have already lived through, and puts the running systems directly under it.
 *
 * The proof section sits high rather than near the end: five clickable systems
 * is the strongest thing the studio owns, and on cold traffic it has to arrive
 * before the visitor decides this is another agency pitch.
 *
 * Where the website page has a price table, this has a section explaining why
 * there is no price. Custom work genuinely has no shelf figure, and saying so
 * plainly is worth more than a made-up "starting from".
 */
export default function PromoAppLanding({
  lang,
  dict,
  portfolio,
  services,
}: {
  lang: Locale;
  dict: Dictionary;
  portfolio: PortfolioRow[];
  services: Dictionary["servicesList"];
}) {
  const t = dict.promoApp;
  const waUrl = whatsappUrlFor(`/${lang}/promo-aplikasi`);

  return (
    <>
      <PromoHeader waUrl={waUrl} waLabel={t.ctaSecondary} />

      {/* Hero. Plain server-rendered markup, no `Reveal`: on a page paid for
          per click the first screen must not wait on hydration. Same reasoning
          as the website landing page. */}
      <section className="bg-gradient-to-b from-forest-dark to-near-black text-off-white">
        <div className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow text-sea-foam">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-off-white/75">
            {t.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {/* Off-white, not sea-foam. On this dark panel near-black on
                sea-foam is about 4.4:1 while the outlined button next to it is
                near 15:1, which would make the primary CTA read as the weaker
                of the two. */}
            <a
              href={`#${QUOTE_ANCHOR}`}
              className="rounded-full bg-off-white px-7 py-3.5 text-sm font-semibold text-near-black transition-colors hover:bg-sea-foam"
            >
              {t.ctaPrimary}
            </a>
            {/* Points at the proof, not at WhatsApp: the header already carries
                a chat button, and for this audience the running systems are the
                argument. */}
            {portfolio.length > 0 && (
              <a
                href={`#${PROOF_ANCHOR}`}
                className="rounded-full border border-off-white/25 px-7 py-3.5 text-sm font-semibold text-off-white transition-colors hover:border-sea-foam hover:text-sea-foam"
              >
                {t.ctaProof}
              </a>
            )}
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

      {/* Why systems stall */}
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

      {/* Proof, on the dark inset panel so it reads as the centrepiece.
          Hidden entirely when there is nothing real to show. */}
      {portfolio.length > 0 && (
        <section
          id={PROOF_ANCHOR}
          className="mx-4 my-8 scroll-mt-20 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black text-off-white md:mx-6 md:my-12 md:rounded-[2.5rem]"
        >
          <div className="mx-auto max-w-content px-6 py-16 md:px-10 md:py-20">
            <Reveal>
              <p className="eyebrow text-sea-foam">{t.proofEyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t.proofTitle}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-off-white/70">
                {t.proofBody}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {portfolio.map((item, i) => {
                const tags = (item.tech_stack ?? []).slice(0, 3);
                return (
                  <Reveal key={item.id} delay={i * 0.08} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-off-white/10 bg-off-white/[0.03] p-6">
                      {item.industry && (
                        <p className="eyebrow text-sea-foam">{item.industry}</p>
                      )}
                      <h3 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-off-white/70">
                          {item.description}
                        </p>
                      )}
                      {tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {tags.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-off-white/15 px-2.5 py-0.5 text-xs text-off-white/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-6">
                        {item.live_url && item.live_url !== "#" ? (
                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sea-foam px-4 py-2 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* What we build. Copy comes from `servicesList`, so this page cannot
          drift away from what the services page already promises. */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.buildEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.buildTitle}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-warm-neutral bg-white/60 p-6">
                  <h3 className="font-display text-lg font-bold text-forest-dark">
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-forest-dark/70">
                    {s.summary}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full bg-warm-neutral px-3 py-1 text-xs font-medium text-forest-dark/80"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cost. Where the website page has a price table. Answering the question
          honestly is a better use of the slot than a "starting from" figure
          that would be wrong for most readers. */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-16 md:px-8 md:pb-20">
          <Reveal>
            <div className="rounded-[2rem] border border-warm-neutral bg-warm-neutral/40 p-8 md:p-12">
              <p className="eyebrow text-sea-foam">{t.costEyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
                {t.costTitle}
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-forest-dark/70">
                {t.costBody}
              </p>
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {t.costItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 leading-relaxed text-forest-dark/80"
                  >
                    <CheckMark className="mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={`#${QUOTE_ANCHOR}`}
                className="mt-8 inline-block rounded-full bg-forest-dark px-7 py-3.5 text-sm font-semibold text-off-white transition-colors hover:bg-sea-foam"
              >
                {t.ctaPrimary}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

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
