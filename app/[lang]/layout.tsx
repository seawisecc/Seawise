import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import StructuredData from "@/components/StructuredData";
import { i18n, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/siteUrl";
import { notFound } from "next/navigation";

const KEYWORDS: Record<Locale, string[]> = {
  id: [
    "jasa pembuatan website Bali",
    "jasa pembuatan aplikasi Bali",
    "web developer Bali",
    "jasa pembuatan website",
    "jasa pembuatan aplikasi",
    "jasa aplikasi custom",
    "ERP custom",
    "aplikasi UMKM",
    "company profile website",
    "Seawise Studio Bali",
  ],
  en: [
    "web development Bali",
    "app development Bali",
    "software developer Bali",
    "custom software",
    "custom ERP",
    "business apps",
    "website development Indonesia",
    "Seawise Studio",
  ],
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : i18n.defaultLocale;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    keywords: KEYWORDS[lang],
    applicationName: "Seawise Studio",
    authors: [{ name: "Seawise Studio" }],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", id: "/id", "x-default": "/en" },
    },
    // `max-snippet: -1` lifts the default cap on how much of a page a crawler
    // may quote. It used to sit only under `googleBot`, so every other crawler,
    // including the answer engines, fell back to a truncated snippet.
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${SITE_URL}/${lang}`,
      siteName: "Seawise Studio",
      locale: lang === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans">
        <StructuredData lang={lang} />
        <SiteChrome
          navbar={<Navbar lang={lang} dict={dict} />}
          footer={<Footer lang={lang} dict={dict} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
