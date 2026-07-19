# Seawise — Website

Systems & Software Studio. Next.js (App Router) + Tailwind + Framer Motion, siap dilanjutkan ke Supabase.

## Status build (bertahap)

**Fase 1 — selesai (batch ini):**

- Setup Next.js App Router + Tailwind + design tokens (palette dari logo)
- Font Space Grotesk (display) + Inter (body)
- Layout dasar: Navbar (responsive + mobile menu), Footer
- Signature element: whale-tail wave divider antar-section + animasi whale masuk sekali saat load
- Halaman Home lengkap (konten hardcoded): hero, problem→solution, services grid, featured portfolio, testimoni, CTA

**Fase 2 — selesai:**

- Koneksi Supabase (client browser + server, `@supabase/ssr`) dengan fallback graceful ke konten hardcoded bila env belum diisi
- Halaman `/layanan` (detail 4 layanan) dan `/tentang`
- Halaman `/portfolio` — dinamis dari Supabase, kartu dengan tombol "Lihat Aplikasi Live", tech badges, screenshot
- Halaman `/testimoni` — dinamis dari Supabase
- Halaman `/kontak` — form dengan server action → insert ke tabel `leads`, validasi + honeypot anti-bot

**Fase 3 — selesai (bilingual + logo):**

- Bilingual EN + ID dengan routing berbasis path (`/en/...` dan `/id/...`), **default English**
- Semua halaman pindah ke `app/[lang]/`, semua teks ditarik dari `lib/i18n/dictionaries.ts`
- `middleware.ts` mengarahkan URL tanpa prefix locale ke `/en`
- Language switcher (EN / ID) di navbar — mempertahankan halaman yang sedang dibuka
- Komponen `Logo` terpusat, mudah diganti ke file `SeaWise.png`

**Fase 4 — selesai (admin panel):**

- Admin panel `/admin` (Supabase Auth email/password + proteksi middleware)
- Login page + sign out, sidebar shell, dashboard dengan ringkasan jumlah
- CRUD Portfolio, Testimoni, Partner (tambah/edit/hapus, urutan, publish/draft, upload gambar ke Storage)
- Lihat Leads dengan status baru/dibalas
- Navbar/Footer publik otomatis disembunyikan di route admin

**Fase berikutnya (opsional):**

- Konten Supabase dua bahasa penuh (kolom `_en`/`_id`)
- Polish animasi tambahan, responsive check menyeluruh, deploy ke Vercel

## Bahasa (i18n)

- Default: **English** (`/en`). Bahasa Indonesia di `/id`.
- Semua copy ada di `lib/i18n/dictionaries.ts` (objek `en` dan `id`). Ubah teks di sana.
- Tambah bahasa baru: tambahkan ke `lib/i18n/config.ts` lalu lengkapi dictionary-nya.
- Catatan: konten dari Supabase (portfolio/testimoni) tersimpan satu bahasa apa adanya.
  Konten contoh fallback tersedia dua bahasa. Untuk konten DB dua bahasa penuh,
  perlu tambah kolom (mis. `title_en`/`title_id`) — bisa dikerjakan nanti kalau perlu.

## Mengganti Logo

Buka `components/Logo.tsx`:
1. Taruh file logo di folder `public/` (mis. `public/SeaWise.png`).
2. Set `const USE_IMAGE_LOGO = true;`

Logo langsung berganti di navbar dan footer sekaligus. Placeholder saat ini
adalah whale mark yang digambar inline di `components/WhaleMark.tsx`.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 (otomatis diarahkan ke `/en`).

## Supabase

1. Copy `.env.local.example` → `.env.local`, isi dari Project Settings → API.
2. Jalankan schema SQL di bawah pada SQL Editor Supabase.

```sql
-- portfolio
create table portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  industry text,
  live_url text,
  screenshot_url text,
  tech_stack text[],
  featured boolean default false,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  role text,
  content text not null,
  avatar_url text,
  published boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- partners
create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- leads (dari form kontak)
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);
```

## Admin panel (`/admin`)

URL: `/en/admin` (atau `/id/admin`). Route diproteksi via `middleware.ts` —
kalau belum login, otomatis diarahkan ke `/admin/login`.

### 1. Buat user admin

Supabase Dashboard → Authentication → Users → **Add user** (email + password).
Login pakai kredensial itu di `/admin/login`.

### 2. Row Level Security (RLS)

Aktifkan RLS lalu jalankan policy berikut — **publik hanya boleh baca yang
published**, sedangkan **user login boleh baca/tulis semua**:

```sql
alter table portfolio    enable row level security;
alter table testimonials enable row level security;
alter table partners     enable row level security;
alter table leads        enable row level security;

-- Publik: baca hanya yang published
create policy "public read published portfolio"
  on portfolio for select using (published = true);
create policy "public read published testimonials"
  on testimonials for select using (published = true);
create policy "public read published partners"
  on partners for select using (published = true);

-- Publik: boleh kirim pesan (insert lead) saja
create policy "public insert leads"
  on leads for insert with check (true);

-- Admin (user login): akses penuh ke semua tabel
create policy "admin all portfolio"    on portfolio    for all to authenticated using (true) with check (true);
create policy "admin all testimonials" on testimonials for all to authenticated using (true) with check (true);
create policy "admin all partners"     on partners     for all to authenticated using (true) with check (true);
create policy "admin all leads"        on leads        for all to authenticated using (true) with check (true);
```

### 3. Storage untuk upload gambar

Supabase Dashboard → Storage → **New bucket** → nama `media`, centang **Public**.
Lalu izinkan user login untuk upload:

```sql
create policy "admin upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');
create policy "public read media"
  on storage.objects for select using (bucket_id = 'media');
```

Fitur admin: kelola Portfolio, Testimoni, Partner (tambah/edit/hapus, urutan,
publish/draft, upload gambar), dan lihat Leads (dengan status baru/dibalas).

## Logo

`components/WhaleMark.tsx` saat ini menggambar whale mark inline sebagai placeholder.
Ketika `SeaWise.png` tersedia, taruh di `public/SeaWise.png` dan ganti isi
komponen dengan `<Image src="/SeaWise.png" ... />`.

## Design tokens

| Token | Hex | Penggunaan |
|---|---|---|
| `forest-dark` | `#132A22` | Teks utama, dominan section terang |
| `near-black` | `#0A1712` | Background section gelap |
| `off-white` | `#FAFAF8` | Background utama |
| `sea-foam` | `#5C8577` | Aksen sekunder, hover, garis |
| `warm-neutral` | `#E8E4D9` | Card background di section terang |

Tagline resmi: **Systems & Software Studio**.
