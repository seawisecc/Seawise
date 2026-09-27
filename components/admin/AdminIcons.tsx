/** Minimal line icons for the admin UI. All use currentColor. */
import type { ReactNode } from "react";

type P = { className?: string };
const base = "h-5 w-5";

export function WalletIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v1" />
      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2H5" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function TrendUpIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15l5-5 3 3 6-6" />
      <path d="M18 7h3v3" />
    </svg>
  );
}
export function TrendDownIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9l5 5 3-3 6 6" />
      <path d="M18 17h3v-3" />
    </svg>
  );
}
export function LayersIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}
export function QuoteIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 7H5a1 1 0 00-1 1v4a1 1 0 001 1h3v3a2 2 0 01-2 2" />
      <path d="M20 7h-4a1 1 0 00-1 1v4a1 1 0 001 1h3v3a2 2 0 01-2 2" />
    </svg>
  );
}
export function UsersIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0112 0" />
      <path d="M16 6a3 3 0 010 6" />
      <path d="M18 14a6 6 0 013 5" />
    </svg>
  );
}
export function InboxIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 13l2-7h12l2 7" />
      <path d="M4 13v5a1 1 0 001 1h14a1 1 0 001-1v-5" />
      <path d="M4 13h4l1 2h6l1-2h4" />
    </svg>
  );
}
export function ArticleIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}
export function GridIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}
export function TagIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h7l9 9-7 7-9-9V4z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function SettingsIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
    </svg>
  );
}
export function MoreIcon({ className = base }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Small UI glyphs. Same 1.7 stroke as the menu icons, so text arrows and
   symbols never have to stand in for them. ─────────────────────────────── */

function Glyph({ className = "h-4 w-4", children }: P & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
export function PlusIcon({ className }: P) {
  return <Glyph className={className}><path d="M12 5v14M5 12h14" /></Glyph>;
}
export function ChevronRightIcon({ className }: P) {
  return <Glyph className={className}><path d="M9 6l6 6-6 6" /></Glyph>;
}
export function ExternalIcon({ className }: P) {
  return (
    <Glyph className={className}>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" />
    </Glyph>
  );
}
export function LogoutIcon({ className }: P) {
  return (
    <Glyph className={className}>
      <path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h10" />
    </Glyph>
  );
}
export function DownloadIcon({ className }: P) {
  return (
    <Glyph className={className}>
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </Glyph>
  );
}
export function CloseIcon({ className }: P) {
  return <Glyph className={className}><path d="M6 6l12 12M18 6L6 18" /></Glyph>;
}
export function CheckIcon({ className }: P) {
  return <Glyph className={className}><path d="M5 12.5l4.5 4.5L19 7" /></Glyph>;
}
export function AlertIcon({ className }: P) {
  return (
    <Glyph className={className}>
      <path d="M12 3.5l9.5 16.5h-19L12 3.5z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </Glyph>
  );
}
export function ArrowUpIcon({ className }: P) {
  return <Glyph className={className}><path d="M12 19V5M6 11l6-6 6 6" /></Glyph>;
}
export function ArrowDownIcon({ className }: P) {
  return <Glyph className={className}><path d="M12 5v14M6 13l6 6 6-6" /></Glyph>;
}
