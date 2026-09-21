# Prompt gambar untuk konten berikutnya

Stok foto untuk carousel Instagram setelah 19 Oktober 2026, dan sebagian
sekaligus jadi cover artikel blog berikutnya. Generate di ChatGPT atau Gemini,
simpan di `foto-ai/` dengan **nama file persis seperti judul tiap prompt**
(misalnya `foto-ai/villa-double-booking.jpg`). Nama itu yang dicari
`render.py`.

## Cara pakai

1. Salin satu prompt, lalu tempelkan **blok gaya** di belakangnya.
2. Minta rasio **landscape 3:2**. Rasio ini pas untuk cover IG (foto utuh di
   atas, judul di panel gelap di bawah) dan juga untuk cover blog.
3. Kalau tangan atau jari terlihat janggal, generate ulang. Tangan adalah titik
   lemah generator gambar, dan di cover ukurannya cukup besar untuk kelihatan.
4. Simpan sebagai JPG di `foto-ai/`, lebar sekitar 1500px.

Tidak harus semua. Satu foto sudah menambah satu post.

## Aturan supaya senada dengan foto yang sudah ada

Sama dengan aturan cover blog di `konten-blog/README.md`:

- **Satu momen masalah yang spesifik**, bukan suasana umum.
- **Orang hanya tangan, dari belakang, atau buram karena gerak.** Wajah buatan
  AI gampang terlihat janggal.
- **Tanpa tulisan yang terbaca** dan **tanpa layar aplikasi.**
- **Palet brand:** off-white hangat, netral, aksen hijau hutan, cahaya alami.

**Blok gaya, tempel di akhir setiap prompt:**

```
Cinematic editorial photography, 35mm lens, natural warm light, muted color grade with warm off-white, soft neutrals and deep forest-green accents, shallow depth of field, realistic textures, no faces visible, no readable text, no logos, no brand names, 3:2 landscape.
```

**Negative prompt**, kalau generatornya menyediakan kolom ini:

```
readable text, letters, numbers, watermark, logo, brand name, faces, smiling people, stock photo pose, laptop screen, tablet screen, app interface, neon colors, blue color cast, harsh flash, cartoon, illustration, 3d render, extra fingers, deformed hands
```

---

## A. Topik artikel berikutnya

Urutannya mengikuti antrean di `konten-blog/README.md`. Foto yang sama dipakai
untuk cover artikel dan post IG-nya.

### `villa-double-booking`
Artikel dan post: website villa dan guesthouse, booking langsung tanpa komisi OTA.
```
The open-air reception desk of a small Balinese guesthouse in the late afternoon. On the carved wooden counter: an open hardcover booking ledger with two overlapping handwritten entries on the same line, a pencil, a ringing phone face down, and two identical brass room keys on one hook. In the soft background, two sets of travel luggage wait side by side at the entrance under a frangipani tree. Dark forest-green painted shutters, stone floor, warm tropical light. All handwriting illegible.
```

### `aplikasi-custom-pemetaan`
Artikel dan post: biaya pembuatan aplikasi custom, apa yang menentukan harganya.
```
Top-down view of a wooden meeting table in a bright studio. A large sheet of paper covered with a hand-drawn process map: boxes, arrows, and rows of pastel sticky notes, some crossed out and moved. Two pairs of hands work on it, one placing a sticky note, one pointing with a pen. Around the sheet: two cups of coffee, a dark green notebook, a pencil case. Warm morning daylight. All handwriting and notes illegible.
```

### `website-pilihan-fondasi`
Artikel dan post: website custom, WordPress, atau website builder.
```
A designer's desk against a warm off-white wall. Printed website page layouts are pinned to a cork board in three separate columns, one column neat and consistent, one cluttered with many overlapping printouts and tangled string, one nearly empty. A hand pins a new printout into the neat column. On the desk below: a dark green notebook, a ruler, a cup of tea. Soft side daylight. All printed text illegible.
```

### `sipnap-akhir-bulan`
Artikel dan post: laporan SIPNAP apotek.
```
Top-down flat lay of a white pharmacy back-office counter at the end of the month: a thick stack of paper prescription slips held with a black binder clip, an open hardcover ledger with dense handwritten columns, a rubber stamp and ink pad, a few loose blister packs and small medicine boxes, a pen, reading glasses and a dark green pharmacy tray. One hand rests on the ledger turning a page. Warm late-afternoon light casting long soft shadows. All handwriting, labels and prescriptions illegible.
```

### `beach-club-reservasi`
Artikel dan post: website restoran dan beach club di Bali.
```
A beach club terrace in Bali at golden hour, seen from behind the host stand. On the wooden stand: an open paper reservation book crowded with handwritten names and crossed-out times, a pen, and a small blank table number card. Beyond, softly blurred, lounge daybeds with dark green cushions, palm trees and a bright sunset sea. A staff member's hand flips a page in a hurry. All handwriting illegible.
```

---

## B. Post tips dan edukasi

### `kasir-jam-ramai`
Post: kenapa kasir lambat saat ramai, dan kasir yang bisa scan atau cari produk cepat.
```
Eye-level view across the counter of a busy small cafe during the morning rush. In the foreground, a cashier's hands count coins from a small open cash drawer next to a paper order pad. Behind the counter, a queue of customers in soft motion blur, seen only from the shoulders down. Espresso machine steam, dark green tiled wall, warm pendant lights. All writing illegible.
```

### `nota-hilang-basah`
Post: risiko catatan di kertas, data yang aman di sistem.
```
Close-up of a small shop counter after a sudden rain leak. A handwritten sales notebook lies open, its pages soaked and the ink running, next to a pile of damp crumpled paper receipts. A hand lifts one dripping page carefully. A few raindrops on the dark green painted counter, warm light from a bare bulb. All handwriting illegible and smudged.
```

### `faktur-supplier-menumpuk`
Post: hutang supplier dan faktur yang tercecer.
```
A small store back office desk. A metal receipt spike overloaded with supplier invoices, more invoices stacked in a tray and tucked under a stapler, a calculator, and a wall calendar with circled dates softly blurred behind. A hand pulls one invoice from the middle of the stack. Dark forest-green filing cabinet, warm desk lamp light. All printed text illegible.
```

### `banyak-cabang`
Post: pemilik dengan beberapa cabang yang angkanya tersebar.
```
Still life on a wooden desk: three different sets of shop keys on separate key rings, each resting on its own small handwritten notebook, plus a phone face down and a cup of coffee. A hand reaches for one of the notebooks. Warm evening lamp light, dark green leather desk pad, soft neutral background. All handwriting illegible.
```

### `stok-kedaluwarsa-rak`
Post: bahan atau produk kedaluwarsa yang terlewat di rak belakang.
```
Close-up of a dark forest-green metal shelf in a small store room lined with plain white containers and amber glass jars. A hand pulls out one dusty container from the very back row, its small blank tag yellowed with age, while newer containers stand neatly in front. Soft daylight from a side window, fine dust in the light beam. Tags and labels blank or illegible.
```

---

## C. Post tentang Seawise

Sebaiknya diganti foto asli di `foto-asli/` kalau ada, karena foto AI tentang
"kami" terasa kurang jujur. Pakai ini hanya kalau foto asli belum ada.

### `studio-sketsa`
Post: di balik layar, merancang alur sebelum menulis kode.
```
Top-down view of a studio desk in Bali: hand-drawn app wireframes on paper, boxes and arrows sketched in pencil, an eraser, a dark green notebook, a mechanical pencil, a cup of black coffee and a small frangipani flower. One hand is mid-sketch. Warm morning light through a window with the soft shadow of palm leaves. All sketches without readable text.
```

### `konsultasi-kopi`
Post: konsultasi gratis, ngobrol dulu soal alur bisnis.
```
Two cups of coffee on a wooden cafe table in Bali, an open notebook between them with a simple hand-drawn flow of boxes and arrows. Two pairs of hands, one explaining with a pen, one resting next to a phone face down. Soft blurred tropical garden in the background, dark green ceramic cups, warm afternoon light. All handwriting illegible.
```

### `pendampingan-toko`
Post: pendampingan setelah aplikasi live.
```
Over-the-shoulder view at a small shop counter: two people seen only from behind, one pointing toward a tablet on a stand whose screen is turned away from the camera, the other leaning in to look. On the counter: a small receipt printer, a jar of pens, a potted plant. Warm daylight from the shop front, dark green shelves softly blurred. No screen visible, no faces.
```

---

## Setelah foto ditaruh

Bilang ke Claude "foto AI sudah ada di foto-ai". Setiap foto akan dipasangkan
ke post baru untuk batch berikutnya, dan foto di bagian A juga diusulkan jadi
cover artikelnya.
