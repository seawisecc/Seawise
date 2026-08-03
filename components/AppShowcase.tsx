"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export type ShowcaseSlide = {
  title: string;
  type: string; // 'app' | 'website'
  desktop: string;
  mobile: string;
  href: string | null;
};

type Labels = { app: string; website: string };

export default function AppShowcase({
  slides,
  labels,
}: {
  slides: ShowcaseSlide[];
  labels: Labels;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (slides.length === 0) return null;

  function scrollByCards(dir: number) {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 560);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => {
          const inner = (
            <>
              <DeviceDuo desktop={s.desktop} mobile={s.mobile} title={s.title} />
              <div className="mt-5 text-center">
                <span className="rounded-full bg-warm-neutral px-2.5 py-0.5 text-xs font-medium text-forest-dark/70">
                  {s.type === "app" ? labels.app : labels.website}
                </span>
                <p className="mt-2 font-display text-sm font-bold text-forest-dark transition-colors group-hover:text-sea-foam">
                  {s.title}
                </p>
              </div>
            </>
          );

          return s.href ? (
            <Link
              key={`${s.desktop}-${i}`}
              href={s.href}
              className="group block shrink-0 snap-center transition-transform duration-300 hover:-translate-y-1"
            >
              {inner}
            </Link>
          ) : (
            <div key={`${s.desktop}-${i}`} className="group shrink-0 snap-center">
              {inner}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => scrollByCards(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-neutral text-forest-dark transition-colors hover:border-sea-foam hover:bg-forest-dark hover:text-off-white"
          >
            <ChevronIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={() => scrollByCards(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-neutral text-forest-dark transition-colors hover:border-sea-foam hover:bg-forest-dark hover:text-off-white"
          >
            <ChevronIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Laptop + phone mockup shown together (responsive preview). */
function DeviceDuo({
  desktop,
  mobile,
  title,
}: {
  desktop: string;
  mobile: string;
  title: string;
}) {
  return (
    <div className="relative w-[460px] max-w-[85vw] sm:w-[540px]">
      {/* Laptop */}
      <div className="w-full">
        {/* Screen / lid */}
        <div className="relative mx-auto aspect-[16/10] w-[86%] overflow-hidden rounded-xl border-[7px] border-near-black bg-near-black shadow-xl">
          <Image
            src={desktop}
            alt={`${title}, desktop view`}
            fill
            sizes="(max-width: 640px) 73vw, 465px"
            className="object-cover object-top"
          />
        </div>
        {/* Base / hinge */}
        <div className="relative mx-auto h-3 w-full rounded-b-xl bg-gradient-to-b from-[#12241d] to-near-black shadow-md">
          <span className="absolute left-1/2 top-0 h-1 w-[13%] -translate-x-1/2 rounded-b-md bg-off-white/15" />
        </div>
      </div>

      {/* Phone (overlaps bottom-right) */}
      <div className="absolute bottom-0 right-0 z-10 aspect-[9/19] w-[24%] overflow-hidden rounded-[1.15rem] border-4 border-near-black bg-near-black shadow-2xl">
        <Image
          src={mobile}
          alt={`${title}, mobile view`}
          fill
          sizes="140px"
          className="object-cover object-top"
        />
        <span className="absolute left-1/2 top-1.5 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-off-white/40" />
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
