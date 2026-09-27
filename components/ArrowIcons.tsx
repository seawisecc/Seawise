/**
 * Link arrows for the public site. They replace the text glyphs (→ ← ↗) that
 * used to sit inside the dictionary strings: a glyph takes its shape from
 * whatever font renders it, so it never quite matched the rest of the UI.
 * Same stroke weight as the service icons. All use currentColor.
 */

type P = { className?: string };
const base = "h-4 w-4 shrink-0";

function Arrow({ className = base, d }: P & { d: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function ArrowRight({ className }: P) {
  return <Arrow className={className} d="M5 12h14M13 6l6 6-6 6" />;
}

export function ArrowLeft({ className }: P) {
  return <Arrow className={className} d="M19 12H5M11 6l-6 6 6 6" />;
}

/** For links that open another site in a new tab. */
export function ArrowUpRight({ className }: P) {
  return <Arrow className={className} d="M7 17L17 7M9 7h8v8" />;
}
