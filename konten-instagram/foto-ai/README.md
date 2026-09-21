# Foto AI untuk Instagram

Hasil generate dari prompt di `../prompt-gambar.md`. Nama file harus sama
dengan judul prompt-nya, misalnya `villa-double-booking.jpg`.

Di `posts.py`, slide cover merujuk foto ini lewat kunci `ai`, contohnya
`"ai": "villa-double-booking"`. Urutan prioritas cover saat render:

1. `real`: foto asli di `../foto-asli/`
2. `ai`: foto di folder ini
3. `photo` atau mockup screenshot yang tertulis di slide
