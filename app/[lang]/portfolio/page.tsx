import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import WhaleMark from "@/components/WhaleMark";
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

/** Keep tag rows tidy; the rest collapse into a "+N" pill. */
const MAX_TAGS = 6;

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
              const tags = p.tech_stack ?? [];
              const shown = tags.slice(0, MAX_TAGS);
              const extra = tags.length - shown.length;

              return (
                <Reveal key={p.id} delay={(i % 3) * 0.08} className="h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-warm-neutral bg-white/60 transition-colors hover:border-sea-foam">
                    {/* Preview: screenshot, or a quiet whale watermark as fallback */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-dark">
                      {p.screenshot_url ? (
                        <Image
                          src={p.screenshot_url}
                          alt={`Preview ${p.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <WhaleMark className="h-14 w-14 text-off-white/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow text-sea-foam">{p.industry}</p>

                      <h2 className="mt-1.5 line-clamp-2 font-display text-xl font-bold leading-snug text-forest-dark">
                        {p.title}
                      </h2>

                      {p.description && (
                        <p className="mt-2.5 line-clamp-4 text-sm leading-relaxed text-forest-dark/70">
                          {p.description}
                        </p>
                      )}

                      {shown.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {shown.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-warm-neutral px-2.5 py-0.5 text-xs font-medium text-forest-dark/80"
                            >
                              {tech}
                            </span>
                          ))}
                          {extra > 0 && (
                            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-forest-dark/45">
                              +{extra}
                            </span>
                          )}
                        </div>
                      )}

                      {/* mt-auto keeps every card's button on the same baseline */}
                      <div className="mt-auto pt-6">
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
