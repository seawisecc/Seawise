-- ─────────────────────────────────────────────────────────────────────────────
-- v11: asal-usul lead
--
-- Menambah tiga kolom di tabel `leads` supaya setiap pesan masuk membawa
-- jejak dari mana orangnya datang. Tanpa ini semua lead terlihat sama dan
-- tidak ada cara tahu channel mana yang benar-benar menghasilkan.
--
--   phone         nomor WhatsApp, opsional, diisi kalau form kontak memintanya
--   source        asal pengunjung: utm_source, domain perujuk, atau 'langsung'
--   landing_path  halaman tempat form dikirim, mis. /id/jasa-pembuatan-website-bali
--
-- Idempoten, aman dijalankan berulang. Jalankan sesudah v1.
-- ─────────────────────────────────────────────────────────────────────────────

alter table leads add column if not exists phone        text;
alter table leads add column if not exists source       text;
alter table leads add column if not exists landing_path text;

-- Admin selalu membaca leads urut terbaru, indeks ini membuatnya tetap cepat
-- saat jumlah barisnya bertambah.
create index if not exists leads_created_at_idx on leads (created_at desc);
