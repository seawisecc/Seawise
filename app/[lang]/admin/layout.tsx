import type { Viewport } from "next";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

/**
 * Admin-only viewport. `viewportFit: "cover"` is what makes
 * `env(safe-area-inset-*)` resolve to real values on iPhone; without it the
 * insets are always 0 and the bottom navigation would sit under the home
 * indicator. Scoped to this segment so the public site keeps Next's default.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * AdminShell lives here rather than inside each page. When every page rendered
 * its own shell, moving between menu items unmounted and rebuilt the sidebar,
 * the bottom bar and the header on every navigation, which is what made the
 * panel feel like it was reloading instead of navigating. From the layout the
 * chrome persists and only the content area swaps.
 */
export default function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return <AdminShell lang={params.lang}>{children}</AdminShell>;
}
