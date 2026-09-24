"""Render Instagram Highlight stories (1080x1920) plus one cover per highlight.

Each highlight is one topic, posted as five Stories on one day, one per hour,
then gathered into a Highlight by hand in the Instagram app (the API cannot
create Highlights or set their cover). Covers land in out_highlights/covers/
for the owner to pick from the phone gallery.

Covers are read at ~60px on the profile, so they carry one bold centred icon
and no text; the highlight name sits under the circle and the longer
explanation lives in the first slide of each highlight.

Needs assets/: logo-light.png, icon-*.svg (Lucide) and hl-<key>-shot.jpg /
hl-<key>-mobile.jpg (portfolio screenshot_url and mobile_url).
"""
import html, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
A = "file://" + ASSETS + "/"
OUT = os.path.join(ROOT, "out_highlights")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1920px;padding:120px 88px 150px;display:flex;flex-direction:column;background:#0A1712;color:#FAFAF8;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(1000px 800px at 100% 0%,rgba(92,133,119,.35),transparent 60%);pointer-events:none}
.glow2{position:absolute;inset:0;background:radial-gradient(760px 760px at 50% 50%,rgba(92,133,119,.30),transparent 70%);pointer-events:none}
.z{position:relative;z-index:2}
.top{display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk';font-weight:600;font-size:32px}
.brand img{height:48px}
.count{font-family:'Space Grotesk';font-weight:600;font-size:28px;color:#9DC2B4;letter-spacing:.1em}
.eyebrow{font-family:'Space Grotesk';font-weight:600;font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:#9DC2B4;margin-bottom:30px}
h1{font-family:'Space Grotesk';font-weight:700;font-size:84px;line-height:1.06;letter-spacing:-.03em}
.sub{font-size:38px;line-height:1.45;margin-top:36px;opacity:.82}
.grow{flex:1}
.badge{width:200px;height:200px;border-radius:50%;background:rgba(157,194,180,.14);border:2px solid rgba(157,194,180,.35);display:flex;align-items:center;justify-content:center;margin-bottom:56px}
.badge svg{width:96px;height:96px}
.pill{display:inline-flex;align-items:center;gap:14px;padding:30px 48px;border-radius:999px;background:#FAFAF8;color:#0A1712;font-family:'Space Grotesk';font-weight:700;font-size:38px}
.foot{display:flex;justify-content:center}
ul{list-style:none;margin-top:56px;display:flex;flex-direction:column;gap:30px}
li{display:flex;gap:24px;align-items:flex-start;font-size:40px;line-height:1.35}
li svg{flex:none;width:44px;height:44px;margin-top:4px}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:24px;padding:30px 0;border-bottom:2px solid rgba(250,250,248,.12)}
.row b{font-family:'Space Grotesk';font-size:48px}
.row .p{font-family:'Space Grotesk';font-weight:700;font-size:48px;color:#9DC2B4;white-space:nowrap}
.row .d{font-size:32px;opacity:.75;margin-top:8px;line-height:1.35}
.note{font-size:32px;opacity:.7;margin-top:36px;line-height:1.4}
.dev{position:relative;height:820px;margin-top:64px}
.lap{position:absolute;left:0;top:0;width:904px;border-radius:22px;overflow:hidden;border:10px solid #1E2E28;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.lap img{display:block;width:100%}
.mob{position:absolute;right:-10px;top:250px;width:270px;border-radius:40px;overflow:hidden;border:10px solid #1E2E28;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.mob img{display:block;width:100%}
.demo{display:inline-block;font-size:26px;padding:10px 22px;border-radius:999px;background:rgba(250,250,248,.1);color:#CFE0D9;margin-top:24px}
.step{display:flex;gap:32px;align-items:flex-start;padding:26px 0}
.num{flex:none;width:72px;height:72px;border-radius:50%;background:#9DC2B4;color:#0A1712;font-family:'Space Grotesk';font-weight:700;font-size:36px;display:flex;align-items:center;justify-content:center}
.step b{display:block;font-family:'Space Grotesk';font-size:44px;line-height:1.2}
.step span{display:block;font-size:32px;opacity:.72;margin-top:8px;line-height:1.35}
.cvbg{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#2E5A4C 0%,#173A30 34%,#0A1712 62%)}
.cv{position:absolute;left:190px;top:610px;width:700px;height:700px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.cv svg{width:490px;height:490px}
"""


def e(t):
    return html.escape(t, quote=False)


def icon(name, color="#9DC2B4", width=2):
    svg = open(os.path.join(ASSETS, f"icon-{name}.svg")).read()
    svg = svg.replace('stroke="currentColor"', f'stroke="{color}"').replace('stroke-width="2"', f'stroke-width="{width}"')
    return svg[svg.index("<svg"):]


def head(n, total):
    return (f'<div class="top z"><div class="brand"><img src="{A}logo-light.png">Seawise Studio</div>'
            f'<div class="count">{n}/{total}</div></div>')


def body(h, s, n, total):
    t = s["type"]
    out = head(n, total)
    if t == "open":
        out += ('<div class="grow"></div><div class="z">'
                f'<div class="badge">{icon(h["icon"])}</div><div class="eyebrow">{e(s["eyebrow"])}</div>'
                f'<h1>{e(s["title"])}</h1><p class="sub">{e(s["sub"])}</p></div><div class="grow"></div>'
                '<div class="foot z"><span class="pill">Tap untuk lanjut &rarr;</span></div>')
    elif t == "text":
        out += ('<div class="grow"></div><div class="z">'
                f'<div class="eyebrow">{e(s["eyebrow"])}</div><h1>{e(s["title"])}</h1>'
                + (f'<p class="sub">{e(s["sub"])}</p>' if s.get("sub") else "") + '</div><div class="grow"></div>'
                + (f'<div class="foot z"><span class="pill">{e(s["cta"])}</span></div>' if s.get("cta") else ""))
    elif t == "list":
        items = "".join(f'<li>{icon("check")}<span>{e(i)}</span></li>' for i in s["items"])
        out += ('<div class="grow"></div><div class="z">'
                f'<div class="eyebrow">{e(s["eyebrow"])}</div><h1 style="font-size:76px">{e(s["title"])}</h1>'
                f'<ul>{items}</ul></div><div class="grow"></div>'
                + (f'<div class="foot z"><span class="pill">{e(s["cta"])}</span></div>' if s.get("cta") else ""))
    elif t == "price":
        rows = "".join(f'<div class="row"><div><b>{e(r[0])}</b><div class="d">{e(r[2])}</div></div>'
                       f'<div class="p">{e(r[1])}</div></div>' for r in s["rows"])
        out += ('<div class="grow"></div><div class="z">'
                f'<div class="eyebrow">{e(s["eyebrow"])}</div><h1 style="font-size:76px">{e(s["title"])}</h1>'
                f'<div style="margin-top:40px">{rows}</div><p class="note">{e(s["note"])}</p></div><div class="grow"></div>')
    elif t == "flow":
        steps = "".join(f'<div class="step"><div class="num">{i + 1}</div><div><b>{e(a)}</b><span>{e(b)}</span></div></div>'
                        for i, (a, b) in enumerate(s["steps"]))
        out += ('<div class="grow"></div><div class="z">'
                f'<div class="eyebrow">{e(s["eyebrow"])}</div><h1 style="font-size:76px">{e(s["title"])}</h1>'
                f'<div style="margin-top:40px">{steps}</div></div><div class="grow"></div>')
    elif t == "shot":
        k = s["shots"]
        out += ('<div style="height:70px"></div><div class="z">'
                f'<div class="eyebrow">{e(s["eyebrow"])}</div><h1 style="font-size:72px">{e(s["title"])}</h1>'
                f'<div class="demo">{e(s.get("label", "Tampilan dengan data demo"))}</div></div>'
                f'<div class="dev z"><div class="lap"><img src="{A}hl-{k}-shot.jpg"></div>'
                f'<div class="mob"><img src="{A}hl-{k}-mobile.jpg"></div></div><div class="grow"></div>'
                + (f'<div class="foot z"><span class="pill">{e(s["cta"])}</span></div>' if s.get("cta") else ""))
    return f'<div class="glow"></div>{out}'


def cover(h):
    # Seen at ~60px on the profile: one bold icon, no text (Instagram prints
    # the highlight name under the circle), thick stroke so it survives scaling.
    return f'<div class="cvbg"></div><div class="cv z">{icon(h["icon"], "#FAFAF8", 2.25)}</div>'


HIGHLIGHTS = [
  {"key": "website", "date": "2026-09-24", "icon": "globe", "label": "Website", "blurb": "Paket, harga, dan contoh",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Website",
     "title": "Website bisnis yang cepat, rapi, dan gampang diurus.",
     "sub": "Di sini: paket dan harga, contoh website yang sudah jalan, dan cara kami kerja."},
    {"type": "price", "eyebrow": "Harga terbuka", "title": "4 paket website Seawise.", "rows": [
      ("Shore", "Rp2 jt", "1 halaman, buat promosi produk atau acara"),
      ("Reef", "Rp3,5 jt", "Company profile utuh, admin panel sendiri"),
      ("Current", "Rp4,5 jt", "Tampilan lebih personal, section diatur sendiri"),
      ("Trench", "Rp12 jt", "Full custom untuk model bisnis yang unik")],
     "note": "Maintenance Rp1,8 jt per tahun, opsional di paket Shore. Detail lengkap di seawise.id"},
    {"type": "shot", "eyebrow": "Contoh yang sudah jalan", "title": "Leuca de Perfume",
     "label": "leuca.seawise.id", "cta": "Company profile brand parfum", "shots": "leuca"},
    {"type": "flow", "eyebrow": "Cara kami kerja", "title": "Dari ngobrol sampai online.", "steps": [
      ("Pahami dulu tujuanmu", "Website ini buat jualan, dipercaya, atau ditemukan?"),
      ("Cakupan dan harga tertulis", "Jelas di depan, sebelum pengerjaan dimulai."),
      ("Desain, bangun, revisi", "Kamu lihat progresnya secara berkala."),
      ("Online dan didampingi", "Mulai paket Reef, teks dan foto bisa kamu ubah sendiri.")]},
    {"type": "text", "eyebrow": "Masih bingung pilih paket?", "title": "Tanya dulu, gratis.",
     "sub": "Ceritain usahamu lewat DM, kami bantu pilih paket yang paling pas. Tanpa kewajiban.", "cta": "DM kami atau seawise.id"},
  ]},
  {"key": "aplikasi", "date": "2026-09-25", "icon": "app-window", "label": "Aplikasi", "blurb": "Dibuat sesuai alur bisnismu",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Aplikasi custom",
     "title": "Aplikasi yang ikut cara kerjamu, bukan sebaliknya.",
     "sub": "Di sini: kapan butuh aplikasi custom, cara kami kerja, dan aplikasi yang sudah jalan."},
    {"type": "list", "eyebrow": "Tandanya", "title": "Kapan butuh aplikasi custom?", "items": [
      "Data tercecer di Excel, WhatsApp, dan buku catatan",
      "Rekap akhir bulan makan waktu berjam-jam",
      "Aplikasi jadi nggak cocok dengan alur kerjamu",
      "Kamu nggak bisa cek angka tanpa nanya orang dulu"]},
    {"type": "flow", "eyebrow": "Cara kami kerja", "title": "Petakan dulu, baru bikin.", "steps": [
      ("Pahami dulu alur bisnismu", "Sebelum bicara kode."),
      ("Cakupan dan harga tertulis", "Jelas di depan, sebelum pengerjaan dimulai."),
      ("Desain, bangun, uji", "Kamu lihat progresnya secara berkala."),
      ("Live dan didampingi", "Sampai tim benar-benar terbiasa.")]},
    {"type": "list", "eyebrow": "Yang sudah jalan", "title": "Lima aplikasi, lima bidang usaha.", "items": [
      "IMS untuk pabrik dan manufaktur",
      "TokoKu untuk toko ritel dan jasa",
      "Sehatera untuk apotek dan klinik",
      "RCM untuk resto dan kafe",
      "Hari Baik, kalender siklus personal"],
     "cta": "Detailnya ada di highlight masing-masing"},
    {"type": "text", "eyebrow": "Konsultasi gratis", "title": "Ada proses yang masih ribet dicatat manual?",
     "sub": "Ceritain dulu alurnya, kami bantu petakan. Gratis, tanpa kewajiban.", "cta": "DM kami atau seawise.id"},
  ]},
  {"key": "ims", "date": "2026-09-26", "icon": "factory", "label": "IMS", "blurb": "Sistem produksi untuk pabrik",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Manufaktur", "title": "Industry Management (IMS)",
     "sub": "Sistem produksi untuk pabrik: dari bahan masuk sampai HPP per batch."},
    {"type": "text", "eyebrow": "Masalahnya", "title": "Spreadsheet terpisah, HPP cuma perkiraan.",
     "sub": "Stok fisik nggak cocok dengan catatan, dan bahan yang mau kedaluwarsa lolos dari pantauan."},
    {"type": "shot", "eyebrow": "Yang kami bangun", "title": "Seluruh alur produksi dalam satu sistem.", "shots": "ims"},
    {"type": "list", "eyebrow": "Isinya", "title": "Fitur utama", "items": [
      "Pembelian dengan alur persetujuan",
      "Stok FEFO dan kontrol kedaluwarsa",
      "Formula produk dan komposisi bahan",
      "HPP otomatis per batch dari harga lot yang terpakai",
      "Konsinyasi, POS, dan multi-user"]},
    {"type": "text", "eyebrow": "Hasilnya", "title": "HPP bisa dilihat kapan saja.",
     "sub": "Tim produksi dan pembelian kerja dari satu sumber data yang sama.", "cta": "ims.seawise.id"},
  ]},
  {"key": "tokoku", "date": "2026-09-27", "icon": "store", "label": "TokoKu", "blurb": "Kasir yang sekaligus membukukan",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Ritel dan jasa", "title": "TokoKu",
     "sub": "Kasir yang sekaligus membukukan, buat toko dan usaha jasa."},
    {"type": "text", "eyebrow": "Masalahnya", "title": "Laku, tapi untungnya berapa?",
     "sub": "Omzet dicatat di buku, pengeluaran nggak dicatat sama sekali."},
    {"type": "shot", "eyebrow": "Yang kami bangun", "title": "Kasir di HP, laporan di genggaman.", "shots": "tokoku"},
    {"type": "list", "eyebrow": "Isinya", "title": "Fitur utama", "items": [
      "Setiap transaksi otomatis mengurangi stok",
      "Pengeluaran ikut dihitung, laba bersih muncul sendiri",
      "Struk dicetak atau dikirim ke WhatsApp pembeli",
      "Pegawai cuma lihat yang perlu dilihat"]},
    {"type": "text", "eyebrow": "Sudah dipakai", "title": "Leuca de Perfume berhenti menebak arus kas.",
     "sub": "Semua transaksi mendarat di satu tempat, jadi modal buat stok berikutnya jelas.", "cta": "tokoku.seawise.id"},
  ]},
  {"key": "sehatera", "date": "2026-09-28", "icon": "pill", "label": "Sehatera", "blurb": "Sistem apotek terpadu",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Apotek dan klinik", "title": "Sehatera",
     "sub": "Sistem apotek terpadu: kasir, resep, stok per batch, sampai laporan SIPNAP."},
    {"type": "text", "eyebrow": "Masalahnya", "title": "Margin apotek bisa hilang diam-diam.",
     "sub": "Obat kedaluwarsa lolos, hutang supplier tercecer, dan SIPNAP dikerjakan manual berjam-jam."},
    {"type": "shot", "eyebrow": "Yang kami bangun", "title": "Satu sistem, dari kasir sampai laporan.", "shots": "sehatera"},
    {"type": "list", "eyebrow": "Isinya", "title": "Fitur utama", "items": [
      "Kasir dengan pencatatan resep",
      "Pelacakan batch dan peringatan dini kedaluwarsa",
      "Order terpandu, PO otomatis dipecah per distributor",
      "Pembayaran faktur dan hutang supplier",
      "Laporan SIPNAP otomatis, bisa multi-apotek"]},
    {"type": "text", "eyebrow": "Hasilnya", "title": "Siap audit kapan saja.",
     "sub": "Stok dan hutang terpantau di satu tempat, keputusan dari data, bukan perkiraan.", "cta": "sehatera.seawise.id"},
  ]},
  {"key": "rcm", "date": "2026-09-29", "icon": "utensils-crossed", "label": "RCM", "blurb": "Sistem resto dan kafe",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Resto dan kafe", "title": "Resto & Cafe Management",
     "sub": "Dari meja, ke dapur, sampai laporan tutup kasir. Bisa multi-outlet."},
    {"type": "text", "eyebrow": "Masalahnya", "title": "Jam ramai selalu jadi jam rawan.",
     "sub": "Pesanan tercecer antara kasir dan dapur, modal per porsi nggak terpantau."},
    {"type": "shot", "eyebrow": "Yang kami bangun", "title": "Kasir per meja, langsung ke layar dapur.", "shots": "rcm"},
    {"type": "list", "eyebrow": "Isinya", "title": "Fitur utama", "items": [
      "Kasir per meja dan take away",
      "Layar dapur (KDS) real-time",
      "QR order dari meja tamu",
      "HPP per porsi ikut harga bahan terbaru",
      "Multi-outlet, hak akses per modul"]},
    {"type": "text", "eyebrow": "Hasilnya", "title": "Jam sibuk lebih terkendali.",
     "sub": "Alur pesanan rapi, dan rekap harian selesai otomatis saat tutup.", "cta": "rcm.seawise.id"},
  ]},
  {"key": "haribaik", "date": "2026-09-30", "icon": "calendar-heart", "label": "Hari Baik", "blurb": "Kalender siklus personal",
   "slides": [
    {"type": "open", "eyebrow": "Highlight: Gaya hidup", "title": "Hari Baik",
     "sub": "Kalender siklus personal, dihitung dari tanggal lahirmu sendiri."},
    {"type": "text", "eyebrow": "Idenya", "title": "Satu kalender, bunyinya sama buat semua orang.",
     "sub": "Padahal perhitungan aslinya berangkat dari hari lahir tiap orang."},
    {"type": "shot", "eyebrow": "Yang kami bangun", "title": "Wariga, primbon, dan fengshui 81 angka dalam satu bacaan.",
     "shots": "haribaik"},
    {"type": "list", "eyebrow": "Isinya", "title": "Fitur utama", "items": [
      "Bacaan harian dan kalender sebulan penuh",
      "Watak kelahiran dan makna nama",
      "Kecocokan pasangan dan perjalanan hidup",
      "Pencari hari untuk acara",
      "Bisa dipasang di HP seperti aplikasi biasa"]},
    {"type": "text", "eyebrow": "Bukan ramalan, bukan AI", "title": "Aritmetika tetap yang bisa dihitung ulang siapa saja.",
     "sub": "Diuji terhadap seluruh 210 hari siklus pawukon.", "cta": "haribaik.seawise.id"},
  ]},
]


def shoot(doc, hp):
    open(hp, "w").write(doc)
    png = hp[:-5] + ".png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    "--window-size=1080,1920", "--virtual-time-budget=6000", "--allow-file-access-from-files",
                    f"--screenshot={png}", "file://" + hp], capture_output=True, timeout=60)
    print(png, os.path.exists(png))


def page(inner):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="s">{inner}</div></body></html>'


def main(only=None):
    os.makedirs(os.path.join(OUT, "covers"), exist_ok=True)
    for i, h in enumerate(HIGHLIGHTS, 1):
        if only and h["key"] not in only:
            continue
        shoot(page(cover(h)), os.path.join(OUT, "covers", f"cover-{i}-{h['key']}.html"))
        n = len(h["slides"])
        for j, s in enumerate(h["slides"], 1):
            shoot(page(body(h, s, j, n)), os.path.join(OUT, f"hl{i}-{h['key']}-{j}.html"))


if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
