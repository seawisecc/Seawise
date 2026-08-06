import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
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
  return pageSeo(params.lang, "kontak", {
    title: dict.seo.kontak.title,
    description: dict.seo.kontak.description,
  });
}

export const revalidate = 120;

export default function KontakPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.contact;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(lang, [
          { name: dict.breadcrumb.home, path: "" },
          { name: t.eyebrow, path: "kontak" },
        ])}
      />
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <div className="space-y-6">
                <div>
                  <p className="eyebrow text-sea-foam">{t.emailLabel}</p>
                  <a
                    href="mailto:hello@seawise.id"
                    className="mt-1.5 block font-display text-xl font-bold text-forest-dark hover:text-sea-foam"
                  >
                    hello@seawise.id
                  </a>
                </div>
                <div>
                  <p className="eyebrow text-sea-foam">{t.helpLabel}</p>
                  <ul className="mt-2 space-y-2 text-forest-dark/75">
                    {t.helpItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-warm-neutral bg-warm-neutral/30 p-7 md:p-8">
                <ContactForm lang={lang} dict={dict} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
