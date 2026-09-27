/**
 * Group icons for the Services page. Sea-themed to match the whale brand:
 * the website icon is a browser window with a wave inside; the app icon is a
 * phone with a wave. Both use currentColor.
 */

export function WebsiteIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="4" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 8H21.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5.2" cy="6" r="0.7" fill="currentColor" />
      <circle cx="7.4" cy="6" r="0.7" fill="currentColor" />
      <path
        d="M5 14.5c1.2-1.4 2.4-1.4 3.6 0 1.2 1.4 2.4 1.4 3.6 0 1.2-1.4 2.4-1.4 3.6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M8.5 13c1-1.1 2-1.1 3 0s2 1.1 3 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Data group: chart frame with a wave for the trend line. */
export function DataIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 3.5v15a2 2 0 002 2h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M7 14.5c1.3-2.6 2.7-2.6 4 0s2.7 2.6 4 0 2.7-5.2 4-5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Documentation group: a page with a folded corner and wave lines of text. */
export function DocsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2.5h8l4.5 4.5v12a2.5 2.5 0 01-2.5 2.5H6a2.5 2.5 0 01-2.5-2.5v-14A2.5 2.5 0 016 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2.5V7h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.5 12c.8-.9 1.7-.9 2.5 0s1.7.9 2.5 0 1.7-.9 2.5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 16.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
