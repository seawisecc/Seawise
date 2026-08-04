"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import WhaleMark from "./WhaleMark";
import type { PortfolioRow } from "@/lib/queries";

const MAX_TAGS = 6;

type Labels = {
  liveButton: string;
  comingSoon: string;
  filterAll: string;
  filterApp: string;
  filterWebsite: string;
  viewDetail: string;
};

export default function PortfolioGrid({
  items,
  labels,
  lang,
}: {
  items: PortfolioRow[];
  labels: Labels;
  lang: string;
}) {
  const [filter, setFilter] = useState<"all" | "app" | "website">("all");

  const hasApp = items.some((p) => p.project_type === "app");
  const hasWeb = items.some((p) => p.project_type === "website");
  const showTabs = hasApp && hasWeb;

  const shownItems =
    filter === "all" ? items : items.filter((p) => p.project_type === filter);

  const tabs: { key: "all" | "app" | "website"; label: string }[] = [
    { key: "all", label: labels.filterAll },
    { key: "app", label: labels.filterApp },
    { key: "website", label: labels.filterWebsite },
  ];

  return (
    <>
      {showTabs && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-forest-dark text-off-white"
                  : "border border-warm-neutral text-forest-dark/70 hover:border-sea-foam"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shownItems.map((p, i) => {
          const hasLive = p.live_url && p.live_url !== "#";
          const tags = p.tech_stack ?? [];
          const shown = tags.slice(0, MAX_TAGS);
          const extra = tags.length - shown.length;
          const detailHref = p.slug ? `/${lang}/portfolio/${p.slug}` : null;
          const cardImage = p.cover_url ?? p.screenshot_url;

          return (
            <Reveal key={p.id} delay={(i % 3) * 0.06} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-warm-neutral bg-white/60 transition-colors hover:border-sea-foam">
                <PreviewWrap href={detailHref}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-dark">
                    {cardImage ? (
                      <Image
                        src={cardImage}
                        alt={`Preview ${p.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        // First card is the LCP element on /portfolio.
                        priority={i === 0}
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <WhaleMark className="h-14 w-14 text-off-white/20" />
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-off-white/90 px-2.5 py-0.5 text-xs font-medium text-forest-dark">
                      {p.project_type === "website" ? labels.filterWebsite : labels.filterApp}
                    </span>
                  </div>
                </PreviewWrap>

                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-sea-foam">{p.industry}</p>
                  {detailHref ? (
                    <Link href={detailHref} className="mt-1.5">
                      <h2 className="line-clamp-2 font-display text-xl font-bold leading-snug text-forest-dark transition-colors hover:text-sea-foam">
                        {p.title}
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="mt-1.5 line-clamp-2 font-display text-xl font-bold leading-snug text-forest-dark">
                      {p.title}
                    </h2>
                  )}
                  {p.description && (
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-forest-dark/70">
                      {p.description}
                    </p>
                  )}

                  {shown.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {shown.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-warm-neutral px-2.5 py-0.5 text-xs font-medium text-forest-dark/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-forest-dark/45">
                          +{extra}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                    {detailHref && (
                      <Link
                        href={detailHref}
                        className="inline-flex items-center gap-1.5 rounded-full bg-forest-dark px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam"
                      >
                        {labels.viewDetail}
                      </Link>
                    )}
                    {hasLive ? (
                      <a
                        href={p.live_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-sea-foam hover:underline"
                      >
                        {labels.liveButton}
                      </a>
                    ) : (
                      !detailHref && (
                        <span className="text-sm font-medium text-forest-dark/40">
                          {labels.comingSoon}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/** Wraps the preview in a link to the detail page when a slug exists. */
function PreviewWrap({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <Link href={href} className="block">
      {children}
    </Link>
  );
}
