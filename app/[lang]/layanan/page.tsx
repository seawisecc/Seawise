import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import WhaleDivider from "@/components/WhaleDivider";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return { title: dict.nav.services, description: dict.services.intro };
}

export default function LayananPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.services;

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {dict.servicesList.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <div
                  id={s.slug}
                  className="flex h-full flex-col rounded-2xl border border-warm-neutral bg-white/60 p-8 transition-colors hover:border-sea-foam"
                >
                  <span className="font-display text-sm font-bold text-sea-foam">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-forest-dark">
                    {s.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-forest-dark/70">
                    {s.summary}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-warm-neutral pt-5">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-sm text-forest-dark/80"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sea-foam" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhaleDivider from="var(--off-white)" to="var(--near-black)" />

      <section className="bg-near-black text-off-white">
        <div className="mx-auto max-w-content px-5 py-20 text-center md:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
