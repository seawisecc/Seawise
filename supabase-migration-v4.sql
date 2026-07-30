-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v4 (Blog / Artikel)
-- Jalankan di Supabase → SQL Editor. Aman diulang.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- dipakai di URL: /blog/slug-ini
  title text not null,
  excerpt text,                        -- ringkasan singkat (dipakai untuk meta description)
  content text,                        -- isi artikel (format Markdown)
  cover_url text,                      -- gambar sampul (opsional)
  published boolean default false,
  published_at timestamptz,            -- tanggal terbit (untuk urutan & tampilan)
  created_at timestamptz default now()
);

alter table posts enable row level security;

-- Publik: baca hanya artikel yang published
drop policy if exists "public read published posts" on posts;
create policy "public read published posts"
  on posts for select using (published = true);

-- Admin (user login): akses penuh
drop policy if exists "admin all posts" on posts;
create policy "admin all posts"
  on posts for all to authenticated using (true) with check (true);
