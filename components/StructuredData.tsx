import { SITE_URL } from "@/lib/siteUrl";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { AREA_SERVED, STUDIO_ID } from "@/lib/seo";
import {
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  GOOGLE_BUSINESS_URL,
  MAYALOKA_NAME,
  MAYALOKA_URL,
} from "@/lib/contact";
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
      // telephone and sameAs were confirmed by the owner on 20 Aug 2026: the
      // WhatsApp business line and the studio's Instagram profile. The Google
      // Business Profile joined sameAs on 27 Aug 2026, also owner confirmed.
      // That one matters most here: it is what lets Google tie this site to
      // the profile it already ranks, so filter it out rather than emit "" if
      // the env override is ever blanked.
      // Still not set on purpose: priceRange. It is a factual claim about the
      // business and no verified band exists yet, so it stays out. Likewise
      // aggregateRating: the profile's stars are real, but Google disallows
      // self-serving review markup about your own organisation.
      telephone: `+${WHATSAPP_NUMBER}`,
      sameAs: [INSTAGRAM_URL, GOOGLE_BUSINESS_URL].filter(Boolean),
      // Seawise Studio operates as part of Mayaloka Digital. Owner confirmed
      // on 31 Aug 2026. Stated here as well as in the footer so the relation
      // is machine readable, which is what lets an answer engine describe the
      // studio and its parent as one group rather than two unrelated firms.
      parentOrganization: {
        "@type": "Organization",
        name: MAYALOKA_NAME,
        url: MAYALOKA_URL,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@seawise.id",
        telephone: `+${WHATSAPP_NUMBER}`,
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
