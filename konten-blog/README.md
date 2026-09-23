# Konten blog

Naskah artikel `/blog`, dua bahasa. Yang tayang tetap isi tabel `posts` di
Supabase. Folder ini adalah naskah sumbernya, jadi kalau artikel diubah lewat
`/admin/blog`, samakan juga file di sini.

Menggantikan `artikel-1..4-*.md` di root repo, yang dihapus 11 September 2026.

## Kenapa `.txt` dan satu file per kotak isian

Keempat artikel pertama tayang berbulan-bulan **tanpa satu pun subjudul**.
Teksnya disalin dari tampilan preview Markdown, dan preview membuang tanda
`##`, `-`, dan `**`. Form tetap tersimpan, tidak ada error, dan halaman
artikelnya jadi satu dinding paragraf. Diperbaiki langsung di database pada
11 September 2026.

Dua keputusan yang menutup celah itu:

- **`.txt`, bukan `.md`.** Editor, Quick Look, dan aplikasi GitHub di HP
  merender `.md` jadi preview. `.txt` selalu tampil mentah, jadi yang tersalin
  pasti Markdown asli.
- **Isi file = isi satu kotak, seluruhnya.** File lama membuka dengan baris
  instruksi `# Cara pakai` yang tidak boleh ikut tersalin. Sekarang cukup
  Cmd+A, Cmd+C. Judul, slug, dan excerpt ada di `meta.json`.

Editor admin juga sekarang memberi peringatan kalau isi artikel panjang tidak
punya subjudul, lihat `components/admin/postContentWarnings.ts`.

## Pemetaan ke form admin

| Kotak di `/admin/blog` | Sumber |
|---|---|
| Judul, Slug, Ringkasan | `meta.json`: `title`, `slug`, `excerpt` |
| Isi artikel (Markdown) | `NN-slug.id.txt` |
| Judul (EN), Ringkasan (EN) | `meta.json`: `title_en`, `excerpt_en` |
| Isi artikel (EN, Markdown) | `NN-slug.en.txt` |

Batas yang dipakai: judul maksimal 60 karakter, excerpt maksimal 155, karena
excerpt dipakai langsung sebagai meta description.

## Status

| File | Kata kunci utama | Status |
|---|---|---|
| `01-biaya-bikin-website` | biaya bikin website | tayang |
| `02-aplikasi-apotek` | aplikasi apotek | tayang |
| `03-aplikasi-kasir-umkm` | aplikasi kasir UMKM | tayang |
| `04-jasa-pembuatan-aplikasi-custom` | jasa pembuatan aplikasi custom | tayang |
| `05-aplikasi-kasir-restoran` | aplikasi kasir restoran | tayang |
| `06-erp-manufaktur-pabrik-kecil` | ERP manufaktur | tayang |
| `07-aplikasi-stok-barang-toko-retail` | aplikasi stok barang | tayang |
| `08-website-villa-guesthouse-bali` | website villa Bali | draft di database, cover terpasang |
| `09-pemetaan-kebutuhan-aplikasi-custom` | pemetaan kebutuhan aplikasi | draft di database, cover terpasang |
| `10-website-custom-wordpress-atau-builder` | website custom vs WordPress | draft di database, cover terpasang |
| `11-laporan-sipnap-apotek-otomatis` | laporan SIPNAP apotek | draft di database, cover terpasang |
| `12-website-reservasi-restoran-bali` | website reservasi restoran Bali | draft di database, cover terpasang |

Artikel baru jangan ditayangkan sebelum punya cover, karena kartu blog tanpa
gambar akan tampil beda dari kartu lain. Unggah cover 16:9 lewat
`/admin/blog`, centang Published, simpan. Cover yang sama juga dipakai sebagai
cover carousel Instagram, lihat `konten-instagram/README.md`.

### Prompt cover

**Cover menggambarkan masalah yang dibahas artikel, bukan aplikasinya.**

Empat cover pertama semuanya layar aplikasi di atas meja rapi. Hasilnya
kartu-kartu di `/blog` sulit dibedakan, dan gambarnya tidak memberi alasan
untuk diklik. Orang mengklik karena mengenali masalahnya sendiri: kertas order
yang menumpuk saat ramai, rekap tutup yang tidak cocok, bahan kedaluwarsa di
belakang rak. Aplikasinya sudah muncul di dalam artikel lewat studi kasus.

Aturan supaya kartunya tetap terasa satu keluarga:

- **Satu momen masalah yang spesifik**, bukan suasana umum. "Kertas order
  menumpuk di rel dapur" lebih kuat daripada "dapur restoran sibuk".
- **Warna tetap dari palet brand**: off-white hangat, netral, aksen hijau hutan,
  cahaya hangat alami. Masalahnya boleh terasa tegang, warnanya jangan suram
  atau kebiruan.
- **Orang hanya tangan, dari belakang, atau buram karena gerak.** Wajah buatan
  AI gampang terlihat janggal, dan cover yang terasa seperti foto stok lebih
  buruk daripada cover tanpa orang.
- **Tanpa tulisan yang terbaca.** Nota dan label dibuat coretan tak terbaca atau
  kosong. Teks rusak buatan AI langsung terlihat palsu.
- **Tidak ada layar aplikasi.**

Tulis prompt dalam bahasa Inggris, generator gambar lebih patuh begitu. Setiap
artikel punya dua konsep, pilih yang hasilnya paling kuat. Tempelkan blok gaya
di akhir setiap prompt.

**Blok gaya, sama untuk semua cover:**

```
Cinematic editorial photography, 35mm lens, natural warm light, muted color grade with warm off-white, soft neutrals and deep forest-green accents, shallow depth of field, realistic textures, no faces visible, no readable text, no logos, no brand names, 16:9 landscape.
```

**05, aplikasi kasir restoran. Konsep A, rel dapur saat jam ramai:**

```
Close-up of a stainless steel kitchen pass rail in a busy restaurant during dinner rush, crowded with dozens of handwritten paper order tickets clipped in a messy overlapping row, a few tickets curled and one fallen onto the counter next to a plate of food waiting under a warm heat lamp. A cook's hand reaches in from the edge of the frame to grab a ticket. Behind, kitchen staff in dark green aprons move in motion blur, steam rising, copper pans. Scribbled tickets are illegible.
```

**05, konsep B, rekap tutup yang tidak cocok:**

```
A small cafe after closing time, late evening. On a wooden table under a single warm pendant light: an open cash drawer with banknotes, a long crumpled receipt roll, a calculator, a notebook with messy handwritten tallies and crossed-out numbers, a cold half-finished coffee in an off-white ceramic cup. A hand holds a pen, paused over the notebook. In the soft background, chairs stacked on tables and a dark green tiled wall. Quiet, tired mood. All writing illegible.
```

**06, ERP manufaktur. Konsep A, spreadsheet di lantai produksi:**

```
A workbench in a small cosmetics and fragrance production room covered with printed spreadsheet pages, some with coffee rings and handwritten corrections, colorful sticky notes, a clipboard with a stock count sheet, a pencil, and a digital scale. Amber glass bottles and white ingredient containers sit among the papers. A hand flips through the pages searching for a number. In the soft background, a stainless steel mixing tank and dark forest-green metal shelving. All printed and handwritten text illegible.
```

**06, konsep B, lot kedaluwarsa yang terlewat:**

```
Close-up of a dark forest-green metal shelf in a small production warehouse lined with white ingredient containers and amber glass jars. A hand pulls out one dusty container from the very back row, its small blank lot tag yellowed with age, while newer containers stand neatly in front. Soft daylight from a side window, fine dust in the light beam. Tags and labels blank or illegible.
```

**02, aplikasi apotek. Konsep A, stok opname di laci obat:**

```
Inside a small community pharmacy, a tall wall of pull-out medicine drawers, several drawers left open showing jumbled blister packs and small medicine boxes. In the foreground a pharmacist's hand holds a clipboard with a handwritten stock count sheet full of tally marks and corrections, while the other hand counts boxes inside an open drawer. White coat sleeve visible, face out of frame. Soft daylight from the pharmacy front window, dark forest-green drawer fronts with brass handles. All labels and handwriting illegible.
```

**02, konsep B, resep dan laporan manual, flat lay:**

```
Top-down flat lay of a white pharmacy back-office counter at the end of the day: a thick stack of paper prescription slips held with a black binder clip, an open hardcover ledger with dense handwritten columns, a rubber stamp and ink pad, a few loose blister packs and small medicine boxes, a pen, reading glasses and a dark green pharmacy tray. One hand rests on the ledger turning a page. Warm late-afternoon light casting long soft shadows. All handwriting, labels and prescriptions illegible.
```

**03, aplikasi kasir UMKM. Konsep A, nota tulis tangan:**

```
Close-up at the counter of a small Indonesian retail shop. A shopkeeper's hand writes a sale by hand in a small carbon-copy receipt book, next to a metal receipt spike stacked with torn handwritten receipts and a worn calculator. On the other side, a customer's hand waits holding folded banknotes. Behind, softly blurred shelves of neatly stacked goods, dark green painted wooden shelving, warm afternoon light through the shop front. All handwriting illegible.
```

**03, konsep B, kaleng biskuit jadi kas:**

```
Eye-level still life on a glass display counter of a small shop: an old round metal biscuit tin used as a cash box, lid off, stuffed with crumpled banknotes, coins and rubber-banded handwritten receipts. Next to it a school exercise book open to hand-ruled columns of sales figures with crossed-out totals, a pencil and a calculator. Warm daylight, softly blurred shelves of goods and a dark green wall behind. Nostalgic, honest mood. No brand markings on the tin, all writing illegible.
```

**07, aplikasi stok barang. Konsep A, celah di rak toko:**

```
Eye-level view along a single aisle shelf in a small tidy retail shop. The shelf is neatly stocked with rows of identical plain amber and frosted glass bottles, except for one conspicuous empty gap in the middle row where a product should be, a small blank price tag still clipped under the empty space. A hand holding a clipboard with a handwritten stock count sheet hovers at the edge of the frame, pen paused. Soft afternoon daylight from the shop window, warm off-white walls, dark forest-green painted wooden shelving. All labels and handwriting blank or illegible.
```

**07, konsep B, barang mati di gudang belakang:**

```
A small cramped storeroom at the back of a retail shop, seen from the doorway. Unopened cardboard boxes stacked high against the wall, the lower ones faded and dusty, one box open showing unsold products still wrapped. A single beam of warm light from a high window falls across the stack, fine dust in the air. On a folding table in the foreground, a clipboard with a stock count sheet and a pen. Dark forest-green metal door frame, warm neutral tones. All labels and writing illegible.
```

Pilih konsep A untuk 07. Konsep B terlalu mirip komposisi rak dengan berkas
cahaya milik 06, dan A satu-satunya yang memakai "celah kosong" sebagai
pusat gambar.

**Kombinasi yang disarankan.** Semua masalah di artikel ini pada dasarnya
"catatan manual", jadi kalau konsepnya dipilih sembarangan, keempat kartu bisa
sama-sama tangan memegang kertas. Kombinasi ini memberi empat komposisi yang
berbeda:

| Artikel | Konsep | Komposisi |
|---|---|---|
| 02 apotek | B | flat lay dari atas |
| 03 kasir UMKM | B | still life sejajar mata, satu objek ikonik |
| 05 kasir restoran | A | close-up penuh gerak |
| 06 ERP manufaktur | B | detail rak dengan berkas cahaya |

Artikel 01 dan 04 topiknya umum, bukan satu industri, jadi flat lay laptopnya
boleh dipertahankan.

**Negative prompt**, kalau generatornya menyediakan kolom ini:

```
readable text, letters, numbers, watermark, logo, brand name, faces, smiling people, stock photo pose, laptop screen, tablet screen, app interface, neon colors, blue color cast, harsh flash, cartoon, illustration, 3d render, extra fingers, deformed hands
```

- Midjourney: tambahkan `--ar 16:9 --style raw` di akhir prompt.
- ChatGPT atau Gemini: tempel prompt beserta blok gaya, lalu minta "landscape 16:9".
- Kalau jari atau tangan tampil janggal, generate ulang. Tangan adalah titik
  lemah generator gambar, dan di cover ukurannya cukup besar untuk kelihatan.

**Ekspor sebagai JPG, jangan PNG**, di lebar sekitar 1600px dan ukuran di bawah
300KB. Cover dipakai juga sebagai `og:image`, dan PNG lossless tidak ikut
mengecil lewat parameter kualitas, lihat jebakan `og:image` di `CLAUDE.md`.

## Aturan menulis

- **Satu paragraf = satu baris.** `renderMarkdown()` memakai `breaks: true`,
  jadi baris yang dipatahkan di tengah paragraf akan tampil sebagai patahan
  baris di halaman.
- **Jangan pakai `# `.** Judul artikel sudah dirender sebagai `<h1>`. Mulai
  subjudul dari `##`.
- **Tautan internal ikut locale.** Versi `id` menaut ke `/id/...`, versi `en`
  ke `/en/...`. Setiap artikel minimal menaut ke satu landing page Bali dan
  satu studi kasus portfolio yang relevan.
- **Jangan menaut ke artikel yang masih draft.** Hasilnya 404 sampai artikel
  itu tayang. Setelah 05 dan 06 tayang, boleh tambahkan tautan ke keduanya
  dari 03 dan 04.
- **Tanpa em-dash**, sama seperti aturan teks publik lain.
- **Angka milik Seawise harus sama dengan halaman layanan.** Artikel 01 menyebut
  maintenance Rp1,8 juta per tahun dan durasi 3–5 / 5–10 / 10–14 hari. Kalau
  harga di `/admin/pricing` atau FAQ di dictionary berubah, ubah artikelnya juga.
- **Angka contoh diberi label "angka ilustrasi".** Artikel 05 dan 06 memuat
  contoh hitung HPP. Itu contoh, bukan data klien, dan labelnya jangan dihapus.

## Urutan artikel berikutnya

Dua artikel per bulan, satu kata kunci utama per artikel. Jangan membuat artikel
yang kata kuncinya sama dengan landing page `jasa-pembuatan-website-bali` atau
`jasa-pembuatan-aplikasi-bali`, cukup tautkan ke sana.

1. ~~Aplikasi stok barang untuk toko retail~~, sudah ditulis sebagai 07.
2. Website villa dan guesthouse di Bali: booking langsung tanpa komisi OTA.
3. Biaya pembuatan aplikasi custom: apa yang menentukan harganya.
4. Website custom, WordPress, atau website builder.
5. Laporan SIPNAP apotek: apa yang dilaporkan dan cara menyiapkannya, tautkan ke Sehatera.
6. Website restoran dan beach club di Bali: menu, reservasi, Google Maps.
