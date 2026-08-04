-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v1 (skema dasar)
-- Jalankan PALING AWAL di Supabase → SQL Editor, sebelum v2.
-- Aman diulang (pakai IF NOT EXISTS + DROP POLICY IF EXISTS).
--
-- Membuat 4 tabel inti: portfolio, testimonials, partners, leads.
-- Tabel `pricing` & `transactions` dibuat di v2, `posts` di v4.
-- Kolom tambahan (slug, body, gallery, mobile_url, cover_url, *_en) menyusul
-- di v5 sampai v8, jadi jangan tambahkan di sini.
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Portfolio (proyek yang ditampilkan di /portfolio)
create table if not exists portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  industry text,                   -- mis. "Manufaktur / Distribusi"
  live_url text,                   -- '#' atau kosong kalau belum bisa dibuka
  screenshot_url text,
  tech_stack text[],
  featured boolean default false,  -- tampil di blok unggulan homepage
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- 2. Testimoni klien
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  role text,
  content text not null,
  avatar_url text,
  published boolean default false, -- sengaja false: baru tampil setelah dicek
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3. Partner / klien
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- 4. Leads (pesan masuk dari form kontak)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',       -- 'new' | 'read' | 'done'
  created_at timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────
-- Publik hanya boleh baca baris yang published; user login akses penuh.
alter table portfolio    enable row level security;
alter table testimonials enable row level security;
alter table partners     enable row level security;
alter table leads        enable row level security;

-- Publik: baca hanya yang published
drop policy if exists "public read published portfolio" on portfolio;
create policy "public read published portfolio"
  on portfolio for select using (published = true);

drop policy if exists "public read published testimonials" on testimonials;
create policy "public read published testimonials"
  on testimonials for select using (published = true);

drop policy if exists "public read published partners" on partners;
create policy "public read published partners"
  on partners for select using (published = true);

-- Publik: boleh kirim pesan (insert) saja, tidak boleh membaca leads
drop policy if exists "public insert leads" on leads;
create policy "public insert leads"
  on leads for insert with check (true);

-- Admin (user login): akses penuh ke semua tabel
drop policy if exists "admin all portfolio" on portfolio;
create policy "admin all portfolio"
  on portfolio for all to authenticated using (true) with check (true);

drop policy if exists "admin all testimonials" on testimonials;
create policy "admin all testimonials"
  on testimonials for all to authenticated using (true) with check (true);

drop policy if exists "admin all partners" on partners;
create policy "admin all partners"
  on partners for all to authenticated using (true) with check (true);

drop policy if exists "admin all leads" on leads;
create policy "admin all leads"
  on leads for all to authenticated using (true) with check (true);
