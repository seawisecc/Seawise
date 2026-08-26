# Prompt untuk Claude Code — Seawise Studio

Buka Terminal, `cd` ke folder proyek, jalankan `claude`, lalu tempel prompt di bawah.
Kerjakan **satu tugas per sesi**, jangan semua sekaligus. Hasilnya jauh lebih rapi.

---

## Konteks (tempel di awal sesi mana pun)

```
Ini proyek Next.js 14 App Router + TypeScript + Tailwind + Supabase untuk
Seawise Studio, studio pembuatan aplikasi & website di Bali.

Hal penting yang harus kamu patuhi:

1. Situs bilingual. Semua teks tampil ada di lib/i18n/dictionaries.ts,
   objek `en` adalah sumber kebenaran dan `id` wajib punya key yang sama.
   Jangan pernah hardcode teks di komponen publik.
   Halaman admin berbahasa Indonesia saja, boleh hardcode di sana.
2. JANGAN pernah pakai karakter em-dash (—) di teks yang terlihat pengunjung,
   termasuk alt text. Ganti dengan koma, titik dua, atau tanda pipa.
3. JANGAN membuat testimoni, rating, angka statistik, atau logo klien fiktif.
   Kalau data kosong, sembunyikan section-nya.
4. Halaman publik pakai ISR `export const revalidate = 120` dan membaca
   Supabase lewat client cookieless di lib/supabase/public.ts. Jangan diubah
   ke force-dynamic, itu merusak kecepatan.
5. Canonical per halaman diatur lewat helper di lib/seo.ts. Halaman baru
   wajib memakainya, kalau tidak dia akan mewarisi canonical homepage.
6. Verifikasi dengan `npx tsc --noEmit -p tsconfig.verify.json`.
   `next build` akan gagal di lingkungan tanpa akses Google Fonts, itu wajar.
7. Jangan menambahkan dependensi berbayar atau layanan yang butuh kartu kredit
   tanpa memberi tahu saya dulu dan menunggu persetujuan.
8. Tampilan situs publik sudah final dan saya sukai. Jangan mengubah layout,
   warna, atau navigasi halaman publik kecuali saya minta secara eksplisit.

Sebelum mengubah apa pun, baca dulu file terkait dan jelaskan rencanamu.
```

---

## Tugas 1 — Sapuan bug menyeluruh

```
Lakukan audit bug menyeluruh pada proyek ini. Jangan perbaiki apa pun dulu,
laporkan temuan lebih dahulu dengan prioritas tinggi/sedang/rendah.

Periksa hal berikut:
- Jalankan npx tsc --noEmit -p tsconfig.verify.json dan laporkan error.
- Cari key yang ada di objek `en` tapi hilang di `id` pada dictionaries.ts,
  dan sebaliknya.
- Cari em-dash (—) pada teks yang terlihat pengunjung termasuk alt text,
  placeholder, dan metadata. Abaikan komentar kode.
- Cari halaman yang generateMetadata-nya tidak memakai helper lib/seo.ts
  sehingga canonical-nya salah mewarisi homepage.
- Cari komponen yang bisa crash saat data Supabase kosong atau null,
  misalnya .map pada nilai null atau akses properti tanpa guard.
- Cari <Image> tanpa sizes atau alt, dan tautan eksternal tanpa
  rel="noopener noreferrer".
- Cari state React yang tidak sinkron saat modal admin dibuka lalu ditutup.
- Periksa apakah semua kolom yang dipakai di kode benar-benar ada di file
  migrasi SQL v2 sampai v8, terutama kolom baru mobile_url, cover_url,
  dan seluruh kolom berakhiran _en.

Setelah saya setujui temuannya, baru perbaiki satu per satu.
```

---

## Tugas 2 — Audit SEO teknis

```
Lakukan audit SEO teknis pada proyek ini dan buat laporan dalam
file SEO-AUDIT.md. Fokus pada hal yang bisa diverifikasi dari kode,
bukan tebakan.

Periksa:
- Canonical dan hreflang tiap halaman, pastikan tidak ada yang menunjuk
  ke URL yang salah.
- app/sitemap.ts, apakah semua halaman publik tercakup.
- app/robots.ts.
- Structured data JSON-LD: validitas tipe schema.org yang dipakai
  (ProfessionalService, WebSite, BlogPosting, CreativeWork).
  Pastikan tidak ada aggregateRating atau review palsu.
- Struktur heading tiap halaman, pastikan hanya ada satu <h1>.
- Title dan meta description tiap halaman, apakah unik dan panjangnya
  wajar (title di bawah 60 karakter, description 120 sampai 160).
- Open Graph per halaman, apakah masih memakai teks homepage.
- Internal linking, halaman mana yang yatim tanpa tautan masuk.
- Ukuran dan format gambar, apakah ada yang memperlambat LCP.

Lalu usulkan, dengan urutan dampak terbesar:
- Section FAQ dengan FAQPage schema, di halaman mana yang paling tepat.
- Landing page lokal untuk kata kunci "jasa pembuatan website Bali"
  dan "jasa pembuatan aplikasi Bali".
- BreadcrumbList schema.
Jangan implementasikan dulu, tunggu persetujuan saya.
```

---

## Tugas 3 — Statistik kunjungan di halaman admin

```
Tambahkan pencatatan kunjungan sederhana yang hasilnya tampil di halaman admin.
Syarat mutlak: gratis, tanpa layanan pihak ketiga berbayar, tanpa cookie,
dan tidak memperlambat halaman publik.

Rancangan yang saya inginkan:

1. Migrasi SQL baru supabase-migration-v9.sql, tabel `page_views` berisi
   id, path, locale, referrer, device, created_at.
   Sertakan index pada created_at dan path. RLS: publik boleh insert saja,
   hanya user terautentikasi yang boleh select.

2. Komponen client ringan yang mencatat satu baris saat halaman publik dibuka.
   Pasang di SiteChrome agar hanya jalan di halaman publik, bukan di admin.
   Jangan mencatat jika user-agent terindikasi bot.
   Gunakan navigator.sendBeacon atau fetch dengan keepalive supaya tidak
   menahan rendering.

3. Halaman admin baru /admin/traffic plus kartu ringkasan di dashboard:
   - Total kunjungan hari ini, 7 hari, 30 hari
   - Grafik batang kunjungan harian 30 hari terakhir
   - Tabel halaman terpopuler
   - Tabel sumber rujukan terbanyak
   - Perbandingan perangkat mobile dan desktop
   Pakai SVG buatan sendiri seperti grafik di FinanceManager, jangan
   menambah library chart.

4. Tambahkan menu "Traffic" di AdminShell, ikut pola ikon yang sudah ada
   di AdminIcons.tsx, dan pastikan rapi di mobile.

Jelaskan dulu rencanamu dan keterbatasan pendekatan ini sebelum menulis kode.
```

---

## Tugas 4 — Bottom navigation untuk HALAMAN ADMIN di mobile

```
PENTING: tugas ini HANYA untuk halaman admin (/[lang]/admin/...).
Navigasi situs publik sudah final, jangan disentuh sama sekali.

Saat ini AdminShell memakai top bar dengan tombol hamburger dan drawer
yang menggeser dari samping. Di HP ini kurang nyaman. Ganti menjadi
bottom navigation bar yang menempel di bawah layar, supaya terasa
seperti aplikasi.

Ketentuan:
- Hanya di bawah breakpoint md. Di desktop, sidebar kiri yang sekarang
  tetap dipakai apa adanya tanpa perubahan.
- Menu admin ada 8: Dashboard, Keuangan, Portfolio, Price List, Testimoni,
  Partner, Blog, Pesan Masuk. Terlalu banyak untuk bottom bar.
  Tampilkan 4 yang paling sering dipakai (usulkan mana menurutmu, saya kira
  Dashboard, Keuangan, Portfolio, Pesan Masuk), lalu item kelima berupa
  "Lainnya" yang membuka bottom sheet berisi sisa menu.
- Item aktif diberi penanda jelas, pakai usePathname.
- Ikon garis tipis konsisten dengan AdminIcons.tsx yang sudah ada.
  Kalau perlu ikon baru, tambahkan di file yang sama, jangan pakai
  library ikon.
- Gaya menyesuaikan admin sekarang: latar putih, border halus di atas,
  aksen sea-foam untuk item aktif.
- Wajib aman terhadap safe area iPhone, pakai
  padding-bottom: env(safe-area-inset-bottom).
- Beri padding bawah pada area konten admin supaya bagian akhir halaman
  dan tombol Simpan tidak tertutup bottom bar.
- Modal editor di admin harus tetap bisa di-scroll penuh dan tombol
  aksinya tidak tertutup bottom bar. Cek ini di PortfolioManager,
  PricingManager, PostManager, TestimonialManager, PartnerManager.
- Top bar mobile boleh disederhanakan menjadi logo plus judul halaman saja,
  karena menu sudah pindah ke bawah. Hapus tombol hamburger dan drawer-nya
  kalau memang sudah tidak terpakai, jangan tinggalkan kode mati.

Tunjukkan rencana dan struktur komponennya sebelum menulis kode.
```

---

## Tugas 5 — Rapikan dashboard admin di tampilan HP

```
PENTING: hanya halaman admin, jangan sentuh situs publik.

Di HP, halaman Dashboard dan Keuangan terlalu longgar. Kartu-kartunya
terlalu besar, banyak ruang kosong terbuang, dan saya harus scroll jauh
untuk melihat informasi yang sedikit. Rapikan supaya padat dan enak dibaca.

Yang saya inginkan:
- Di mobile, kartu statistik jadi 2 kolom per baris, bukan 1 kolom
  menumpuk ke bawah. Gunakan grid-cols-2 lalu naik bertahap di
  breakpoint sm, md, dan lg.
- Kecilkan padding kartu di mobile, misalnya p-4 di mobile dan p-6 ke atas
  di desktop. Sekarang padding desktop dipakai juga di HP.
- Kecilkan ukuran font angka besar di mobile, tapi tetap jelas terbaca.
  Pakai pola text-2xl di mobile lalu md:text-3xl.
- Kartu hero saldo di DashboardOverview terlalu tinggi di HP. Padatkan,
  dan susun blok uang masuk serta uang keluar berdampingan 2 kolom,
  jangan menumpuk.
- Di FinanceManager, kartu ringkasan uang masuk, uang keluar, dan saldo
  juga dipadatkan. Saldo boleh tetap selebar penuh karena paling penting,
  dua lainnya berdampingan.
- Grafik tren bulanan di FinanceManager, pastikan tidak gepeng di layar
  sempit. Kurangi tinggi di mobile dan pastikan label bulan tidak
  bertumpuk. Kalau perlu, tampilkan lebih sedikit bulan di mobile.
- Form tambah transaksi di FinanceManager sekarang 6 kolom di desktop.
  Di mobile pastikan tiap input selebar penuh dan jaraknya tidak boros.
- Tabel yang scroll horizontal biarkan seperti sekarang, itu sudah benar.

Aturan: jangan mengubah tampilan desktop sama sekali, hanya perbaiki
breakpoint mobile. Setelah selesai, jelaskan bagian mana saja yang berubah
supaya saya bisa cek satu per satu di HP.
```

---

## Tugas 6 — Verifikasi favicon untuk Google Search

```
Favicon situs belum muncul di hasil pencarian Google, masih ikon bola dunia
generik. Saya ingin kamu memverifikasi tidak ada yang salah secara teknis,
lalu melakukan pengerasan seperlunya.

Konteks yang sudah saya pastikan sendiri, jangan diubah tanpa alasan kuat:
- app/icon.png sudah 512x512 persegi
- app/favicon.ico sudah berisi ukuran 48, 32, dan 16
- app/apple-icon.png sudah 180x180
- robots.txt tidak memblokir file ikon
- apex seawise.id sudah redirect ke www.seawise.id
Menurut dokumentasi Google, semua syarat sudah terpenuhi, jadi kemungkinan
besar ini soal waktu. Jangan mengarang perbaikan yang tidak perlu.

Yang saya minta:

1. Verifikasi HTML yang benar-benar dihasilkan. Jalankan dev server, ambil
   HTML homepage, dan laporkan persis tag <link rel="icon"> apa saja yang
   muncul, beserta href, sizes, dan type-nya. Konfirmasi tiap URL itu
   benar-benar bisa diakses dan mengembalikan status 200 dengan
   content-type gambar yang benar.

2. Periksa rantai redirect dari https://seawise.id sampai halaman final.
   Laporkan berapa kali hop. Google mencari favicon pada homepage situs,
   jadi rantai yang terlalu panjang berpotensi menyulitkan. Kalau ada hop
   yang bisa dipangkas lewat konfigurasi Vercel atau middleware, usulkan,
   tapi jangan langsung terapkan.

3. Periksa apakah ikon terbaca saat dikecilkan ke 16x16. Logo paus yang
   terlalu detail akan jadi gumpalan tidak jelas di hasil pencarian.
   Render ikon pada ukuran 16, 32, dan 48 lalu laporkan penilaianmu.
   Kalau memang tidak terbaca, usulkan versi yang disederhanakan,
   tapi JANGAN ganti filenya sebelum saya setujui. Alasannya: Google
   mensyaratkan URL favicon stabil, dan Next.js mengubah hash URL setiap
   file ikon berubah, sehingga setiap penggantian mengulang proses dari nol.

4. Periksa apakah ikon punya latar transparan. Google menampilkan favicon
   di atas latar terang maupun gelap. Kalau paus berwarna gelap di atas
   latar transparan, dia akan hilang di mode gelap. Laporkan temuanmu dan
   usulkan solusinya, misalnya latar solid berbentuk lingkaran atau kotak
   membulat.

5. Terpisah dari favicon: pastikan JSON-LD Organization atau
   ProfessionalService di komponen StructuredData sudah punya properti
   `logo` berisi URL absolut ke gambar logo. Ini tidak memengaruhi favicon,
   tapi membantu Google mengenali logo brand. Tambahkan kalau belum ada.

Tutup dengan laporan singkat: mana yang benar-benar bermasalah, mana yang
sudah benar dan hanya perlu ditunggu.
```

---

## Tugas 7 — AEO dan GEO, optimasi untuk AI dan mesin jawaban

```
Saya ingin situs ini lebih mungkin dikutip oleh AI Overviews Google,
Perplexity, ChatGPT, dan asisten AI lain saat orang bertanya soal jasa
pembuatan website atau aplikasi bisnis di Indonesia.

Saya paham sebagian besar faktornya ada di luar kode, yaitu sebutan di situs
lain dan otoritas brand. Fokus tugas ini hanya bagian teknis di dalam kode.
Jangan menjanjikan hasil, kerjakan saja yang memang bisa dikerjakan.

Kerjakan bertahap, tunjukkan rencana dulu:

1. FAQ dengan schema. Tambahkan section FAQ di halaman /layanan,
   /jasa-pembuatan-website-bali, dan /jasa-pembuatan-aplikasi-bali,
   lengkap dengan JSON-LD FAQPage. Pertanyaannya harus yang benar-benar
   ditanyakan calon klien, misalnya berapa biaya bikin website company
   profile, berapa lama pengerjaannya, apakah bisa update sendiri,
   apakah termasuk domain dan hosting, apa bedanya website dengan aplikasi,
   apakah melayani luar Bali. Jawaban harus langsung dan konkret,
   sertakan angka nyata. Simpan teksnya di dictionaries.ts untuk en dan id.
   PENTING: jawaban harus jujur dan sesuai kenyataan bisnis saya.
   Kalau kamu tidak tahu jawabannya, tanyakan ke saya, jangan mengarang.

2. Struktur jawab-duluan. Periksa 200 kata pertama tiap halaman utama dan
   tiap artikel blog. Sistem AI menilai relevansi dari bagian pembuka.
   Pastikan pembuka langsung menjawab pertanyaan inti halaman itu, bukan
   basa-basi. Laporkan halaman mana yang pembukanya bertele-tele dan
   usulkan perbaikan, jangan langsung ubah teksnya.

3. Data konkret yang mudah dikutip. AI cenderung mengutip angka dan tabel.
   Pastikan tabel perbandingan paket harga berupa HTML tabel atau daftar
   semantik yang benar, bukan gambar dan bukan div polos. Periksa juga
   halaman studi kasus portfolio, apakah ada angka hasil yang bisa dikutip.

4. Schema yang lengkap. Audit komponen StructuredData:
   - Organization atau ProfessionalService dengan logo, alamat, areaServed,
     dan sameAs berisi tautan profil resmi
   - Service untuk tiap layanan utama
   - FAQPage dari poin 1
   - BreadcrumbList, helper breadcrumbJsonLd sudah ada di lib/seo.ts,
     pastikan benar-benar dipakai di halaman detail
   Validasi mental terhadap spesifikasi schema.org, jangan menambahkan
   properti karangan. Sekali lagi, JANGAN tambahkan aggregateRating
   atau review.

5. Sinyal keahlian. Pastikan artikel blog punya penulis yang jelas dengan
   schema Person, dan tanggal terbit serta tanggal pembaruan yang benar.
   Kalau kolomnya belum ada di tabel posts, buat migrasi SQL baru dan
   field-nya di PostManager.

6. Akses crawler AI. Periksa app/robots.ts. Saat ini semua crawler
   diizinkan dan itu memang yang saya mau, karena saya ingin dikutip AI.
   Konfirmasi tidak ada yang tanpa sengaja memblokir GPTBot, PerplexityBot,
   ClaudeBot, atau Google-Extended.

7. llms.txt. Jelaskan dulu ke saya secara jujur: ini standar usulan yang
   adopsinya belum terbukti luas. Kalau menurutmu biayanya murah dan
   risikonya nol, buatkan file llms.txt berisi ringkasan singkat tentang
   Seawise Studio, daftar layanan, kisaran harga, dan tautan halaman utama.
   Kalau menurutmu mubazir, katakan saja, saya tidak keberatan.

Setelah selesai, buat ringkasan di file AEO-GEO.md berisi apa yang sudah
dikerjakan dan apa yang harus saya kerjakan sendiri di luar kode.
```

---

## Catatan cara pakai

- Urutan yang saya sarankan: Tugas 1, lalu 5, lalu 4, lalu 6, lalu 3, lalu 2.
  Tugas 5 paling cepat terasa manfaatnya, Tugas 2 paling panjang.
  Sebagian Tugas 2 mungkin sudah dikerjakan (landing page Bali sudah live),
  jadi minta Claude Code memeriksa dulu apa yang sudah ada.
- Setiap selesai satu tugas: jalankan `npx tsc --noEmit -p tsconfig.verify.json`,
  cek di `npm run dev`, baru commit.
- Kalau Claude Code menawarkan menambah dependensi baru, tanya dulu kenapa
  dan apakah ada cara tanpa itu.
- Perintah berguna di dalam sesi: `/clear` untuk memulai konteks baru antar
  tugas, dan `/init` kalau ingin dibuatkan file CLAUDE.md berisi konteks
  proyek supaya tidak perlu menempel blok konteks berulang kali.
