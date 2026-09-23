-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v14
-- Grant Data API eksplisit untuk semua tabel. Jalankan sesudah v1–v13.
-- Aman diulang: GRANT yang sudah ada tidak berubah apa-apa.
--
-- Mulai 30 Oktober 2026 Supabase berhenti otomatis memberi grant ke tabel
-- baru di schema public. Tabel di produksi dibuat sebelum itu, jadi grantnya
-- sudah ada dan file ini tidak mengubah perilaku apa pun di sana. Gunanya
-- untuk database yang dibangun ulang dari v1–v13 (project baru, preview
-- branch, db reset): tanpa file ini semua tabel menolak API, dan kegagalannya
-- diam. Section publik hilang sendiri karena query mengembalikan kosong, dan
-- form kontak gagal sehingga lead hilang.
--
-- Grant disamakan dengan policy RLS di v1, v2, v4, v12, bukan dibuka lebar.
-- RLS tetap penjaga baris, grant ini penjaga operasi.
-- ─────────────────────────────────────────────────────────────────────────

-- ── Konten publik: pengunjung baca, admin kelola ─────────────────────────
grant select on public.portfolio     to anon;
grant select on public.testimonials  to anon;
grant select on public.partners      to anon;
grant select on public.pricing       to anon;
grant select on public.posts         to anon;
grant select on public.site_settings to anon;

-- ── Leads: pengunjung hanya boleh mengirim, tidak boleh membaca ──────────
-- Form di app/[lang]/kontak/actions.ts insert lewat client anon tanpa
-- .select() sesudahnya. Kalau suatu saat ditambah .select(), insert akan
-- gagal karena anon memang tidak boleh membaca leads, dan itu disengaja.
grant insert on public.leads to anon;

-- ── transactions: tidak ada grant untuk anon sama sekali ─────────────────

-- ── Admin (user login) dan service role: akses penuh ─────────────────────
grant select, insert, update, delete on
  public.portfolio,
  public.testimonials,
  public.partners,
  public.leads,
  public.pricing,
  public.transactions,
  public.posts,
  public.site_settings
to authenticated, service_role;
