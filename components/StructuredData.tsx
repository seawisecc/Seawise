import { SITE_URL } from "@/lib/siteUrl";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * JSON-LD structured data so Google understands the business (rich results,
 * knowledge panel eligibility). Rendered once in the root layout.
 */
export default function StructuredData({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#studio`,
      name: "Seawise Studio",
      url: SITE_URL,
      logo: `${SITE_URL}/SeaWise.png`,
      image: `${SITE_URL}/SeaWise.png`,
      description: dict.meta.description,
      email: "hello@seawise.id",
      slogan: "Systems & Software Studio",
      areaServed: { "@type": "Country", name: "Indonesia" },
      knowsAbout: [
        "Web development",
        "Website development",
        "Application development",
        "Custom ERP",
        "Business apps",
        "System migration",
      ],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Application Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom ERP" } },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Seawise Studio",
      inLanguage: lang === "id" ? "id-ID" : "en-US",
      publisher: { "@id": `${SITE_URL}/#studio` },
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
