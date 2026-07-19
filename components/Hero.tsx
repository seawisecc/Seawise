"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Hero. The whale swims in once on page load — a single orchestrated moment,
 * not a looping animation (per brief). Text staggers up beneath it.
 */
export default function Hero({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.hero;

  return (
    <section className="relative overflow-hidden bg-off-white">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-28">
        <div>
          <motion.p
            className="eyebrow text-sea-foam"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.eyebrow}
          </motion.p>

          <motion.h1
            className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-forest-dark sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.titleBefore}
            <span className="text-sea-foam">{t.highlight}</span>
            {t.titleAfter}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-lg text-lg leading-relaxed text-forest-dark/75"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href={`/${lang}/portfolio`}
              className="rounded-full bg-forest-dark px-6 py-3 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}/kontak`}
              className="rounded-full border border-forest-dark/20 px-6 py-3 text-sm font-medium text-forest-dark transition-colors hover:border-sea-foam hover:text-sea-foam"
            >
              {t.ctaSecondary}
            </Link>
          </motion.div>
        </div>

        {/* Logo swims in from the left, once. */}
        <motion.div
          className="relative flex justify-center md:justify-end"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <Image
            src="/SeaWise.png"
            alt="Seawise"
            width={480}
            height={400}
            priority
            className="h-auto w-full max-w-sm object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
