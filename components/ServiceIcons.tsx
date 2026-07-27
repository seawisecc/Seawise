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
