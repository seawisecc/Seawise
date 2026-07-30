/** Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the environment to override. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.seawise.id";
