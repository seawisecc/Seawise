# AEO / GEO

Catatan pengerjaan sisi teknis supaya situs ini lebih mudah dibaca dan dikutip
mesin jawab (AI Overviews, Perplexity, ChatGPT, Claude).

**Peringatan yang perlu dibaca duluan.** Tidak ada satu pun hal di dokumen ini
yang menjamin situs ini akan dikutip. Faktor terbesar sitasi AI ada di luar
kode: seberapa sering nama Seawise disebut di situs lain, direktori, forum, dan
media. Yang bisa dikerjakan di dalam repo hanyalah memastikan mesin tidak salah
paham dan tidak kehilangan informasi. Itu saja yang dikerjakan di sini.

---

## Sudah dikerjakan

### FAQ

FAQ dan `FAQPage` JSON-LD sebenarnya sudah ada sebelum tugas ini, di ketiga
halaman. Yang ditambahkan sekarang, di `lib/i18n/dictionaries.ts`, dua bahasa:

| Halaman | Perubahan | Jumlah akhir |
|---|---|---|
| `/layanan` | Jawaban durasi diganti dengan angka nyata. Ditambah "apakah termasuk domain dan hosting" dan "apa bedanya website dengan aplikasi" | 5 → 7 |
| `/jasa-pembuatan-website-bali` | Ditambah "berapa lama pengerjaan websitenya" | 5 → 6 |
| `/jasa-pembuatan-aplikasi-bali` | Ditambah "apa bedanya website dengan aplikasi" | 5 → 6 |

Yang paling berarti: jawaban durasi yang dulu berbunyi "tergantung cakupan"
sekarang memuat angka, **Shore 3–5 hari, Reef 5–10 hari, Current 10–14 hari**,
dan Trench jujur disebut tergantung kerumitan permintaan karena memang begitu
kenyataannya. Jawaban tanpa angka praktis tidak pernah dikutip mesin jawab.

Jawaban domain dan hosting memakai kalimat yang **sudah lebih dulu terbit** di
landing page website, jadi tidak ada klaim baru yang dibuat. Kalimat itu masih
belum memuat angka, lihat bagian "Masih menunggu jawabanmu".

Panjang array `en` dan `id` diperiksa manual dan cocok (7/6/6 di kedua locale).
Ini penting karena, sesuai catatan di `CLAUDE.md`, TypeScript **tidak**
memeriksa jumlah elemen array antar locale.

### Penulis artikel dan tanggal pembaruan

`supabase-migration-v10.sql` menambah `author_name`, `author_title`,
`author_title_en`, dan `updated_at` di tabel `posts`, lalu mengisi artikel yang
sudah terbit supaya tidak ada yang tanpa penulis.

| Perubahan | File |
|---|---|
| Kolom penulis dan tanggal pembaruan | `supabase-migration-v10.sql` |
| Field Penulis, Jabatan, dan Jabatan (EN) di editor artikel | `components/admin/PostManager.tsx` |
| `updated_at` ditulis otomatis tiap kali artikel disimpan | `components/admin/PostManager.tsx` |
| Nilai bawaan untuk artikel baru, supaya tidak perlu diketik ulang | `lib/author.ts` |
| `author` jadi `Person` dengan `jobTitle` dan `worksFor`, `dateModified` dari `updated_at` | `app/[lang]/blog/[slug]/page.tsx` |
| Byline yang terlihat pembaca, satu baris dengan tanggal terbit | `app/[lang]/blog/[slug]/page.tsx` |
| `lastModified` di sitemap memakai `updated_at` lebih dulu | `app/sitemap.ts` |

Byline dipasang atas persetujuan pemilik. Alasannya: panduan Google soal E-E-A-T
menyebut informasi penulis sebaiknya terlihat pengunjung, bukan hanya ada di
markup, jadi `Person` di JSON-LD saja hanya memberi sebagian manfaatnya. Ini
satu-satunya perubahan tampilan halaman publik dalam pekerjaan ini.

Dua keputusan yang sengaja diambil:

- **Artikel tanpa penulis jatuh kembali ke `Organization`**, bukan memakai nama
  bawaan diam-diam. Yang terbit ke JSON-LD selalu isi kolom di barisnya, jadi
  apa yang tersimpan sama dengan apa yang diklaim.
- **`dateModified` jatuh ke tanggal terbit** untuk artikel lama yang belum
  pernah disunting. Mengaku sebuah artikel baru diperbarui padahal tidak lebih
  buruk daripada tidak menampilkan tanggal pembaruan sama sekali.

`lib/author.ts` bukan sumber kebenaran, hanya mengisi form artikel baru. Ganti
penulis per artikel lewat `/admin/blog` kalau suatu saat ada penulis tamu.

### Structured data

| Perubahan | File |
|---|---|
| Komponen `<JsonLd>` menggantikan blok `<script dangerouslySetInnerHTML>` yang tersebar di 6 file | `components/JsonLd.tsx` |
| `AREA_SERVED` dan `STUDIO_ID` jadi satu sumber, dipakai bersama node sitewide dan semua node `Service` | `lib/seo.ts`, `components/StructuredData.tsx` |
| 4 node `Service` di `/layanan`, satu per layanan di `servicesList`, masing-masing `provider` menunjuk ke `@id` studio | `lib/seo.ts` (`servicesJsonLd`) |
| `hasOfferCatalog` berisi 4 paket website nyata, lengkap dengan `PriceSpecification` dalam IDR | `lib/seo.ts` |
| Node `Service` di kedua landing page, nama dan deskripsi diambil dari dictionary | `lib/seo.ts` (`serviceJsonLd`) |
| `BreadcrumbList` ditambahkan di 6 halaman yang belum punya | `/layanan`, `/portfolio`, `/blog`, `/tentang`, `/kontak`, `/testimoni` |

Sesuai permintaan, **tidak ada `aggregateRating` dan tidak ada `review`**
di mana pun. `sameAs` juga sengaja masih kosong, lihat bagian "Tugas kamu".

Sebaran akhir per halaman, hasil pemeriksaan pada server yang berjalan:

| Halaman | Node |
|---|---|
| `/` | ProfessionalService, WebSite |
| `/layanan` | + FAQPage, 4× Service (satu dengan OfferCatalog), BreadcrumbList |
| `/jasa-pembuatan-website-bali` | + FAQPage, Service, BreadcrumbList |
| `/jasa-pembuatan-aplikasi-bali` | + FAQPage, Service, BreadcrumbList |
| `/portfolio`, `/testimoni`, `/blog`, `/tentang`, `/kontak` | + BreadcrumbList |
| `/blog/[slug]` | + BlogPosting, BreadcrumbList |
| `/portfolio/[slug]` | + CreativeWork, BreadcrumbList |

Homepage sengaja tanpa breadcrumb, karena breadcrumb satu item tidak berarti apa-apa.

### Parser harga

`parsePriceIDR()` di `lib/seo.ts` mengubah harga yang ditulis manusia menjadi
angka rupiah untuk `PriceSpecification`. Dia menangani format yang benar-benar
dipakai: `Rp 2.000.000` di tabel Supabase, serta `Rp2M` dan `Rp3,5–4 juta` di
dictionary fallback, termasuk rentang.

Parser ini **sengaja ketat**. Kalau formatnya tidak dikenali, hasilnya `null`
dan harga dihilangkan sama sekali dari JSON-LD, bukan ditebak. Harga bisa kamu
ubah bebas dari admin, dan angka salah di structured data adalah klaim palsu
tentang bisnismu. Lebih baik tidak ada harga daripada harga keliru.

Diuji dengan 16 kasus, termasuk yang harus ditolak (`Rp 15.00.000`,
`Hubungi kami`, rentang terbalik). Semua lolos.

### Tabel di artikel, bug yang selama ini diam

`lib/markdown.ts` sejak awal memakai `gfm: true`, artinya tabel Markdown memang
diparse jadi `<table>` betulan. Tapi `app/globals.css` **tidak punya satu pun
aturan `.article table`**, dan preflight Tailwind menghapus border bawaan
browser. Jadi kalau kamu menempel tabel perbandingan di artikel, hasilnya
deretan teks tanpa garis sama sekali.

Ini penting untuk AEO karena tabel adalah format yang paling sering dikutip
mesin jawab. Sekarang sudah ada gayanya, dan `renderMarkdown()` membungkus tiap
tabel dengan `<div class="table-wrap">` yang bisa digeser sendiri, supaya tabel
lebar tidak membuat seluruh halaman bergeser di HP.

**Artinya sekarang kamu sudah bisa menempel tabel Markdown di artikel.** Contoh:

```markdown
| Paket | Harga | Admin panel |
|---|---|---|
| Shore | Rp 2.000.000 | Tidak |
| Reef | Rp 3.500.000 | Ya |
```

### Akses crawler AI, hasil pemeriksaan

Diperiksa dan **tidak ada yang memblokir crawler AI**, sesuai yang kamu mau:

- `app/robots.ts` cuma punya satu rule, `User-Agent: *` dengan `Allow: /`.
  Tidak ada entri terpisah untuk GPTBot, PerplexityBot, ClaudeBot, CCBot,
  Google-Extended, atau lainnya. Yang di-disallow hanya `/en/admin`,
  `/id/admin`, dan `/api`, dan itu memang benar.
- `middleware.ts` tidak membaca user-agent sama sekali, jadi tidak ada
  penyaringan bot di sana.
- `next.config.mjs` tidak menyetel header `X-Robots-Tag`, dan tidak ada
  `vercel.json` yang bisa menyelipkannya.
- Tidak ada `noindex` di halaman publik mana pun.

Satu hal yang diperbaiki: `app/[lang]/layout.tsx` dulu menaruh
`max-image-preview: large` **hanya di dalam `googleBot`**, sedangkan aturan
umum cuma `index, follow`. Efeknya semua crawler selain Googlebot, termasuk
mesin jawab, jatuh ke batas kutipan bawaan yang pendek. Sekarang aturan umum
berbunyi:

```
index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1
```

`max-snippet:-1` artinya tidak ada batas panjang kutipan.

### llms.txt

Dibuat di `app/llms.txt/route.ts`, bisa diakses di `/llms.txt`.

**Penilaian jujur, ini sengaja ditulis supaya kamu tidak salah harap.** llms.txt
adalah usulan dari September 2024. Sampai sekarang tidak ada satu pun penyedia
besar (OpenAI, Anthropic, Google, Perplexity) yang menyatakan secara resmi
membaca file ini untuk sitasi. John Mueller dari Google pernah menyamakannya
dengan meta keywords, tag yang dulu ramai lalu diabaikan total. **Jangan
berharap file ini menghasilkan apa pun.** Dia dibuat semata karena ongkos
gagalnya nol: satu route, tanpa dependensi, tanpa risiko.

Dibuat sebagai route, bukan file statis di `public/`, supaya daftar paket dan
harganya diambil dari Supabase lewat `getPricing()`. Salinan statis akan diam-diam
basi begitu kamu mengubah harga di admin, dan harga basi di sini adalah klaim
yang salah. Isinya: ringkasan studio, 4 layanan, 4 paket beserta harga dan
fitur, catatan bahwa aplikasi dihitung per proyek, FAQ, dan tautan halaman utama.
Semua diambil dari dictionary dan database, tidak ada yang ditulis ulang manual.

---

## Poin 2: audit pembukaan halaman, laporan saja

Diminta laporan tanpa mengubah teks, jadi **tidak ada teks yang saya ubah di
bagian ini.** Semua di bawah adalah usulan yang menunggu keputusanmu.

Alasan ini penting: mesin jawab menilai relevansi dari bagian pembuka. Kalau
120 kata pertama isinya slogan, halaman itu kalah dari halaman lain yang
langsung menjawab, walaupun isi lengkapnya lebih bagus.

### Yang sudah bagus, tidak perlu diapa-apakan

| Halaman | Kenapa bagus |
|---|---|
| `/jasa-pembuatan-website-bali` | Pembuka langsung menyebut company profile, landing page, website custom, Bali, seluruh Indonesia, dan admin panel. Persis menjawab pertanyaan intinya. |
| `/jasa-pembuatan-aplikasi-bali` | Sama kuatnya: ERP, kasir, aplikasi bisnis, Bali, seluruh Indonesia, migrasi spreadsheet. |
| `/kontak` | "Diskusi pertama gratis. Isi formulir di bawah, atau email langsung ke hello@seawise.id." Faktual, langsung, mudah dikutip. |
| Artikel `biaya-bikin-website` | **Ini contoh terbaik di seluruh situs.** Kalimat pertama mengulang pertanyaannya, lalu angka nyata muncul sekitar kata ke-70: Rp2 juta, Rp3,5–4 juta, Rp4,5–5 juta, Rp6 juta ke atas, tiap angka dengan penjelasan siapa yang cocok. Tiru pola ini untuk artikel berikutnya. |

### Yang bertele-tele, diurutkan dari yang paling merugikan

**1. `/layanan`, paling parah.**

Sekarang: judul "Empat cara kami membantu bisnismu berjalan lebih rapi",
pembuka "Setiap layanan dibangun dari alur kerja tim kamu, bukan template yang
dipaksakan."

Masalahnya: nol informasi. "Empat cara" tidak memberi tahu empat apa. Pertanyaan
inti halaman ini adalah "layanan apa saja dan berapa harganya", dan angka Rp2
juta baru muncul jauh di bawah, di `webIntro`. Halaman terpenting untuk kueri
komersial justru pembukanya paling kosong.

Usulan `services.intro`: sebut empat layanannya dan harga awalnya.
Misalnya, "Kami mengerjakan empat hal: ERP custom, aplikasi UMKM, migrasi dari
spreadsheet, dan pembuatan website. Paket website mulai Rp2 juta, aplikasi
dihitung per proyek."

**2. Homepage.**

Sekarang: "Sistem yang benar-benar dipakai orang, bukan cuma di-deploy" lalu
"Kami membangun ERP dan aplikasi custom lintas industri, dari sistem enterprise
sampai aplikasi untuk usaha kecil yang sedang tumbuh."

Masalahnya: kata "website" dan kata "Bali" **tidak muncul sama sekali** di
sekitar 60 kata pertama. Untuk kueri "jasa pembuatan website di Indonesia",
halaman depan tidak memberi sinyal apa pun bahwa studio ini mengerjakan website
dan berlokasi di Bali. Sloganya bagus untuk manusia, tapi tidak memberi tahu
mesin apa pun yang bisa dicocokkan.

Usulan `hero.subtitle`: sisipkan kata website dan lokasi. Judulnya biarkan,
itu identitas brand.

**3. `/tentang`.**

Sekarang: "Seawise adalah Systems & Software Studio. Kami membangun ERP dan
aplikasi custom lintas industri..."

Masalahnya: tidak menyebut Bali, tidak menyebut sejak kapan. Halaman "tentang"
adalah tempat pertama yang dilihat mesin saat menjawab "siapa Seawise Studio",
dan justru dua fakta entitas paling dasar tidak ada di situ.

Usulan: tambahkan lokasi dan tahun berdiri di `about.intro`. **Tahun berdirinya
harus kamu yang beri**, tidak saya karang.

**4. Artikel `aplikasi-apotek`.**

Sekarang dua kalimat pertama membangun suasana: "Mengelola apotek berarti
berpacu dengan dua hal sekaligus..." lalu langsung lompat ke "Tanda apotek Anda
perlu aplikasi".

Masalahnya: **tidak ada satu kalimat pun yang mendefinisikan apa itu aplikasi
apotek.** Untuk kueri "apa itu aplikasi apotek" atau "fitur aplikasi apotek",
tidak ada kalimat yang bisa dipetik utuh sebagai jawaban.

Usulan: sisipkan satu kalimat definisi setelah kalimat pertama, misalnya
"Aplikasi apotek adalah sistem yang menggabungkan kasir, pencatatan resep, dan
pelacakan stok per batch beserta tanggal kadaluarsanya dalam satu tempat."
Sesudah itu baru masuk ke tanda-tandanya.

**5. `/portfolio`, kecil.** Pembukanya sudah menjawab ("setiap proyek menaut
langsung ke aplikasi yang hidup"), tapi tidak menyebut berapa banyak dan
industri apa saja. Menambahkan "lima sistem di manufaktur, apotek, restoran,
retail, dan parfum" akan memberi mesin sesuatu yang konkret.

**6. `/blog`, kecil.** "Panduan praktis dan wawasan dari pekerjaan kami
membangun sistem custom." Generik, tapi halaman indeks blog jarang jadi sumber
jawaban. Prioritas paling rendah.

### Catatan konsistensi, di luar daftar tapi layak dibereskan

Artikel 1 memakai sapaan **"kamu"**, artikel 2 memakai **"Anda"**. Dictionary
publik konsisten memakai "kamu". Sebaiknya disamakan.

---

## Masih menunggu jawabanmu

Tiga jawaban FAQ masih tanpa angka, karena butuh fakta yang hanya kamu tahu.
Saya tidak mengarang jawaban soal bisnismu.

| Pertanyaan | Yang saya butuhkan |
|---|---|
| Berapa lama pengerjaan aplikasi custom | Tercepat dan terlama yang pernah nyata. Sekarang halaman aplikasi tidak punya pertanyaan durasi sama sekali |
| Berapa biaya aplikasi custom | Angka "mulai dari", kalau memang ada. Sekarang jawabannya "dihitung per proyek" tanpa satu angka pun |
| Domain dan hosting | Termasuk paket atau terpisah, untuk berapa lama, kisaran biaya per tahun. Jawaban yang terbit sekarang jujur tapi masih kabur |

Ketiganya hanya soal teks di `lib/i18n/dictionaries.ts`, tidak ada kode yang
perlu diubah. Begitu angkanya ada, tinggal tempel.

---

## Tugas kamu, di luar kode

Diurutkan dari yang paling berdampak.

### 0. Jalankan ulang `supabase-migration-v10.sql`

Migrasi ini **sudah dijalankan** dan kolomnya sudah terisi. Tapi versi awal file
ini mengisi `author_title_en` dengan `'Founder, Seawise Studio'`, dan koma di
dalamnya membuat byline halaman Inggris terbaca **"Agus Yulyastrawan, Founder,
Seawise Studio"**, koma dobel, karena byline sudah menyisipkan komanya sendiri
setelah nama. Versi Indonesia tidak terkena.

Filenya sudah diperbaiki dan sekarang memuat satu baris `update` khusus untuk
membereskan baris yang sudah terlanjur terisi. **Jalankan ulang file itu**,
aman diulang dan tidak ada data yang hilang. Alternatifnya, ubah field
"Jabatan penulis (EN)" di `/admin/blog` untuk kedua artikel.

Catatan urutan untuk deploy berikutnya di lingkungan lain: migrasi dijalankan
**sebelum** deploy. Halaman publik aman entah kolomnya sudah ada atau belum
(`author` cuma tetap `Organization`), tapi `PostManager` selalu menulis
`updated_at` saat menyimpan, jadi menyimpan artikel akan gagal selama kolomnya
belum ada.

### 1. Angka hasil di studi kasus portfolio

**Ini yang paling ampuh dan paling mendesak.** Kelima studi kasus punya bagian
"Hasil", dan **tidak satu pun memuat angka**. Semuanya kualitatif: "rekap
selesai otomatis", "stok terpantau", "keputusan lebih terarah".

Mesin jawab mengutip angka. "Sistem apotek memangkas waktu rekap laporan SIPNAP
dari 3 jam jadi 10 menit" adalah kalimat yang bisa dikutip. "Laporan tersedia
dalam hitungan detik" tidak, karena tidak bisa dibandingkan dengan apa pun.

Isi lewat `/admin/portfolio`, bagian "Hasil" di kolom body. Hanya angka yang
benar-benar terjadi dan bisa kamu pertanggungjawabkan kalau ditanya klien.
Kalau kamu tidak punya angkanya, tanyakan ke klien yang bersangkutan, jangan
diperkirakan.

### 2. `sameAs` di structured data

Masih kosong di `components/StructuredData.tsx`. Ini yang menghubungkan situs
ke identitas brand di tempat lain, dan justru bagian yang paling berpengaruh ke
sitasi AI. Kirim URL profil resmi yang aktif: Instagram, LinkedIn, GitHub,
Google Business Profile. Kirim yang ada saja. Kosong lebih baik daripada salah.

### 3. Google Business Profile

Belum ada tandanya di repo. Untuk kueri lokal ("jasa pembuatan website Bali")
ini bobotnya besar dan gratis. Setelah terverifikasi, URL-nya masuk ke `sameAs`.

### 4. `telephone` dan `priceRange`

Masih sengaja kosong di `StructuredData.tsx`, sesuai aturan di `CLAUDE.md`.
`priceRange` sekarang sebenarnya sudah bisa diisi jujur karena harganya publik,
misalnya `"Rp2.000.000 - Rp7.000.000"`. Bilang saja kalau mau saya isikan.

### 5. `NEXT_PUBLIC_WHATSAPP_NUMBER`

Masih memakai nilai contoh `6281234567890` di `lib/contact.ts`. Harus diisi di
environment Vercel. Ini bukan soal AEO, tapi setiap pengunjung yang menekan
tombol WhatsApp sekarang jatuh ke nomor yang salah.

### 6. Dua ketidakkonsistenan kecil di data

- **`price_note_en` kosong** di tabel `pricing`, jadi halaman Inggris dan
  `/llms.txt` menampilkan "/ proyek" alih-alih "/ project". Isi lewat
  `/admin/pricing`.
- **"Rp2M" di dictionary Inggris.** Bagi pembaca Inggris "M" berarti million
  dan itu benar, tapi bagi pembaca Indonesia "M" berarti miliar. Karena ini
  hanya muncul di locale `en`, secara teknis tidak salah. Kalau mau lebih aman,
  ganti jadi "Rp2 million". Terserah kamu.

### 7. Yang benar-benar menggerakkan sitasi AI

Semua di atas hanya membuat situs mudah dibaca. Yang membuatnya **dikutip**
adalah nama Seawise disebut di tempat lain: direktori bisnis lokal, profil di
platform freelance, jawaban di forum, liputan media lokal, studi kasus yang
dipublikasikan klien. Tidak ada baris kode yang bisa menggantikan itu.

---

## Verifikasi

```bash
npx tsc --noEmit -p tsconfig.verify.json    # lolos
```

Selain typecheck, semua di atas diperiksa pada server yang benar-benar berjalan:
JSON-LD di 10 halaman diambil dan diparse, harga di `PriceSpecification`
dicocokkan dengan baris Supabase, meta robots dan `/robots.txt` dibaca langsung,
`/llms.txt` diambil, dan aturan `.article table` dipastikan ikut terkirim di
bundle CSS produksi.

Sesudah migrasi v10 dijalankan, diperiksa ulang: `author` sudah berupa `Person`
dengan `jobTitle` dan `worksFor` di kedua locale, byline tampil di halaman
artikel, dan `sitemap.xml` mengeluarkan 32 URL dengan `lastmod` yang mengikuti
`updated_at`.

Dua hal yang **belum** bisa diverifikasi terhadap data nyata, jadi jangan
dianggap teruji:

- **`dateModified` yang benar-benar berbeda dari `datePublished`.** Kedua
  artikel belum pernah disunting sejak kolomnya ada, jadi nilainya masih sama.
  Baru terbukti setelah kamu menyunting satu artikel lewat `/admin/blog`.
- **Tabel Markdown di artikel sungguhan.** Gaya CSS dan pembungkusnya sudah
  diuji terhadap keluaran `marked` dan dipastikan terkirim di bundle, tapi
  belum ada artikel yang benar-benar memuat tabel.

`next build` bisa gagal di lingkungan tanpa akses Google Fonts. Itu wajar dan
bukan tanda kode rusak, sesuai catatan di `CLAUDE.md`.
