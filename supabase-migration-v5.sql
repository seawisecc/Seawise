-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v5 (Halaman studi kasus portfolio)
-- Jalankan di Supabase → SQL Editor. Aman diulang.
-- Menambah: slug (URL detail), body (tulisan Markdown), gallery (galeri gambar).
-- ─────────────────────────────────────────────────────────────────────────

alter table portfolio add column if not exists slug text;
alter table portfolio add column if not exists body text;
alter table portfolio add column if not exists gallery text[];

-- Backfill slug dari judul untuk data yang sudah ada (huruf kecil, tanpa simbol).
update portfolio
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- Pastikan slug unik.
create unique index if not exists portfolio_slug_key on portfolio (slug);
