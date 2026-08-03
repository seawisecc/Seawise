import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPortfolioItem } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/siteUrl";
import { pageAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale; slug: string };
}): Promise<Metadata> {
  const item = await getPortfolioItem(params.slug, params.lang);
  if (!item) return { title: "404" };
  return {
    title: `${item.title} | ${item.industry ?? "Portfolio"}`,
    description: item.description ?? undefined,
    alternates: pageAlternates(params.lang, `portfolio/${item.slug}`),
    openGraph: {
      title: item.title,
      description: item.description ?? undefined,
      url: `${SITE_URL}/${params.lang}/portfolio/${item.slug}`,
      type: "article",
      images: item.screenshot_url ? [{ url: item.screenshot_url }] : undefined,
    },
  };
}

export default async function PortfolioDetail({
  params,
}: {
  params: { lang: Locale; slug: string };
}) {
  const { lang, slug } = params;
  const item = await getPortfolioItem(slug, lang);
  if (!item) notFound();

  const t = getDictionary(lang).portfolio;
  const hasLive = item.live_url && item.live_url !== "#";
  const bodyHtml = renderMarkdown(item.body);
  const gallery = item.gallery ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    about: item.industry ?? undefined,
    description: item.description ?? undefined,
    image: item.screenshot_url ?? undefined,
    url: `${SITE_URL}/${lang}/portfolio/${item.slug}`,
    creator: { "@type": "Organization", name: "Seawise Studio" },
  };

  return (
    <article className="bg-off-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
        <Link href={`/${lang}/portfolio`} className="text-sm font-medium text-sea-foam hover:underline">
          {t.detailBack}
        </Link>

        <p className="eyebrow mt-8 text-sea-foam">
          {item.industry} ·{" "}
          {item.project_type === "website" ? t.filterWebsite : t.filterApp}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] tracking-tight text-forest-dark md:text-5xl">
          {item.title}
        </h1>
        {item.description && (
          <p className="mt-5 text-lg leading-relaxed text-forest-dark/70">
            {item.description}
          </p>
        )}

        {(item.tech_stack?.length ?? 0) > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {item.tech_stack!.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-warm-neutral px-3 py-1 text-xs font-medium text-forest-dark/80"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {hasLive && (
          <a
            href={item.live_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-6 py-3 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam"
          >
            {t.liveButton}
          </a>
        )}

        {item.screenshot_url && (
          <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-forest-dark">
            <Image
              src={item.screenshot_url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {bodyHtml && (
          <div
            className="article mt-10"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}

        {gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {gallery.map((src) => (
              <div key={src} className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-warm-neutral">
                <Image
                  src={src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 rounded-[2rem] bg-gradient-to-b from-forest-dark to-near-black px-8 py-12 text-center md:rounded-[2.5rem]">
          <h2 className="mx-auto max-w-xl font-display text-2xl font-bold text-off-white md:text-3xl">
            {t.detailCtaTitle}
          </h2>
          <Link
            href={`/${lang}/kontak`}
            className="mt-6 inline-block rounded-full bg-sea-foam px-7 py-3 text-sm font-medium text-near-black transition-colors hover:bg-off-white"
          >
            {t.detailCtaButton}
          </Link>
        </div>
      </div>
    </article>
  );
}
