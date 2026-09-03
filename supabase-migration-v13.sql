-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v13
-- Kolom urutan untuk `posts`, dipakai drag and drop di /admin/blog.
-- Jalankan sesudah v4 (yang membuat tabel posts). Aman diulang.
--
-- CATATAN PENTING: kolom ini HANYA mengurutkan tabel di panel admin.
-- Halaman /blog publik tetap urut tanggal terbit, lihat getPosts() di
-- lib/queries.ts. Tabel portfolio, testimonials, dan partners sudah punya
-- sort_order sejak v1, jadi tidak ada yang perlu ditambahkan di sana.
-- ─────────────────────────────────────────────────────────────────────────

alter table posts add column if not exists sort_order int default 0;

-- Isi awal mengikuti urutan yang sudah terlihat operator sebelum kolom ini
-- ada, yaitu artikel terbaru di atas. Tanpa ini semua baris bernilai 0 dan
-- daftar admin akan teracak sendiri di hari kolom ini dipasang.
--
-- Dijaga supaya hanya jalan sekali: begitu ada satu baris yang bukan 0,
-- berarti backfill sudah pernah jalan atau pemilik sudah menggeser urutannya,
-- dan menjalankan ulang migrasi ini tidak boleh membatalkan susunan itu.
do $$
begin
  if not exists (select 1 from posts where sort_order <> 0) then
    update posts p
    set sort_order = s.rn
    from (
      select id, (row_number() over (order by created_at desc)) - 1 as rn
      from posts
    ) s
    where s.id = p.id;
  end if;
end $$;
