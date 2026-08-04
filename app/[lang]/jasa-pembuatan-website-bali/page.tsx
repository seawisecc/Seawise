import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { faqJsonLd } from "@/components/FaqSection";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const PATH = "jasa-pembuatan-website-bali";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return pageSeo(params.lang, PATH, {
    title: dict.seo.websiteBali.title,
    description: dict.seo.websiteBali.description,
  });
}

export const revalidate = 120;

export default function WebsiteBaliPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const content = dict.landing.website;

  const breadcrumb = breadcrumbJsonLd(lang, [
    { name: dict.breadcrumb.home, path: "" },
    { name: content.eyebrow, path: PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content.faq)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <LandingPage lang={lang} content={content} />
    </>
  );
}
