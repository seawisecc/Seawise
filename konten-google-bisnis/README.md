# Konten Google Business Profile

Post ke profil Google Bisnis "Seawise Studio", dijadwalkan lewat Zernio (akun
`googlebusiness` `6ab376528d284ffb2132b05c`, disambungkan 23 Sep 2026). Post
tampil di profil bisnis di Google Search dan Maps, jadi yang melihatnya orang
yang sedang mencari jasa, bukan sekadar scroll.

`posts.json` berisi teks dan jadwal tiap post. Gambarnya ada di bucket
Supabase `media/gbp/<slug>.jpg`.

## Jadwal

Satu post per minggu, **Kamis 10.00 WITA** (jam kerja, saat orang mencari
vendor). Temanya mengikuti tema carousel IG minggu yang sama.

| Tanggal | Post | Tombol ke |
|---|---|---|
| 24 Sep | g01 kasir UMKM | artikel 03 |
| 1 Okt | g02 kasir restoran | artikel 05 |
| 8 Okt | g03 stok toko retail | artikel 07 |
| 15 Okt | g04 biaya website | artikel 01 |
| 22 Okt | g05 ERP manufaktur | artikel 06 |
| 29 Okt | g06 aplikasi custom | artikel 04 |
| 5 Nov | g07 aplikasi apotek | artikel 02 |

## Aturan

- **Format**: satu gambar, teks, satu tombol. Tidak ada carousel, Story,
  atau Reel. `platformSpecificData`: `topicType: "STANDARD"`,
  `languageCode: "id"`, `callToAction: {type: "LEARN_MORE", url}`.
- **Tombol hanya ke artikel yang sudah tayang.** Artikel draft menghasilkan
  404. Artikel 08–12 baru boleh dipakai setelah di-Publish di `/admin/blog`.
- **URL tombol memakai UTM** `?utm_source=google&utm_medium=gbp&utm_campaign=post`
  supaya kunjungan dari Google Bisnis bisa dibedakan dari pencarian biasa.
- **Gambar landscape, JPG, tanpa teks di dalamnya.** Google memotong gambar
  post mendekati landscape, jadi cover carousel IG (portrait, teks di bawah)
  akan terpotong. Pakai cover artikel blog atau foto di `konten-instagram/foto-ai/`.
  Cover blog aslinya WebP, jadi dikonversi ke JPG dulu.
- **Teks**: "Anda", sedikit lebih formal dari IG. Tanpa hashtag (tidak
  berguna di Google), tanpa nomor telepon (Google cenderung menolak, tombol
  sudah menggantikannya), tanpa angka harga (supaya tidak jadi tempat ketiga
  yang harus disamakan dengan tabel `pricing`), tanpa em-dash. Batas Google
  1.500 karakter, post di sini sekitar 400–550.
- Zernio menerima post bukan berarti Google menerima. Validasi terakhir
  terjadi saat tayang, jadi cek status post pertama sesudah jadwalnya lewat.

## Layanan dan Produk (ditata 24 Sep 2026)

**Layanan** diatur lewat API Zernio (`gmb_services_update_google_business_services`,
akun `6ab376528d284ffb2132b05c`). Isinya penggantian penuh, jadi selalu kirim
seluruh daftar: 4 paket website dengan harga dari tabel `pricing`, maintenance,
5 layanan aplikasi tanpa harga, migrasi spreadsheet, dan 3 item bawaan Google.

**Produk** tidak punya API, jadi diedit di Chrome lewat panel "Edit products"
di hasil pencarian Google. Pemilihan gambar membuka file picker Mac, jadi
pemilik yang memilih gambarnya. Isinya sekarang:

| Kategori | Produk | Harga | Sumber harga |
|---|---|---|---|
| Aplikasi Bisnis | IMS | Rp25.000.000 sekali bayar | ims.seawise.id/kenapa |
| Aplikasi Bisnis | TokoKu | mulai Rp99.000/bln | tokoku.seawise.id/fitur |
| Aplikasi Bisnis | Sehatera | mulai Rp99.000/bln | sehatera.seawise.id/kenapa |
| Aplikasi Bisnis | RCM | Rp170.000/bln | rcm.seawise.id/kenapa |
| Paket Website | Shore, Reef, Current, Trench | Rp2 / 3,5 / 4,5 / 12 jt | tabel `pricing` |
| Aplikasi Gaya Hidup | Hari Baik | tanpa harga | |

Yang gampang salah:

- Harga produk aplikasi mengikuti halaman harga di situs aplikasinya
  masing-masing, bukan repo ini. Kalau harga di sana berubah, produk di sini
  ikut diubah.
- Sehatera pindah ke `sehatera.seawise.id`. `psm.seawise.id` mati (24 Sep 2026)
  padahal masih dipakai `live_url` portfolio.
- RCM pernah berstatus NOT APPROVED dengan alasan "Alcoholic drinks" karena
  gambar mockup lamanya. Teksnya bersih. Screenshot dashboard dipakai sebagai
  gantinya. Hindari gambar resto dengan gelas minuman.
- Gambar produk ada di `Desktop/Seawise Studio/gambar-produk-google/`, dari
  kolom `screenshot_url` dan `cover_url` tabel `portfolio`.
