-- ─────────────────────────────────────────────────────────────────────────
-- Seawise — data contoh (seed)
-- Jalankan sekali di Supabase → SQL Editor.
-- Setelah ini, portfolio & testimoni contoh muncul di /admin dan bisa diedit.
-- Website publik akan menampilkan data dari database ini (bukan lagi fallback).
-- Jalankan HANYA jika tabelnya masih kosong (biar tidak dobel).
-- ─────────────────────────────────────────────────────────────────────────

insert into portfolio (title, description, industry, live_url, tech_stack, featured, sort_order, published)
values
  ('IC-ERP',
   'ERP terpusat dengan inventori, pembelian, dan laporan real-time.',
   'Manufaktur / Distribusi',
   '#',
   array['Inventori','Pembelian','Laporan'],
   true, 0, true),
  ('ApotekERP',
   'Sistem apotek dengan pelacakan batch, kadaluarsa, dan resep.',
   'Apotek / Kesehatan',
   '#',
   array['Batch','Kadaluarsa','Resep'],
   true, 1, true),
  ('Resto ERP',
   'Sistem resto terintegrasi dari kasir sampai manajemen bahan baku.',
   'F&B / Restoran',
   '#',
   array['Kasir','Dapur','Stok'],
   true, 2, true);

insert into testimonials (client_name, company, role, content, published, sort_order)
values
  ('Budi Santoso',
   'CV Inti Cemerlang',
   'Direktur Operasional',
   'Sejak pakai sistem dari Seawise, laporan stok yang dulu makan waktu seharian sekarang selesai dalam hitungan menit. Timnya paham betul kebutuhan lapangan.',
   true, 0),
  ('Sari Wijaya',
   'Apotek Sehat Bersama',
   'Pemilik',
   'Yang saya suka, mereka tidak memaksakan sistem yang rumit. Dibangun sesuai cara kerja kami, dan tetap didampingi setelah live.',
   true, 1);

-- Catatan: ganti live_url '#' dengan URL aplikasi asli lewat /admin → Portfolio → Edit.
