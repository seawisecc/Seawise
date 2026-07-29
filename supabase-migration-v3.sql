-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v3
-- Jalankan di Supabase → SQL Editor (setelah v2).
-- Menambah kolom `tagline` (cocok untuk) di price list, lalu mengisi 4 paket
-- website: Shore / Reef / Current / Trench.
-- ⚠️ Blok INSERT akan MENGGANTI isi tabel pricing dengan 4 paket ini.
--    Kalau kamu sudah punya paket sendiri dan tak mau ditimpa, lewati `delete`.
-- ─────────────────────────────────────────────────────────────────────────

alter table pricing add column if not exists tagline text;

delete from pricing;

insert into pricing (name, tagline, price, price_note, features, featured, sort_order, published)
values
  ('Shore',
   'Promosi 1 produk/acara, personal branding sederhana',
   'Rp2 juta', '/ proyek',
   array[
     '1 halaman (maks 4–5 section)',
     '1 preset tema (tanpa pilihan warna)',
     'Tanpa admin panel (update via kami)',
     'SEO metadata standar',
     '1× revisi minor',
     'Maintenance opsional Rp1,5jt/th'
   ], false, 0, true),

  ('Reef',
   'UMKM yang butuh company profile utuh',
   'Rp3,5–4 juta', '/ proyek',
   array[
     'Maks 5–6 section (hero, tentang, produk, galeri, kontak)',
     'Pilih dari preset tersedia',
     'Admin panel: edit teks, harga, foto',
     'SEO + structured data otomatis',
     '2× revisi major',
     'Maintenance Rp1,5jt/th'
   ], true, 1, true),

  ('Current',
   'Tampilan lebih personal, beda dari kompetitor',
   'Rp4,5–5 juta', '/ proyek',
   array[
     'Maks 8–10 section, reorder sendiri',
     'Preset + kustomisasi moderat (warna/layout/animasi ringan)',
     'Admin + reorder section sendiri',
     'SEO seperti Reef',
     'Bisa tambah 1 add-on (charge terpisah)',
     '2× revisi major'
   ], false, 2, true),

  ('Trench',
   'Model bisnis unik / butuh fitur custom penuh',
   'Rp6–7 juta', '/ proyek',
   array[
     'Section tidak dibatasi (sesuai kebutuhan)',
     'Full custom (vertical/tema baru)',
     'Admin akses lebih luas',
     'SEO + bisa bundling SEO Managed (diskon)',
     '1 add-on termasuk, add-on kedua terpisah',
     '2× revisi major + prioritas support'
   ], false, 3, true);
