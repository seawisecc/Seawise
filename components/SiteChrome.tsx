"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { captureLeadSource } from "@/lib/leadSource";
import FloatingWhatsApp from "./FloatingWhatsApp";

/**
 * Hides the marketing navbar/footer on admin routes (/{lang}/admin*), so the
 * admin panel gets a clean full-height shell without the public site chrome.
 */
export default function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const isAdmin = /^\/[^/]+\/admin(\/|$)/.test(pathname);

  // Runs before the admin early return so the hook order stays stable. Records
  // the channel on arrival, so it survives the walk to the contact page.
  useEffect(() => {
    captureLeadSource();
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
      <FloatingWhatsApp pathname={pathname} />
    </>
  );
}
