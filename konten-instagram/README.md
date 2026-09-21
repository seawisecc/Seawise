# Konten Instagram

Carousel `@seawise.id`, 1080x1350, dijadwalkan lewat Zernio (akun IG
`6ab0df208d284ffb21252deb`). Jadwal: Senin, Rabu, Jumat pukul 19.00 WITA.

- `posts.py`: isi slide dan caption per post. Satu-satunya file yang diubah
  untuk bulan berikutnya.
- `render.py`: template (warna dan font sama dengan situs) dan render lewat
  Chrome headless.

## Membuat ulang

1. Siapkan folder `assets/` di sebelah script: `logo-dark.png` (salinan
   `public/SeaWise.png`), `logo-light.png` (logo yang sama diwarnai `#FAFAF8`
   untuk latar gelap), dan screenshot portfolio yang dipakai `posts.py`, dengan
   nama `<slug-portfolio>-shot.jpg` / `-g0.jpg` dari kolom `screenshot_url` dan
   `gallery` di tabel `portfolio`.
2. `python3 render.py` (atau `python3 render.py 03-studi-tokoku` untuk satu post).
3. Konversi ke JPG, unggah ke bucket Supabase `media/instagram/<periode>/`,
   lalu jadwalkan di Zernio dengan URL publiknya.

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
| 5 Okt | 06 kebocoran stok | **butuh artikel 07 sudah tayang** |
| 7 Okt | 07 rumus restock | **butuh artikel 07 sudah tayang** |
| 9 Okt | 08 tanda apotek | artikel 02 |
| 12 Okt | 09 studi Sehatera | |
| 14 Okt | 10 harga website | harga dari tabel `pricing` 21 Sep 2026 |
| 16 Okt | 11 tanda ERP | artikel 06 |
| 19 Okt | 12 studi Industry Management | |
