import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PortfolioGrid from "@/components/PortfolioGrid";
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

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const t = getDictionary(lang).portfolio;
  const items = await getPortfolio(lang);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

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
    </>
  );
}
