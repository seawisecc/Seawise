import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { faqJsonLd } from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const PATH = "jasa-pembuatan-aplikasi-bali";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return pageSeo(params.lang, PATH, {
    title: dict.seo.appBali.title,
    description: dict.seo.appBali.description,
  });
}

export const revalidate = 120;

export default function AppBaliPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const content = dict.landing.app;

  return (
    <>
      <JsonLd data={faqJsonLd(content.faq)} />
      <JsonLd
        data={serviceJsonLd(lang, PATH, {
          name: content.eyebrow,
          description: content.intro,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(lang, [
          { name: dict.breadcrumb.home, path: "" },
          { name: content.eyebrow, path: PATH },
        ])}
      />
      <LandingPage lang={lang} content={content} />
    </>
  );
}
