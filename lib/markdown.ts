import { marked } from "marked";

/**
 * Render Markdown (written by the admin) to HTML for article pages.
 * Content is authored by the trusted admin only, so output is used directly.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  const html = marked.parse(md, { async: false, gfm: true, breaks: true }) as string;
  // Wrap tables so a wide comparison table scrolls inside its own box instead
  // of pushing the whole article sideways on a phone. Styled in globals.css.
  return html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
}
