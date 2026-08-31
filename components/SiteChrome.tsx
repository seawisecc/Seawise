"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { captureLeadSource } from "@/lib/leadSource";
import FloatingWhatsApp from "./FloatingWhatsApp";

/**
 * Decides which chrome a route gets.
 *
 * Admin routes (/{lang}/admin*) get none, so the panel has a clean full-height
 * shell. The paid-ads landing page (/{lang}/promo) keeps the footer but loses
 * the navbar: it renders its own brand header with a single CTA, because on a
 * page paid for per click every nav link is just a cheaper way to leave. It
 * also skips the floating WhatsApp button, which would otherwise sit on top of
 * that page's own sticky CTA and can cover the submit button on a phone.
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
  const isPromo = /^\/[^/]+\/promo(\/|$)/.test(pathname);

  // Runs before the admin early return so the hook order stays stable. Records
  // the channel on arrival, so it survives the walk to the contact page.
  useEffect(() => {
    captureLeadSource();
  }, []);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {!isPromo && navbar}
      <main>{children}</main>
      {footer}
      {!isPromo && <FloatingWhatsApp pathname={pathname} />}
    </>
  );
}
