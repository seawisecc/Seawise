# Prompt video untuk Reel

Klip AI buat Reel `@seawise.id`. Simpan hasil generate di `video-ai/` dengan
**nama file persis seperti judul prompt** (misalnya `video-ai/kasir-scan-cepat.mp4`).
Nama itu yang dicari `render_reels.py`.

## Sumber yang dipakai (dan batasannya)

Dua-duanya kena watermark visible di tier yang dipakai, jadi klipnya dipakai
sebagai b-roll pendek di background, bukan elemen utama. Fondasi Reel tetap
slideshow dari aset yang sudah ada (carousel/Story), yang bersih tanpa
watermark.

- **Kling AI (free)**: 66 kredit/hari, reset harian, nggak bisa ditabung.
  Klip 5 detik, 720p, watermark "Kling AI" di pojok.
- **Google Flow / Veo (paket Plus)**: sekitar 200 kredit/bulan. Klip sampai
  8 detik. Watermark "Made with Veo" tetap ada di paket Plus, baru hilang di
  Ultra atau lewat API berbayar (belum dipakai, lihat aturan dependensi
  berbayar di `CLAUDE.md`).

## Cara pakai

1. Salin satu prompt, tempelkan **blok gaya** di belakangnya.
2. Kling: rasio vertikal 9:16, durasi default (5 detik). Flow: rasio 9:16,
   durasi 6-8 detik kalau modelnya kasih pilihan.
3. Simpan sebagai `.mp4` di `video-ai/`, nama file sama persis dengan judul
   prompt.
4. Kalau tangan atau wajah terlihat janggal, generate ulang. Sama seperti
   foto AI, ini titik lemah generator.

## Aturan supaya senada dengan carousel dan foto yang sudah ada

Sama dengan `prompt-gambar.md`:

- **Satu momen masalah atau satu aksi spesifik**, bukan suasana umum.
- **Orang hanya tangan, dari belakang, atau buram karena gerak.** Hindari
  wajah yang jelas kelihatan, apalagi bicara ke kamera, generator AI belum
  konsisten untuk itu.
- **Tanpa tulisan yang terbaca** dan **tanpa layar aplikasi** di dalam video.
- **Palet brand**: off-white hangat, netral, aksen hijau hutan, cahaya alami.
- **Gerakan pelan dan sederhana.** Kamera statis atau pan lambat lebih aman
  daripada gerakan cepat, yang biasanya menghasilkan artefak aneh.

**Blok gaya, tempel di akhir setiap prompt:**

```
Cinematic editorial video, 35mm lens look, natural warm light, muted color
grade with warm off-white, soft neutrals and deep forest-green accents,
shallow depth of field, slow and simple camera movement, realistic textures,
no faces visible, no readable text, no logos, no brand names, vertical 9:16.
```

## Contoh prompt

### `kasir-scan-cepat`
Untuk carousel "kasir jam ramai" atau Reel edukasi kasir.
```
Close-up of a hand scanning a product barcode at a small cafe counter, the
scanner beeps and the receipt printer starts printing immediately after.
Soft motion blur of a customer waiting in the background. Warm pendant
light, dark green tiled wall.
```

### `catatan-ke-cloud`
Untuk Reel tentang mencatat manual vs otomatis.
```
Top-down shot of a hand closing a paper notebook and setting it aside, then
a phone screen turned face-down lights up briefly beside it, implying data
syncing quietly in the background. Warm desk lamp light, dark green desk pad.
```

### `rak-toko-tenang`
Untuk Reel edukasi stok/opname.
```
Slow pan across a tidy small shop shelf, products neatly arranged, a hand
enters frame to straighten one item. Calm and orderly mood, warm afternoon
light through the shop front, dark green painted shelving.
```

## Setelah klip ditaruh

Bilang ke Claude "klip video sudah ada di video-ai/, judulnya X". Klip akan
dipasangkan ke Reel baru lewat `render_reels.py`.
