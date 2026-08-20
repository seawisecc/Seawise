/**
 * First touch attribution for leads, browser side only.
 *
 * The contact form used to read utm_source straight from its own URL, which
 * quietly loses the answer in the most common case: someone taps
 * seawise.id/id?utm_source=instagram, browses, then opens the contact page.
 * That second navigation carries no query string and the referrer is our own
 * domain, so the lead would have been filed as "langsung" even though
 * Instagram sent them.
 *
 * So the source is captured once on arrival and kept for the session. First
 * touch wins: if someone arrives from Instagram today and returns via Google
 * in the same session, Instagram keeps the credit for that visit.
 *
 * sessionStorage, not a cookie: it dies with the tab, is never sent to a
 * server on its own, and holds nothing personal, just a channel name.
 */

const KEY = "seawise.leadSource";
export const DIRECT = "langsung";

/** sessionStorage throws in some privacy modes. Attribution is never worth an exception. */
function safeGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable, the visit is simply recorded as direct later on.
  }
}

/** Reads utm_source, else the referring domain, else direct. */
function detect(): string {
  const utm = new URLSearchParams(window.location.search).get("utm_source");
  if (utm?.trim()) return utm.trim().slice(0, 120);

  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      const self = window.location.hostname.replace(/^www\./, "");
      if (host !== self) return host;
    } catch {
      // Malformed referrer, treat it as if there were none.
    }
  }

  return DIRECT;
}

/**
 * Call once per visit, as early as possible. Safe to call again: the value is
 * only written when nothing has been stored yet, which is what keeps it first
 * touch rather than last touch.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return;
  if (safeGet(KEY)) return;
  safeSet(KEY, detect());
}

/** What to file the lead under. Falls back to detecting on the spot. */
export function readLeadSource(): string {
  if (typeof window === "undefined") return DIRECT;
  return safeGet(KEY) ?? detect();
}
