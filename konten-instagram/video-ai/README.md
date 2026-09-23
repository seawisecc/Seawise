# Klip video AI untuk Reel

Hasil generate dari prompt di `../prompt-video.md` (Kling atau Google Flow).
Nama file harus sama dengan judul prompt-nya, misalnya
`video-ai/kasir-scan-cepat.mp4`.

Di `render_reels.py`, klip dipakai lewat frame `{"type": "clip", "clip":
"<nama>.mp4", "seconds": 4, ...}`: di-crop ke 1080x1920, disamakan ke 25fps,
audio aslinya dibuang, dan judul hook ditumpuk di atasnya.

Kling (free) dan Google Flow (paket Plus) menurut dokumentasinya memberi
watermark visible. Tiga klip pertama (23 Sep 2026) ternyata bersih, jadi
dipakai sebagai frame pembuka. Cek pojok-pojok frame tiap klip baru sebelum
dipakai: kalau ada watermark, potong durasinya atau jangan jadikan frame
pembuka.
