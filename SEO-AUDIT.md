# Audit SEO Teknis, Seawise Studio

Tanggal: 4 Agustus 2026
Cakupan: `app/`, `components/`, `lib/`, output HTML hasil build produksi.

## Metodologi

Audit ini **tidak menebak dari kode saja**. Saya menjalankan `next build` lalu
`next start`, kemudian menarik HTML asli tiap halaman dengan `curl` dan
memeriksa tag yang benar-benar terkirim ke browser. Supabase terkonfigurasi
saat pengujian, jadi halaman detail portfolio dan blog ikut teruji dengan data
sungguhan, bukan data contoh.

Yang diverifikasi langsung dari HTML: canonical, hreflang, title, meta
description, Open Graph, Twitter Card, JSON-LD, jumlah `<h1>`, `sitemap.xml`,
`robots.txt`, graf tautan internal, dan ukuran gambar yang benar-benar
terkirim.

---

## Ringkasan

Fondasi teknisnya **sudah kuat**. Canonical, hreflang, sitemap, robots, struktur
heading, dan tautan internal semuanya bersih, dan tidak ditemukan satu pun
rating atau testimoni palsu di structured data.

Masalah terbesar bukan di infrastruktur, melainkan di **dua hal yang membuat
kerja SEO yang sudah dilakukan tidak terpanen**: link yang dibagikan tampil
tanpa gambar, dan artikel andalan tayang tanpa struktur.

| Prioritas | Jumlah |
|---|---|
| 🔴 Tinggi | 3 |
| 🟡 Sedang | 5 |
| 🟢 Rendah | 6 |

---

## 🔴 Prioritas Tinggi

### T-1. `og:image` hilang di semua halaman kecuali homepage

Diverifikasi dari HTML terkirim:

| Halaman | `og:image` | `twitter:image` |
|---|---|---|
| `/id` | ada | ada |
| `/id/layanan` | **tidak ada** | **tidak ada** |
| `/id/portfolio` | **tidak ada** | **tidak ada** |
| `/id/testimoni` | **tidak ada** | **tidak ada** |
| `/id/blog` | **tidak ada** | **tidak ada** |
| `/id/tentang` | **tidak ada** | **tidak ada** |
| `/id/kontak` | **tidak ada** | **tidak ada** |

Berlaku sama di locale `en`, jadi total **12 halaman**.

**Penyebab**, di `lib/seo.ts:37`, fungsi `pageSeo()` menyetel objek
`openGraph` tanpa properti `images`. Di Next.js, `openGraph` eksplisit dari
sebuah halaman **menimpa** konvensi berbasis file `app/opengraph-image.png`.
Homepage selamat karena ia tidak memanggil `pageSeo()`, melainkan mewarisi
metadata layout.

**Dampak.** Setiap kali link `/kontak` atau `/layanan` dibagikan di WhatsApp,
Instagram, Facebook, atau LinkedIn, previewnya muncul sebagai teks polos tanpa
gambar. Untuk bisnis di Indonesia yang penyebarannya bertumpu pada WhatsApp,
ini menurunkan rasio klik secara langsung. Ini juga satu-satunya temuan yang
merugikan setiap hari tanpa disadari.

**Perbaikan.** Tambahkan `images` ke objek `openGraph` di dalam `pageSeo()`,
menunjuk ke `${SITE_URL}/opengraph-image.png`. Satu perubahan, dua belas
halaman beres.

---

### T-2. Artikel blog tayang tanpa satu pun subjudul

Halaman `/id/blog/biaya-bikin-website` yang tayang berisi:

- 663 kata
- 29 paragraf `<p>`
- **0 tag `<h2>`, 0 tag `<h3>`**

Padahal sumber artikelnya di repo, `artikel-1-biaya-bikin-website.md`, punya
struktur lengkap:

```
## Kisaran biaya bikin website di 2026
## Apa saja yang memengaruhi biaya?
   ### 1. Jumlah halaman dan section
   ### 2. Tingkat kustomisasi desain
   ### 3. Kemampuan mengelola sendiri (admin panel)
   ### 4. Fitur tambahan
   ### 5. Maintenance dan hosting
## Kenapa website murah sering justru lebih mahal?
## Cara memilih paket yang tepat
## Pertanyaan yang sering diajukan
   ### Berapa lama proses pembuatan website?
   ### Apakah harga sudah termasuk domain dan hosting?
   ### Apakah saya bisa mengubah isi website sendiri?
   ### Apakah website akan langsung muncul di Google?
## Kesimpulan
```

Lima `##` dan sembilan `###` hilang seluruhnya saat konten dimasukkan ke admin.
Renderer Markdown (`lib/markdown.ts`) berfungsi normal, jadi yang tersimpan di
kolom `content` memang sudah tanpa tanda `#`.

**Dampak.** Google memakai heading untuk memahami cakupan sebuah halaman dan
untuk memilih cuplikan. Artikel 663 kata berupa satu dinding paragraf jauh
lebih lemah dibanding artikel yang sama dengan lima subjudul. Yang paling
disayangkan, **section "Pertanyaan yang sering diajukan" berisi empat tanya
jawab jadi tidak terlihat sama sekali**, padahal itu bahan matang untuk usulan
FAQ di bagian bawah dokumen ini.

**Perbaikan.** Tempel ulang isi artikel dari file `.md` lengkap dengan tanda
`##` dan `###`. Tidak ada perubahan kode yang dibutuhkan.

**Catatan saat menempel:** baris pertama file `.md` adalah
`# Cara pakai (isi ke Admin → Blog → Tulis Artikel)`, yaitu instruksi, bukan
bagian artikel. Jangan ikut ditempel. Kalau ikut, halaman akan punya dua `<h1>`
karena judul artikel sudah dirender sebagai `<h1>` oleh halamannya.

---

### T-3. `og:image` halaman detail memakai PNG mentah sampai 3,5 MB

`app/[lang]/portfolio/[slug]/page.tsx:30` dan
`app/[lang]/blog/[slug]/page.tsx:33` mengisi `og:image` dengan URL Supabase
Storage apa adanya:

```
https://emrirmpkpwbzionjljhe.supabase.co/storage/v1/object/public/media/portfolio/1785749426858-3yh74q.png
```

Ukuran file sumber yang terukur:

| Rentang | Jumlah file |
|---|---|
| 384 KB sampai 1 MB | 8 |
| 1 MB sampai 2 MB | 6 |
| 3,5 MB | 1 |

Semuanya PNG tanpa kompresi.

**Dampak.** Scraper media sosial mengambil URL mentah ini, bukan versi yang
sudah dioptimasi `next/image`. WhatsApp punya batas praktis beberapa ratus KB
untuk gambar preview dan akan diam-diam tidak menampilkan gambar yang lebih
besar. Jadi justru halaman detail proyek, yang paling sering kamu kirim ke
calon klien, berisiko tampil tanpa gambar.

**Perbaikan.** Arahkan `og:image` ke endpoint optimasi Next
(`/_next/image?url=...&w=1200&q=75`) dengan URL absolut, atau kompres ulang
gambar sumber sebelum diunggah.

---

## 🟡 Prioritas Sedang

### S-1. Meta description terlalu pendek di 5 dari 7 halaman

Target wajar 120 sampai 160 karakter. Hasil pengukuran:

| Halaman | EN | ID | Status |
|---|---|---|---|
| `/` | 141 | 140 | ok |
| `/layanan` | 77 | 87 | **terlalu pendek** |
| `/portfolio` | 74 | 80 | **terlalu pendek** |
| `/testimoni` | 67 | 75 | **terlalu pendek** |
| `/blog` | 68 | 73 | **terlalu pendek** |
| `/tentang` | 157 | **169** | ID **terlalu panjang** |
| `/kontak` | 97 | 86 | **terlalu pendek** |

Description di bawah 120 karakter menyisakan ruang yang tidak terpakai di hasil
pencarian, dan membuat Google lebih sering menulis ulang snippet dengan potongan
teks acak dari halaman. Sumbernya semua ada di `lib/i18n/dictionaries.ts` pada
key `*.intro`.

### S-2. Description halaman detail jauh melewati batas

| Halaman | Panjang |
|---|---|
| `/id/portfolio/industry-management-ims` | **305** |
| `/id/blog/biaya-bikin-website` | **170** |
| `/id/portfolio/leuca-de-perfume` | 112 |

Description portfolio diambil mentah dari kolom `description`, tanpa pemotongan.
Perlu dipotong di sekitar 155 karakter pada batas kata.

### S-3. Title artikel blog 89 karakter, terpotong di hasil pencarian

```
Biaya Bikin Website 2026: Panduan Lengkap Harga & Cara Memilih Paket | Seawise Studio
```

Google memotong di sekitar 60 karakter, jadi bagian `| Seawise Studio` dan
sebagian judul tidak terlihat. Judul artikel di database perlu dipendekkan, atau
`titleTemplate` tidak diterapkan pada halaman artikel.

### S-4. Title halaman dalam generik, tidak memakai kata kunci lokal

| Halaman | Title | Panjang | Sisa ruang |
|---|---|---|---|
| `/id/layanan` | `Layanan \| Seawise Studio` | 24 | 36 karakter |
| `/id/portfolio` | `Portfolio \| Seawise Studio` | 26 | 34 karakter |
| `/id/blog` | `Blog \| Seawise Studio` | 21 | 39 karakter |

Semuanya aman dari sisi panjang, tapi tidak ada satu pun yang memuat kata kunci
yang kamu incar. Meta `keywords` memang sudah berisi "jasa pembuatan website
Bali", tetapi **Google mengabaikan meta keywords sejak 2009**. Kata kunci hanya
berpengaruh kalau muncul di `<title>`, `<h1>`, dan isi halaman.

### S-5. Tiga dari empat artikel belum dipublikasikan

Repo berisi empat artikel siap tayang:

```
artikel-1-biaya-bikin-website.md      → sudah tayang
artikel-2-aplikasi-apotek.md          → belum
artikel-3-aplikasi-kasir-umkm.md      → belum
artikel-4-jasa-pembuatan-aplikasi.md  → belum
```

`sitemap.xml` hanya memuat satu artikel. Tiga artikel yang sudah selesai ditulis
tidak menghasilkan apa pun selama masih tersimpan sebagai file.

---

## 🟢 Prioritas Rendah

| # | Temuan | Lokasi |
|---|---|---|
| R-1 | Gambar kartu portfolio pertama tidak memakai `priority`, sehingga kandidat LCP di `/portfolio` tidak di-preload | `components/PortfolioGrid.tsx:80` |
| R-2 | AVIF belum diaktifkan. `next.config.mjs` tidak menyetel `images.formats`, jadi Next hanya menyajikan WebP. AVIF biasanya 20 sampai 30 persen lebih kecil | `next.config.mjs` |
| R-3 | `ProfessionalService` belum punya `telephone`, `addressLocality`, `postalCode`, `sameAs`, `priceRange`, `openingHoursSpecification`. Bukan error, tapi memperkuat sinyal bisnis lokal | `components/StructuredData.tsx` |
| R-4 | `BlogPosting` belum punya `publisher.logo` bertipe `ImageObject` | `app/[lang]/blog/[slug]/page.tsx:65` |
| R-5 | Artikel blog hanya punya 1 tautan masuk, dari `/blog`. Tidak ada tautan dari `/layanan` ke artikel yang relevan | tautan internal |
| R-6 | `robots.txt` memakai direktif `Host:` yang non-standar dan hanya dipakai Yandex. Tidak berbahaya | `app/robots.ts:15` |

---

## Yang Sudah Benar

Bagian ini penting supaya tidak ada yang "diperbaiki" padahal sudah beres.

### Canonical, 14 dari 14 benar

Setiap halaman menunjuk ke dirinya sendiri dengan locale yang tepat. Tidak ada
satu pun yang mewarisi canonical homepage.

```
/id/layanan   → https://www.seawise.id/id/layanan
/en/layanan   → https://www.seawise.id/en/layanan
```

Homepage aman meski tidak memanggil `pageSeo()`, karena `app/[lang]/layout.tsx:73`
sudah menetapkan `canonical: /${lang}`.

### hreflang lengkap dan simetris

Tiga tag di setiap halaman, dan pasangan `id` maupun `en` menghasilkan set yang
identik, persis seperti yang disyaratkan Google:

```html
<link rel="alternate" hrefLang="en" href="https://www.seawise.id/en/layanan"/>
<link rel="alternate" hrefLang="id" href="https://www.seawise.id/id/layanan"/>
<link rel="alternate" hrefLang="x-default" href="https://www.seawise.id/en/layanan"/>
```

### `sitemap.xml`, 26 URL, cakupan penuh

14 halaman statis (7 × 2 locale), 10 detail portfolio (5 × 2), 2 detail blog
(1 × 2). Semua halaman publik tercakup, tidak ada URL yang menghasilkan 404, dan
`app/sitemap.ts:32` sudah melewati baris tanpa slug.

### `robots.txt` benar

Admin diblokir untuk kedua locale, sitemap terdaftar.

### Structured data valid, tanpa rekayasa

- `ProfessionalService` dan `WebSite` dalam satu `@graph`, terhubung lewat `@id`.
- `BlogPosting` di detail artikel, `CreativeWork` di detail portfolio.
- **Tidak ada `aggregateRating`. Tidak ada `review`. Tidak ada angka statistik
  buatan.** Sudah saya periksa di seluruh JSON-LD dan komponen.

### Satu `<h1>` per halaman, 9 dari 9

Diverifikasi dari HTML terkirim, bukan dari grep. Homepage memakai `motion.h1`
milik framer-motion di `components/Hero.tsx:44`, halaman dalam memakai
`PageHeader`, halaman detail memakai `<h1>` sendiri.

### Tidak ada halaman yatim

Setiap halaman utama menerima 8 tautan masuk dari navbar dan footer. Setiap
detail portfolio menerima tautan dari `/` dan `/portfolio`.

### Pengiriman gambar sudah efisien

Ini sempat terlihat seperti masalah dan ternyata bukan. PNG sumber 1,1 MB
dikirim sebagai WebP:

| Lebar | Terkirim | Format |
|---|---|---|
| 1080 | 36 KB | `image/webp` |
| 1200 | 41 KB | `image/webp` |
| 1080 | 57 KB | `image/webp` |

Kompresi sekitar 96 persen. `next/image` bekerja sebagaimana mestinya, dan
semua `<Image>` di halaman publik sudah punya `alt` dan `sizes`.

**Catatan:** pengukuran awal sempat menunjukkan `image/png` 682 KB. Itu keliru,
karena alat ujinya tidak mengirim header `Accept: image/webp`. Angka di atas
adalah hasil dengan header browser sungguhan.

---

## Usulan, Diurutkan Berdasarkan Dampak

### 1. Landing page lokal, dampak terbesar

**Masalahnya konkret:** tidak ada satu pun halaman di situs ini yang menargetkan
"jasa pembuatan website Bali" di `<title>` maupun `<h1>`. Kata kunci itu hanya
ada di meta `keywords`, yang diabaikan Google. Halaman `/layanan` berjudul
"Layanan", terlalu umum untuk bersaing.

Ini adalah jarak terbesar antara apa yang kamu incar dan apa yang kodenya
katakan.

**Usulan, dua halaman baru:**

| Route | Title | H1 |
|---|---|---|
| `/id/jasa-pembuatan-website-bali` | Jasa Pembuatan Website Bali \| Seawise Studio (45) | Jasa Pembuatan Website di Bali |
| `/id/jasa-pembuatan-aplikasi-bali` | Jasa Pembuatan Aplikasi Bali \| Seawise Studio (46) | Jasa Pembuatan Aplikasi di Bali |

Padanan `en` dibuat sekaligus (`/en/web-development-bali`,
`/en/app-development-bali`) supaya kontrak hreflang situs tidak pecah. Isi
halaman diambil dari materi yang sudah ada di `dictionaries.ts` dan
`artikel-4-jasa-pembuatan-aplikasi.md`, jadi tidak perlu menulis dari nol.

**Yang perlu disentuh:** key baru di `dictionaries.ts` untuk kedua locale, dua
route baru dengan `pageSeo()` dan `revalidate = 120`, entri di `app/sitemap.ts`,
serta tautan masuk dari `/layanan`, footer, dan homepage supaya halamannya tidak
lahir dalam keadaan yatim.

### 2. Section FAQ dengan `FAQPage` schema

**Peringatan jujur di depan.** Sejak Agustus 2023 Google **membatasi rich result
FAQ hanya untuk situs pemerintah dan kesehatan yang otoritatif**. Situs
komersial seperti Seawise hampir pasti **tidak** akan mendapat tampilan
akordeon di hasil pencarian. Siapa pun yang menjanjikan sebaliknya sedang
memakai informasi lama.

Manfaat yang masih nyata: struktur konten yang lebih baik, penargetan pencarian
berbentuk pertanyaan, dan keterbacaan oleh mesin jawaban seperti ChatGPT,
Perplexity, dan AI Overviews. Itu tetap berharga, hanya bukan karena rich result.

**Penempatan terbaik, berurutan:**

1. **`/id/layanan`**, halaman dengan niat beli tertinggi. Pertanyaan seputar
   harga, lama pengerjaan, kepemilikan kode, dan maintenance.
2. **Artikel blog `biaya-bikin-website`**: **bahannya sudah ada dan sudah
   ditulis**, empat tanya jawab di section "Pertanyaan yang sering diajukan".
   Saat ini tidak tayang karena masalah T-2. Ini keuntungan termurah di seluruh
   dokumen: perbaiki T-2, lalu bungkus dengan `FAQPage`.
3. **Landing page lokal** dari usulan nomor 1, begitu halamannya ada.

Saya sarankan **tidak** memasang FAQ di `/kontak`, karena halaman itu tugasnya
mengubah pengunjung jadi lead, bukan menahan mereka membaca.

### 3. `BreadcrumbList` schema

Dampak paling kecil dari ketiganya, tapi effort-nya juga paling kecil, dan
**breadcrumb masih benar-benar ditampilkan Google di hasil pencarian**, tidak
seperti FAQ.

Diterapkan di dua tempat:

```
Beranda › Portfolio › Industry Management [IMS]
Beranda › Blog › Biaya Bikin Website 2026
```

Cukup satu helper di `lib/seo.ts` yang menghasilkan node `BreadcrumbList`, lalu
dipakai di `app/[lang]/portfolio/[slug]/page.tsx` dan
`app/[lang]/blog/[slug]/page.tsx`. Idealnya sekalian menambahkan breadcrumb yang
terlihat di halaman, karena itu juga memperkuat tautan internal ke `/portfolio`
dan `/blog`.

---

## Urutan Pengerjaan yang Disarankan

| Urutan | Pekerjaan | Effort | Kenapa didahulukan |
|---|---|---|---|
| 1 | Perbaiki T-2, tempel ulang artikel dengan heading | 10 menit, tanpa kode | Termurah, dan membuka jalan untuk FAQ |
| 2 | Perbaiki T-1, `og:image` di `pageSeo()` | Satu fungsi | Memperbaiki 12 halaman sekaligus |
| 3 | Publikasikan 3 artikel sisa (S-5) | Tanpa kode | Konten sudah jadi, tinggal ditayangkan |
| 4 | Landing page lokal | Sedang | Dampak jangka panjang terbesar |
| 5 | Rapikan meta description (S-1, S-2, S-3) | Kecil | Menaikkan rasio klik |
| 6 | Perbaiki T-3, `og:image` halaman detail | Kecil | Preview WhatsApp halaman proyek |
| 7 | FAQ + `FAQPage` | Sedang | Setelah nomor 1 dan 4 beres |
| 8 | `BreadcrumbList` | Kecil | Pelengkap |
| 9 | Temuan R-1 sampai R-6 | Kecil | Penyempurnaan |

---

---

## Status Implementasi

Diperbarui setelah seluruh temuan dikerjakan. Diverifikasi ulang dari HTML hasil
build produksi.

| Temuan | Status | Bukti |
|---|---|---|
| T-1 `og:image` hilang | **Selesai** | `og:image` dan `twitter:image` kini ada di 9/9 halaman, kedua locale |
| T-2 artikel tanpa subjudul | **Perlu kamu** | Konten di database, butuh login admin. Langkah ada di `KONTEN-SIAP-TEMPEL.md` |
| T-3 `og:image` PNG raksasa | **Selesai** | 1622 KB turun ke 289 KB, terbesar kini 382 KB |
| S-1 description terlalu pendek | **Selesai** | 18/18 halaman kini di rentang 120-160 |
| S-2 description detail kelewat panjang | **Selesai** | 305 turun ke 147, 170 turun ke 152 |
| S-3 title artikel 89 karakter | **Sebagian** | Kode: 89 turun ke 72. Sisanya butuh judul di database dipendekkan |
| S-4 title tanpa kata kunci | **Selesai** | Kunci `seo.*` baru, teks yang terlihat tidak berubah |
| S-5 tiga artikel belum tayang | **Perlu kamu** | Butuh login admin |
| R-1 LCP tanpa `priority` | **Selesai** | `PortfolioGrid.tsx`, kartu pertama |
| R-2 AVIF belum aktif | **Selesai** | `next.config.mjs` |
| R-3 `ProfessionalService` tipis | **Sebagian** | `contactPoint` ditambah. `telephone` dan `sameAs` sengaja dikosongkan, tidak ada data terverifikasi |
| R-4 `publisher.logo` | **Selesai** | `BlogPosting` |
| R-5 tautan internal ke artikel | **Sebagian** | Landing page menautkan ke portfolio dan layanan |
| R-6 direktif `Host:` | **Selesai** | Dihapus dari `robots.ts` |
| Landing page lokal | **Selesai** | 4 halaman baru, 8 tautan masuk masing-masing, nol yatim |
| FAQ + `FAQPage` | **Selesai** | `/layanan` dan kedua landing page, 5 pertanyaan per halaman |
| `BreadcrumbList` | **Selesai** | Detail blog, detail portfolio, dan landing page |

`sitemap.xml` bertambah dari 26 ke 30 URL. `tsc` bersih, `next build` sukses.

### Sisa untuk kamu

1. `KONTEN-SIAP-TEMPEL.md`, langkah untuk T-2, S-5, dan S-3.
2. Cek `NEXT_PUBLIC_WHATSAPP_NUMBER` di Vercel. Nilai bawaannya
   `6281234567890` adalah nomor contoh, bukan nomor asli.
3. Kompres ulang screenshot PNG sebelum diunggah. Dua halaman detail masih
   menghasilkan preview 308 KB dan 382 KB, sedikit di atas ambang WhatsApp.
   Ini menyelesaikannya di sumber, sekaligus menghemat kuota Supabase.
4. Kalau nanti nomor telepon dan akun media sosial resmi sudah ada, kabari saya
   untuk melengkapi `telephone` dan `sameAs` di structured data.
