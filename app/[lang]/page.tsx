import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import AppShowcase, { type ShowcaseSlide } from "@/components/AppShowcase";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getPortfolio, getTestimonials } from "@/lib/queries";

export const revalidate = 120;

export default async function Home({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.home;

  const portfolio = await getPortfolio(lang);
  const featured = portfolio.filter((p) => p.featured).slice(0, 3);
  const testimonials = (await getTestimonials(lang)).slice(0, 2);

  const showcaseSlides: ShowcaseSlide[] = portfolio
    .map((p) => {
      const desktop = p.screenshot_url ?? p.mobile_url;
      if (!desktop) return null;
      return {
        title: p.title,
        type: p.project_type,
        desktop,
        mobile: p.mobile_url ?? desktop,
        href: p.slug ? `/${lang}/portfolio/${p.slug}` : null,
      };
    })
    .filter((s): s is ShowcaseSlide => s !== null)
    .slice(0, 8);

  return (
    <>
      <Hero lang={lang} dict={dict} />

      {/* Problem → Solution */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-20 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal className="rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-8">
              <p className="eyebrow text-forest-dark/50">{t.problemEyebrow}</p>
              <p className="mt-4 font-display text-2xl font-bold leading-snug text-forest-dark">
                {t.problemTitle}
              </p>
              <p className="mt-4 leading-relaxed text-forest-dark/70">
                {t.problemBody}
              </p>
            </Reveal>
            <Reveal
              delay={0.1}
              className="rounded-2xl bg-forest-dark p-8 text-off-white"
            >
              <p className="eyebrow text-sea-foam">{t.solutionEyebrow}</p>
              <p className="mt-4 font-display text-2xl font-bold leading-snug">
                {t.solutionTitle}
              </p>
              <p className="mt-4 leading-relaxed text-off-white/75">
                {t.solutionBody}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="layanan" className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-20 md:px-8">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.servicesEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.servicesTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {dict.servicesList.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-warm-neutral bg-white/60 p-7 transition-colors hover:border-sea-foam">
                  <h3 className="font-display text-xl font-bold text-forest-dark">
                    {s.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-forest-dark/70">
                    {s.summary}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="rounded-full bg-warm-neutral px-3 py-1 text-xs font-medium text-forest-dark/80"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link
              href={`/${lang}/layanan`}
              className="mt-8 inline-block text-sm font-medium text-sea-foam hover:underline"
            >
              {t.servicesLink}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured portfolio — inset dark panel */}
      <section className="mx-4 my-8 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black text-off-white md:mx-6 md:my-12 md:rounded-[2.5rem]">
        <div className="mx-auto max-w-content px-6 py-20 md:px-10 md:py-24">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.featuredEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t.featuredTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featured.map((p, i) => {
              const tags = (p.tech_stack ?? []).slice(0, 4);
              const extra = (p.tech_stack ?? []).length - tags.length;

              return (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-off-white/10 bg-off-white/[0.03] p-6">
                    <p className="eyebrow text-sea-foam">{p.industry}</p>
                    <h3 className="mt-2 line-clamp-2 font-display text-2xl font-bold leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-off-white/70">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {tags.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-off-white/15 px-2.5 py-0.5 text-xs text-off-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="px-2.5 py-0.5 text-xs text-off-white/40">
                          +{extra}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-6">
                      {p.live_url && p.live_url !== "#" && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sea-foam px-4 py-2 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
                        >
                          {dict.portfolio.liveButton}
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <Link
              href={`/${lang}/portfolio`}
              className="mt-8 inline-block text-sm font-medium text-sea-foam hover:underline"
            >
              {t.featuredLink}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Product showcase — screenshot slideshow */}
      {showcaseSlides.length > 0 && (
        <section className="bg-off-white">
          <div className="mx-auto max-w-content px-5 py-20 md:px-8">
            <Reveal>
              <p className="eyebrow text-sea-foam">{t.showcaseEyebrow}</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
                {t.showcaseTitle}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-forest-dark/70">
                {t.showcaseIntro}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <AppShowcase
                slides={showcaseSlides}
                labels={{ app: t.showcaseApp, website: t.showcaseWebsite }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Why trust us — verifiable proof points */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.proofEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.proofTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {t.proofItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex h-full gap-4 rounded-2xl border border-warm-neutral bg-white/60 p-6">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea-foam/15 font-display text-sm font-bold text-sea-foam">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-forest-dark">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-forest-dark/70">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial preview */}
      {testimonials.length > 0 && (
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8">
          <Reveal>
            <p className="eyebrow text-sea-foam">{t.testimonialsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
              {t.testimonialsTitle}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {testimonials.map((tItem, i) => (
              <Reveal key={tItem.id} delay={i * 0.08}>
                <figure className="h-full rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-8">
                  <blockquote className="font-display text-lg leading-relaxed text-forest-dark">
                    “{tItem.content}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm text-forest-dark/70">
                    <span className="font-semibold text-forest-dark">
                      {tItem.client_name}
                    </span>
                    {[tItem.role, tItem.company].filter(Boolean).length > 0 &&
                      `, ${[tItem.role, tItem.company].filter(Boolean).join(", ")}`}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="bg-off-white pb-24">
        <div className="mx-auto max-w-content px-5 md:px-8">
          <Reveal>
            <div className="rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black px-8 py-14 text-center md:px-16 md:rounded-[2.5rem]">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-off-white md:text-4xl">
                {t.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-off-white/75">
                {t.ctaBody}
              </p>
              <Link
                href={`/${lang}/kontak`}
                className="mt-8 inline-block rounded-full bg-sea-foam px-7 py-3 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
              >
                {t.ctaButton}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
