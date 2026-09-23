# Konten Instagram

Carousel dan Story `@seawise.id`, dijadwalkan lewat Zernio (akun IG
`6ab0df208d284ffb21252deb`). Carousel: Senin, Rabu, Jumat pukul 19.00 WITA.
Story: Selasa, Kamis, Sabtu pukul 19.00 WITA, mengisi hari kosong di antara
carousel.

- `posts.py`: isi slide per carousel. File yang diubah untuk batch berikutnya.
- `captions.json`: caption per carousel, dipisah supaya mengubah slide tidak
  pernah menyentuh caption yang sudah terjadwal.
- `render.py`: template carousel (1080x1350, warna dan font sama dengan
  situs) dan render lewat Chrome headless.
- `render_stories.py`: daftar `STORIES` dan template Story (1080x1920), render
  lewat Chrome headless. Lihat bagian Story di bawah.
- `upload.js`: unggah hasil render (JPG) ke bucket Supabase Storage sekaligus
  catat URL publiknya ke `.urls-<periode>.json`. Jalankan
  `PERIOD=<periode> node konten-instagram/upload.js` setelah render dan
  konversi ke JPG. Butuh `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`.
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
2. `python3 render.py` untuk carousel (atau `python3 render.py 03-studi-tokoku`
   untuk satu post), `python3 render_stories.py` untuk Story.
3. Konversi PNG ke JPG di `jpg_out/` dan `jpg_out_stories/`, lalu
   `PERIOD=<periode> node konten-instagram/upload.js` untuk unggah ke bucket
   Supabase `media/instagram/<periode>/` sekaligus dapat URL publiknya di
   `.urls-<periode>.json`. Zernio tidak bisa mengganti gambar post yang sudah
   terjadwal: buat post baru dulu, baru hapus yang lama. Periode sekarang ada
   di `media/instagram/2026-q4-v3/`.

`assets/`, `out/`, `out_stories/`, `jpg_out/`, `jpg_out_stories/`, dan
`.urls-*.json` tidak disimpan di repo, isinya bisa dibangun ulang.

## Story

Dua jenis, ditandai `type` di `STORIES` pada `render_stories.py`:

- **`repost`**: reformat vertikal dari cover carousel yang baru tayang,
  dengan CTA "Baca lengkapnya di feed". Menunjuk balik ke carousel terakhir
  atau yang baru mau tayang.
- **`tip`**: satu pemikiran singkat berdiri sendiri, tanpa carousel yang
  cocok hari itu.

Cover-nya pakai foto AI yang sama dengan carousel terkait lewat kunci `ai`,
prioritas foto sama seperti carousel (`real` di `foto-asli/` > `ai` di
`foto-ai/`). Story tidak punya caption di Instagram, jadi `posts_create_post`
Zernio dipanggil tanpa `content`, cukup `media_items` satu gambar dan
`platformSpecificData: {"contentType": "story"}` di entri platform-nya.

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

Tidak ada Story di periode ini, formatnya belum ada. Story baru mulai
periode berikutnya.

## Periode 21 Okt – 19 Nov 2026

| Tanggal | Post | Catatan |
|---|---|---|
| 21 Okt | 13 nota basah (carousel) | |
| 22 Okt | Story: tips backup catatan | |
| 23 Okt | 14 villa double booking (carousel) | artikel 08 |
| 24 Okt | Story: repost villa | |
| 26 Okt | 15 kasir jam ramai (carousel) | |
| 27 Okt | Story: tau nggak struk | |
| 28 Okt | 16 pemetaan kebutuhan (carousel) | artikel 09 |
| 29 Okt | Story: repost pemetaan kebutuhan | |
| 30 Okt | 17 studio sketsa (carousel) | |
| 31 Okt | Story: tips stok opname | |
| 2 Nov | 18 faktur supplier (carousel) | |
| 3 Nov | Story: reminder HPP | |
| 4 Nov | 19 website fondasi (carousel) | artikel 10 |
| 5 Nov | Story: repost fondasi | |
| 6 Nov | 20 banyak cabang (carousel) | |
| 7 Nov | Story: reminder konsultasi gratis | |
| 9 Nov | 21 SIPNAP (carousel) | artikel 11 |
| 10 Nov | Story: repost SIPNAP | |
| 11 Nov | 22 konsultasi kopi (carousel) | |
| 12 Nov | Story: tau nggak laporan | |
| 13 Nov | 23 stok kedaluwarsa (carousel) | |
| 14 Nov | Story: cek akhir pekan margin | |
| 16 Nov | 24 beach club reservasi (carousel) | artikel 12 |
| 17 Nov | Story: repost beach club | |
| 18 Nov | 25 pendampingan (carousel) | |
| 19 Nov | Story: follow tiap minggu | |

Artikel 08–12 masih draft di database (belum di-Publish), lihat status
terbaru di `konten-blog/README.md`.
