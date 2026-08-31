-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v12
-- Jalankan sekali di Supabase → SQL Editor. Aman diulang (pakai IF NOT EXISTS).
-- Menambah: tabel pengaturan situs, dipakai panel /admin/pengaturan.
-- ─────────────────────────────────────────────────────────────────────────

-- Sengaja key/value, bukan satu kolom per pengaturan. Setiap saklar baru di
-- panel admin cukup menambah satu baris di sini, tanpa migrasi lagi. Sisi
-- TypeScript-nya tetap aman karena `getSiteSettings()` di lib/queries.ts
-- memetakan key yang dikenal ke objek bertipe, dan mengabaikan sisanya.
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table site_settings enable row level security;

-- Publik boleh baca: footer dan JSON-LD membacanya lewat client cookieless.
drop policy if exists "public read site_settings" on site_settings;
create policy "public read site_settings"
  on site_settings for select using (true);

drop policy if exists "admin all site_settings" on site_settings;
create policy "admin all site_settings"
  on site_settings for all to authenticated using (true) with check (true);

-- ── Nilai awal ───────────────────────────────────────────────────────────
-- `show_parent_org`: menampilkan "Part of Mayaloka Digital" di footer, sekaligus
-- `parentOrganization` di JSON-LD. Keduanya dikendalikan satu saklar supaya
-- tampilan dan yang dibaca mesin tidak pernah bercerita berbeda.
--
-- ON CONFLICT DO NOTHING, jadi menjalankan ulang migrasi ini tidak akan
-- mengembalikan saklar ke posisi semula kalau pemilik sudah mematikannya.
insert into site_settings (key, value)
values ('show_parent_org', 'true'::jsonb)
on conflict (key) do nothing;
