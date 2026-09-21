"""Render Seawise Instagram carousels (1080x1350) from posts.py via headless Chrome."""
import html, json, os, subprocess, sys
from posts import POSTS

ROOT = os.path.dirname(os.path.abspath(__file__))
A = "file://" + os.path.join(ROOT, "assets") + "/"
OUT = os.path.join(ROOT, "out")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1350px;padding:88px 88px 96px;display:flex;flex-direction:column}
.dark{background:#0A1712;color:#FAFAF8}
.light{background:#FAFAF8;color:#132A22}
.warm{background:#E8E4D9;color:#132A22}
.glow{position:absolute;inset:0;background:radial-gradient(900px 700px at 100% 0%,rgba(92,133,119,.35),transparent 60%);pointer-events:none}
.top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.brand{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk';font-weight:600;font-size:30px;letter-spacing:-.01em}
.brand img{height:46px}
.tag{font-family:'Space Grotesk';font-weight:600;font-size:22px;letter-spacing:.14em;text-transform:uppercase;padding:12px 22px;border-radius:999px;border:2px solid currentColor;opacity:.9}
.dark .tag{color:#9DC2B4}
.light .tag,.warm .tag{color:#5C8577}
.eyebrow{font-family:'Space Grotesk';font-weight:600;font-size:26px;letter-spacing:.14em;text-transform:uppercase;color:#5C8577;margin-bottom:28px}
.dark .eyebrow{color:#9DC2B4}
h1{font-family:'Space Grotesk';font-weight:700;font-size:92px;line-height:1.02;letter-spacing:-.03em}
h2{font-family:'Space Grotesk';font-weight:700;font-size:66px;line-height:1.06;letter-spacing:-.025em}
.sub{font-size:34px;line-height:1.4;margin-top:36px;opacity:.78;max-width:860px}
.body{font-size:36px;line-height:1.45;margin-top:36px;opacity:.85}
.body b{opacity:1;font-weight:700}
.grow{flex:1}
.foot{position:absolute;left:88px;right:88px;bottom:64px;display:flex;justify-content:space-between;align-items:center;font-size:24px;font-weight:500;opacity:.6}
.swipe{font-family:'Space Grotesk';font-weight:600;font-size:26px;color:#9DC2B4;opacity:1}
.foot.cov{opacity:1}
.foot.cov .n{opacity:.6}
.items{margin-top:44px;border-top:2px solid rgba(92,133,119,.35)}
.item{display:flex;gap:32px;padding:30px 0;border-bottom:2px solid rgba(92,133,119,.35)}
.num{font-family:'Space Grotesk';font-weight:700;font-size:44px;color:#5C8577;min-width:64px;line-height:1.1}
.it b{display:block;font-family:'Space Grotesk';font-weight:700;font-size:38px;line-height:1.18;letter-spacing:-.01em}
.it span{display:block;font-size:29px;line-height:1.4;margin-top:10px;opacity:.72}
.big{font-family:'Space Grotesk';font-weight:700;font-size:150px;line-height:1;color:#5C8577;letter-spacing:-.04em}
.frame{margin-top:48px;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px rgba(10,23,18,.28);background:#fff}
.frame .bar{height:40px;background:#132A22;display:flex;gap:10px;align-items:center;padding:0 18px}
.frame .bar i{width:13px;height:13px;border-radius:50%;background:rgba(250,250,248,.35)}
.frame img{display:block;width:100%}
.cap{font-size:28px;line-height:1.4;margin-top:36px;opacity:.78}
.note{font-size:22px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5C8577;margin-top:18px}
.peek{position:absolute;left:88px;right:88px;bottom:-40px;border-radius:22px 22px 0 0;overflow:hidden;box-shadow:0 -20px 80px rgba(0,0,0,.45);z-index:1}
.peek img{display:block;width:100%}
.peek:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,23,18,0) 40%,rgba(10,23,18,.85) 100%)}
table{width:100%;border-collapse:collapse;margin-top:44px;font-size:30px}
td{padding:24px 0;border-bottom:2px solid rgba(92,133,119,.35);vertical-align:top}
td:last-child{text-align:right;font-family:'Space Grotesk';font-weight:700;font-size:34px;white-space:nowrap;padding-left:24px}
td small{display:block;font-size:24px;opacity:.65;margin-top:6px;font-family:Inter;font-weight:400}
tr.total td{border-bottom:none;border-top:4px solid #132A22;font-family:'Space Grotesk';font-weight:700;font-size:38px}
tr.total td:last-child{font-size:46px;color:#5C8577}
.formula{margin-top:60px;padding:56px 52px;border-radius:28px;background:#132A22;color:#FAFAF8;font-family:'Space Grotesk';font-weight:700;font-size:52px;line-height:1.25;letter-spacing:-.015em}
.formula em{font-style:normal;color:#9DC2B4}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:48px}
.card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 16px 40px rgba(10,23,18,.12)}
.card img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top left}
.card div{padding:22px 24px 26px}
.card b{display:block;font-family:'Space Grotesk';font-weight:700;font-size:30px;letter-spacing:-.01em}
.card span{display:block;font-size:22px;opacity:.65;margin-top:6px}
.pill{display:inline-flex;align-items:center;gap:14px;margin-top:56px;padding:28px 44px;border-radius:999px;background:#FAFAF8;color:#0A1712;font-family:'Space Grotesk';font-weight:700;font-size:36px;align-self:flex-start}
.ctalist{margin-top:40px;font-size:30px;line-height:1.7;opacity:.8}
"""

def e(t):
    return html.escape(t, quote=False)

def rich(t):
    # **bold** only
    parts = e(t).split("**")
    return "".join(f"<b>{p}</b>" if i % 2 else p for i, p in enumerate(parts))

def logo(theme):
    return A + ("logo-light.png" if theme == "dark" else "logo-dark.png")

def top(theme, tag):
    t = f'<span class="tag">{e(tag)}</span>' if tag else ""
    return f'<div class="top"><div class="brand"><img src="{logo(theme)}">Seawise Studio</div>{t}</div>'

def foot(i, n, cover=False):
    if cover:
        return f'<div class="foot cov"><span class="swipe">Geser untuk baca &rarr;</span><span class="n">{i}/{n}</span></div>'
    return f'<div class="foot"><span>seawise.id</span><span>{i}/{n}</span></div>'

def slide(p, s, i, n):
    k = s["type"]
    if k == "cover":
        img = s.get("image")
        pad = "padding-bottom:600px" if img else ""
        peek = f'<div class="peek"><img src="{A}{img}"></div>' if img else ""
        sub = f'<p class="sub">{rich(s["sub"])}</p>' if s.get("sub") else ""
        return ("dark", f'<div class="glow"></div>{top("dark", p["tag"])}<div class="grow"></div>'
                f'<div style="position:relative;z-index:2;{pad}"><div class="eyebrow">{e(s["eyebrow"])}</div><h1>{e(s["title"])}</h1>{sub}</div>'
                f'<div style="height:{"0" if img else "90"}px"></div>{peek}{foot(i, n, True) if not img else ""}')
    if k == "list":
        rows = "".join(
            f'<div class="item"><div class="num">{e(str(it.get("n", "")))}</div><div class="it"><b>{e(it["t"])}</b>'
            + (f'<span>{e(it["d"])}</span>' if it.get("d") else "") + "</div></div>"
            for it in s["items"])
        intro = f'<p class="body" style="margin-top:24px">{rich(s["intro"])}</p>' if s.get("intro") else ""
        return (s.get("theme", "light"), f'{top(s.get("theme","light"), None)}<div class="grow"></div><div><h2>{e(s["title"])}</h2>{intro}</div><div class="items">{rows}</div><div class="grow"></div><div style="height:40px"></div>{foot(i, n)}')
    if k == "text":
        big = f'<div class="big">{e(s["big"])}</div><div style="height:32px"></div>' if s.get("big") else ""
        eb = f'<div class="eyebrow">{e(s["eyebrow"])}</div>' if s.get("eyebrow") else ""
        return (s.get("theme", "light"), f'{top(s.get("theme","light"), None)}<div class="grow"></div><div>{eb}{big}<h2>{e(s["title"])}</h2>'
                + "".join(f'<p class="body">{rich(b)}</p>' for b in s["body"]) + f'</div><div class="grow"></div><div style="height:40px"></div>{foot(i, n)}')
    if k == "image":
        note = f'<div class="note">{e(s["note"])}</div>' if s.get("note") else ""
        return ("warm", f'{top("warm", None)}<div style="margin-top:64px"><div class="eyebrow">{e(s["eyebrow"])}</div><h2>{e(s["title"])}</h2></div>'
                f'<div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="{A}{s["image"]}"></div><p class="cap">{rich(s["cap"])}</p>{note}{foot(i, n)}')
    if k == "grid":
        cards = "".join(f'<div class="card"><img src="{A}{c["img"]}"><div><b>{e(c["t"])}</b><span>{e(c["d"])}</span></div></div>' for c in s["cards"])
        return ("warm", f'{top("warm", None)}<div style="margin-top:64px"><h2>{e(s["title"])}</h2></div><div class="grid">{cards}</div><div class="note" style="margin-top:32px">{e(s.get("note",""))}</div>{foot(i, n)}')
    if k == "table":
        rows = ""
        for r in s["rows"]:
            cls = ' class="total"' if r.get("total") else ""
            small = f'<small>{e(r["d"])}</small>' if r.get("d") else ""
            rows += f'<tr{cls}><td>{e(r["l"])}{small}</td><td>{e(r["v"])}</td></tr>'
        note = f'<div class="note">{e(s["note"])}</div>' if s.get("note") else ""
        intro = f'<p class="body" style="margin-top:24px">{rich(s["intro"])}</p>' if s.get("intro") else ""
        return ("light", f'{top("light", None)}<div class="grow"></div><div><h2>{e(s["title"])}</h2>{intro}</div><table>{rows}</table>{note}<div class="grow"></div><div style="height:40px"></div>{foot(i, n)}')
    if k == "formula":
        return ("light", f'{top("light", None)}<div class="grow"></div><div><div class="eyebrow">{e(s["eyebrow"])}</div><h2>{e(s["title"])}</h2>'
                f'<div class="formula">{s["html"]}</div><p class="body">{rich(s["after"])}</p></div><div class="grow"></div><div style="height:40px"></div>{foot(i, n)}')
    if k == "cta":
        lines = "".join(f"<div>{rich(l)}</div>" for l in s.get("lines", []))
        return ("dark", f'<div class="glow"></div>{top("dark", None)}<div class="grow"></div><div style="position:relative;z-index:2;display:flex;flex-direction:column">'
                f'<div class="eyebrow">{e(s.get("eyebrow","Seawise Studio"))}</div><h1 style="font-size:84px">{e(s["title"])}</h1><p class="sub">{rich(s["sub"])}</p>'
                f'<div class="ctalist">{lines}</div><span class="pill">{e(s["button"])} &rarr;</span></div><div style="height:90px"></div>{foot(i, n)}')
    raise ValueError(k)

def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    for p in POSTS:
        if only and p["id"] not in only:
            continue
        n = len(p["slides"])
        for i, s in enumerate(p["slides"], 1):
            theme, inner = slide(p, s, i, n)
            doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="s {theme}">{inner}</div></body></html>'
            hp = os.path.join(OUT, f'{p["id"]}-{i:02d}.html')
            open(hp, "w").write(doc)
            png = hp[:-5] + ".png"
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                            "--window-size=1080,1350", "--virtual-time-budget=6000", "--allow-file-access-from-files",
                            f"--screenshot={png}", "file://" + hp], capture_output=True, timeout=60)
            print(png, os.path.exists(png))

if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
