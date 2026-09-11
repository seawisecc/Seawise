/**
 * Pemeriksaan isi artikel sebelum disimpan, khusus editor blog admin.
 *
 * Lahir dari bug nyata: keempat artikel pertama tayang berbulan-bulan tanpa
 * satu pun subjudul, karena teksnya disalin dari tampilan preview Markdown.
 * Preview membuang tanda `##`, `-`, dan `**`, jadi yang tersimpan cuma teks
 * polos dan halaman artikelnya jadi satu dinding paragraf. Tidak ada error,
 * form tetap tersimpan, dan tidak ada yang sadar sampai HTML-nya diperiksa.
 *
 * Hanya peringatan, tidak memblokir simpan. Artikel pendek atau pengumuman
 * memang boleh tanpa subjudul.
 */

/** Di bawah panjang ini artikel dianggap catatan pendek, bukan panduan. */
const LONG_ARTICLE_CHARS = 1500;

export function postContentWarnings(
  content: string | null | undefined,
  lang: "id" | "en"
): string[] {
  const text = content ?? "";
  if (!text.trim()) return [];

  const warnings: string[] = [];
  const long = text.length >= LONG_ARTICLE_CHARS;

  if (long && !/^#{2,3}\s+\S/m.test(text)) {
    warnings.push(
      "Tidak ada subjudul (## atau ###). Biasanya tanda ini teks tersalin dari tampilan preview, bukan dari teks mentah Markdown. Salin ulang dari file .txt di folder konten-blog."
    );
  }

  if (/^#\s+\S/m.test(text)) {
    warnings.push(
      "Ada baris diawali satu # (judul H1). Judul artikel sudah menjadi H1 halaman, jadi pakai ## untuk subjudul supaya halaman tidak punya dua H1."
    );
  }

  if (/^\s*[•●▪]\s/m.test(text)) {
    warnings.push(
      "Ada poin berawalan • yang tidak akan terbaca sebagai daftar. Ganti dengan tanda - di awal baris."
    );
  }

  if (text.includes("—")) {
    warnings.push("Ada em-dash (—). Ganti dengan koma, titik dua, atau titik.");
  }

  const other = lang === "id" ? "en" : "id";
  if (new RegExp(`\\]\\(/${other}/`).test(text)) {
    warnings.push(
      `Ada tautan ke /${other}/ di versi ${lang === "id" ? "Indonesia" : "Inggris"}. Tautan internal sebaiknya memakai /${lang}/ supaya pembaca tetap di bahasanya.`
    );
  }

  if (long && !new RegExp(`\\]\\(/${lang}/`).test(text)) {
    warnings.push(
      `Belum ada tautan internal, misalnya ke /${lang}/jasa-pembuatan-website-bali atau studi kasus portfolio. Artikel tanpa tautan tidak mengalirkan pembaca ke halaman yang menghasilkan lead.`
    );
  }

  return warnings;
}
