import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/siteUrl";
import {
  pageAlternates,
  breadcrumbJsonLd,
  clampDescription,
  ogImageUrl,
  STUDIO_ID,
} from "@/lib/seo";
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
  const description = clampDescription(post.excerpt);
  const image = ogImageUrl(post.cover_url);
  return {
    // Absolute, so the "| Seawise Studio" template does not push an already
    // long article headline further past what Google will display.
    title: { absolute: post.title },
    description,
    alternates: pageAlternates(params.lang, `blog/${post.slug}`),
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at ?? post.created_at,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
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

  const dict = getDictionary(lang);
  const t = dict.blog;
  const html = renderMarkdown(post.content);
  const date = post.published_at ?? post.created_at;
  // Falls back to the publish date for articles written before `updated_at`
  // existed. Claiming an article was revised when it was not is worse than
  // showing no revision at all.
  const modified = post.updated_at ?? date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? undefined,
    datePublished: date,
    dateModified: modified,
    // A named Person carries the expertise signal that an Organization does
    // not. Rows with no author fall back to the studio rather than inventing
    // a name for an article nobody has claimed.
    author: post.author_name
      ? {
          "@type": "Person",
          name: post.author_name,
          ...(post.author_title ? { jobTitle: post.author_title } : {}),
          worksFor: { "@id": STUDIO_ID },
          url: `${SITE_URL}/${lang}/tentang`,
        }
      : { "@type": "Organization", name: "Seawise Studio" },
    publisher: {
      "@type": "Organization",
      name: "Seawise Studio",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/SeaWise.png` },
    },
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${post.slug}`,
  };

  const breadcrumb = breadcrumbJsonLd(lang, [
    { name: dict.breadcrumb.home, path: "" },
    { name: t.eyebrow, path: "blog" },
    { name: post.title, path: `blog/${post.slug}` },
  ]);

  return (
    <article className="bg-off-white">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
        <Link
          href={`/${lang}/blog`}
          className="text-sm font-medium text-sea-foam hover:underline"
        >
          {t.back}
        </Link>

        {/*
          Byline. Google's guidance on E-E-A-T is that author information
          should be visible to readers, not only present in the markup, so the
          same name that goes into the Person node is shown here. Articles with
          no author on the row simply keep the date on its own.
        */}
        <p className="mt-8 text-sm text-forest-dark/50">
          {t.publishedOn} {formatDate(date, lang)}
          {post.author_name && (
            <>
              {" · "}
              <span className="font-medium text-forest-dark/70">
                {post.author_name}
              </span>
              {post.author_title && `, ${post.author_title}`}
            </>
          )}
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
