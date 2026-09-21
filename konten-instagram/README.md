# Konten Instagram

Carousel `@seawise.id`, 1080x1350, dijadwalkan lewat Zernio (akun IG
`6ab0df208d284ffb21252deb`). Jadwal: Senin, Rabu, Jumat pukul 19.00 WITA.

- `posts.py`: isi slide per post. File yang diubah untuk bulan berikutnya.
- `captions.json`: caption per post, dipisah supaya mengubah slide tidak
  pernah menyentuh caption yang sudah terjadwal.
- `render.py`: template (warna dan font sama dengan situs) dan render lewat
  Chrome headless.
- `foto-asli/`: foto asli dari pemilik. Lihat README di dalamnya.
- `prompt-gambar.md` dan `foto-ai/`: prompt foto untuk batch berikutnya dan
  hasil generate-nya.

## Cover

- **Post edukasi dan kenalan** memakai foto AI cover artikel blog yang
  topiknya sama (`blog-<slug>.jpg` dari kolom `cover_url` tabel `posts`).
  Gayanya sudah seragam, jadi feed IG dan blog terlihat satu keluarga.
- **Post studi kasus** memakai cover mockup screenshot aplikasi, sampai foto
  asli ditaruh di `foto-asli/`. Begitu ada, `render.py` otomatis memakainya.
- Foto asli selalu menang atas foto AI maupun mockup, lewat kunci `real` di
  slide cover.

## Membuat ulang

1. Siapkan folder `assets/` di sebelah script: `logo-dark.png` (salinan
   `public/SeaWise.png`), `logo-light.png` (logo yang sama diwarnai `#FAFAF8`
   untuk latar gelap), screenshot portfolio dengan nama
   `<slug-portfolio>-shot.jpg` / `-g0.jpg` / `-mobile.jpg` (kolom
   `screenshot_url`, `gallery`, `mobile_url` tabel `portfolio`), cover blog
   sebagai `blog-<slug>.jpg`, dan ikon Lucide sebagai `icon-<nama>.svg` dari
   `cdn.jsdelivr.net/npm/lucide-static/icons/`.
2. `python3 render.py` (atau `python3 render.py 03-studi-tokoku` untuk satu post).
3. Konversi ke JPG, unggah ke bucket Supabase `media/instagram/<periode>/`,
   lalu jadwalkan di Zernio dengan URL publiknya. Zernio tidak bisa mengganti
   gambar post yang sudah terjadwal: buat post baru dulu, baru hapus yang lama.
   Periode sekarang ada di `media/instagram/2026-q4-v2/`.

`assets/` dan `out/` tidak disimpan di repo, isinya bisa dibangun ulang.

## Aturan isi

Sama dengan situs publik: tanpa em-dash, tanpa testimoni atau angka karangan,
angka contoh diberi label "Angka ilustrasi", screenshot aplikasi diberi label
"Tampilan dengan data demo". Harga harus sama dengan tabel `pricing`. Kalau
harga di `/admin/pricing` berubah, post harga yang belum tayang ikut diubah.

Caption santai ("kamu", "nggak"), tapi tetap rapi karena pembacanya pemilik
bisnis.

## Periode 23 Sep – 19 Okt 2026

| Tanggal | Post | Catatan |
|---|---|---|
| 23 Sep | 01 kenalan | |
| 25 Sep | 02 tanda Excel | artikel 03 |
| 28 Sep | 03 studi TokoKu | |
| 30 Sep | 04 HPP kopi | artikel 05 |
| 2 Okt | 05 studi Resto & Cafe | |
| 5 Okt | 06 kebocoran stok | artikel 07 |
| 7 Okt | 07 rumus restock | artikel 07 |
| 9 Okt | 08 tanda apotek | artikel 02 |
| 12 Okt | 09 studi Sehatera | |
| 14 Okt | 10 harga website | harga dari tabel `pricing` 21 Sep 2026 |
| 16 Okt | 11 tanda ERP | artikel 06 |
| 19 Okt | 12 studi Industry Management | |
