/**
 * Penulis bawaan untuk artikel baru di panel admin.
 *
 * Bukan sumber kebenaran. Yang terbit ke halaman dan ke JSON-LD selalu isi
 * kolom `author_name` / `author_title` di baris `posts`, supaya apa yang
 * ditampilkan sama persis dengan apa yang tersimpan. Nilai di sini hanya
 * mengisi form artikel baru agar tidak perlu diketik ulang, dan bisa ditimpa
 * per artikel kalau ada penulis tamu.
 */
// Jabatan ditulis tanpa koma di dalamnya. Byline di halaman artikel sudah
// menyisipkan koma sendiri setelah nama, jadi "Founder, Seawise Studio" akan
// terbaca "Agus Yulyastrawan, Founder, Seawise Studio".
export const DEFAULT_AUTHOR = {
  name: "Agus Yulyastrawan",
  title: "Founder Seawise Studio",
  titleEn: "Founder Seawise Studio",
};
