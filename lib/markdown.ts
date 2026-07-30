import { marked } from "marked";

/**
 * Render Markdown (written by the admin) to HTML for article pages.
 * Content is authored by the trusted admin only, so output is used directly.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  return marked.parse(md, { async: false, gfm: true, breaks: true }) as string;
}
