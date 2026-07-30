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

export function whatsappUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
