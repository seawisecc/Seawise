import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getPortfolio } from "@/lib/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return { title: dict.nav.portfolio, description: dict.portfolio.intro };
}

// Always fetch fresh from Supabase at request time.
export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.portfolio;
  const items = await getPortfolio(lang);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => {
              const hasLive = p.live_url && p.live_url !== "#";
              return (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-warm-neutral bg-white/60 transition-colors hover:border-sea-foam">
                    <div className="relative aspect-[16/10] w-full bg-forest-dark">
                      {p.screenshot_url ? (
                        <Image
                          src={p.screenshot_url}
                          alt={`Preview ${p.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-display text-3xl font-bold text-off-white/90">
                            {p.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow text-sea-foam">{p.industry}</p>
                      <h2 className="mt-1.5 font-display text-xl font-bold text-forest-dark">
                        {p.title}
                      </h2>
                      {p.description && (
                        <p className="mt-2 text-sm leading-relaxed text-forest-dark/70">
                          {p.description}
                        </p>
                      )}

                      {p.tech_stack && p.tech_stack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-warm-neutral px-2.5 py-0.5 text-xs font-medium text-forest-dark/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 pt-1">
                        {hasLive ? (
                          <a
                            href={p.live_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam"
                          >
                            {t.liveButton}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark/50">
                            {t.comingSoon}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
