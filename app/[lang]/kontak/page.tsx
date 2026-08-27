import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import {
  whatsappUrl,
  whatsappDisplay,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  GOOGLE_BUSINESS_URL,
} from "@/lib/contact";
import {
  WhatsAppIcon,
  MailIcon,
  InstagramIcon,
  GoogleBusinessIcon,
} from "@/components/ContactIcons";
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
              <div className="space-y-1">
                <ChannelLink
                  href="mailto:hello@seawise.id"
                  label={t.emailLabel}
                  value="hello@seawise.id"
                  brandClass="group-hover:text-sea-foam"
                  icon={<MailIcon className="h-5 w-5" />}
                />
                <ChannelLink
                  href={whatsappUrl()}
                  external
                  label={t.whatsappLabel}
                  value={whatsappDisplay()}
                  brandClass="group-hover:text-[#25D366]"
                  icon={<WhatsAppIcon className="h-5 w-5" />}
                />
                <ChannelLink
                  href={INSTAGRAM_URL}
                  external
                  label={t.instagramLabel}
                  value={`@${INSTAGRAM_HANDLE}`}
                  brandClass="group-hover:text-[#C13584]"
                  icon={<InstagramIcon className="h-5 w-5" />}
                />
                {GOOGLE_BUSINESS_URL ? (
                  <ChannelLink
                    href={GOOGLE_BUSINESS_URL}
                    external
                    label={t.googleLabel}
                    value={t.googleValue}
                    brandClass="group-hover:text-[#1A73E8]"
                    icon={<GoogleBusinessIcon className="h-5 w-5" />}
                  />
                ) : null}

                <div className="pt-6">
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

/**
 * One contact channel: icon chip, its label, and the value itself.
 *
 * The icon draws in the site palette and only takes on the channel's real
 * brand colour on hover, so four different logos sitting in a column still
 * read as one set. The whole row is the link, not just the value, which gives
 * a comfortable tap target on mobile.
 *
 * `label` stays visible rather than living in a tooltip: a title attribute is
 * invisible to touch users and to screen readers that do not announce it, and
 * "WhatsApp" is exactly the word that tells someone whether to tap.
 */
function ChannelLink({
  href,
  label,
  value,
  icon,
  brandClass,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  brandClass: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group -mx-3 flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-warm-neutral hover:bg-warm-neutral/40"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warm-neutral bg-off-white text-forest-dark transition-colors ${brandClass}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="eyebrow block text-sea-foam">{label}</span>
        <span className="mt-0.5 block truncate font-display text-xl font-bold text-forest-dark transition-colors group-hover:text-sea-foam">
          {value}
        </span>
      </span>
    </a>
  );
}
