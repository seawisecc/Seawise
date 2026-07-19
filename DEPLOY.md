# Deploy Seawise ke Vercel

Estimasi 10–15 menit. Semua perintah dijalankan di Mac kamu (Terminal),
dari dalam folder `seawise-website`.

## 0. Prasyarat (Supabase sudah siap)

Pastikan di Supabase sudah dilakukan (lihat README bagian Supabase & Admin):
- [ ] Schema tabel (portfolio, testimonials, partners, leads)
- [ ] RLS + policy dijalankan
- [ ] Bucket Storage `media` (public) + policy-nya
- [ ] User admin dibuat (Authentication → Add user)
- [ ] (Opsional) `supabase-seed.sql` dijalankan untuk data contoh

## 1. Tes build di lokal dulu

```bash
cd ~/Desktop/seawise-website
rm -rf node_modules .next
npm install
npm run build
```

Kalau `npm run build` sukses, siap deploy. (Build butuh internet untuk
mengambil font Google — itu normal.)

## 2. Push ke GitHub

Folder ini sudah di-`git init` dari sesi sebelumnya, tapi ada file lock sisa
sandbox. Paling bersih, mulai ulang git:

```bash
rm -rf .git
git init
git add -A
git commit -m "Seawise website"
```

Lalu buat repo baru kosong di https://github.com/new (mis. `seawise-website`,
set Private), dan hubungkan:

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/seawise-website.git
git push -u origin main
```

> `.gitignore` sudah mengecualikan `node_modules`, `.next`, dan `.env.local`,
> jadi kunci rahasia tidak akan ikut ter-push.

## 3. Import ke Vercel

1. Buka https://vercel.com → login (bisa pakai akun GitHub).
2. **Add New… → Project** → pilih repo `seawise-website` → **Import**.
3. Framework otomatis terdeteksi sebagai **Next.js**. Biarkan setting default.
4. Jangan klik Deploy dulu — set Environment Variables (langkah 4).

## 4. Environment Variables di Vercel

Di halaman import (Environment Variables), tambahkan — ambil dari
Supabase → Project Settings → API:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

(`SUPABASE_SERVICE_ROLE_KEY` tidak wajib — belum dipakai kode saat ini.)

Lalu klik **Deploy**. Tunggu ~1–2 menit.

## 5. Setelah live

- Situs publik: `https://seawise-website.vercel.app` (auto redirect ke `/en`).
- Admin: `https://…vercel.app/en/admin` → login dengan user admin Supabase.
- Kirim tes pesan lewat `/en/kontak`, cek muncul di admin → Pesan Masuk.

### Custom domain (opsional)
Vercel → Project → Settings → Domains → tambahkan domain kamu, ikuti
instruksi DNS-nya.

### Catatan Supabase Auth (opsional)
Login admin pakai email/password, jadi tidak butuh konfigurasi redirect URL.
Kalau nanti pindah ke magic link, tambahkan domain Vercel ke
Supabase → Authentication → URL Configuration.

---

## Alternatif: Vercel CLI (tanpa GitHub)

```bash
npm i -g vercel
cd ~/Desktop/seawise-website
vercel            # ikuti prompt login + setup
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod     # deploy production
```
