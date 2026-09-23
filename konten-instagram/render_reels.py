"""Render Seawise Instagram Reel frames (1080x1920) from REELS below via
headless Chrome, then assemble into an .mp4 with ffmpeg (slow zoom on photo
frames only, text and CTA cards held still, hard cuts between frames).

Frame types, same spirit as render_stories.py:
- "clip": a video from video-ai/ with a transparent overlay (shade, brand,
  eyebrow/title) laid on top. `seconds` sets how much of the clip is used.
- "photo": full-bleed photo (real > ai priority) with eyebrow/title, no
  swipe UI (that only makes sense for a static carousel/story, not video).
- "text": plain text card on dark background, no photo.
- "cta": closing card, "Follow" style.

Usage: `python3 render_reels.py [id ...]`, or `python3 render_reels.py
assemble [id ...]` to re-run ffmpeg without re-rendering the PNGs.

A reel is a short sequence of 3-5 frames telling one beat (hook, problem,
insight, CTA), each held ~2.2s, hard cut between frames.
No music: the final file carries a silent audio track only (see
prompt-video.md for why there is no music).

Requires ffmpeg (`brew install ffmpeg`) and Chrome, same as render.py.
"""
import html, os, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
A = "file://" + os.path.join(ROOT, "assets") + "/"
OUT = os.path.join(ROOT, "out_reels")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FOTO = os.path.join(ROOT, "foto-asli")
FOTO_AI = os.path.join(ROOT, "foto-ai")
VIDEO_AI = os.path.join(ROOT, "video-ai")
FRAME_SECONDS = 2.2
FPS = 25

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
.ph{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.phw{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden}
.shade{position:absolute;left:0;top:0;width:1080px;height:1922px;background:linear-gradient(to bottom,rgba(10,23,18,.55) 0%,rgba(10,23,18,.1) 35%,rgba(10,23,18,.1) 55%,rgba(10,23,18,.92) 88%,#0A1712 100%)}
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

def photo_for(f):
    real = real_photo(f.get("ai", ""), FOTO, "real") if f.get("ai") else None
    return real or real_photo(f["ai"], FOTO_AI, "ai")

def e(t):
    return html.escape(t, quote=False)

def render_frame(f):
    k = f["type"]
    if k == "clip":
        # Transparent overlay (shade + brand + headline) laid over the video clip by ffmpeg.
        sub = f'<p class="sub">{e(f["sub"])}</p>' if f.get("sub") else ""
        return (f'<div class="shade"></div>'
                f'<div class="top"><div class="brand"><img src="{A}logo-light.png">Seawise Studio</div></div>'
                f'<div class="txt"><div class="eyebrow">{e(f["eyebrow"])}</div><h1 style="font-size:80px">{e(f["title"])}</h1>{sub}</div>')
    if k == "photo":
        img = photo_for(f)
        sub = f'<p class="sub">{e(f["sub"])}</p>' if f.get("sub") else ""
        return (f'<div class="phw"><img class="ph" src="{A}{img}"></div><div class="shade"></div>'
                f'<div class="top"><div class="brand"><img src="{A}logo-light.png">Seawise Studio</div></div>'
                f'<div class="txt"><div class="eyebrow">{e(f["eyebrow"])}</div><h1 style="font-size:80px">{e(f["title"])}</h1>{sub}</div>')
    if k == "cta":
        return (f'<div class="glow"></div><div class="top"><div class="brand" style="background:none;backdrop-filter:none;padding:0">'
                f'<img src="{A}logo-light.png">Seawise Studio</div></div><div class="grow"></div>'
                f'<div style="position:relative;z-index:2"><div class="eyebrow">{e(f["eyebrow"])}</div><h1>{e(f["title"])}</h1>'
                + (f'<p class="sub">{e(f["sub"])}</p>' if f.get("sub") else "") + '</div><div class="grow"></div>'
                f'<div class="foot"><span class="pill">{e(f.get("cta", "seawise.id"))}</span></div>')
    # text
    return (f'<div class="glow"></div><div class="top"><div class="brand" style="background:none;backdrop-filter:none;padding:0">'
            f'<img src="{A}logo-light.png">Seawise Studio</div></div><div class="grow"></div>'
            f'<div style="position:relative;z-index:2"><div class="eyebrow">{e(f["eyebrow"])}</div><h1>{e(f["title"])}</h1>'
            + (f'<p class="sub">{e(f["sub"])}</p>' if f.get("sub") else "") + '</div><div class="grow"></div>')

def render_pngs(only=None):
    os.makedirs(OUT, exist_ok=True)
    for r in REELS:
        if only and r["id"] not in only:
            continue
        for i, f in enumerate(r["frames"], 1):
            clip = f["type"] == "clip"
            bg = "html,body,.s{background:transparent!important}" if clip else ""
            doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}{bg}</style></head><body><div class="s">{render_frame(f)}</div></body></html>'
            hp = os.path.join(OUT, f'{r["id"]}-{i:02d}.html')
            open(hp, "w").write(doc)
            png = hp[:-5] + ".png"
            cmd = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                   "--window-size=1080,1920", "--virtual-time-budget=6000", "--allow-file-access-from-files"]
            if clip:
                cmd.append("--default-background-color=00000000")
            subprocess.run(cmd + [f"--screenshot={png}", "file://" + hp], capture_output=True, timeout=60)
            print(png, os.path.exists(png))

ENC = ["-an", "-r", str(FPS), "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p"]

def assemble(only=None):
    """ffmpeg: clip frames get the transparent overlay on the video, still frames get a slow zoom, then concat."""
    for r in REELS:
        if only and r["id"] not in only:
            continue
        segs = []
        for i, f in enumerate(r["frames"], 1):
            png = os.path.join(OUT, f'{r["id"]}-{i:02d}.png')
            seg = os.path.join(OUT, f'{r["id"]}-{i:02d}.mp4')
            if f["type"] == "clip":
                src = os.path.join(VIDEO_AI, f["clip"])
                if not os.path.exists(src):
                    raise SystemExit(f"clip {f['clip']} not found in video-ai/")
                secs = str(f.get("seconds", 4))
                subprocess.run(["ffmpeg", "-y", "-i", src, "-loop", "1", "-i", png, "-t", secs, "-filter_complex",
                                f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps={FPS}[v];[v][1:v]overlay=0:0",
                                *ENC, seg], capture_output=True)
            elif f["type"] == "photo":
                d = int(FRAME_SECONDS * FPS)
                # Upscale before zoompan, otherwise the zoom steps in whole pixels and visibly jitters.
                subprocess.run(["ffmpeg", "-y", "-loop", "1", "-i", png, "-t", str(FRAME_SECONDS),
                                "-vf", f"scale=2160:3840,zoompan=z='min(zoom+0.0012,1.1)':d={d}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps={FPS}",
                                *ENC, seg], capture_output=True)
            else:
                # Text and CTA cards stay still: zooming them grows the headline and eats the side margin.
                subprocess.run(["ffmpeg", "-y", "-loop", "1", "-i", png, "-t", str(FRAME_SECONDS),
                                "-vf", f"fps={FPS}", *ENC, seg], capture_output=True)
            segs.append(seg)
        listfile = os.path.join(OUT, f'{r["id"]}-list.txt')
        with open(listfile, "w") as fh:
            for s in segs:
                fh.write(f"file '{os.path.basename(s)}'\n")
        video = os.path.join(OUT, f'{r["id"]}-video.mp4')
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listfile, "-c", "copy", video],
                        capture_output=True, cwd=OUT)
        # Silent AAC track: the reel is meant to be quiet, but some Instagram
        # ingest paths reject a video with no audio stream at all.
        final = os.path.join(OUT, f'{r["id"]}.mp4')
        subprocess.run(["ffmpeg", "-y", "-i", video, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                        "-shortest", "-c:v", "copy", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", final],
                        capture_output=True)
        print(final, os.path.exists(final))

# Frame "photo" belum dipakai reel mana pun; contohnya:
# {"type": "photo", "ai": "villa-double-booking", "eyebrow": "Buat pemilik villa", "title": "..."}
REELS = [
  # Periode 23 Sep - 19 Okt 2026, Minggu 19.00 WITA, di media/instagram/2026-q4-v2/reels/.
  {"id": "r01-kasir", "date": "2026-09-27", "frames": [
    {"type": "clip", "clip": "kasir-scan-cepat.mp4", "seconds": 4, "eyebrow": "Jam ramai di kasir", "title": "Satu transaksi lambat, antrean langsung numpuk."},
    {"type": "text", "eyebrow": "Masalahnya", "title": "Cari produk dan hitung kembalian masih manual."},
    {"type": "text", "eyebrow": "Solusinya", "title": "Scan barcode, kembalian dihitung otomatis."},
    {"type": "cta", "eyebrow": "Kasirmu masih manual?", "title": "Ngobrol dulu, gratis.", "cta": "seawise.id"},
  ]},
  {"id": "r02-catatan", "date": "2026-10-11", "frames": [
    {"type": "clip", "clip": "catatan-ke-cloud.mp4", "seconds": 4, "eyebrow": "Catatan usaha", "title": "Buku catatan bisa basah, hilang, atau keselip."},
    {"type": "text", "eyebrow": "Yang ikut hilang", "title": "Riwayat transaksi, hutang, dan bukti pembelian."},
    {"type": "text", "eyebrow": "Solusinya", "title": "Tercatat di sistem, bukan di laci."},
    {"type": "cta", "eyebrow": "Masih pakai buku?", "title": "Ngobrol dulu, gratis.", "cta": "seawise.id"},
  ]},
  {"id": "r03-rak", "date": "2026-10-04", "frames": [
    {"type": "clip", "clip": "rak-toko-tenang.mp4", "seconds": 4, "eyebrow": "Buat pemilik toko", "title": "Rak rapi belum tentu stoknya cocok."},
    {"type": "text", "eyebrow": "Tau nggak", "title": "Selisih stok biasanya dari kebocoran kecil yang nggak tercatat."},
    {"type": "text", "eyebrow": "Solusinya", "title": "Stok berkurang otomatis di tiap transaksi."},
    {"type": "cta", "eyebrow": "Stok sering selisih?", "title": "Ngobrol dulu, gratis.", "cta": "seawise.id"},
  ]},
]

if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["assemble"]:
        assemble(set(args[1:]) or None)
    else:
        render_pngs(set(args) or None)
        assemble(set(args) or None)
