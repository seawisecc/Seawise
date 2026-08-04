import Reveal from "./Reveal";

export type FaqItem = { q: string; a: string };

/**
 * Question and answer block, paired with FAQPage JSON-LD.
 *
 * Note on expectations: since August 2023 Google restricts FAQ rich results to
 * authoritative government and health sites, so this will almost certainly not
 * render as an accordion in search for a commercial studio. The value here is
 * content structure and being readable by answer engines, not rich results.
 */
export default function FaqSection({
  title,
  items,
}: {
  title: string;
  items: readonly FaqItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-content px-5 py-14 md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-forest-dark md:text-4xl">
            {title}
          </h2>
        </Reveal>
        <dl className="mt-8 max-w-3xl divide-y divide-warm-neutral border-t border-warm-neutral">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={(i % 3) * 0.05}>
              <div className="py-6">
                <dt className="font-display text-lg font-bold text-forest-dark">
                  {item.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-forest-dark/75">
                  {item.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** FAQPage JSON-LD for the same items. */
export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
