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
| `05-aplikasi-kasir-restoran` | aplikasi kasir restoran | **draft**, butuh cover |
| `06-erp-manufaktur-pabrik-kecil` | ERP manufaktur | **draft**, butuh cover |

Dua draft sengaja belum tayang karena belum punya cover, dan kartu blog tanpa
gambar akan tampil beda dari kartu lain. Unggah cover 16:9 lewat
`/admin/blog`, centang Published, simpan.

### Prompt cover

Cover yang sudah ada punya dua keluarga. Artikel topik industri (apotek, kasir)
memakai **foto sejajar mata**: meja marmer putih dengan panel depan kayu hijau
bergaris vertikal, tablet di stand hijau gelap, tanaman kecil di pot putih
bergaris, rak hijau hutan dengan lampu LED hangat, bayangan daun dari jendela.
Artikel topik umum (biaya website, aplikasi custom) memakai flat lay laptop di
meja krem. Artikel 05 dan 06 masuk keluarga pertama.

Tulis prompt dalam bahasa Inggris, generator gambar lebih patuh begitu.

**05, aplikasi kasir restoran:**

```
Eye-level editorial photograph of a modern cafe counter. A white marble countertop with a fluted dark forest-green wood panel front. On the counter, a sleek tablet on a dark green stand shows a minimal point-of-sale screen: a clean grid of table tiles and a short order list, soft green accents, no readable text. Beside it a small white ribbed ceramic pot with a green plant and two matte off-white ceramic coffee cups. In the softly blurred background, a dark green tiled wall with a warm-lit kitchen pass window and a small kitchen display screen, an espresso machine and wooden shelves with glass jars under warm LED strip lighting. Soft morning sunlight with gentle leaf shadows on the wall. Off-white, warm neutral and deep forest-green palette, calm premium mood, shallow depth of field, lots of empty space on the left side, no people, no text, no logos, no brand names. 16:9.
```

**06, ERP manufaktur pabrik kecil:**

```
Eye-level editorial photograph of a small, clean production room of a boutique cosmetics and fragrance manufacturer. A white marble workbench with a fluted dark forest-green wood panel front. On the bench, a sleek tablet on a dark green stand shows a minimal inventory dashboard: a simple bar chart, a donut chart and a tidy table of stock lots with soft green accents, no readable text. Next to it a small white ribbed ceramic pot with a green plant, a digital scale and a few amber glass bottles. In the softly blurred background, dark forest-green metal shelving holds neatly arranged white ingredient containers and amber bottles with small blank lot tags, lit by warm LED strip lighting. Soft daylight from a side window casting gentle leaf shadows. Off-white, warm neutral and deep forest-green palette, calm premium mood, shallow depth of field, lots of empty space on the left side, no people, no text, no logos, no brand names. 16:9.
```

**Negative prompt**, kalau generatornya menyediakan kolom ini:

```
text, letters, numbers, watermark, logo, brand name, people, hands, clutter, neon colors, blue tones, harsh flash, cartoon, illustration, 3d render look, distorted screen, warped tablet
```

- Midjourney: tambahkan `--ar 16:9 --style raw` di akhir prompt.
- ChatGPT atau Gemini: tempel prompt apa adanya, lalu minta "landscape 16:9".
- Tulisan di layar yang tampil acak, ulangi generate saja. Jangan dibiarkan,
  karena teks rusak di mockup langsung terlihat palsu.

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

1. Aplikasi stok barang untuk toko retail, tautkan ke TokoKu.
2. Website villa dan guesthouse di Bali: booking langsung tanpa komisi OTA.
3. Biaya pembuatan aplikasi custom: apa yang menentukan harganya.
4. Website custom, WordPress, atau website builder.
5. Laporan SIPNAP apotek: apa yang dilaporkan dan cara menyiapkannya, tautkan ke Sehatera.
6. Website restoran dan beach club di Bali: menu, reservasi, Google Maps.
