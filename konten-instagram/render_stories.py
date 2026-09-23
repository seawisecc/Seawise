"""Render Seawise Instagram Stories (1080x1920) from STORIES below via headless Chrome.

Two kinds:
- "repost": vertical reformat of a feed carousel's cover photo + title, posted the
  day after that carousel goes out, pointing back to the feed.
- "tip": standalone single-frame thought, no matching feed post that day.

Reuses the same photo priority as render.py (foto-asli > foto-ai) and the same
assets/ folder (logo, icons). Run after konten-instagram/assets/ is built.
"""
import html, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
A = "file://" + os.path.join(ROOT, "assets") + "/"
OUT = os.path.join(ROOT, "out_stories")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FOTO = os.path.join(ROOT, "foto-asli")
FOTO_AI = os.path.join(ROOT, "foto-ai")

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1920px;padding:96px 88px;display:flex;flex-direction:column;background:#0A1712;color:#FAFAF8}
.glow{position:absolute;inset:0;background:radial-gradient(1000px 800px at 100% 0%,rgba(92,133,119,.35),transparent 60%);pointer-events:none}
.top{display:flex;align-items:center;position:relative;z-index:2}
.brand{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk';font-weight:600;font-size:32px;letter-spacing:-.01em;background:rgba(10,23,18,.5);padding:12px 28px 12px 18px;border-radius:999px;backdrop-filter:blur(8px)}
.brand img{height:48px}
.eyebrow{font-family:'Space Grotesk';font-weight:600;font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:#9DC2B4;margin-bottom:32px}
h1{font-family:'Space Grotesk';font-weight:700;font-size:96px;line-height:1.05;letter-spacing:-.03em}
.sub{font-size:38px;line-height:1.45;margin-top:40px;opacity:.82;max-width:860px}
.grow{flex:1}
.foot{position:relative;z-index:2;display:flex;justify-content:center}
.pill{display:inline-flex;align-items:center;gap:14px;padding:30px 48px;border-radius:999px;background:#FAFAF8;color:#0A1712;font-family:'Space Grotesk';font-weight:700;font-size:38px}
.ph{position:absolute;left:0;top:0;width:1080px;height:1180px;object-fit:cover}
.phw{position:absolute;left:0;top:0;width:1080px;height:1180px;overflow:hidden}
.shade{position:absolute;left:0;top:0;width:1080px;height:1182px;background:linear-gradient(to bottom,rgba(10,23,18,.5) 0%,rgba(10,23,18,.05) 35%,rgba(10,23,18,.05) 55%,rgba(10,23,18,.9) 85%,#0A1712 100%)}
.txt{position:relative;z-index:2;margin-top:auto}
"""

def real_photo(name, folder, prefix):
    if not name or not os.path.isdir(folder):
        return None
    for f in sorted(os.listdir(folder)):
        stem, ext = os.path.splitext(f)
        if stem.lower() == name.lower() and ext.lower() in (".jpg", ".jpeg", ".png", ".heic", ".webp"):
            out = f"{prefix}-{name}.jpg"
            subprocess.run(["sips", "-s", "format", "jpeg", "-Z", "2200", os.path.join(folder, f),
                            "--out", os.path.join(ROOT, "assets", out)], capture_output=True)
            return out
    return None

def e(t):
    return html.escape(t, quote=False)

def photo_for(s):
    real = real_photo(s.get("ai", ""), FOTO, "real") if s.get("ai") else None
    if real:
        return real
    return real_photo(s["ai"], FOTO_AI, "ai")

def render(s):
    if s["type"] == "repost":
        img = photo_for(s)
        return (f'<div class="phw"><img class="ph" src="{A}{img}"></div><div class="shade"></div>'
                f'<div class="top"><div class="brand"><img src="{A}logo-light.png">Seawise Studio</div></div>'
                f'<div class="txt"><div class="eyebrow">{e(s["eyebrow"])}</div><h1 style="font-size:76px">{e(s["title"])}</h1></div>'
                f'<div style="height:56px"></div><div class="foot"><span class="pill">{e(s["cta"])} &uarr;</span></div>')
    # tip
    return (f'<div class="glow"></div><div class="top"><div class="brand" style="background:none;backdrop-filter:none;padding:0">'
            f'<img src="{A}logo-light.png">Seawise Studio</div></div><div class="grow"></div>'
            f'<div style="position:relative;z-index:2"><div class="eyebrow">{e(s["eyebrow"])}</div><h1>{e(s["title"])}</h1>'
            + (f'<p class="sub">{e(s["sub"])}</p>' if s.get("sub") else "") + '</div><div class="grow"></div>'
            f'<div class="foot"><span class="pill">{e(s.get("cta", "seawise.id"))}</span></div>')

STORIES = [
  {"id": "s01-tip-backup", "date": "2026-10-22", "type": "tip", "eyebrow": "Tips singkat",
   "title": "Kapan terakhir kamu backup catatan penjualan?", "sub": "Kalau jawabnya nggak tahu, mungkin waktunya sistem yang backup otomatis.", "cta": "seawise.id"},
  {"id": "s02-repost-villa", "date": "2026-10-24", "type": "repost", "ai": "villa-double-booking",
   "eyebrow": "Baru di feed", "title": "Dua tamu, satu kamar, tanggal yang sama.", "cta": "Baca lengkapnya di feed"},
  {"id": "s03-tip-struk", "date": "2026-10-27", "type": "tip", "eyebrow": "Tau nggak",
   "title": "Aplikasi kasir yang baik bisa kirim struk langsung ke WhatsApp pembeli.", "sub": "Nggak perlu print, nggak perlu nunggu.", "cta": "seawise.id"},
  {"id": "s04-repost-pemetaan", "date": "2026-10-29", "type": "repost", "ai": "aplikasi-custom-pemetaan",
   "eyebrow": "Baru di feed", "title": "Aplikasi custom yang gagal, biasanya gagal di sini.", "cta": "Baca lengkapnya di feed"},
  {"id": "s05-tip-opname", "date": "2026-10-31", "type": "tip", "eyebrow": "Cek akhir pekan",
   "title": "Kapan terakhir kamu stok opname?", "sub": "Kalau udah lama, mungkin ada selisih yang belum ketahuan.", "cta": "seawise.id"},
  {"id": "s06-tip-hpp", "date": "2026-11-03", "type": "tip", "eyebrow": "Reminder",
   "title": "Harga bahan naik itu wajar. HPP yang nggak ikut naik, itu masalah.", "sub": "Kapan terakhir kamu update HPP menu?", "cta": "seawise.id"},
  {"id": "s07-repost-fondasi", "date": "2026-11-05", "type": "repost", "ai": "website-pilihan-fondasi",
   "eyebrow": "Baru di feed", "title": "Builder, WordPress, atau custom? Bukan soal mahal-murahan.", "cta": "Baca lengkapnya di feed"},
  {"id": "s08-tip-konsultasi", "date": "2026-11-07", "type": "tip", "eyebrow": "Reminder",
   "title": "Ada proses bisnis yang masih ribet dicatat manual?", "sub": "DM kami, kami bantu petakan dulu. Gratis, tanpa kewajiban.", "cta": "seawise.id"},
  {"id": "s09-repost-sipnap", "date": "2026-11-10", "type": "repost", "ai": "sipnap-akhir-bulan",
   "eyebrow": "Baru di feed", "title": "Rekap SIPNAP akhir bulan bikin begadang?", "cta": "Baca lengkapnya di feed"},
  {"id": "s10-tip-laporan", "date": "2026-11-12", "type": "tip", "eyebrow": "Tau nggak",
   "title": "Laporan yang tadinya butuh berjam-jam bisa otomatis.", "sub": "Asal datanya tercatat rapi sejak transaksi pertama.", "cta": "seawise.id"},
  {"id": "s11-tip-margin", "date": "2026-11-14", "type": "tip", "eyebrow": "Cek akhir pekan",
   "title": "Sudah cek margin bulan ini?", "sub": "Kalau belum sempat, mungkin sistemnya yang belum bantu ngitung.", "cta": "seawise.id"},
  {"id": "s12-repost-beachclub", "date": "2026-11-17", "type": "repost", "ai": "beach-club-reservasi",
   "eyebrow": "Baru di feed", "title": "Reservasi tercecer di WA, DM, dan buku catatan.", "cta": "Baca lengkapnya di feed"},
  {"id": "s13-tip-follow", "date": "2026-11-19", "type": "tip", "eyebrow": "Tiap minggu",
   "title": "Follow buat tips digitalisasi usaha tiap minggu.", "sub": "Senin, Rabu, Jumat kami bahas topik baru di feed.", "cta": "@seawise.id"},

  # Periode 23 Sep - 19 Okt 2026 (dibuat belakangan, mengisi lubang, semua
  # "tip" karena posting periode ini tidak punya foto-ai untuk direpost).
  {"id": "p1-s01-tip-follow-awal", "date": "2026-09-24", "type": "tip", "eyebrow": "Baru mulai",
   "title": "Follow buat tips digitalisasi usaha, Senin, Rabu, Jumat di feed.", "sub": "Kami bahas kasir, stok, sampai ERP, dari masalah yang beneran dialami UMKM.", "cta": "@seawise.id"},
  {"id": "p1-s02-tanda-excel", "date": "2026-09-26", "type": "tip", "eyebrow": "Baru di feed",
   "title": "6 tanda usahamu sudah kebesaran buat Excel.", "cta": "Baca lengkapnya di feed"},
  {"id": "p1-s03-studi-tokoku", "date": "2026-09-29", "type": "tip", "eyebrow": "Studi kasus baru",
   "title": "Dari nota tulis tangan ke arus kas yang bisa dicek kapan saja.", "cta": "Baca studi kasusnya di feed"},
  {"id": "p1-s04-hpp-kopi", "date": "2026-10-01", "type": "tip", "eyebrow": "Reminder",
   "title": "Modal segelas es kopi susu aren kamu berapa?", "sub": "Kalau belum pernah dihitung, margin bisa turun diam-diam.", "cta": "seawise.id"},
  {"id": "p1-s05-studi-resto", "date": "2026-10-03", "type": "tip", "eyebrow": "Studi kasus baru",
   "title": "Pesanan nggak lagi tercecer antara kasir dan dapur.", "cta": "Baca studi kasusnya di feed"},
  {"id": "p1-s06-bocor-stok", "date": "2026-10-06", "type": "tip", "eyebrow": "Tau nggak",
   "title": "Selisih stok jarang dari satu kesalahan besar.", "sub": "Biasanya numpuk dari 5 kebocoran kecil yang nggak kerasa.", "cta": "seawise.id"},
  {"id": "p1-s07-rumus-restock", "date": "2026-10-08", "type": "tip", "eyebrow": "Baru di feed",
   "title": "Kapan harus restock? Jangan ditebak, dihitung.", "cta": "Baca rumusnya di feed"},
  {"id": "p1-s08-tanda-apotek", "date": "2026-10-10", "type": "tip", "eyebrow": "Buat pemilik apotek",
   "title": "5 tanda apotekmu sudah butuh aplikasi.", "cta": "Baca lengkapnya di feed"},
  {"id": "p1-s09-studi-sehatera", "date": "2026-10-13", "type": "tip", "eyebrow": "Studi kasus baru",
   "title": "Apotek yang berhenti kehilangan margin diam-diam.", "cta": "Baca studi kasusnya di feed"},
  {"id": "p1-s10-harga-website", "date": "2026-10-15", "type": "tip", "eyebrow": "Harga terbuka",
   "title": "Berapa sih biaya bikin website? Ini harga paket kami.", "cta": "Lihat harganya di feed"},
  {"id": "p1-s11-tanda-erp", "date": "2026-10-17", "type": "tip", "eyebrow": "Buat pemilik pabrik kecil",
   "title": "6 tanda pabrikmu sudah melampaui spreadsheet.", "cta": "Baca lengkapnya di feed"},
  {"id": "p1-s12-studi-ims", "date": "2026-10-20", "type": "tip", "eyebrow": "Studi kasus baru",
   "title": "Dari spreadsheet terpisah ke satu sumber data produksi.", "cta": "Baca studi kasusnya di feed"},
]

def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    for s in STORIES:
        if only and s["id"] not in only:
            continue
        doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="s">{render(s)}</div></body></html>'
        hp = os.path.join(OUT, f'{s["id"]}.html')
        open(hp, "w").write(doc)
        png = hp[:-5] + ".png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        "--window-size=1080,1920", "--virtual-time-budget=6000", "--allow-file-access-from-files",
                        f"--screenshot={png}", "file://" + hp], capture_output=True, timeout=60)
        print(png, os.path.exists(png))

if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
