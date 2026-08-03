import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return pageSeo(params.lang, "tentang", {
    title: dict.nav.about,
    description: dict.about.intro,
  });
}

export default function TentangPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.about;

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {t.principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-8">
                  <h2 className="font-display text-xl font-bold text-forest-dark">
                    {p.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-forest-dark/70">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-forest-dark p-8 text-off-white sm:flex-row sm:items-center sm:justify-between md:p-10">
              <p className="font-display text-2xl font-bold leading-snug">
                {t.ctaTitle}
              </p>
              <Link
                href={`/${lang}/portfolio`}
                className="shrink-0 rounded-full bg-sea-foam px-6 py-3 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
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
