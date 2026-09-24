"""Square (1080x1080) product images for the Google Business Profile Products tab.

Website packages get a price card, apps get their portfolio screenshot on the
brand background. Prices must match the `pricing` table and each app's own
pricing page. Reuses konten-instagram/assets (logo, icons, hl-*-shot.jpg).

Output: out_produk/<key>.jpg
"""
import html, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
IG = os.path.join(ROOT, "..", "konten-instagram")
sys.path.insert(0, IG)
from render_highlights import icon, CHROME  # noqa: E402

A = "file://" + os.path.abspath(os.path.join(IG, "assets")) + "/"
OUT = os.path.join(ROOT, "out_produk")

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1080px;overflow:hidden}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1080px;padding:80px;display:flex;flex-direction:column;background:#0A1712;color:#FAFAF8;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(900px 700px at 100% 0%,rgba(92,133,119,.38),transparent 60%)}
.z{position:relative;z-index:2}
.brand{display:flex;align-items:center;gap:14px;font-family:'Space Grotesk';font-weight:600;font-size:30px}
.brand img{height:44px}
.eyebrow{font-family:'Space Grotesk';font-weight:600;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#9DC2B4;margin-bottom:18px}
h1{font-family:'Space Grotesk';font-weight:700;font-size:96px;line-height:1;letter-spacing:-.03em}
.price{font-family:'Space Grotesk';font-weight:700;font-size:72px;color:#9DC2B4;margin-top:22px}
ul{list-style:none;margin-top:44px;display:flex;flex-direction:column;gap:22px}
li{display:flex;gap:20px;font-size:36px;line-height:1.3}
li svg{flex:none;width:40px;height:40px;margin-top:2px}
.grow{flex:1}
.shot{position:absolute;left:80px;right:80px;bottom:80px;border-radius:20px;overflow:hidden;border:8px solid #1E2E28;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.shot img{display:block;width:100%}
.demo{position:absolute;right:96px;bottom:96px;font-size:22px;padding:8px 18px;border-radius:999px;background:rgba(10,23,18,.8);color:#CFE0D9}
"""

WEB = [
    ("website-shore", "Shore", "Rp2 jt", ["1 halaman untuk promosi", "Maksimal 4 sampai 5 section", "SEO metadata standar"]),
    ("website-reef", "Reef", "Rp3,5 jt", ["Company profile utuh", "Admin panel teks, harga, foto", "SEO + structured data"]),
    ("website-current", "Current", "Rp4,5 jt", ["8 sampai 10 section", "Kustomisasi warna dan layout", "Bisa tambah 1 add-on"]),
    ("website-trench", "Trench", "Rp12 jt", ["Full custom, section bebas", "Termasuk 1 add-on", "Prioritas support"]),
]
APPS = [
    ("app-rcm", "rcm", "Resto dan kafe", "RCM"),
    ("app-haribaik", "haribaik", "Kalender siklus personal", "Hari Baik"),
]


def e(t):
    return html.escape(t, quote=False)


def web(name, price, items):
    li = "".join(f'<li>{icon("check")}<span>{e(i)}</span></li>' for i in items)
    return (f'<div class="glow"></div><div class="brand z"><img src="{A}logo-light.png">Seawise Studio</div>'
            f'<div class="grow"></div><div class="z"><div class="eyebrow">Paket website</div><h1>{e(name)}</h1>'
            f'<div class="price">{e(price)}</div><ul>{li}</ul></div>')


def app(shot, eyebrow, name):
    return (f'<div class="glow"></div><div class="brand z"><img src="{A}logo-light.png">Seawise Studio</div>'
            f'<div class="z" style="margin-top:56px"><div class="eyebrow">{e(eyebrow)}</div><h1 style="font-size:84px">{e(name)}</h1></div>'
            f'<div class="shot z"><img src="{A}hl-{shot}-shot.jpg"></div><div class="demo z">Tampilan dengan data demo</div>')


def shoot(key, inner):
    hp = os.path.join(OUT, key + ".html")
    open(hp, "w").write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>'
                        f'<body><div class="s">{inner}</div></body></html>')
    png = hp[:-5] + ".png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    "--window-size=1080,1080", "--virtual-time-budget=6000", "--allow-file-access-from-files",
                    f"--screenshot={png}", "file://" + hp], capture_output=True, timeout=60)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "90", png, "--out", hp[:-5] + ".jpg"],
                   capture_output=True)
    print(hp[:-5] + ".jpg", os.path.exists(hp[:-5] + ".jpg"))


def main():
    os.makedirs(OUT, exist_ok=True)
    for key, name, price, items in WEB:
        shoot(key, web(name, price, items))
    for key, shot, eyebrow, name in APPS:
        shoot(key, app(shot, eyebrow, name))


if __name__ == "__main__":
    main()
