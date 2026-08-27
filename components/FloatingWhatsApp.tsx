import { whatsappUrlFor } from "@/lib/contact";
import { WhatsAppIcon } from "./ContactIcons";

/**
 * Floating WhatsApp button, bottom-right on every public page.
 * Helps visitors from Google / GBP start a chat instantly (higher conversion).
 *
 * `pathname` comes from SiteChrome so the pre-filled text matches the page the
 * visitor is on. That is what tells you afterwards which page earned the chat.
 */
export default function FloatingWhatsApp({ pathname }: { pathname: string }) {
  return (
    <a
      href={whatsappUrlFor(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
