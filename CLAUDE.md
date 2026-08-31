# CLAUDE.md

Panduan kerja untuk Claude Code di repo Seawise Studio.
Next.js 14 App Router, TypeScript, Tailwind, Supabase. Studio pembuatan
aplikasi & website di Bali.

---

## Aturan wajib

1. **Situs bilingual.** Semua teks yang dilihat pengunjung ada di
   `lib/i18n/dictionaries.ts`. Objek `en` adalah sumber kebenaran, `id` wajib
   punya key yang sama. **Jangan hardcode teks di komponen publik.** Halaman
   admin berbahasa Indonesia saja dan boleh hardcode.

2. **Jangan pakai em-dash (—) di teks yang terlihat pengunjung**, termasuk alt
   text, placeholder, dan metadata. Ganti dengan koma, titik dua, atau pipe.
   Komentar kode dikecualikan. En-dash (–) untuk rentang angka boleh.

3. **Jangan pernah membuat testimoni, rating, angka statistik, atau logo klien
   fiktif.** Kalau data kosong, sembunyikan section-nya.

4. **Halaman publik pakai ISR** `export const revalidate = 120` dan membaca
   Supabase lewat client cookieless di `lib/supabase/public.ts`. Jangan diubah
   ke `force-dynamic`, itu merusak kecepatan. Saat ini 11 dari 11 halaman
   publik sudah patuh. Aturan ini **hanya untuk halaman**, bukan route handler:
   `app/api/revalidate/route.ts` memang `force-dynamic` karena harus membaca
   cookie sesi, dan itu benar.

5. **Canonical per halaman lewat helper di `lib/seo.ts`.** Halaman baru wajib
   memakainya, kalau tidak dia mewarisi canonical homepage.

6. **Verifikasi dengan `npx tsc --noEmit -p tsconfig.verify.json`.**
   `next build` bisa gagal di lingkungan tanpa akses Google Fonts, itu wajar
   dan bukan tanda kode rusak.

7. **Jangan menambah dependensi berbayar atau layanan yang butuh kartu kredit**
   tanpa memberi tahu dan menunggu persetujuan.

8. **Tampilan situs publik sudah final.** Jangan mengubah layout, warna, atau
   navigasi halaman publik kecuali diminta eksplisit. Admin bebas dikerjakan.

**Sebelum mengubah apa pun, baca dulu file terkait dan jelaskan rencananya.**

---

## Jebakan yang sudah pernah menggigit

Bagian ini bukan teori. Semuanya pernah jadi bug nyata di repo ini.

### `pageSeo()` wajib menyertakan `images`

Menyetel `openGraph` di sebuah halaman **menimpa** konvensi file
`app/opengraph-image.png` milik Next. Dulu `pageSeo()` tidak menyebut `images`,
akibatnya 12 halaman terkirim tanpa gambar preview sama sekali saat dibagikan
di WhatsApp. Kalau menambah metadata OG di mana pun, pastikan `images` ikut.

### `og:image` halaman detail: lebar 640, bukan 1200

Scraper sosial mengirim `Accept: */*`, jadi optimizer mengembalikan format
sumber. Screenshot di Supabase adalah PNG lossless, dan **parameter `q` tidak
berpengaruh sama sekali pada PNG.** Hanya lebar yang menggerakkan ukuran file.
640 menahan di bawah ambang preview WhatsApp (~300KB) sambil tetap melewati
minimum 600x315 milik Facebook. Lihat `ogImageUrl()` di `lib/seo.ts`.

### Edit admin "tidak muncul" padahal tersimpan

`revalidate = 120` berjalan dengan stale-while-revalidate. Setelah menyimpan di
admin, kunjungan **pertama** tetap dilayani HTML lama sambil Next meregenerasi
di latar belakang, baru kunjungan kedua yang segar. Di halaman sepi, header
balasannya `x-vercel-cache: STALE` dengan `age` besar, dan itu terbaca seperti
"edit saya hilang". Padahal datanya sudah masuk.

Karena itu ada `app/api/revalidate/route.ts`. Manager admin memanggilnya lewat
`revalidatePublicPages()` di `lib/revalidate.ts` sesudah setiap simpan dan
hapus, jadi cache dibersihkan saat itu juga. Autentikasinya memakai cookie sesi
Supabase yang sudah dipasang panel admin, **bukan** secret baru di environment.
Kalau menambah manager konten publik baru, panggil helper itu juga.

Route di `app/api/**` sengaja tidak kena middleware, lihat `matcher` di
`middleware.ts` yang mengecualikan `api`. Jangan hapus pengecualian itu, kalau
kena middleware route ini akan diredirect ke prefix locale dan mati.

### Halaman utama cuma memuat 3 portfolio featured

`app/[lang]/page.tsx` memakai `.slice(0, 3)`. Entry featured keempat dan
seterusnya tidak akan pernah tampil di halaman utama, hanya di `/portfolio`.
Ini sempat bikin bingung saat 4 entry ditandai featured. `PortfolioManager`
sekarang menampilkan peringatan kalau jumlah featured melewati batas itu.
Angkanya ada di `HOME_FEATURED_LIMIT`, samakan kalau `.slice()` diubah.

### `seo.*` terpisah dari `intro` yang terlihat

`dict.X.intro` dipakai ganda: sebagai paragraf pembuka yang tampil di halaman
**dan** dulu sebagai meta description. Memperpanjang description untuk SEO akan
mengubah tampilan publik, yang melanggar aturan 8. Karena itu ada objek
`dict.seo.*` terpisah. **Jangan digabung kembali.**

### Panjang array tidak diperiksa TypeScript

`const id: Dictionary` memaksa `id` punya semua key `en`, tapi array di-infer
sebagai `string[]`, jadi **jumlah elemen yang berbeda antar locale lolos
typecheck**. Kalau menambah atau menghapus item array, cek kedua locale manual.

### `AdminShell` ada di layout, bukan di halaman

`app/[lang]/admin/layout.tsx` yang merender `AdminShell`. Dulu setiap halaman
admin merender shell-nya sendiri, sehingga sidebar dan bottom bar dibongkar
pasang di setiap perpindahan menu dan panel terasa seperti reload.
**Jangan kembalikan `AdminShell` ke dalam file halaman.** Halaman admin
idealnya cukup tiga baris:

```tsx
import FinanceManager from "@/components/admin/FinanceManager";

export default function AdminFinancePage() {
  return <FinanceManager />;
}
```

Halaman login ikut dibungkus layout, jadi `AdminShell` punya pengecualian
internal untuk `/admin/login`, pola yang sama dipakai `SiteChrome`.

### Upload di admin harus pakai functional updater

Handler upload menulis balik ke state setelah `await`. Kalau memakai `editing`
dari closure, menutup modal saat upload berjalan akan **membuka modal itu
kembali** dengan data basi, dan upload galeri batch kedua menghapus batch
pertama. Selalu:

```tsx
setEditing((prev) => (prev ? { ...prev, cover_url: url } : prev));
```

### `env(safe-area-inset-*)` butuh `viewport-fit=cover`

Tanpa itu nilainya selalu 0 dan padding safe area jadi mubazir. Diset di
`app/[lang]/admin/layout.tsx`, **khusus segmen admin** supaya situs publik
tetap memakai viewport default Next.

### `/promo` sengaja `noindex`, jangan "diperbaiki"

`app/[lang]/promo/page.tsx` adalah landing page iklan berbayar dan memasang
`robots: { index: false, follow: true }` **dengan sengaja**. Halaman keyword
`jasa-pembuatan-website-bali` sudah ditulis untuk query yang sama, jadi kalau
halaman promo ikut diindeks keduanya berebut sinyal yang sama. Halaman ini cuma
kebagian trafik dari iklan, jadi dia melepas pencarian sepenuhnya.

Karena itu juga dia **tidak** ada di `app/sitemap.ts` dan **tidak** masuk
`disallow` di `app/robots.ts`. Menambah disallow justru bikin crawler tidak bisa
membaca `noindex`-nya sama sekali, dan itu cara klasik halaman tetap terindeks.

Dua hal lain di halaman ini yang kelihatan seperti kelalaian tapi bukan:

- **Hero-nya tidak dibungkus `Reveal`.** `Reveal` mulai dari `opacity: 0` dan
  menunggu framer-motion hidrasi plus IntersectionObserver. Di bawah lipatan itu
  tidak terasa, di layar pertama artinya headline dan CTA halaman yang dibayar
  per klik kosong sampai JavaScript jalan. Sisa halaman tetap pakai `Reveal`.
- **Tombol utamanya `bg-off-white`, bukan `bg-sea-foam`.** Di panel gelap,
  teks near-black di atas sea-foam cuma sekitar 4,4:1 sementara tombol outline
  di sebelahnya hampir 15:1, jadi pasangan brand-nya membuat CTA utama terbaca
  lebih lemah dari CTA sekunder. Warnanya masih dari palet yang sama.

Navbar disembunyikan lewat pengecualian `isPromo` di `SiteChrome`, pola yang
sama dengan admin. Footer tetap ada.

### Mail masuk `hello@seawise.id` lewat webhook, bukan mailbox

Sampai 31 Agustus 2026 domain ini **tidak punya MX yang berfungsi**: satu-satunya
record menunjuk balik ke A record-nya sendiri, yang isinya Vercel. Jadi setiap
email ke alamat yang dipajang di footer hilang tanpa jejak.

Sekarang Resend Inbound yang menerima, lalu `app/api/inbound/route.ts`
meneruskannya ke Gmail studio lewat `lib/inboundEmail.ts`. Yang gampang salah:

- Tanda tangan Svix diverifikasi terhadap **body mentah**. Kalau body dibaca
  sebagai JSON lalu diserialisasi ulang, urutan key berubah dan HMAC-nya tidak
  akan pernah cocok lagi. Karena itu `req.text()` dulu, `JSON.parse` belakangan.
- Tanpa `RESEND_INBOUND_SECRET` route ini menolak jalan sama sekali. Endpoint
  tanpa autentikasi yang bisa menyuruh Resend mengirim email itu open relay.
- Webhook `email.received` **hanya membawa metadata**. Body dan lampiran harus
  ditarik lewat `/emails/receiving/{id}` dan endpoint attachments-nya.
- Balasan 5xx berarti "kirim ulang webhooknya". Kegagalan sementara dijawab 503
  supaya Resend mengulang, kegagalan permanen dijawab 200 supaya berhenti.

### Ikon transparan hanya untuk tab, jangan untuk yang lain

`app/icon.png` dan `app/favicon.ico` sengaja berlatar transparan, dibangun dari
`public/SeaWise.png` yang memang sudah transparan. Yang **harus tetap buram**:

- `app/apple-icon.png`. iOS tidak menghormati alpha di ikon home screen, area
  transparan dirender **hitam**. Ikon Apple wajib punya latar solid.
- `public/icons/icon-maskable-512.png`. Ikon maskable memang harus penuh satu
  kanvas supaya Android bebas memotongnya jadi lingkaran atau squircle.
  Transparan justru membatalkan gunanya.

Kalau logonya diganti, bangun ulang dari sumber transparan lalu pasang kembali
latar `#FAFAF8` khusus untuk dua file di atas.

Catatan kontras: paus berwarna `#102820`, sangat gelap. Di tab browser bertema
gelap ikon transparan jadi nyaris tak terlihat. Solusi sebenarnya adalah
`app/icon.svg` dengan `prefers-color-scheme` supaya pausnya berganti terang,
tapi itu butuh logo versi vektor yang belum ada di repo.

### Pengaturan situs ada di tabel key/value

`site_settings` (migrasi v12) menyimpan saklar yang dibalik pemilik di
`/admin/pengaturan`. Sengaja key/value, jadi saklar baru cukup menambah satu
baris, bukan migrasi baru. jsonb yang tak bertipe berhenti di
`getSiteSettings()` di `lib/queries.ts`, yang memetakan key dikenal ke objek
bertipe dan mengabaikan sisanya.

**Setiap default harus sama dengan perilaku situs sebelum saklar itu ada.**
Default juga yang dipakai saat tabelnya hilang atau tak terbaca, jadi masalah
database tidak boleh diam-diam mencopot konten dari situs publik. Sudah diuji:
tanpa tabel v12, footer dan JSON-LD tetap menampilkan induk perusahaan.

`showParentOrg` mengendalikan dua hal sekaligus, baris "Part of" di footer dan
`parentOrganization` di JSON-LD. Jangan dipisah: menyembunyikan barisnya tapi
tetap mengirim datanya membuat halaman bercerita beda ke pengunjung dan ke
mesin pencari.

`getSiteSettings()` dibungkus `cache()` dari React karena footer dan
`StructuredData` sama-sama memanggilnya dalam satu render.

Konsekuensinya `Footer` dan `StructuredData` sekarang **async**. `Footer`
dioper sebagai prop ke `SiteChrome` yang client component, dan itu pola yang
didukung. Keduanya membaca lewat client cookieless, jadi halaman tetap statis
dan `revalidate = 120` tidak terganggu.

### Tidak ada fallback portfolio atau testimoni

Dulu ada baris placeholder untuk portfolio. Baris itu punya slug yang halaman
detailnya tidak ada, jadi setiap kartu menautkan ke 404 **dan slug palsu itu
masuk ke `sitemap.xml`**. Sekarang `getPortfolio()` mengembalikan array kosong
dan pemanggilnya menyembunyikan section. Jangan tambahkan fallback lagi. Untuk
mengisi database kosong, pakai `supabase-seed.sql`.

---

## Struktur

```
app/[lang]/              halaman publik, semua pakai revalidate = 120
app/[lang]/admin/        panel admin
  layout.tsx             AdminShell + viewport-fit=cover
  loading.tsx            skeleton saat navigasi
  pengaturan/            saklar situs, baca/tulis site_settings
app/[lang]/promo/        landing page iklan, noindex, di luar sitemap
app/api/revalidate/      purge cache ISR on-demand, dipanggil manager admin
app/api/inbound/         webhook Resend Inbound untuk mail ke @seawise.id
lib/revalidate.ts        helper pemanggil route di atas
lib/inboundEmail.ts      verifikasi Svix + teruskan mail masuk ke Gmail
components/              komponen publik (21)
components/admin/        komponen admin (12)
lib/i18n/dictionaries.ts seluruh teks publik, en sumber kebenaran
lib/seo.ts               canonical, hreflang, OG, breadcrumb
lib/queries.ts           baca Supabase untuk halaman publik
lib/supabase/public.ts   client cookieless, dipakai halaman publik
lib/supabase/client.ts   client browser, dipakai admin
middleware.ts            prefix locale + proteksi rute admin
```

### Menu admin

`components/admin/adminSections.ts` adalah **sumber tunggal** daftar menu.
Sidebar desktop dan bottom navigation mobile sama-sama membacanya. Tambah menu
cukup di satu tempat itu.

Bottom navigation mobile: 4 menu utama plus sheet "Lainnya" untuk sisanya,
diatur lewat `PRIMARY_SLUGS`.

### Lapisan z-index admin

| Lapisan | z |
|---|---|
| Top bar mobile, bottom nav | 30 |
| Sheet "Lainnya" | 40 |
| Modal editor manager | 50 |

Modal harus selalu di atas bottom nav supaya tombol Simpan tidak tertutup.

---

## Deploy

Produksi berjalan di Vercel project `seawise` dengan domain `www.seawise.id`,
terhubung ke GitHub `seawisecc/Seawise`. **Push ke `main` memicu deploy
produksi otomatis**, build sekitar 40 detik.

Jangan pakai `vercel --prod` dari lokal untuk alur harian. Perintah itu
mengunggah isi folder lokal apa adanya, termasuk perubahan yang belum
di-commit, sehingga kode di produksi bisa berbeda dari isi repo.

`DEPLOY.md` adalah panduan setup pertama kali, bukan alur harian, dan sudah
usang di satu titik berbahaya: dia menyuruh `rm -rf .git && git init`. **Jangan
jalankan itu sekarang**, repo ini sudah punya riwayat dan remote.

`vercel link` menaruh `VERCEL_OIDC_TOKEN` di `.env.local` dan menambah `.env*`
ke `.gitignore`. Keduanya wajar, bukan tanda ada yang rusak.

---

## Bilingual

- `en` sumber kebenaran, `Dictionary` di-infer darinya.
- Konten database bilingual lewat kolom `*_en`: bahasa Indonesia di kolom
  dasar, Inggris di kolom `*_en`. Kalau `*_en` kosong, `pickText()` di
  `lib/queries.ts` jatuh ke versi Indonesia, jadi terjemahan bisa bertahap.
- Berlaku untuk `portfolio`, `pricing`, `testimonials` (v8) dan `posts` (v9).
- Path route sama untuk kedua locale. `/en/layanan` dan `/id/layanan` memakai
  path Indonesia yang sama. Ikuti konvensi ini untuk halaman baru.

---

## Migrasi SQL

Jalankan berurutan, semua idempoten:

```
v1  tabel dasar: portfolio, testimonials, partners, leads + RLS
v2  pricing, transactions, project_type
v3  pricing.tagline
v4  posts
v5  portfolio: slug, body, gallery
v6  portfolio.mobile_url
v7  portfolio.cover_url
v8  kolom *_en: portfolio, pricing, testimonials
v9  kolom *_en: posts
v10 posts: author_name, author_title, author_title_en, updated_at
v11 leads: phone, source, landing_path + indeks created_at
v12 site_settings: tabel key/value untuk saklar di /admin/pengaturan
```

**v1 wajib duluan di database kosong**, karena v2 memakai
`alter table portfolio`.

Kalau menambah kolom di kode, pastikan ada migrasinya. Ada script verifikasi
di riwayat: bandingkan kolom di tipe TypeScript pada `lib/queries.ts` dengan
seluruh file `.sql`.

---

## Yang butuh keputusan pemilik, jangan diisi sendiri

- **`NEXT_PUBLIC_WHATSAPP_NUMBER`.** Nilai bawaan di `lib/contact.ts` adalah
  `6281234567890`, nomor contoh. Harus diisi di environment Vercel.
- **`priceRange`** di `components/StructuredData.tsx` sengaja dikosongkan. Itu
  klaim faktual tentang bisnis dan belum ada data terverifikasi. Jangan
  dikarang. `telephone` dan `sameAs` sudah diisi 20 Agustus 2026 atas
  konfirmasi pemilik: nomor WhatsApp bisnis dan Instagram `@seawise.id`,
  keduanya bersumber dari `lib/contact.ts`. Profil Bisnis Google menyusul ke
  `sameAs` pada 27 Agustus 2026, lihat `GOOGLE_BUSINESS_URL`.
- **`aggregateRating` tetap kosong.** Profil Google punya rating asli, tapi
  Google melarang markup ulasan yang memuji organisasi sendiri. Jangan tergoda
  memindahkan angka bintang dari GBP ke JSON-LD.
- **Link Google Bisnis wajib bentuk `?cid=`.** URL `/search?q=...&ved=...`,
  dan shortlink `share.google/...` bukan URL profil: yang pertama terikat sesi
  browser, yang kedua cuma redirector yang diselesaikan JavaScript. Google
  tidak membaca keduanya sebagai profil. Detailnya di komentar `lib/contact.ts`.
- **`RESEND_API_KEY`** di environment Vercel. Tanpa ini notifikasi lead di
  `lib/notifyLead.ts` dilewati diam-diam, form tetap jalan dan lead tetap
  tersimpan, cuma tidak ada email yang masuk. Opsional pendampingnya:
  `LEAD_NOTIFY_TO` dan `LEAD_NOTIFY_FROM`. Pengirim wajib memakai domain yang
  sudah terverifikasi di Resend, sekarang `send.seawise.id`.
- **`RESEND_INBOUND_SECRET`** di environment Vercel, diambil dari signing secret
  webhook di dashboard Resend. Tanpa ini `app/api/inbound` menolak semua request
  dan mail masuk tidak diteruskan. Perlu juga satu MX record `seawise.id` ke
  nilai yang diberikan Resend, dipasang di panel idcloudhost. Opsional
  pendampingnya: `INBOUND_FORWARD_TO` (default ikut `LEAD_NOTIFY_TO`) dan
  `INBOUND_FORWARD_FROM` (wajib domain terverifikasi di Resend).
- **Isi artikel blog** ada di tabel `posts` di Supabase, hanya bisa diubah lewat
  `/admin/blog` karena RLS. Lihat `KONTEN-SIAP-TEMPEL.md`.

---

## Dokumen lain

| File | Isi |
|---|---|
| `README.md` | setup, Supabase, admin panel, RLS |
| `DEPLOY.md` | setup Vercel pertama kali, bukan alur harian, lihat bagian Deploy |
| `SEO-AUDIT.md` | audit SEO teknis + status implementasi tiap temuan |
| `AEO-GEO.md` | sitasi mesin jawab: structured data, llms.txt, audit pembukaan halaman |
| `KONTEN-SIAP-TEMPEL.md` | langkah mengisi konten yang butuh login admin |
| `panduan-isi-portfolio-testimoni.md` | panduan mengisi portfolio & testimoni |
| `artikel-*.md` | naskah artikel blog siap tempel |
