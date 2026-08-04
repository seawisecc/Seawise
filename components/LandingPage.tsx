import Link from "next/link";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import FaqSection, { type FaqItem } from "./FaqSection";

export type LandingContent = {
  eyebrow: string;
  title: string;
  intro: string;
  pointsTitle: string;
  points: readonly { title: string; body: string }[];
  stepsTitle: string;
  steps: readonly { title: string; body: string }[];
  faqTitle: string;
  faq: readonly FaqItem[];
  relatedTitle: string;
  relatedPortfolio: string;
  relatedServices: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

/**
 * Shared layout for the keyword-targeted local landing pages. Built from the
 * same primitives as the rest of the site so these pages do not read as bolted
 * on, and every claim comes from the dictionary rather than being invented here.
 */
export default function LandingPage({
  lang,
  content,
}: {
  lang: string;
  content: LandingContent;
}) {
  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        intro={content.intro}
      />

      {/* What you get */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {content.pointsTitle}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {content.points.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-warm-neutral bg-white/60 p-6">
                  <h3 className="font-display text-xl font-bold text-forest-dark">
                    {p.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-forest-dark/75">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-4 my-8 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black text-off-white md:mx-6 md:my-12 md:rounded-[2.5rem]">
        <div className="mx-auto max-w-content px-6 py-16 md:px-10 md:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {content.stepsTitle}
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="h-full">
                <li className="flex h-full flex-col rounded-2xl border border-off-white/10 bg-off-white/[0.03] p-6">
                  <span className="font-display text-sm font-bold text-sea-foam">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-off-white/70">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection title={content.faqTitle} items={content.faq} />

      {/* Internal links, so these pages pass authority on instead of dead-ending */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-14 md:px-8">
          <p className="eyebrow text-forest-dark/50">{content.relatedTitle}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={`/${lang}/portfolio`}
              className="text-sm font-medium text-sea-foam hover:underline"
            >
              {content.relatedPortfolio}
            </Link>
            <Link
              href={`/${lang}/layanan`}
              className="text-sm font-medium text-sea-foam hover:underline"
            >
              {content.relatedServices}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-20 md:px-8">
          <div className="rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black px-8 py-14 text-center md:rounded-[2.5rem]">
            <h2 className="mx-auto max-w-xl font-display text-2xl font-bold text-off-white md:text-3xl">
              {content.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-off-white/70">
              {content.ctaBody}
            </p>
            <Link
              href={`/${lang}/kontak`}
              className="mt-7 inline-block rounded-full bg-sea-foam px-7 py-3 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
            >
              {content.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
