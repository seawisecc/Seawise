import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getPosts } from "@/lib/queries";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return pageSeo(params.lang, "blog", {
    title: dict.seo.blog.title,
    description: dict.seo.blog.description,
  });
}

export const revalidate = 120;

function formatDate(value: string | null, lang: Locale) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.blog;
  const posts = await getPosts(lang);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(lang, [
          { name: dict.breadcrumb.home, path: "" },
          { name: t.eyebrow, path: "blog" },
        ])}
      />
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-8 text-center text-forest-dark/60">
              {t.empty}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06} className="h-full">
                  <Link
                    href={`/${lang}/blog/${p.slug}`}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-warm-neutral bg-white/60 transition-colors hover:border-sea-foam"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-warm-neutral">
                      {p.cover_url && (
                        <Image
                          src={p.cover_url}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-forest-dark/50">
                        {formatDate(p.published_at ?? p.created_at, lang)}
                      </p>
                      <h2 className="mt-2 line-clamp-2 font-display text-xl font-bold leading-snug text-forest-dark">
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-dark/70">
                          {p.excerpt}
                        </p>
                      )}
                      <span className="mt-auto pt-5 text-sm font-medium text-sea-foam">
                        {t.readMore} →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
