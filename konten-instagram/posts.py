"""Instagram content calendar for @seawise.id. Times are 19:00 WITA (UTC+8).

Covers:
- Edukasi and kenalan posts use `photocover` with the AI blog cover of the
  matching article (`blog-<slug>.jpg`).
- Case studies use `cover` with a screenshot peek, plus `real`: once
  foto-asli/<real>.jpg exists, render.py swaps in the real photo automatically.

Captions live in captions.json so slide edits never touch published copy.
"""
import json, os

CAPTIONS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "captions.json")))

CTA_BLOG = lambda title, sub: {"type": "cta", "eyebrow": "Mau baca lengkapnya?", "title": title, "sub": sub,
                               "button": "Link di bio · Blog"}
CTA_TALK = {"type": "cta", "eyebrow": "Konsultasi gratis", "title": "Ceritain dulu alur bisnismu.",
            "sub": "Kami pelajari cara kerjamu dulu, baru bicara solusi. Ngobrolnya gratis, tanpa kewajiban.",
            "button": "Link di bio · seawise.id"}
DEMO = "Tampilan dengan data demo"

POSTS = [
# 1 ─────────────────────────────────────────────
{"id": "01-kenalan", "date": "2026-09-23", "tag": "Kenalan", "slides": [
  {"type": "photocover", "real": "tim", "photo": "blog-jasa-pembuatan-aplikasi-custom.jpg", "eyebrow": "Seawise Studio · Bali",
   "title": "Website dan aplikasi yang benar-benar dipakai bisnis."},
  {"type": "list", "title": "Yang kami kerjakan", "items": [
    {"icon": "globe", "t": "Website bisnis", "d": "Landing page, company profile, sampai website custom yang isinya bisa kamu ubah sendiri."},
    {"icon": "app-window", "t": "Aplikasi custom", "d": "Kasir, stok, apotek, restoran, sampai ERP pabrik. Sistemnya mengikuti alur kerjamu."},
    {"icon": "handshake", "t": "Pendampingan setelah live", "d": "Tim dilatih sampai terbiasa, dan kami tetap bisa dihubungi."}]},
  {"type": "grid", "title": "Beberapa yang sudah jalan", "note": "Semua bisa dibuka di seawise.id/portfolio", "cards": [
    {"img": "retail-service-umkm-edition-shot.jpg", "t": "TokoKu", "d": "Ritel & UMKM"},
    {"img": "pharmacy-store-management-psm-shot.jpg", "t": "Sehatera", "d": "Apotek"},
    {"img": "resto-cafe-management-rcm-shot.jpg", "t": "Resto & Cafe", "d": "Restoran, kafe & bar"},
    {"img": "industry-management-ims-shot.jpg", "t": "Industry Management", "d": "Manufaktur"}]},
  {"type": "flow", "eyebrow": "Cara kami kerja", "title": "Dari ngobrol sampai dipakai tiap hari.", "steps": [
    {"icon": "messages-square", "t": "Pahami dulu alur bisnismu", "d": "Sebelum bicara kode."},
    {"icon": "file-text", "t": "Cakupan dan harga tertulis", "d": "Jelas di depan, sebelum pengerjaan dimulai."},
    {"icon": "code-xml", "t": "Desain, bangun, uji", "d": "Kamu lihat progresnya secara berkala."},
    {"icon": "rocket", "t": "Live dan didampingi", "d": "Sampai tim benar-benar terbiasa."}]},
  CTA_TALK]},

# 2 ─────────────────────────────────────────────
{"id": "02-tanda-excel", "date": "2026-09-25", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-aplikasi-kasir-umkm.jpg", "eyebrow": "Buat pemilik toko",
   "title": "6 tanda usahamu sudah kebesaran buat Excel."},
  {"type": "list", "title": "Tanda 1 sampai 3", "items": [
    {"icon": "search", "t": "Stok baru ketahuan setelah dicek ke rak", "d": "Catatan nggak bisa dipegang, jadi harus hitung fisik dulu."},
    {"icon": "clock", "t": "Rekap harian makan waktu", "d": "Dan angkanya sering meleset dari uang di laci."},
    {"icon": "circle-help", "t": "Nggak tahu produk paling laku", "d": "Belanja stok jadi pakai feeling."}]},
  {"type": "list", "title": "Tanda 4 sampai 6", "items": [
    {"icon": "wallet", "t": "Omzet besar, untung bersih misteri", "d": "Pengeluaran nggak ikut tercatat."},
    {"icon": "users-round", "t": "Kasir lebih dari satu", "d": "Atau mau buka cabang. File Excel mulai bentrok."},
    {"icon": "calculator", "t": "Salah hitung saat ramai", "d": "Harga, diskon, atau kembalian."}]},
  {"type": "text", "eyebrow": "Kena beberapa?", "title": "Excel-nya sudah mulai membatasi, bukan membantu.",
   "body": ["Aplikasi kasir mencatat transaksi, mengurangi stok, dan menyusun laporan **sekaligus, otomatis**.",
            "Nggak ada lagi rekap malam-malam sambil nyocokin angka."]},
  CTA_BLOG("Panduan pindah dari Excel ke aplikasi kasir.", "Fitur yang wajib ada, bedanya dengan Excel, dan cara memilih yang pas buat usahamu.")]},

# 3 ─────────────────────────────────────────────
{"id": "03-studi-tokoku", "date": "2026-09-28", "tag": "Studi kasus", "slides": [
  {"type": "cover", "real": "tokoku", "eyebrow": "TokoKu · Ritel & UMKM",
   "title": "Dari nota tulis tangan ke arus kas yang bisa dicek kapan saja.", "image": "retail-service-umkm-edition-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Laku, tapi untungnya berapa?",
   "body": ["Leuca de Perfume dulu mencatat penjualan secara manual. Nota ditulis tangan, dan kadang ada pembelian yang **lolos tidak tercatat** sama sekali.",
            "Pemilik tidak punya gambaran arus kas yang bisa dipercaya saat mau belanja stok berikutnya."]},
  {"type": "devices", "eyebrow": "Yang kami bangun", "title": "Kasir yang sekaligus membukukan.",
   "desktop": "retail-service-umkm-edition-shot.jpg", "mobile": "retail-service-umkm-edition-mobile.jpg",
   "cap": "Jalan di laptop, tablet, dan HP. Pemilik bisa cek dari mana saja.", "note": DEMO},
  {"type": "flow", "eyebrow": "Cara kerjanya", "title": "Satu transaksi, semuanya beres.", "steps": [
    {"icon": "shopping-cart", "t": "Transaksi di kasir", "d": "Cari produk atau scan barcode."},
    {"icon": "package-minus", "t": "Stok berkurang otomatis", "d": "Tanpa input ulang."},
    {"icon": "message-circle", "t": "Struk ke WhatsApp pembeli", "d": "Atau dicetak di printer termal."},
    {"icon": "wallet", "t": "Laba bersih langsung kelihatan", "d": "Karena pengeluaran ikut tercatat."}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Mengatur modal berhenti jadi tebakan.",
   "body": ["Semua transaksi mendarat di satu tempat, jadi arus kas bisa dibuka kapan saja dari HP.",
            "Pemilik tahu **berapa uang yang aman** dipakai buat belanja stok berikutnya."]},
  CTA_TALK]},

# 4 ─────────────────────────────────────────────
{"id": "04-hpp-kopi", "date": "2026-09-30", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-aplikasi-kasir-restoran.jpg", "eyebrow": "Buat pemilik kafe",
   "title": "Modal segelas es kopi susu aren kamu berapa?"},
  {"type": "table", "title": "Hitung per bahan", "intro": "Satu gelas, dipecah sesuai resep.", "rows": [
    {"l": "Biji kopi", "d": "18 g · Rp250.000/kg", "v": "Rp4.500"},
    {"l": "Susu segar", "d": "150 ml · Rp22.000/liter", "v": "Rp3.300"},
    {"l": "Gula aren cair", "d": "20 ml · Rp40.000/liter", "v": "Rp800"},
    {"l": "Es batu dan cup", "d": "1 set", "v": "Rp1.500"},
    {"l": "HPP per porsi", "v": "Rp10.100", "total": True}], "note": "Angka ilustrasi"},
  {"type": "compare", "eyebrow": "Masalahnya", "title": "Harga bahan nggak pernah diam.",
   "cells": [{"l": "Susu naik / liter", "v": "+4rb"}, {"l": "HPP naik / gelas", "v": "+600", "hl": True}],
   "body": ["Kalau harga jual tetap, margin turun diam-diam, dan biasanya **baru ketahuan di akhir bulan**."], "note": "Angka ilustrasi, dalam rupiah"},
  {"type": "text", "eyebrow": "Solusinya", "title": "HPP yang ikut harga bahan.",
   "body": ["Aplikasi kasir restoran yang menyimpan **resep per menu** bisa menghitung ulang HPP otomatis setiap harga bahan berubah.",
            "Kamu tahu menu mana yang masih untung, dan mana yang perlu dinaikkan harganya."]},
  CTA_BLOG("7 fitur wajib aplikasi kasir restoran.", "Dari layar dapur, QR order, sampai HPP per porsi. Lengkap dengan contoh hitungannya.")]},

# 5 ─────────────────────────────────────────────
{"id": "05-studi-resto", "date": "2026-10-02", "tag": "Studi kasus", "slides": [
  {"type": "cover", "real": "resto", "eyebrow": "Resto & Cafe Management · F&B",
   "title": "Pesanan nggak lagi tercecer antara kasir dan dapur.", "image": "resto-cafe-management-rcm-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Jam ramai selalu jadi jam rawan.",
   "body": ["Pesanan tercecer antara kasir dan dapur, modal per porsi nggak terpantau, dan rekap penjualan makan waktu **setiap kali tutup**.",
            "Saat ramai, salah order dan antrean menumpuk jadi masalah yang berulang."]},
  {"type": "devices", "eyebrow": "Yang kami bangun", "title": "Satu sistem dari meja sampai dapur.",
   "desktop": "resto-cafe-management-rcm-shot.jpg", "mobile": "resto-cafe-management-rcm-mobile.jpg",
   "cap": "Kasir per meja terhubung langsung ke layar dapur, dan tamu bisa pesan lewat QR dari meja.", "note": DEMO},
  {"type": "flow", "eyebrow": "Alur pesanan", "title": "Dari meja ke dapur, tanpa kertas.", "steps": [
    {"icon": "qr-code", "t": "Tamu pesan dari meja", "d": "Lewat QR, atau dicatat kasir per meja."},
    {"icon": "chef-hat", "t": "Langsung muncul di layar dapur", "d": "Nggak ada kertas order yang hilang."},
    {"icon": "coins", "t": "HPP per porsi ikut harga bahan", "d": "Margin tiap menu kelihatan."},
    {"icon": "store", "t": "Rekap semua outlet otomatis", "d": "Selesai begitu tutup."}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Jam sibuk lebih terkendali.",
   "body": ["Alur pesanan dari kasir ke dapur jadi rapi, modal per porsi kelihatan jelas, dan **rekap harian selesai otomatis** saat tutup."]},
  CTA_TALK]},

# 6 ─────────────────────────────────────────────
{"id": "06-bocor-stok", "date": "2026-10-05", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-aplikasi-stok-barang-toko-retail.jpg", "eyebrow": "Buat pemilik toko",
   "title": "Di catatan 12. Di rak tinggal 5. Ke mana sisanya?"},
  {"type": "compare", "eyebrow": "Kejadian sehari-hari", "title": "Selisihnya jarang dari satu kesalahan besar.",
   "cells": [{"l": "Di catatan", "v": "12"}, {"l": "Di rak", "v": "5"}, {"l": "Hilang ke mana?", "v": "7", "hl": True}],
   "body": ["Biasanya ia menumpuk dari **5 kebocoran kecil** yang nggak kerasa. Geser."], "note": "Angka ilustrasi"},
  {"type": "list", "title": "Kebocoran 1 sampai 3", "items": [
    {"icon": "receipt", "t": "Penjualan yang lolos", "d": "Nggak sempat dicatat saat ramai, atau notanya hilang."},
    {"icon": "truck", "t": "Barang masuk nggak diinput", "d": "Langsung dipajang, dicatatnya nanti. Atau lupa."},
    {"icon": "package-x", "t": "Retur dan barang rusak", "d": "Keluar dari rak, tapi nggak dikurangi dari catatan."}]},
  {"type": "list", "title": "Kebocoran 4 dan 5", "items": [
    {"icon": "gift", "t": "Pemakaian sendiri", "d": "Diambil buat sampel, hadiah, atau keperluan toko."},
    {"icon": "clipboard-list", "t": "Salah hitung saat opname", "d": "Hasilnya langsung ditimpa, penyebab selisihnya nggak pernah dicari."}]},
  {"type": "text", "eyebrow": "Jadi siapa yang salah?", "title": "Bukan pegawainya. Sistemnya.",
   "body": ["Buku dan Excel bergantung pada orang yang **harus ingat** mencatat setiap kejadian.",
            "Makin ramai toko, makin besar peluang ada yang terlewat. Aplikasi stok memindahkan beban itu ke sistem."]},
  CTA_BLOG("Panduan aplikasi stok barang toko retail.", "Fitur wajib, cara stok opname yang benar, dan rumus kapan harus restock.")]},

# 7 ─────────────────────────────────────────────
{"id": "07-rumus-restock", "date": "2026-10-07", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-aplikasi-stok-barang-toko-retail.jpg", "pos": "85% 55%", "zoom": 1.55,
   "eyebrow": "Simpan dulu", "title": "Kapan harus restock? Jangan ditebak, dihitung."},
  {"type": "formula", "eyebrow": "Titik pesan ulang", "title": "Pesan lagi saat stok menyentuh angka ini:",
   "html": "rata-rata terjual per hari<br><em>×</em> waktu tunggu supplier<br><em>+</em> stok pengaman",
   "after": "Stok pengaman itu cadangan buat hari ramai atau kiriman yang telat."},
  {"type": "table", "title": "Contoh: parfum 50 ml", "rows": [
    {"l": "Terjual per hari", "v": "4 botol"},
    {"l": "Waktu tunggu supplier", "v": "5 hari"},
    {"l": "Kebutuhan selama menunggu", "d": "4 × 5", "v": "20 botol"},
    {"l": "Stok pengaman", "d": "3 hari penjualan", "v": "12 botol"},
    {"l": "Titik pesan ulang", "v": "32 botol", "total": True}], "note": "Angka ilustrasi"},
  {"type": "compare", "eyebrow": "Bedanya", "title": "Pesan di angka yang tepat.",
   "cells": [{"l": "Pesan di sisa", "v": "32", "hl": True}, {"l": "Kalau baru di sisa", "v": "10"}],
   "body": ["Pesan di 10? Rak bakal **kosong 2 sampai 3 hari** sebelum kiriman datang.",
            "Angka rata-rata penjualannya gampang didapat dari aplikasi yang mencatat setiap transaksi."], "note": "Angka ilustrasi"},
  CTA_BLOG("Panduan aplikasi stok barang toko retail.", "Penyebab selisih stok, fitur wajib, dan cara memilih yang tepat.")]},

# 8 ─────────────────────────────────────────────
{"id": "08-tanda-apotek", "date": "2026-10-09", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-aplikasi-apotek.jpg", "eyebrow": "Buat pemilik apotek",
   "title": "5 tanda apotekmu sudah butuh aplikasi."},
  {"type": "list", "title": "Cek satu per satu", "items": [
    {"icon": "calendar-x", "t": "Obat kedaluwarsa lolos pantauan"},
    {"icon": "package-search", "t": "Stok fisik nggak cocok dengan catatan"},
    {"icon": "clock", "t": "Rekap penjualan dan pembelian makan berjam-jam"},
    {"icon": "circle-help", "t": "Susah jawab sisa stok saat pelanggan tanya"},
    {"icon": "file-text", "t": "Laporan regulasi masih dikerjakan manual"}]},
  {"type": "table", "title": "Fitur yang mencegahnya", "rows": [
    {"l": "Batch dan kedaluwarsa", "d": "Obat kedaluwarsa ketahuan lebih awal", "v": "01"},
    {"l": "Stok real time", "d": "Catatan selalu cocok dengan rak", "v": "02 · 04"},
    {"l": "Kasir terhubung stok", "d": "Setiap penjualan langsung tercatat", "v": "03"},
    {"l": "Laporan otomatis", "d": "Termasuk laporan regulasi", "v": "05"}]},
  {"type": "text", "eyebrow": "Kenapa nomor 1 paling mahal?", "title": "Kerugiannya dobel.",
   "body": ["Obat kedaluwarsa itu **modal yang hilang**, sekaligus risiko buat keamanan pasien.",
            "Dengan pelacakan per batch, peringatan muncul jauh sebelum tanggalnya lewat."]},
  CTA_BLOG("Fitur wajib aplikasi apotek.", "Dari pelacakan batch sampai laporan otomatis, plus cara memilih yang tepat.")]},

# 9 ─────────────────────────────────────────────
{"id": "09-studi-sehatera", "date": "2026-10-12", "tag": "Studi kasus", "slides": [
  {"type": "cover", "real": "sehatera", "eyebrow": "Sehatera · Apotek",
   "title": "Apotek yang berhenti kehilangan margin diam-diam.", "image": "pharmacy-store-management-psm-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Kebocoran yang nggak kelihatan.",
   "body": ["Obat kedaluwarsa lolos dari pantauan, stok dan hutang ke supplier tercecer di banyak catatan.",
            "Dan laporan SIPNAP dikerjakan manual **sampai berjam-jam**."]},
  {"type": "devices", "eyebrow": "Yang kami bangun", "title": "Satu sistem apotek terpadu.",
   "desktop": "pharmacy-store-management-psm-g0.jpg", "mobile": "pharmacy-store-management-psm-mobile.jpg",
   "cap": "Setiap obat dilacak per batch, dengan peringatan dini menjelang kedaluwarsa.", "note": DEMO},
  {"type": "list", "title": "Isinya", "items": [
    {"icon": "pill", "t": "Kasir dengan pencatatan resep"},
    {"icon": "calendar-clock", "t": "Batch dan peringatan kedaluwarsa"},
    {"icon": "truck", "t": "Order ke supplier yang dipandu stok"},
    {"icon": "banknote", "t": "Pembayaran faktur dan hutang supplier"},
    {"icon": "file-chart-column", "t": "Laporan SIPNAP otomatis"}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Keputusan dari data, bukan perkiraan.",
   "body": ["Kedaluwarsa dicegah lebih awal, stok dan hutang supplier terpantau di satu tempat, dan **laporan regulasi nggak lagi manual**."]},
  CTA_TALK]},

# 10 ────────────────────────────────────────────
{"id": "10-harga-website", "date": "2026-10-14", "tag": "Harga terbuka", "slides": [
  {"type": "photocover", "photo": "blog-biaya-bikin-website.jpg", "eyebrow": "Pertanyaan paling sering",
   "title": "Berapa sih biaya bikin website?", "sub": "Ini harga paket kami. Terbuka, tanpa “hubungi untuk harga”."},
  {"type": "table", "title": "Paket website Seawise", "rows": [
    {"l": "Shore", "d": "1 halaman, promosi 1 produk atau acara", "v": "Rp2 jt"},
    {"l": "Reef", "d": "Company profile utuh + admin panel", "v": "Rp3,5 jt"},
    {"l": "Current", "d": "Lebih personal, kustomisasi moderat", "v": "Rp4,5 jt"},
    {"l": "Trench", "d": "Full custom untuk model bisnis unik", "v": "Rp12 jt"}],
   "note": "Maintenance Rp1,8 jt per tahun"},
  {"type": "list", "title": "Yang bikin harganya beda", "items": [
    {"icon": "layout-list", "t": "Jumlah section", "d": "Satu halaman promosi beda kerja dengan company profile lengkap."},
    {"icon": "palette", "t": "Tingkat kustomisasi desain", "d": "Dari preset tema sampai full custom."},
    {"icon": "sliders-horizontal", "t": "Admin panel", "d": "Bisa ubah teks, harga, dan foto sendiri tanpa telepon kami."},
    {"icon": "puzzle", "t": "Fitur tambahan", "d": "Add-on sesuai kebutuhan bisnismu."}]},
  {"type": "text", "eyebrow": "Tips memilih", "title": "Mulai dari tujuanmu, bukan dari paketnya.",
   "body": ["Cuma butuh promosi satu produk? Shore cukup. Isinya sering berubah? **Admin panel** bakal menghemat banyak waktu.",
            "Bisnismu mau tumbuh? Pilih fondasi yang bisa ditingkatkan tanpa bangun ulang."]},
  {"type": "cta", "eyebrow": "Masih bingung pilih?", "title": "Tanya dulu, gratis.",
   "sub": "Ceritain kebutuhanmu, kami bantu pilih paket yang pas. Rincian tiap paket ada di website.",
   "button": "Link di bio · seawise.id"}]},

# 11 ────────────────────────────────────────────
{"id": "11-tanda-erp", "date": "2026-10-16", "tag": "Edukasi", "slides": [
  {"type": "photocover", "photo": "blog-erp-manufaktur-pabrik-kecil.jpg", "eyebrow": "Buat pemilik pabrik kecil",
   "title": "6 tanda pabrikmu sudah melampaui spreadsheet."},
  {"type": "list", "title": "Tanda 1 sampai 3", "items": [
    {"icon": "warehouse", "t": "Stok gudang nggak cocok dengan catatan"},
    {"icon": "calculator", "t": "HPP dihitung sebulan sekali", "d": "Dan angkanya lebih mirip perkiraan."},
    {"icon": "calendar-x", "t": "Bahan kedaluwarsa ketahuan terlambat", "d": "Pas sudah nggak bisa dipakai."}]},
  {"type": "list", "title": "Tanda 4 sampai 6", "items": [
    {"icon": "clipboard-check", "t": "Pembelian tanpa persetujuan jelas", "d": "Susah dilacak siapa pesan apa."},
    {"icon": "flask-conical", "t": "Formula ada di satu file", "d": "Atau di kepala satu orang."},
    {"icon": "users-round", "t": "Tiap tim pakai angka berbeda", "d": "Produksi, gudang, dan pembelian."}]},
  {"type": "text", "eyebrow": "Yang sering luput", "title": "HPP rata-rata bisa menipu.",
   "body": ["Bahan yang sama dibeli di harga berbeda per lot. Kalau dirata-rata, biaya produksi batch hari ini **bisa meleset** dari aslinya.",
            "ERP yang menghitung HPP per batch memakai harga lot yang benar-benar terpakai."]},
  CTA_BLOG("ERP manufaktur untuk pabrik kecil.", "Fitur wajib, contoh hitung HPP per batch, dan cara beralih tanpa menghentikan produksi.")]},

# 12 ────────────────────────────────────────────
{"id": "12-studi-ims", "date": "2026-10-19", "tag": "Studi kasus", "slides": [
  {"type": "cover", "real": "ims", "eyebrow": "Industry Management · Manufaktur",
   "title": "Dari spreadsheet terpisah ke satu sumber data produksi.", "image": "industry-management-ims-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Margin tergerus tanpa disadari.",
   "body": ["Stok fisik nggak cocok dengan catatan, HPP cuma perkiraan, dan bahan mendekati kedaluwarsa lolos pantauan.",
            "Keputusan produksi diambil **tanpa data yang akurat**."]},
  {"type": "devices", "eyebrow": "Yang kami bangun", "title": "Seluruh alur produksi dalam satu sistem.",
   "desktop": "industry-management-ims-g0.jpg", "mobile": "industry-management-ims-mobile.jpg",
   "cap": "Dari pembelian, stok bahan, formula, sampai HPP per batch.", "note": DEMO},
  {"type": "flow", "eyebrow": "Alurnya", "title": "Dari bahan masuk sampai HPP.", "steps": [
    {"icon": "clipboard-check", "t": "Pembelian lewat persetujuan", "d": "Jelas siapa pesan apa."},
    {"icon": "layers", "t": "Stok bahan pakai FEFO", "d": "Yang lebih dulu kedaluwarsa, terpakai lebih dulu."},
    {"icon": "flask-conical", "t": "Produksi dari formula", "d": "Komposisi bahan tercatat rapi."},
    {"icon": "calculator", "t": "HPP otomatis per batch", "d": "Dari harga lot yang benar-benar terpakai."}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "HPP bisa dilihat kapan saja.",
   "body": ["Rekap yang tadinya manual sekarang otomatis, tanpa hitung ulang.",
            "Tim produksi dan pembelian **bekerja dari satu sumber data** yang sama."]},
  CTA_TALK]},

# Periode 21 Okt – 18 Nov 2026 ══════════════════

# 13 ────────────────────────────────────────────
{"id": "13-nota-basah", "date": "2026-10-21", "tag": "Edukasi", "slides": [
  {"type": "photocover", "ai": "nota-hilang-basah", "eyebrow": "Risiko yang sering diremehkan",
   "title": "Kertas bisa basah, hilang, atau tulisannya pudar. Datamu?"},
  {"type": "text", "eyebrow": "Kejadian yang sering dianggap sial", "title": "Padahal ini risiko sistem, bukan nasib buruk.",
   "body": ["Bocor di atap, kopi tumpah, atau nota yang terselip saat beres-beres bisa **menghapus catatan sebulan** dalam sekejap.",
            "Selama catatan cuma ada di kertas, satu kejadian kecil bisa jadi masalah besar."]},
  {"type": "list", "title": "Yang ikut hilang", "items": [
    {"icon": "receipt", "t": "Riwayat transaksi", "d": "Nggak ada cadangan, sekali rusak ya hilang."},
    {"icon": "banknote", "t": "Catatan hutang piutang", "d": "Siapa belum bayar, siapa belum ditagih."},
    {"icon": "file-text", "t": "Bukti pembelian dari supplier", "d": "Susah diklaim ulang kalau ada masalah barang."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Data yang tersimpan di server, bukan di laci.",
   "body": ["Aplikasi kasir dan stok menyimpan setiap transaksi ke cloud, bukan ke kertas yang bisa basah atau hilang.",
            "Kejadian fisik apa pun di toko **nggak akan menghapus catatan usahamu**."]},
  CTA_TALK]},

# 14 ────────────────────────────────────────────
{"id": "14-villa-double-booking", "date": "2026-10-23", "tag": "Untuk pemilik villa", "slides": [
  {"type": "photocover", "ai": "villa-double-booking", "eyebrow": "Buat pemilik villa & guesthouse",
   "title": "Dua tamu, satu kamar, tanggal yang sama."},
  {"type": "text", "eyebrow": "Kejadian yang bikin sport jantung", "title": "Kalender OTA dan kalender internal jarang benar-benar sinkron.",
   "body": ["Satu kamar bisa dipesan dua kali kalau kalendernya tersebar di OTA, buku, dan WhatsApp yang nggak saling tahu.",
            "Tamu yang datang belakangan yang kena getahnya."]},
  {"type": "compare", "eyebrow": "Bedanya", "title": "Booking langsung vs lewat OTA.",
   "cells": [{"l": "Komisi lewat OTA", "v": "~20%"}, {"l": "Komisi booking langsung", "v": "0%", "hl": True}],
   "body": ["Buat tamu yang sudah percaya sama penginapanmu, **kenapa harus lewat OTA lagi**?"], "note": "Angka ilustrasi, kisaran umum industri"},
  {"type": "text", "eyebrow": "Realistis", "title": "Website booking langsung bukan pengganti OTA.",
   "body": ["OTA tetap penting buat jangkau tamu baru. Website booking langsung adalah **kanal tambahan** dengan margin yang lebih baik."]},
  CTA_BLOG("Panduan website booking langsung untuk villa.", "Kenapa double booking terjadi, dan cara website booking langsung membantu.")]},

# 15 ────────────────────────────────────────────
{"id": "15-kasir-jam-ramai", "date": "2026-10-26", "tag": "Edukasi", "slides": [
  {"type": "photocover", "ai": "kasir-jam-ramai", "eyebrow": "Buat pemilik kafe & resto",
   "title": "Kenapa kasir selalu jadi titik lemah saat ramai?"},
  {"type": "list", "title": "Penyebabnya", "items": [
    {"icon": "search", "t": "Cari produk manual", "d": "Scroll atau ketik nama satu-satu di antrean panjang."},
    {"icon": "calculator", "t": "Hitung kembalian manual", "d": "Rawan salah pas kepala lagi penuh."},
    {"icon": "users-round", "t": "Antrean menumpuk", "d": "Satu transaksi lambat, semua ikut nunggu."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Kasir yang bisa scan dan cari produk dalam hitungan detik.",
   "body": ["Barcode dan pencarian cepat memangkas waktu transaksi, jadi antrean nggak menumpuk cuma gara-gara **cari satu produk**.",
            "Kembalian dihitung otomatis, jadi nggak ada lagi salah kembalian saat ramai."]},
  CTA_TALK]},

# 16 ────────────────────────────────────────────
{"id": "16-pemetaan-kebutuhan", "date": "2026-10-28", "tag": "Sebelum kode ditulis", "slides": [
  {"type": "photocover", "ai": "aplikasi-custom-pemetaan", "eyebrow": "Sebelum kode pertama ditulis",
   "title": "Aplikasi custom yang gagal, biasanya gagal di sini."},
  {"type": "list", "title": "Tanda vendor melewatkan tahap ini", "items": [
    {"icon": "circle-help", "t": "Langsung kasih harga", "d": "Tanpa tanya banyak soal alur kerjamu."},
    {"icon": "layout-list", "t": "Proposal fitur generik", "d": "Sama persis untuk semua klien di industri yang sama."},
    {"icon": "users-round", "t": "Nggak pernah tanya ke pengguna lapangan", "d": "Cuma ngobrol sama pemilik atau manajemen."}]},
  {"type": "text", "eyebrow": "Yang seharusnya terjadi", "title": "Ngobrol dulu dengan yang benar-benar pakai.",
   "body": ["Pemilik menggambarkan alur ideal. Staf yang kerja tiap hari tahu **di mana alur itu sebenarnya macet**.",
            "Dari situ baru keluar cakupan dan harga yang akurat, bukan tebakan."]},
  CTA_BLOG("Kenapa pemetaan kebutuhan menentukan semuanya.", "Apa yang terjadi kalau tahap ini dilewatkan, dan apa yang dihasilkan kalau dikerjakan benar.")]},

# 17 ────────────────────────────────────────────
{"id": "17-studio-sketsa", "date": "2026-10-30", "tag": "Di balik layar", "slides": [
  {"type": "photocover", "ai": "studio-sketsa", "eyebrow": "Sebelum baris kode pertama",
   "title": "Merancang alur dulu, baru menulis kode."},
  {"type": "text", "eyebrow": "Kenapa mulai dari sketsa", "title": "Kesalahan di kertas jauh lebih murah dari kesalahan di kode.",
   "body": ["Sebelum desain dan pengembangan dimulai, alur pengguna digambar dulu di atas kertas: kotak, panah, urutan layar.",
            "Kalau ada yang terasa janggal, gampang diubah di tahap ini, **sebelum jadi kode yang harus dibongkar ulang**."]},
  {"type": "list", "title": "Yang kami pastikan di tahap ini", "items": [
    {"icon": "route", "t": "Alur logis dari langkah pertama sampai selesai"},
    {"icon": "eye", "t": "Nggak ada langkah yang membingungkan pengguna"},
    {"icon": "puzzle", "t": "Semua kebutuhan dari pemetaan sudah terwadahi"}]},
  CTA_TALK]},

# 18 ────────────────────────────────────────────
{"id": "18-faktur-supplier", "date": "2026-11-02", "tag": "Edukasi", "slides": [
  {"type": "photocover", "ai": "faktur-supplier-menumpuk", "eyebrow": "Buat pemilik toko & resto",
   "title": "Faktur numpuk di meja, hutang supplier jadi tebakan."},
  {"type": "list", "title": "Yang sering kejadian", "items": [
    {"icon": "calendar-x", "t": "Lupa tanggal jatuh tempo", "d": "Baru sadar pas supplier telepon."},
    {"icon": "banknote", "t": "Salah hitung total hutang", "d": "Faktur tercecer, ada yang kehitung dua kali atau kelewat."},
    {"icon": "clock", "t": "Telat bayar jadi kebiasaan", "d": "Bukan karena nggak ada uang, tapi karena nggak ada yang ingetin."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Hutang supplier dan jatuh tempo, tercatat otomatis.",
   "body": ["Setiap faktur masuk tercatat begitu barang diterima, lengkap dengan tanggal jatuh temponya.",
            "Sistem yang **mengingatkan**, bukan kamu yang harus ingat semuanya."]},
  CTA_TALK]},

# 19 ────────────────────────────────────────────
{"id": "19-website-fondasi", "date": "2026-11-04", "tag": "Sebelum bikin website", "slides": [
  {"type": "photocover", "ai": "website-pilihan-fondasi", "eyebrow": "Sebelum bikin website",
   "title": "Builder, WordPress, atau custom? Bukan soal mahal-murahan."},
  {"type": "list", "title": "Tiga jalur, tiga karakter", "items": [
    {"icon": "layout-template", "t": "Website builder", "d": "Cepat jalan, tapi desainnya terbatas ke template."},
    {"icon": "wrench", "t": "WordPress", "d": "Fleksibel lewat plugin, tapi butuh maintenance rutin."},
    {"icon": "sparkles", "t": "Website custom", "d": "Sesuai kebutuhan penuh, investasi awal lebih besar."}]},
  {"type": "text", "eyebrow": "Cara memilih", "title": "Bukan soal termurah, tapi ke mana bisnismu menuju.",
   "body": ["Builder cocok buat kehadiran online sederhana. WordPress cocok buat konten yang sering bertambah.",
            "Custom cocok kalau kamu butuh **admin panel yang benar-benar sesuai alur kerja**."]},
  CTA_BLOG("Panduan lengkap: custom, WordPress, atau builder.", "Kelebihan-kekurangan tiap pilihan, tabel perbandingan, dan cara memilih berdasarkan kebutuhan.")]},

# 20 ────────────────────────────────────────────
{"id": "20-banyak-cabang", "date": "2026-11-06", "tag": "Edukasi", "slides": [
  {"type": "photocover", "ai": "banyak-cabang", "eyebrow": "Buat pemilik lebih dari satu toko",
   "title": "Tiga cabang, tiga catatan berbeda. Mana yang benar?"},
  {"type": "list", "title": "Masalahnya", "items": [
    {"icon": "map-pin", "t": "Rekap manual per cabang", "d": "Digabung satu-satu tiap akhir bulan."},
    {"icon": "scale", "t": "Susah bandingkan performa", "d": "Format catatan beda-beda antar cabang."},
    {"icon": "package-x", "t": "Stok antar cabang nggak sinkron", "d": "Satu cabang kehabisan, satu cabang menumpuk."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Satu dashboard untuk semua cabang.",
   "body": ["Semua transaksi dari tiap cabang masuk ke satu sistem, jadi kamu bisa **bandingkan performa** tanpa rekap manual.",
            "Stok antar cabang juga kelihatan, jadi transfer barang bisa lebih terencana."]},
  CTA_TALK]},

# 21 ────────────────────────────────────────────
{"id": "21-sipnap", "date": "2026-11-09", "tag": "Untuk pemilik apotek", "slides": [
  {"type": "photocover", "ai": "sipnap-akhir-bulan", "eyebrow": "Buat pemilik apotek",
   "title": "Rekap SIPNAP akhir bulan bikin begadang?"},
  {"type": "list", "title": "Masalah cara manual", "items": [
    {"icon": "copy", "t": "Transaksi dicatat dua kali", "d": "Di kasir, lalu di buku terpisah lagi."},
    {"icon": "clock", "t": "Rekap ulang dari nota", "d": "Dikerjakan dari nol menjelang tenggat."},
    {"icon": "calendar-x", "t": "Transaksi lolos baru ketahuan telat", "d": "Susah dilacak ulang kapan persisnya."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Jurnal golongan obat yang terisi sendiri.",
   "body": ["Begitu obat golongan tertentu terjual, sistem otomatis mencatatnya ke jurnal terpisah.",
            "Saat tenggat SIPNAP tiba, **rekapnya tinggal ditarik**, bukan disusun dari nol."]},
  CTA_BLOG("Panduan laporan SIPNAP otomatis.", "Kenapa cara manual berisiko, dan bagaimana aplikasi apotek membuatnya otomatis.")]},

# 22 ────────────────────────────────────────────
{"id": "22-konsultasi-kopi", "date": "2026-11-11", "tag": "Konsultasi gratis", "slides": [
  {"type": "photocover", "ai": "konsultasi-kopi", "eyebrow": "Sebelum sepakat kerja sama",
   "title": "Ngobrol dulu soal alur bisnismu. Gratis, tanpa kewajiban."},
  {"type": "list", "title": "Yang kami tanyakan", "items": [
    {"icon": "messages-square", "t": "Alur kerja harian", "d": "Dari transaksi pertama sampai tutup toko."},
    {"icon": "circle-help", "t": "Masalah yang paling sering muncul", "d": "Yang bikin capek diulang tiap hari."},
    {"icon": "layers", "t": "Sistem yang sudah dipakai sekarang", "d": "Excel, buku, atau aplikasi lain."}]},
  {"type": "text", "eyebrow": "Nggak ada kewajiban", "title": "Ngobrol dulu, baru diputuskan lanjut atau tidak.",
   "body": ["Dari obrolan ini kami bisa kasih gambaran solusi dan estimasi harga, **tanpa kamu harus komit apa pun** di awal."]},
  CTA_TALK]},

# 23 ────────────────────────────────────────────
{"id": "23-stok-kedaluwarsa", "date": "2026-11-13", "tag": "Edukasi", "slides": [
  {"type": "photocover", "ai": "stok-kedaluwarsa-rak", "eyebrow": "Buat pemilik toko & apotek",
   "title": "Barang kedaluwarsa di rak belakang itu modal yang hilang."},
  {"type": "list", "title": "Kenapa sering kelewat", "items": [
    {"icon": "bell-off", "t": "Nggak ada peringatan otomatis", "d": "Harus inget sendiri kapan tanggalnya."},
    {"icon": "eye-off", "t": "Rak belakang jarang dicek", "d": "Yang di depan mata duluan yang keurus."},
    {"icon": "trash-2", "t": "Baru ketahuan pas mau dibuang", "d": "Modalnya sudah hilang duluan."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Peringatan dini, jauh sebelum tanggalnya lewat.",
   "body": ["Setiap barang yang punya tanggal kedaluwarsa dilacak per batch, dan sistem **mengingatkan lebih awal**.",
            "Barang masih bisa dijual diskon atau diretur, bukan langsung jadi kerugian penuh."]},
  CTA_TALK]},

# 24 ────────────────────────────────────────────
{"id": "24-beach-club-reservasi", "date": "2026-11-16", "tag": "Untuk pemilik resto & beach club", "slides": [
  {"type": "photocover", "ai": "beach-club-reservasi", "eyebrow": "Buat pemilik resto & beach club",
   "title": "Reservasi tercecer di WA, DM, dan buku catatan."},
  {"type": "list", "title": "Masalahnya saat ramai", "items": [
    {"icon": "book-open", "t": "Staf bolak-balik cek meja kosong", "d": "Buku reservasi dibuka-tutup terus."},
    {"icon": "copy", "t": "Reservasi ganda", "d": "Dua tamu dijanjikan meja yang sama."},
    {"icon": "message-circle", "t": "Pesan gampang terlewat", "d": "DM dan chat numpuk pas jam sibuk."}]},
  {"type": "text", "eyebrow": "Solusinya", "title": "Satu sumber data untuk semua reservasi.",
   "body": ["Tamu bisa lihat sendiri slot yang tersedia lewat website, tanpa harus nunggu balasan chat.",
            "Tim bisa fokus melayani tamu yang **sudah datang**, bukan terus-terusan balas reservasi."]},
  CTA_BLOG("Panduan website reservasi restoran & beach club.", "Kenapa reservasi manual berisiko, dan kapan website reservasi mulai perlu.")]},

# 25 ────────────────────────────────────────────
{"id": "25-pendampingan", "date": "2026-11-18", "tag": "Setelah live", "slides": [
  {"type": "photocover", "ai": "pendampingan-toko", "eyebrow": "Bukan cuma serah terima",
   "title": "Live itu awal, bukan akhir."},
  {"type": "text", "eyebrow": "Yang sering terlewat", "title": "Aplikasi tanpa pendampingan sering terbengkalai.",
   "body": ["Tim yang belum terbiasa dengan sistem baru gampang balik lagi ke cara lama begitu ada kendala kecil.",
            "Pendampingan setelah live yang memastikan itu **nggak terjadi**."]},
  {"type": "list", "title": "Yang kami lakukan", "items": [
    {"icon": "graduation-cap", "t": "Tim dilatih sampai terbiasa", "d": "Bukan cuma sesi training sekali lalu ditinggal."},
    {"icon": "phone-call", "t": "Tetap bisa dihubungi", "d": "Kalau ada kendala setelah live."},
    {"icon": "life-buoy", "t": "Dibantu sampai benar-benar dipakai", "d": "Bukan cuma sampai aplikasinya jalan."}]},
  CTA_TALK]},
]

for _p in POSTS:
    _p["caption"] = CAPTIONS[_p["id"]]
