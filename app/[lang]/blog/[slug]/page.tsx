import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/queries";
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
  const post = await getPost(params.slug, params.lang);
  if (!post) return { title: "404" };

  const url = `${SITE_URL}/${params.lang}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: pageAlternates(params.lang, `blog/${post.slug}`),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      type: "article",
      publishedTime: post.published_at ?? post.created_at,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
    },
  };
}

function formatDate(value: string | null, lang: Locale) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { lang: Locale; slug: string };
}) {
  const { lang, slug } = params;
  const post = await getPost(slug, lang);
  if (!post) notFound();

  const t = getDictionary(lang).blog;
  const html = renderMarkdown(post.content);
  const date = post.published_at ?? post.created_at;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? undefined,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: "Seawise Studio" },
    publisher: { "@type": "Organization", name: "Seawise Studio" },
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${post.slug}`,
  };

  return (
    <article className="bg-off-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
        <Link
          href={`/${lang}/blog`}
          className="text-sm font-medium text-sea-foam hover:underline"
        >
          {t.back}
        </Link>

        <p className="mt-8 text-sm text-forest-dark/50">
          {t.publishedOn} {formatDate(date, lang)}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-[1.1] tracking-tight text-forest-dark md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-forest-dark/70">
            {post.excerpt}
          </p>
        )}

        {post.cover_url && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-warm-neutral">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="article mt-10"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}
