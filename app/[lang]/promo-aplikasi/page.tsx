import type { Metadata } from "next";
import PromoAppLanding from "@/components/PromoAppLanding";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo } from "@/lib/seo";
import { getPortfolio } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";

const PATH = "promo-aplikasi";

/** How many systems the proof section shows. Enough to convince, few enough to scroll past. */
const PROOF_LIMIT = 3;

/** The `servicesList` entries this page is about. Web development is the other page's job. */
const APP_SERVICE_SLUGS = ["erp-custom", "aplikasi-umkm", "migrasi-sistem"];

/**
 * Paid-ads landing page for custom applications, the sibling of /promo.
 *
 * `noindex` for the same reason as that one: `jasa-pembuatan-aplikasi-bali` is
 * already written for these queries, and a second page chasing them would only
 * split the signal. This page only ever gets traffic from an ad, so it gives up
 * search and optimises for the form.
 *
 * Also intentionally absent from `app/sitemap.ts`, and intentionally NOT in the
 * robots.txt disallow list: a disallow would stop crawlers reading the noindex,
 * which is the classic way to stay indexed anyway.
 */
export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return {
    ...pageSeo(params.lang, PATH, {
      title: dict.seo.promoApp.title,
      description: dict.seo.promoApp.description,
    }),
    robots: { index: false, follow: true },
  };
}

export const revalidate = 120;

export default async function PromoAppPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const portfolio = await getPortfolio(lang);

  // Mirror image of the website page's ordering. This one sells systems, so an
  // app has to speak first; a company profile site under "not mockups" would
  // answer a question nobody on this page asked. Websites still fill any
  // remaining slot, and no hard filter is used, so an empty app list degrades
  // to showing the best three rather than to a blank section.
  const proof = [...portfolio]
    .sort((a, b) => {
      const isApp = (p: typeof a) => (p.project_type === "app" ? 0 : 1);
      const isLive = (p: typeof a) => (p.live_url && p.live_url !== "#" ? 0 : 1);
      return (
        isApp(a) - isApp(b) ||
        isLive(a) - isLive(b) ||
        Number(b.featured) - Number(a.featured)
      );
    })
    .slice(0, PROOF_LIMIT);

  const services = dict.servicesList.filter((s) =>
    APP_SERVICE_SLUGS.includes(s.slug)
  );

  return (
    <PromoAppLanding
      lang={lang}
      dict={dict}
      portfolio={proof}
      services={services}
    />
  );
}
