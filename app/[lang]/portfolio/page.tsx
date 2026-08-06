import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getPortfolio } from "@/lib/queries";
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
  return pageSeo(params.lang, "portfolio", {
    title: dict.seo.portfolio.title,
    description: dict.seo.portfolio.description,
  });
}

export const revalidate = 120;

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
      <JsonLd
        data={breadcrumbJsonLd(lang, [
          { name: dict.breadcrumb.home, path: "" },
          { name: t.eyebrow, path: "portfolio" },
        ])}
      />
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      {/* Hidden until real rows exist, rather than showing placeholder cards. */}
      {items.length > 0 && (
        <section className="bg-off-white">
          <div className="mx-auto max-w-content px-5 py-14 md:px-8">
            <PortfolioGrid
              items={items}
              lang={lang}
              labels={{
                liveButton: t.liveButton,
                comingSoon: t.comingSoon,
                filterAll: t.filterAll,
                filterApp: t.filterApp,
                filterWebsite: t.filterWebsite,
                viewDetail: t.viewDetail,
              }}
            />
          </div>
        </section>
      )}
    </>
  );
}
