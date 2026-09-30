# Dokumen bisnis: Quotation, Proforma Invoice, Invoice

Sejak 30 September 2026 dokumen dibuat di panel admin, **`/admin/dokumen`**,
dan tersimpan di tabel `documents` Supabase (migrasi v15). Generator HTML
lokal yang dulu ada di folder ini sudah dihapus.

- Kode: `components/admin/DocumentManager.tsx` (daftar, editor, cetak) dan
  `components/admin/documents/` (model dan tampilan A4).
- `contoh/`: contoh PDF dari format yang sama. Angkanya ilustrasi.
- `data/` (tidak di-commit): file klien, termasuk `impor-cantika-zest.json`
  yang bisa dimasukkan lewat tombol **Impor JSON** di `/admin/dokumen`.

## Alur

1. **Quotation** ke calon klien. Rekening tidak tampil secara bawaan.
2. Disetujui: buka quotation, **Buat proforma dari ini**. Termin default 50%.
3. **Buat invoice dari ini**. Semua proforma dari quotation yang sama (kecuali
   berstatus Batal) otomatis masuk ke "Sudah dibayar".
4. Status **Lunas** di invoice memasang cap LUNAS.

Nomor otomatis `QUO|PRO|INV/SW/<tahun>/<bulan>/<urut>`, unik di database.

## Tanda tangan QR

QR berisi penanda tangan, jenis dan nomor dokumen, tanggal, klien, nilai, dan
kode verifikasi (hash dari isi pokok). Kalau isi pokok diubah sesudah dikirim,
kodenya tidak cocok lagi dengan arsip di admin.

## Data studio

Nama penanda tangan, kontak, NPWP, dan rekening disimpan di tabel
`document_settings`, **bukan** `site_settings`, karena `site_settings` bisa
dibaca publik.
