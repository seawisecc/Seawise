import { SITE_URL } from "@/lib/siteUrl";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { AREA_SERVED, STUDIO_ID } from "@/lib/seo";
import JsonLd from "./JsonLd";

/**
 * JSON-LD structured data so Google understands the business (rich results,
 * knowledge panel eligibility). Rendered once in the root layout.
 */
export default function StructuredData({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": STUDIO_ID,
      name: "Seawise Studio",
      url: SITE_URL,
      logo: `${SITE_URL}/SeaWise.png`,
      image: `${SITE_URL}/SeaWise.png`,
      description: dict.meta.description,
      email: "hello@seawise.id",
      slogan: "Systems & Software Studio",
      // Not set on purpose: telephone, sameAs, priceRange. Google treats these
      // as factual business claims, and the repo has no verified phone number
      // or social profile URL to put here. Add them once they are known.
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@seawise.id",
        availableLanguage: ["id", "en"],
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "Bali",
        addressCountry: "ID",
      },
      areaServed: AREA_SERVED,
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
      publisher: { "@id": STUDIO_ID },
    },
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
