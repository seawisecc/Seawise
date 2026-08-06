import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { WebsiteIcon, AppIcon } from "@/components/ServiceIcons";
import FaqSection, { faqJsonLd } from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo, breadcrumbJsonLd, servicesJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import { getPricing } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return pageSeo(params.lang, "layanan", {
    title: dict.seo.layanan.title,
    description: dict.seo.layanan.description,
  });
}

export const revalidate = 120;

export default async function LayananPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.services;
  const pricing = await getPricing(lang);

  return (
    <>
      <JsonLd data={faqJsonLd(dict.faq.items)} />
      <JsonLd
        data={servicesJsonLd(lang, {
          services: dict.servicesList,
          pricing,
          catalogName: t.pricingTitle,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(lang, [
          { name: dict.breadcrumb.home, path: "" },
          { name: t.eyebrow, path: "layanan" },
        ])}
      />
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      {/* ── Website group ─────────────────────────────────────────── */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 pb-8 pt-6 md:px-8">
          <Reveal>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warm-neutral text-forest-dark">
                <WebsiteIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-forest-dark md:text-3xl">
                  {t.webTitle}
                </h2>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-forest-dark/70">
                  {t.webIntro}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pricing.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl p-6 ${
                    p.featured
                      ? "bg-forest-dark text-off-white ring-2 ring-sea-foam"
                      : "border border-warm-neutral bg-white/60 text-forest-dark"
                  }`}
                >
                  {p.featured && (
                    <span className="mb-3 w-fit rounded-full bg-sea-foam px-3 py-0.5 text-xs font-medium text-near-black">
                      {t.popular}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  {p.tagline && (
                    <p
                      className={`mt-1 text-sm leading-snug ${
                        p.featured ? "text-off-white/70" : "text-forest-dark/60"
                      }`}
                    >
                      {p.tagline}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="font-display text-2xl font-bold">{p.price}</span>
                    {p.price_note && (
                      <span
                        className={`ml-1.5 text-sm ${
                          p.featured ? "text-off-white/60" : "text-forest-dark/50"
                        }`}
                      >
                        {p.price_note}
                      </span>
                    )}
                  </div>

                  <ul
                    className={`mt-5 flex-1 space-y-2.5 border-t pt-5 text-sm ${
                      p.featured ? "border-off-white/15" : "border-warm-neutral"
                    }`}
                  >
                    {(p.features ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sea-foam" />
                        <span className={p.featured ? "text-off-white/85" : "text-forest-dark/80"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/${lang}/kontak`}
                    className={`mt-6 inline-block rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors ${
                      p.featured
                        ? "bg-sea-foam text-near-black hover:bg-off-white"
                        : "bg-forest-dark text-off-white hover:bg-sea-foam"
                    }`}
                  >
                    {t.ctaButton}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application group, inset dark panel ───────────────────── */}
      <section className="mx-4 my-8 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black text-off-white md:mx-6 md:my-12 md:rounded-[2.5rem]">
        <div className="mx-auto max-w-content px-6 py-16 md:px-10">
          <Reveal>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-off-white/10 text-off-white">
                <AppIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  {t.appTitle}
                </h2>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-off-white/75">
                  {t.appIntro}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/portfolio`}
                className="rounded-full bg-sea-foam px-6 py-3 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
              >
                {t.appCtaWork}
              </Link>
              <Link
                href={`/${lang}/kontak`}
                className="rounded-full border border-off-white/25 px-6 py-3 text-sm font-medium text-off-white transition-colors hover:border-sea-foam hover:text-sea-foam"
              >
                {t.appCtaConsult}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection title={dict.faq.title} items={dict.faq.items} />
    </>
  );
}
