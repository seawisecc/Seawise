# Konten Siap Tempel, Admin → Blog

## Sudah selesai, 11 September 2026

Temuan **T-2**, **S-3**, dan **S-5** dari `SEO-AUDIT.md` sudah dibereskan
langsung di tabel `posts`, bukan lewat tempel manual:

- Keempat artikel yang tayang ditulis ulang lengkap dengan subjudul, daftar,
  tabel, dan tautan internal, dua bahasa. Sebelumnya keempatnya tayang tanpa
  satu pun `<h2>` karena teksnya tersalin dari tampilan preview.
- Judul dipendekkan ke 60 karakter atau kurang, excerpt ke 155 karakter atau
  kurang, versi `id` dan `en`.
- Jabatan penulis EN yang masih "Founder, Seawise Studio" (koma dobel di
  byline) diganti "Founder Seawise Studio".
- Dua artikel baru masuk sebagai draft: `aplikasi-kasir-restoran` dan
  `erp-manufaktur-pabrik-kecil`.

Isi tabel sebelum perubahan di-backup ke JSON di luar repo sebelum ditimpa.

Naskah sumbernya sekarang ada di `konten-blog/`. Baca `konten-blog/README.md`
sebelum menulis atau menempel artikel apa pun.

---

## Masih perlu kamu

### 1. Terbitkan dua draft

Buka `/id/admin/blog`, edit masing-masing draft, unggah cover 16:9, centang
**Published**, simpan. Usulan cover ada di `konten-blog/README.md`.

### 2. Google Search Console

Setelah kedua draft tayang, setorkan ulang `sitemap.xml` dan minta indeks ulang
untuk keenam URL artikel lewat URL Inspection. Isi keempat artikel lama berubah
cukup banyak, jadi layak dirayapi ulang lebih cepat.

### 3. Nomor WhatsApp

`lib/contact.ts` memakai `6281234567890` sebagai nilai bawaan, dan itu nomor
contoh. Pastikan `NEXT_PUBLIC_WHATSAPP_NUMBER` sudah diisi di **Vercel →
Settings → Environment Variables**.
