-- Seawise Studio — migration v10
-- Penulis artikel dan tanggal pembaruan.
--
-- Kenapa: JSON-LD BlogPosting di app/[lang]/blog/[slug]/page.tsx terpaksa
-- memakai author bertipe Organization, karena tabel `posts` memang tidak punya
-- kolom penulis. Untuk sinyal keahlian (E-E-A-T), penulis berupa Person dengan
-- nama dan jabatan jauh lebih kuat daripada nama perusahaan.
--
-- Masalah kedua: `dateModified` selama ini diisi nilai yang sama persis dengan
-- `datePublished`, karena tidak ada kolom yang mencatat kapan artikel terakhir
-- disunting. Artinya artikel yang sudah diperbarui tetap terlihat basi.
--
-- Konvensi dwibahasa sama seperti v8 dan v9: bahasa Indonesia di kolom dasar,
-- Inggris di kolom *_en, dan kalau *_en kosong `pickText()` jatuh ke versi
-- Indonesia. Nama orang tidak diterjemahkan, jadi hanya jabatannya yang punya
-- pasangan *_en.
--
-- Jalankan sekali di Supabase SQL Editor. Aman diulang (IF NOT EXISTS).
--
-- PENTING, jalankan SEBELUM deploy kodenya. Halaman publik aman tanpa migrasi
-- ini (author cuma tetap Organization), tapi PostManager sekarang selalu
-- menulis updated_at dan kolom penulis saat menyimpan, jadi menyimpan artikel
-- di /admin/blog akan gagal selama kolomnya belum ada.

alter table posts
  add column if not exists author_name     text,
  add column if not exists author_title    text,
  add column if not exists author_title_en text,
  add column if not exists updated_at      timestamptz;

-- Isi artikel yang sudah terbit supaya tidak ada yang tanpa penulis.
-- GANTI nilai di bawah kalau ejaan atau jabatannya berbeda. Sesudah migrasi
-- ini, semuanya bisa disunting per artikel lewat /admin/blog tanpa SQL lagi.
--
-- Jabatan ditulis tanpa koma di dalamnya. Byline di halaman artikel sudah
-- menyisipkan koma sendiri setelah nama, jadi 'Founder, Seawise Studio' akan
-- terbaca "Agus Yulyastrawan, Founder, Seawise Studio".
update posts
   set author_name     = coalesce(author_name, 'Agus Yulyastrawan'),
       author_title    = coalesce(author_title, 'Founder Seawise Studio'),
       author_title_en = coalesce(author_title_en, 'Founder Seawise Studio')
 where author_name is null;

-- Perbaikan untuk database yang sudah menjalankan versi awal file ini, yang
-- sempat memakai 'Founder, Seawise Studio'. Tidak berpengaruh apa-apa di
-- database yang baru pertama kali menjalankan migrasi ini.
update posts
   set author_title_en = 'Founder Seawise Studio'
 where author_title_en = 'Founder, Seawise Studio';

-- Artikel lama belum pernah disunting sejak ada kolom ini, jadi tanggal
-- pembaruannya disamakan dengan tanggal terbit. Itu jujur: memang belum
-- diperbarui. Penyuntingan berikutnya lewat admin akan memperbaruinya sendiri.
update posts
   set updated_at = coalesce(published_at, created_at)
 where updated_at is null;
