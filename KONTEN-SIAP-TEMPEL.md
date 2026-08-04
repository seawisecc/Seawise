# Konten Siap Tempel, Admin → Blog

Dua temuan audit (**T-2** dan **S-5**) tidak bisa saya kerjakan dari sisi kode,
karena isinya tersimpan di tabel `posts` di Supabase dan menulis ke sana butuh
login admin. Dokumen ini adalah langkah persisnya supaya kamu bisa
menyelesaikannya sendiri dalam waktu singkat.

Semua bahan sudah jadi. Tidak ada yang perlu ditulis ulang.

---

## 1. Perbaiki artikel yang sudah tayang (T-2)

**Masalahnya:** artikel `biaya-bikin-website` tayang sebagai 29 paragraf tanpa
satu pun subjudul. Lima `##` dan sembilan `###` hilang saat konten ditempel.
Akibatnya, section "Pertanyaan yang sering diajukan" berisi empat tanya jawab
tidak terlihat sama sekali oleh Google.

**Langkah:**

1. Buka `/id/admin/blog`, klik **Edit** pada artikel *Biaya Bikin Website 2026*.
2. Buka file `artikel-1-biaya-bikin-website.md`.
3. Salin **seluruh isi di bawah garis `---`**, lengkap dengan tanda `##` dan
   `###`. Jangan hanya paragrafnya.
4. Timpa isi kolom **Isi artikel (Markdown)** dengan salinan itu.
5. Simpan.

> **Penting.** Baris pertama file, `# Cara pakai (isi ke Admin → Blog → ...)`,
> adalah instruksi, **bukan bagian artikel**. Jangan ikut ditempel. Kalau ikut,
> halaman akan punya dua `<h1>` karena judul artikel sudah dirender sebagai
> `<h1>` oleh halamannya sendiri.

**Cara memastikan berhasil:** setelah disimpan, buka artikelnya di browser. Kamu
harus melihat subjudul tebal seperti "Kisaran biaya bikin website di 2026" dan
"Pertanyaan yang sering diajukan". Kalau masih satu blok paragraf, berarti tanda
`#` belum ikut tersalin.

---

## 2. Publikasikan tiga artikel sisa (S-5)

Ketiganya sudah selesai ditulis dan tinggal ditayangkan. Untuk masing-masing,
buka `/id/admin/blog` → **+ Artikel**, lalu isi dari file yang bersangkutan.

Setiap file sudah memuat Judul, Slug, dan Excerpt di bagian atas, serta isi
artikel di bawah garis `---`.

| File | Slug | Status |
|---|---|---|
| `artikel-2-aplikasi-apotek.md` | `aplikasi-apotek` | belum tayang |
| `artikel-3-aplikasi-kasir-umkm.md` | `aplikasi-kasir-umkm` | belum tayang |
| `artikel-4-jasa-pembuatan-aplikasi.md` | `jasa-pembuatan-aplikasi-custom` | belum tayang |

Centang **Published** supaya artikelnya masuk ke `/blog` dan ke `sitemap.xml`.

---

## 3. Pendekkan judul artikel (S-3)

Google memotong judul di sekitar 60 karakter. Saya sudah memperbaiki sisi kode
supaya `| Seawise Studio` tidak lagi ditambahkan ke judul artikel, jadi judul di
database kini tampil apa adanya. Empat judul yang ada masih sedikit lewat batas.

Usulan pengganti, isinya tidak berubah, hanya dipendekkan:

| Sekarang | Karakter | Usulan | Karakter |
|---|---|---|---|
| Biaya Bikin Website 2026: Panduan Lengkap Harga & Cara Memilih Paket | 68 | **Biaya Bikin Website 2026: Panduan Harga & Cara Memilih** | 54 |
| Aplikasi Apotek: Fitur Wajib & Cara Memilih Software yang Tepat | 63 | **Aplikasi Apotek: Fitur Wajib & Cara Memilihnya** | 46 |
| Aplikasi Kasir untuk UMKM: Kapan Bisnis Perlu Upgrade dari Excel | 64 | **Aplikasi Kasir UMKM: Kapan Harus Pindah dari Excel** | 51 |
| Jasa Pembuatan Aplikasi Custom: Panduan, Biaya, & Cara Memilih | 62 | **Jasa Pembuatan Aplikasi Custom: Panduan & Biaya** | 48 |

Ini opsional. Judul yang sekarang tetap berfungsi, hanya ekornya terpotong di
hasil pencarian.

---

## 4. Isi versi Inggris (opsional, dari pekerjaan M-2)

Kolom `title_en`, `excerpt_en`, dan `content_en` sudah tersedia di form editor
artikel. Selama dikosongkan, halaman `/en/blog` menampilkan versi Indonesia,
jadi tidak ada yang rusak kalau kamu menundanya.

---

## 5. Dua hal di luar admin yang perlu kamu cek sendiri

**Nomor WhatsApp.** `lib/contact.ts` memakai `6281234567890` sebagai nilai
bawaan, dan itu nomor contoh, bukan nomor asli. Nomor sungguhan diambil dari
environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER`. Pastikan variabel itu sudah
diisi di **Vercel → Settings → Environment Variables**. Kalau belum, tombol
WhatsApp mengambang di situs publik mengarah ke nomor yang salah.

**Google Search Console.** Setelah artikel diperbaiki dan dipublikasikan,
setorkan ulang `sitemap.xml`. Isinya sekarang bertambah empat halaman: dua
landing page lokal dikali dua bahasa.
