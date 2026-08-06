import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPricing } from "@/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * `/llms.txt`, a plain-text summary of the studio for language models.
 *
 * Worth being clear about what this is: llms.txt is a 2024 proposal, and no
 * major AI provider has publicly confirmed that it reads the file. Treat it as
 * a free lottery ticket, not as something that will move rankings. It earns its
 * place only because the cost is one route and the risk is zero.
 *
 * Generated rather than checked in as a static file, so the package prices come
 * from the same Supabase rows the pricing section renders. A hardcoded copy
 * would quietly go stale the first time the prices are edited in the admin
 * panel, and a stale price here is a wrong claim about the business.
 */
export const revalidate = 120;

export async function GET() {
  const dict = getDictionary("en");
  const pricing = await getPricing("en");

  const services = dict.servicesList
    .map((s) => `- **${s.title}**: ${s.summary}`)
    .join("\n");

  const packages = pricing
    .map((p) => {
      const price = [p.price, p.price_note].filter(Boolean).join(" ");
      const parts = [p.tagline, p.features?.join("; ")].filter(Boolean).join(". ");
      return `- **${p.name}**${price ? `, ${price}` : ""}: ${parts}`;
    })
    .join("\n");

  const faq = dict.faq.items.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

  const page = (path: string, name: string, description: string) =>
    `- [${name}](${SITE_URL}/en/${path}): ${description}`;

  const body = `# Seawise Studio

> ${dict.meta.description}

Seawise Studio is a systems and software studio based in Bali, Indonesia,
serving clients across the country. We build custom ERP systems, business
applications, and websites. Work is scoped from a client's existing workflow
rather than from a template, and the first discovery conversation is free.

The site is bilingual. Every page exists at both \`/en/\` and \`/id/\` on the
same path, and the Indonesian pages are the ones written for local search.

## Services

${services}

## Website packages

Prices below are the published starting points. Final scope and price are
confirmed after a discovery call.

${packages}

## Applications

Custom applications (ERP, point of sale, pharmacy, restaurant, retail) are
quoted per project, because scope varies far more than it does for a website.
Delivered systems are listed on the portfolio page and most link straight to a
live build you can open.

## Frequently asked questions

${faq}

## Key pages

${page("layanan", dict.seo.layanan.title, dict.seo.layanan.description)}
${page("jasa-pembuatan-website-bali", dict.seo.websiteBali.title, dict.seo.websiteBali.description)}
${page("jasa-pembuatan-aplikasi-bali", dict.seo.appBali.title, dict.seo.appBali.description)}
${page("portfolio", dict.seo.portfolio.title, dict.seo.portfolio.description)}
${page("blog", dict.seo.blog.title, dict.seo.blog.description)}
${page("tentang", dict.seo.tentang.title, dict.seo.tentang.description)}
${page("kontak", dict.seo.kontak.title, dict.seo.kontak.description)}

## Contact

- Email: hello@seawise.id
- Contact form: ${SITE_URL}/en/kontak
- Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600",
    },
  });
}
