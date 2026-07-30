import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getTestimonials } from "@/lib/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  return { title: dict.nav.testimonials, description: dict.testimonials.intro };
}

export const revalidate = 120;

export default async function TestimoniPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = params;
  const dict = getDictionary(lang);
  const t = dict.testimonials;
  const items = await getTestimonials(lang);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

      <section className="bg-off-white">
        <div className="mx-auto max-w-content px-5 py-14 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 2) * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-warm-neutral bg-warm-neutral/40 p-8">
                  <blockquote className="font-display text-lg leading-relaxed text-forest-dark">
                    “{item.content}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-warm-neutral pt-5">
                    {item.avatar_url ? (
                      <Image
                        src={item.avatar_url}
                        alt={item.client_name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sea-foam font-display text-sm font-bold text-near-black">
                        {item.client_name.charAt(0)}
                      </span>
                    )}
                    <span className="text-sm text-forest-dark/70">
                      <span className="block font-semibold text-forest-dark">
                        {item.client_name}
                      </span>
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
