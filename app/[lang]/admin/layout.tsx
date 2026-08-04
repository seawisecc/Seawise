import type { Viewport } from "next";
import type { ReactNode } from "react";

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

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
