"use client";

import { useEffect, useState } from "react";
import { whatsappUrlFor } from "@/lib/contact";
import { WhatsAppIcon } from "./ContactIcons";

/**
 * Floating WhatsApp button, bottom-right on every public page.
 * Helps visitors from Google / GBP start a chat instantly (higher conversion).
 *
 * `pathname` comes from SiteChrome so the pre-filled text matches the page the
 * visitor is on. That is what tells you afterwards which page earned the chat.
 *
 * It steps aside once the footer is on screen. That started as a collision
 * fix, the button sat on top of the "Part of Mayaloka Digital" lockup in the
 * bottom bar, but it is the right behaviour on its own: the footer carries the
 * WhatsApp link with the number spelled out, so a floating shortcut to the same
 * chat is redundant exactly where it gets in the way. Hiding beats padding the
 * footer, which would only move the overlap to a different screen width.
 */
export default function FloatingWhatsApp({ pathname }: { pathname: string }) {
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    // No footer on this route (admin, promo): nothing to yield to.
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) =>
      setAtFooter(entry.isIntersecting)
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <a
      href={whatsappUrlFor(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      // `aria-hidden` and `tabIndex` follow the visual state, so the button is
      // not a target a keyboard or a screen reader can reach while it is
      // invisible. Rendered rather than unmounted so it can fade.
      aria-hidden={atFooter}
      tabIndex={atFooter ? -1 : undefined}
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-300 md:bottom-6 md:right-6 ${
        atFooter
          ? "pointer-events-none translate-y-3 opacity-0"
          : "translate-y-0 opacity-100 hover:scale-105"
      }`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
