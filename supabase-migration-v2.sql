-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v2
-- Jalankan sekali di Supabase → SQL Editor. Aman diulang (pakai IF NOT EXISTS).
-- Menambah: kategori Aplikasi/Website di portfolio, tabel price list, dan
-- tabel transaksi keuangan (cash flow).
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Portfolio: jenis proyek (app / website)
alter table portfolio
  add column if not exists project_type text not null default 'app';
-- nilai yang dipakai: 'app' atau 'website'

-- 2. Price list (paket pengembangan website)
create table if not exists pricing (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- nama paket, mis. "Company Profile"
  price text,                      -- teks bebas, mis. "Mulai Rp5.000.000"
  price_note text,                 -- mis. "/ proyek" atau "sekali bayar"
  features text[],                 -- daftar fitur paket
  featured boolean default false,  -- paket unggulan (disorot)
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- 3. Transaksi keuangan (cash flow: uang masuk & keluar)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  occurred_on date not null default now(),
  description text not null,
  type text not null check (type in ('income','expense')),
  category text,                   -- mis. "Proyek", "Operasional", "Gaji"
  amount numeric(14,2) not null default 0,  -- selalu positif; arah dari `type`
  created_at timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table pricing      enable row level security;
alter table transactions enable row level security;

-- Price list: publik boleh baca yang published, admin akses penuh
drop policy if exists "public read published pricing" on pricing;
create policy "public read published pricing"
  on pricing for select using (published = true);

drop policy if exists "admin all pricing" on pricing;
create policy "admin all pricing"
  on pricing for all to authenticated using (true) with check (true);

-- Transaksi keuangan: HANYA admin (tidak publik sama sekali)
drop policy if exists "admin all transactions" on transactions;
create policy "admin all transactions"
  on transactions for all to authenticated using (true) with check (true);

-- ── (Opsional) contoh paket harga ────────────────────────────────────────
insert into pricing (name, price, price_note, features, featured, sort_order, published)
values
  ('Company Profile', 'Mulai Rp5.000.000', '/ proyek',
   array['Hingga 5 halaman','Desain responsif','Form kontak','SEO dasar','Domain & hosting dibantu'],
   false, 0, true),
  ('Website Bisnis', 'Mulai Rp12.000.000', '/ proyek',
   array['Halaman tak terbatas','CMS untuk update sendiri','Blog / artikel','SEO lanjutan','Integrasi WhatsApp & analytics'],
   true, 1, true),
  ('Web App Custom', 'Sesuai kebutuhan', 'konsultasi dulu',
   array['Fitur sesuai proses bisnis','Login & hak akses','Database & dashboard','Integrasi sistem lain','Pendampingan setelah live'],
   false, 2, true);
