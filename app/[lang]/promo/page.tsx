import type { Metadata } from "next";
import PromoLanding from "@/components/PromoLanding";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo } from "@/lib/seo";
import { getPricing, getPortfolio } from "@/lib/queries";
import type { Locale } from "@/lib/i18n/config";

const PATH = "promo";

/** How many proof cards the page shows. Enough to be credible, few enough to scroll past. */
const PROOF_LIMIT = 3;

/**
 * Landing page for paid ads.
 *
 * `noindex` is the point of this route, not an oversight. The organic keyword
 * pages `jasa-pembuatan-website-bali` and `jasa-pembuatan-aplikasi-bali` are
 * already written for these queries; letting a second page chase the same ones
 * would just split the signal between them. This page only ever gets traffic
 * from an ad, so it gives up search entirely and optimises for the form.
 *
 * `follow` stays on so the links out of here still pass value, and the route is
 * intentionally NOT added to `app/sitemap.ts` or to robots.txt disallow. A
 * disallow would stop crawlers reading the noindex at all, which is the classic
 * way to end up indexed anyway.
 */
export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return {
    ...pageSeo(params.lang, PATH, {
      title: dict.seo.promo.title,
      description: dict.seo.promo.description,
    }),
    robots: { index: false, follow: true },
  };
}

export const revalidate = 120;

export default async function PromoPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);

  const [pricing, portfolio] = await Promise.all([
    getPricing(lang),
    getPortfolio(lang),
  ]);

  // Ordering matters more than it looks. This page sells websites, so a website
  // has to be the first thing a visitor sees under "not mockups": leading with
  // an ERP would answer a question nobody on this page asked. Apps still fill
  // the remaining slots, because they are real work and they show depth, they
  // just do not get to speak first.
  //
  // After that, entries that open onto something running beat ones that only
  // have a case study page, and featured order breaks any remaining tie. No
  // hard filter anywhere: if the portfolio ever holds no websites at all, the
  // section still shows the best three rather than going blank.
  const proof = [...portfolio]
    .sort((a, b) => {
      const isWebsite = (p: typeof a) => (p.project_type === "website" ? 0 : 1);
      const isLive = (p: typeof a) => (p.live_url && p.live_url !== "#" ? 0 : 1);
      return (
        isWebsite(a) - isWebsite(b) ||
        isLive(a) - isLive(b) ||
        Number(b.featured) - Number(a.featured)
      );
    })
    .slice(0, PROOF_LIMIT);

  return (
    <PromoLanding
      lang={lang}
      dict={dict}
      pricing={pricing}
      portfolio={proof}
    />
  );
}
