/**
 * WhatsApp number in international format WITHOUT "+" or spaces.
 * Example for Indonesia: 6281234567890
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER in the environment to change without editing code.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";

/** Default pre-filled chat message. */
export const WHATSAPP_MESSAGE =
  "Halo Seawise Studio, saya mau tanya soal pembuatan website/aplikasi.";

/** Instagram profile of the studio. Verified by the owner, safe to publish. */
export const INSTAGRAM_HANDLE = "seawise.id";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/**
 * Human readable form of WHATSAPP_NUMBER, e.g. "+62 812-3759-7759".
 * Falls back to a plain "+<digits>" for any shape it does not recognise, so an
 * unusual number never renders as garbage.
 */
export function whatsappDisplay(number = WHATSAPP_NUMBER) {
  const m = /^62(\d{2,3})(\d{3,4})(\d{3,5})$/.exec(number);
  return m ? `+62 ${m[1]}-${m[2]}-${m[3]}` : `+${number}`;
}

export function whatsappUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-filled chat text per public page.
 *
 * The floating button used to send the same sentence from everywhere, so every
 * incoming chat looked identical and there was no way to tell which page did
 * the convincing. Wording it per page turns the chat itself into the source
 * label, without any tracking parameter that a visitor could find creepy.
 *
 * These strings ARE visitor facing, so both locales are required. They live
 * here rather than in the dictionaries because the floating button is rendered
 * by SiteChrome, which is a client shell that never receives a dictionary.
 * Keep the two objects in sync, same keys, same meaning.
 */
const WHATSAPP_MESSAGES: Record<string, { en: string; id: string }> = {
  home: {
    en: "Hi Seawise Studio, I saw your site and would like to ask about building an app or website.",
    id: "Halo Seawise Studio, saya lihat situsnya dan mau tanya soal pembuatan aplikasi atau website.",
  },
  layanan: {
    en: "Hi Seawise Studio, I was reading your services page and would like to discuss a project.",
    id: "Halo Seawise Studio, saya baca halaman layanan dan mau diskusi soal proyek saya.",
  },
  "jasa-pembuatan-website-bali": {
    en: "Hi Seawise Studio, I need a website for my business and would like to ask about the process and pricing.",
    id: "Halo Seawise Studio, saya butuh website untuk usaha saya dan mau tanya proses serta biayanya.",
  },
  "jasa-pembuatan-aplikasi-bali": {
    en: "Hi Seawise Studio, I need a custom app for my business and would like to ask about the process and pricing.",
    id: "Halo Seawise Studio, saya butuh aplikasi khusus untuk usaha saya dan mau tanya proses serta biayanya.",
  },
  portfolio: {
    en: "Hi Seawise Studio, I was looking at your portfolio and would like something similar for my business.",
    id: "Halo Seawise Studio, saya lihat portfolio kalian dan mau yang serupa untuk usaha saya.",
  },
  testimoni: {
    en: "Hi Seawise Studio, I read your client stories and would like to discuss my own project.",
    id: "Halo Seawise Studio, saya baca cerita klien kalian dan mau diskusi soal proyek saya.",
  },
  blog: {
    en: "Hi Seawise Studio, I read one of your articles and have a question about my own case.",
    id: "Halo Seawise Studio, saya baca artikel kalian dan mau tanya soal kasus di usaha saya.",
  },
  tentang: {
    en: "Hi Seawise Studio, I read about your studio and would like to discuss working together.",
    id: "Halo Seawise Studio, saya baca tentang studio kalian dan mau diskusi kerja sama.",
  },
  kontak: {
    en: "Hi Seawise Studio, I would like to ask about building an app or website.",
    id: "Halo Seawise Studio, saya mau tanya soal pembuatan aplikasi atau website.",
  },
};

/**
 * Picks the pre-filled text for a pathname like "/id/jasa-pembuatan-website-bali".
 * Unknown pages fall back to the home wording, so a new route never ends up
 * with an empty chat box.
 */
export function whatsappMessageFor(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const lang = parts[0] === "en" ? "en" : "id";
  const section = parts[1] ?? "home";
  const entry = WHATSAPP_MESSAGES[section] ?? WHATSAPP_MESSAGES.home;
  return entry[lang];
}

/** Convenience wrapper: chat link already worded for the page it sits on. */
export function whatsappUrlFor(pathname: string) {
  return whatsappUrl(whatsappMessageFor(pathname));
}
