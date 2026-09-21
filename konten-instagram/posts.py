"""Instagram content calendar for @seawise.id. Times are 19:00 WITA (UTC+8)."""

CTA_BLOG = lambda title, sub: {"type": "cta", "eyebrow": "Mau baca lengkapnya?", "title": title, "sub": sub,
                               "button": "Link di bio · Blog"}
CTA_TALK = {"type": "cta", "eyebrow": "Konsultasi gratis", "title": "Ceritain dulu alur bisnismu.",
            "sub": "Kami pelajari cara kerjamu dulu, baru bicara solusi. Ngobrolnya gratis, tanpa kewajiban.",
            "button": "Link di bio · seawise.id"}

HT_BASE = "#seawisestudio #jasapembuatanaplikasi #jasapembuatanwebsite #bali #umkmbali"

POSTS = [
# 1 ─────────────────────────────────────────────
{"id": "01-kenalan", "date": "2026-09-23", "tag": "Kenalan", "slides": [
  {"type": "cover", "eyebrow": "Seawise Studio · Bali", "title": "Website dan aplikasi yang benar-benar dipakai bisnis.",
   "sub": "Bukan pajangan. Alat kerja yang bikin operasional harian lebih rapi."},
  {"type": "list", "title": "Yang kami kerjakan", "items": [
    {"n": "01", "t": "Website bisnis", "d": "Landing page, company profile, sampai website custom yang isinya bisa kamu ubah sendiri."},
    {"n": "02", "t": "Aplikasi custom", "d": "Kasir, stok, apotek, restoran, sampai ERP pabrik. Sistemnya mengikuti alur kerjamu."},
    {"n": "03", "t": "Pendampingan setelah live", "d": "Tim dilatih sampai terbiasa, dan kami tetap bisa dihubungi."}]},
  {"type": "grid", "title": "Beberapa yang sudah jalan", "note": "Semua bisa dibuka di seawise.id/portfolio", "cards": [
    {"img": "retail-service-umkm-edition-shot.jpg", "t": "TokoKu", "d": "Ritel & UMKM"},
    {"img": "pharmacy-store-management-psm-shot.jpg", "t": "Sehatera", "d": "Apotek"},
    {"img": "resto-cafe-management-rcm-shot.jpg", "t": "Resto & Cafe", "d": "Restoran, kafe & bar"},
    {"img": "industry-management-ims-shot.jpg", "t": "Industry Management", "d": "Manufaktur"}]},
  {"type": "list", "title": "Cara kami kerja", "items": [
    {"n": "01", "t": "Pahami dulu alur bisnismu", "d": "Sebelum bicara kode."},
    {"n": "02", "t": "Cakupan dan harga tertulis", "d": "Jelas di depan, sebelum pengerjaan dimulai."},
    {"n": "03", "t": "Desain, bangun, uji", "d": "Kamu lihat progresnya secara berkala."},
    {"n": "04", "t": "Live dan didampingi", "d": "Sampai tim benar-benar terbiasa."}]},
  CTA_TALK],
 "caption": """Halo! 👋 Kami Seawise Studio, studio pembuatan website dan aplikasi di Bali.

Yang kami bangun bukan pajangan, tapi alat kerja: kasir yang sekaligus ngurus stok, sistem apotek yang ngingetin obat mau kedaluwarsa, sampai ERP buat pabrik kecil.

Di akun ini kami bakal rutin bagi tips digitalisasi usaha, contoh sistem yang sudah jalan, dan cerita di balik layar. Geser buat kenalan lebih jauh 👉

Masih ada proses di usahamu yang ribet karena dicatat di kertas atau Excel? Ceritain di DM, atau klik link di bio buat konsultasi gratis.

#seawisestudio #jasapembuatanwebsite #jasapembuatanaplikasi #websitebali #aplikasibisnis #umkmbali #bali #digitalisasiumkm"""},

# 2 ─────────────────────────────────────────────
{"id": "02-tanda-excel", "date": "2026-09-25", "tag": "Edukasi", "slides": [
  {"type": "cover", "eyebrow": "Buat pemilik toko", "title": "6 tanda usahamu sudah kebesaran buat Excel.",
   "sub": "Hitung, berapa yang kamu alami?"},
  {"type": "list", "title": "Tanda 1 sampai 3", "items": [
    {"n": "01", "t": "Stok baru ketahuan setelah dicek ke rak", "d": "Catatan nggak bisa dipegang, jadi harus hitung fisik dulu."},
    {"n": "02", "t": "Rekap harian makan waktu", "d": "Dan angkanya sering meleset dari uang di laci."},
    {"n": "03", "t": "Nggak tahu produk paling laku", "d": "Belanja stok jadi pakai feeling."}]},
  {"type": "list", "title": "Tanda 4 sampai 6", "items": [
    {"n": "04", "t": "Omzet besar, untung bersih misteri", "d": "Pengeluaran nggak ikut tercatat."},
    {"n": "05", "t": "Kasir lebih dari satu", "d": "Atau mau buka cabang. File Excel mulai bentrok."},
    {"n": "06", "t": "Salah hitung saat ramai", "d": "Harga, diskon, atau kembalian."}]},
  {"type": "text", "eyebrow": "Kena beberapa?", "title": "Excel-nya sudah mulai membatasi, bukan membantu.",
   "body": ["Aplikasi kasir mencatat transaksi, mengurangi stok, dan menyusun laporan **sekaligus, otomatis**.",
            "Nggak ada lagi rekap malam-malam sambil nyocokin angka."]},
  CTA_BLOG("Panduan pindah dari Excel ke aplikasi kasir.", "Fitur yang wajib ada, bedanya dengan Excel, dan cara memilih yang pas buat usahamu.")],
 "caption": """Excel itu bagus. Buat awal-awal usaha, dia cukup banget. Tapi ada masanya dia mulai jadi beban 😅

Coba cek 6 tanda di slide ini. Kalau kamu kena beberapa, mungkin sudah waktunya pindah ke aplikasi kasir yang sekaligus ngurus stok dan laporan.

Kamu kena yang nomor berapa? Tulis di komentar 👇

Panduan lengkapnya ada di blog kami: fitur wajib, bedanya dengan Excel, dan cara milih yang pas. Link di bio.

#aplikasikasir #aplikasikasirumkm #posumkm #tokoretail #umkmindonesia #tipsbisnis """ + HT_BASE},

# 3 ─────────────────────────────────────────────
{"id": "03-studi-tokoku", "date": "2026-09-28", "tag": "Studi kasus", "slides": [
  {"type": "cover", "eyebrow": "TokoKu · Ritel & UMKM", "title": "Dari nota tulis tangan ke arus kas yang bisa dicek kapan saja.",
   "image": "retail-service-umkm-edition-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Laku, tapi untungnya berapa?",
   "body": ["Leuca de Perfume dulu mencatat penjualan secara manual. Nota ditulis tangan, dan kadang ada pembelian yang **lolos tidak tercatat** sama sekali.",
            "Pemilik tidak punya gambaran arus kas yang bisa dipercaya saat mau belanja stok berikutnya."]},
  {"type": "image", "eyebrow": "Yang kami bangun", "title": "Kasir yang sekaligus membukukan.", "image": "retail-service-umkm-edition-shot.jpg",
   "cap": "Setiap transaksi mengurangi stok, setiap biaya masuk hitungan, dan laba bersih muncul otomatis.", "note": "Tampilan dengan data demo"},
  {"type": "list", "title": "Isinya", "items": [
    {"n": "01", "t": "Kasir dan inventaris jadi satu"},
    {"n": "02", "t": "Pengeluaran tercatat, laba bersih otomatis"},
    {"n": "03", "t": "Struk dicetak atau dikirim ke WhatsApp"},
    {"n": "04", "t": "Pegawai cuma lihat yang perlu dilihat"}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Mengatur modal berhenti jadi tebakan.",
   "body": ["Semua transaksi mendarat di satu tempat, jadi arus kas bisa dibuka kapan saja dari HP.",
            "Pemilik tahu **berapa uang yang aman** dipakai buat belanja stok berikutnya."]},
  CTA_TALK],
 "caption": """Tahu dagangan laku, tapi nggak tahu untungnya berapa. Familiar? 🤔

Itu yang dialami Leuca de Perfume sebelum pakai TokoKu. Nota ditulis tangan, ada pembelian yang lolos nggak tercatat, dan arus kas nggak bisa dijadikan pegangan.

Sekarang semua transaksi masuk ke satu tempat. Stok berkurang otomatis, pengeluaran ikut tercatat, dan struk bisa langsung dikirim ke WhatsApp pembeli. Hasilnya, pemilik tahu berapa uang yang aman dipakai buat belanja stok berikutnya.

Geser buat lihat isinya 👉 Studi kasus lengkapnya ada di seawise.id/portfolio (link di bio).

#studikasus #aplikasikasir #aplikasitoko #tokoparfum #umkm """ + HT_BASE},

# 4 ─────────────────────────────────────────────
{"id": "04-hpp-kopi", "date": "2026-09-30", "tag": "Edukasi", "slides": [
  {"type": "cover", "eyebrow": "Buat pemilik kafe", "title": "Modal segelas es kopi susu aren kamu berapa?",
   "sub": "Kalau jawabannya “kira-kira”, geser."},
  {"type": "table", "title": "Hitung per bahan", "intro": "Satu gelas, dipecah sesuai resep.", "rows": [
    {"l": "Biji kopi", "d": "18 g · Rp250.000/kg", "v": "Rp4.500"},
    {"l": "Susu segar", "d": "150 ml · Rp22.000/liter", "v": "Rp3.300"},
    {"l": "Gula aren cair", "d": "20 ml · Rp40.000/liter", "v": "Rp800"},
    {"l": "Es batu dan cup", "d": "1 set", "v": "Rp1.500"},
    {"l": "HPP per porsi", "v": "Rp10.100", "total": True}], "note": "Angka ilustrasi"},
  {"type": "text", "eyebrow": "Masalahnya", "title": "Harga bahan nggak pernah diam.",
   "body": ["Susu naik Rp4.000 per liter? HPP segelas naik **Rp600**.",
            "Kalau harga jual tetap, margin turun diam-diam, dan biasanya baru ketahuan di akhir bulan."]},
  {"type": "text", "eyebrow": "Solusinya", "title": "HPP yang ikut harga bahan.",
   "body": ["Aplikasi kasir restoran yang menyimpan **resep per menu** bisa menghitung ulang HPP otomatis setiap harga bahan berubah.",
            "Kamu tahu menu mana yang masih untung, dan mana yang perlu dinaikkan harganya."]},
  CTA_BLOG("7 fitur wajib aplikasi kasir restoran.", "Dari layar dapur, QR order, sampai HPP per porsi. Lengkap dengan contoh hitungannya.")],
 "caption": """Pertanyaan simpel yang sering bikin pemilik kafe diam sebentar: modal segelas es kopi susu aren kamu berapa? ☕

Di slide ini kami pecah per bahan pakai angka ilustrasi. Hasilnya Rp10.100 per gelas.

Tapi yang lebih penting: harga bahan itu terus bergerak. Susu naik Rp4.000 per liter, HPP segelas naik Rp600. Kalau harga jual tetap, margin turun pelan-pelan tanpa kerasa.

Makanya HPP sebaiknya dihitung dari resep dan ikut harga bahan terbaru, bukan dihitung sekali lalu dilupakan.

Simpan post ini buat ngitung menu kamu sendiri 📌 Artikel lengkapnya ada di blog, link di bio.

#hpp #bisniskafe #bisniskuliner #coffeeshop #aplikasikasirrestoran #kafebali #fnbbusiness """ + HT_BASE},

# 5 ─────────────────────────────────────────────
{"id": "05-studi-resto", "date": "2026-10-02", "tag": "Studi kasus", "slides": [
  {"type": "cover", "eyebrow": "Resto & Cafe Management · F&B", "title": "Pesanan nggak lagi tercecer antara kasir dan dapur.",
   "image": "resto-cafe-management-rcm-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Jam ramai selalu jadi jam rawan.",
   "body": ["Pesanan tercecer antara kasir dan dapur, modal per porsi nggak terpantau, dan rekap penjualan makan waktu **setiap kali tutup**.",
            "Saat ramai, salah order dan antrean menumpuk jadi masalah yang berulang."]},
  {"type": "image", "eyebrow": "Yang kami bangun", "title": "Satu sistem dari meja sampai dapur.", "image": "resto-cafe-management-rcm-g0.jpg",
   "cap": "Kasir per meja terhubung langsung ke layar dapur, dan pelanggan bisa pesan lewat QR dari meja.", "note": "Tampilan dengan data demo"},
  {"type": "list", "title": "Isinya", "items": [
    {"n": "01", "t": "Kasir per meja dan take away"},
    {"n": "02", "t": "Layar dapur (KDS)"},
    {"n": "03", "t": "QR order dari meja pelanggan"},
    {"n": "04", "t": "HPP per porsi ikut harga bahan"},
    {"n": "05", "t": "Multi-outlet, hak akses per modul"}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Jam sibuk lebih terkendali.",
   "body": ["Alur pesanan dari kasir ke dapur jadi rapi, modal per porsi kelihatan jelas, dan **rekap harian selesai otomatis** saat tutup."]},
  CTA_TALK],
 "caption": """Di restoran, masalah paling mahal biasanya muncul pas lagi ramai-ramainya 🍽️

Kertas order hilang di jalan ke dapur, pesanan tambahan lupa ditagih, dan setelah tutup masih harus rekap berjam-jam.

Resto & Cafe Management kami bangun buat nyatuin semuanya: kasir per meja langsung nyambung ke layar dapur, tamu bisa pesan lewat QR dari meja, dan HPP per porsi ikut harga bahan terbaru. Punya beberapa outlet? Semua kelihatan dari satu sistem.

Geser buat lihat isinya 👉 Mau sistem kayak gini buat restoranmu? DM kami atau klik link di bio.

#aplikasirestoran #kasirrestoran #kitchendisplay #qrorder #restoranbali #bisniskuliner #fnb """ + HT_BASE},

# 6 ─────────────────────────────────────────────
{"id": "06-bocor-stok", "date": "2026-10-05", "tag": "Edukasi", "needs_article": "aplikasi-stok-barang-toko-retail", "slides": [
  {"type": "cover", "eyebrow": "Buat pemilik toko", "title": "Di catatan 12. Di rak tinggal 5. Ke mana sisanya?",
   "sub": "Biasanya bukan satu kesalahan besar."},
  {"type": "list", "title": "5 kebocoran stok yang nggak kerasa", "items": [
    {"n": "01", "t": "Penjualan yang lolos", "d": "Nggak sempat dicatat saat ramai, atau notanya hilang."},
    {"n": "02", "t": "Barang masuk nggak diinput", "d": "Langsung dipajang, dicatatnya nanti. Atau lupa."},
    {"n": "03", "t": "Retur dan barang rusak", "d": "Keluar dari rak, tapi nggak dikurangi dari catatan."}]},
  {"type": "list", "title": "Lanjut", "items": [
    {"n": "04", "t": "Pemakaian sendiri", "d": "Diambil buat sampel, hadiah, atau keperluan toko."},
    {"n": "05", "t": "Salah hitung saat opname", "d": "Hasilnya langsung ditimpa, penyebab selisihnya nggak pernah dicari."}]},
  {"type": "text", "eyebrow": "Jadi siapa yang salah?", "title": "Bukan pegawainya. Sistemnya.",
   "body": ["Buku dan Excel bergantung pada orang yang **harus ingat** mencatat setiap kejadian.",
            "Makin ramai toko, makin besar peluang ada yang terlewat. Aplikasi stok memindahkan beban itu ke sistem."]},
  CTA_BLOG("Panduan aplikasi stok barang toko retail.", "Fitur wajib, cara stok opname yang benar, dan rumus kapan harus restock.")],
 "caption": """Pernah nggak, catatan bilang barang masih 12, tapi di rak tinggal 5? 📦

Selisih stok jarang muncul dari satu kesalahan besar. Biasanya dari 5 kebocoran kecil yang nggak kerasa, dan semuanya ada di slide ini.

Kabar baiknya: ini bukan soal pegawai nggak jujur atau pemilik kurang teliti. Ini soal sistem pencatatan yang bergantung sama ingatan. Begitu setiap barang masuk dan keluar tercatat otomatis, selisihnya bisa ditelusuri.

Dari 5 ini, mana yang paling sering kejadian di tokomu? 👇

Panduan lengkap aplikasi stok barang ada di blog, link di bio.

#aplikasistok #stokbarang #stokopname #tokoretail #manajemenstok #umkm """ + HT_BASE},

# 7 ─────────────────────────────────────────────
{"id": "07-rumus-restock", "date": "2026-10-07", "tag": "Edukasi", "needs_article": "aplikasi-stok-barang-toko-retail", "slides": [
  {"type": "cover", "eyebrow": "Simpan dulu", "title": "Kapan harus restock? Jangan ditebak, dihitung.",
   "sub": "Rumusnya cuma satu baris."},
  {"type": "formula", "eyebrow": "Titik pesan ulang", "title": "Pesan lagi saat stok menyentuh angka ini:",
   "html": "rata-rata terjual per hari<br><em>×</em> waktu tunggu supplier<br><em>+</em> stok pengaman",
   "after": "Stok pengaman itu cadangan buat hari ramai atau kiriman yang telat."},
  {"type": "table", "title": "Contoh: parfum 50 ml", "rows": [
    {"l": "Terjual per hari", "v": "4 botol"},
    {"l": "Waktu tunggu supplier", "v": "5 hari"},
    {"l": "Kebutuhan selama menunggu", "d": "4 × 5", "v": "20 botol"},
    {"l": "Stok pengaman", "d": "3 hari penjualan", "v": "12 botol"},
    {"l": "Titik pesan ulang", "v": "32 botol", "total": True}], "note": "Angka ilustrasi"},
  {"type": "text", "big": "32", "title": "Stok tinggal 32? Saatnya pesan.",
   "body": ["Baru pesan saat sisa 10? Rak bakal **kosong 2 sampai 3 hari** sebelum kiriman datang.",
            "Angka rata-rata penjualan ini susah didapat dari buku, tapi gampang dari aplikasi yang mencatat setiap transaksi."]},
  CTA_BLOG("Panduan aplikasi stok barang toko retail.", "Penyebab selisih stok, fitur wajib, dan cara memilih yang tepat.")],
 "caption": """Restock kebanyakan, modal nyangkut di gudang. Restock telat, pelanggan pulang dengan tangan kosong 😬

Titik aman di antaranya bisa dihitung pakai satu rumus: rata-rata terjual per hari × waktu tunggu supplier + stok pengaman.

Contohnya ada di slide 3, pakai angka ilustrasi. Hasilnya: pesan lagi saat stok tinggal 32 botol, bukan pas tinggal 10.

Bagian tersulitnya justru dapetin angka rata-rata penjualan yang akurat. Di situ aplikasi stok bantu banyak, karena semua transaksi sudah tercatat.

Save post ini biar nggak lupa 📌 Artikel lengkapnya di blog, link di bio.

#restock #manajemenstok #aplikasistok #tokoretail #tipsbisnis #umkm """ + HT_BASE},

# 8 ─────────────────────────────────────────────
{"id": "08-tanda-apotek", "date": "2026-10-09", "tag": "Edukasi", "slides": [
  {"type": "cover", "eyebrow": "Buat pemilik apotek", "title": "5 tanda apotekmu sudah butuh aplikasi.",
   "sub": "Nomor 1 paling mahal kalau dibiarkan."},
  {"type": "list", "title": "Cek satu per satu", "items": [
    {"n": "01", "t": "Obat kedaluwarsa lolos pantauan"},
    {"n": "02", "t": "Stok fisik nggak cocok dengan catatan"},
    {"n": "03", "t": "Rekap penjualan dan pembelian makan berjam-jam"},
    {"n": "04", "t": "Susah jawab sisa stok saat pelanggan tanya"},
    {"n": "05", "t": "Laporan regulasi masih dikerjakan manual"}]},
  {"type": "table", "title": "Fitur yang mencegahnya", "rows": [
    {"l": "Batch dan kedaluwarsa", "d": "Obat kedaluwarsa ketahuan lebih awal", "v": "01"},
    {"l": "Stok real time", "d": "Catatan selalu cocok dengan rak", "v": "02 · 04"},
    {"l": "Kasir terhubung stok", "d": "Setiap penjualan langsung tercatat", "v": "03"},
    {"l": "Laporan otomatis", "d": "Termasuk laporan regulasi", "v": "05"}]},
  {"type": "text", "eyebrow": "Kenapa nomor 1 paling mahal?", "title": "Kerugiannya dobel.",
   "body": ["Obat kedaluwarsa itu **modal yang hilang**, sekaligus risiko buat keamanan pasien.",
            "Dengan pelacakan per batch, peringatan muncul jauh sebelum tanggalnya lewat."]},
  CTA_BLOG("Fitur wajib aplikasi apotek.", "Dari pelacakan batch sampai laporan otomatis, plus cara memilih yang tepat.")],
 "caption": """Apotek bisa kehilangan margin tanpa sadar. Bukan karena sepi, tapi karena obat kedaluwarsa, stok yang nggak cocok, dan rekap manual yang makan waktu 💊

Kami rangkum 5 tandanya di slide ini, plus fitur yang mencegah masing-masing.

Yang paling mahal kalau dibiarkan? Nomor 1. Obat kedaluwarsa itu modal yang hilang sekaligus risiko buat pasien.

Kamu pemilik atau apoteker? Kena berapa dari 5 tanda ini? 👇

Panduan fitur wajib aplikasi apotek ada di blog, link di bio.

#aplikasiapotek #apotek #manajemenapotek #farmasi #apoteker #sipnap """ + HT_BASE},

# 9 ─────────────────────────────────────────────
{"id": "09-studi-sehatera", "date": "2026-10-12", "tag": "Studi kasus", "slides": [
  {"type": "cover", "eyebrow": "Sehatera · Apotek", "title": "Apotek yang berhenti kehilangan margin diam-diam.",
   "image": "pharmacy-store-management-psm-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Kebocoran yang nggak kelihatan.",
   "body": ["Obat kedaluwarsa lolos dari pantauan, stok dan hutang ke supplier tercecer di banyak catatan.",
            "Dan laporan SIPNAP dikerjakan manual **sampai berjam-jam**."]},
  {"type": "image", "eyebrow": "Yang kami bangun", "title": "Satu sistem apotek terpadu.", "image": "pharmacy-store-management-psm-g0.jpg",
   "cap": "Setiap obat dilacak per batch, dengan peringatan dini menjelang kedaluwarsa.", "note": "Tampilan dengan data demo"},
  {"type": "list", "title": "Isinya", "items": [
    {"n": "01", "t": "Kasir dengan pencatatan resep"},
    {"n": "02", "t": "Batch dan peringatan kedaluwarsa"},
    {"n": "03", "t": "Order ke supplier yang dipandu stok"},
    {"n": "04", "t": "Pembayaran faktur dan hutang supplier"},
    {"n": "05", "t": "Laporan SIPNAP otomatis"}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "Keputusan dari data, bukan perkiraan.",
   "body": ["Kedaluwarsa dicegah lebih awal, stok dan hutang supplier terpantau di satu tempat, dan **laporan regulasi nggak lagi manual**."]},
  CTA_TALK],
 "caption": """Kerugian apotek sering nggak kelihatan di kasir. Dia ada di rak belakang, di obat yang kedaluwarsa tanpa ada yang sadar 💊

Sehatera kami bangun buat nutup kebocoran itu. Setiap obat dilacak per batch dengan peringatan dini, order ke supplier dipandu dari sisa stok, hutang faktur tercatat rapi, dan laporan SIPNAP keluar otomatis.

Geser buat lihat isinya 👉 Studi kasus lengkapnya di seawise.id/portfolio, link di bio.

#aplikasiapotek #sistemapotek #manajemenapotek #farmasi #sipnap #apotekbali """ + HT_BASE},

# 10 ────────────────────────────────────────────
{"id": "10-harga-website", "date": "2026-10-14", "tag": "Harga terbuka", "slides": [
  {"type": "cover", "eyebrow": "Pertanyaan paling sering", "title": "Berapa sih biaya bikin website?",
   "sub": "Ini harga paket kami. Terbuka, tanpa “hubungi untuk harga”."},
  {"type": "table", "title": "Paket website Seawise", "rows": [
    {"l": "Shore", "d": "1 halaman, promosi 1 produk atau acara", "v": "Rp2 jt"},
    {"l": "Reef", "d": "Company profile utuh + admin panel", "v": "Rp3,5 jt"},
    {"l": "Current", "d": "Lebih personal, kustomisasi moderat", "v": "Rp4,5 jt"},
    {"l": "Trench", "d": "Full custom untuk model bisnis unik", "v": "Rp12 jt"}],
   "note": "Maintenance Rp1,8 jt per tahun"},
  {"type": "list", "title": "Yang bikin harganya beda", "items": [
    {"n": "01", "t": "Jumlah section", "d": "Satu halaman promosi beda kerja dengan company profile lengkap."},
    {"n": "02", "t": "Tingkat kustomisasi desain", "d": "Dari preset tema sampai full custom."},
    {"n": "03", "t": "Admin panel", "d": "Bisa ubah teks, harga, dan foto sendiri tanpa telepon kami."},
    {"n": "04", "t": "Fitur tambahan", "d": "Add-on sesuai kebutuhan bisnismu."}]},
  {"type": "text", "eyebrow": "Tips memilih", "title": "Mulai dari tujuanmu, bukan dari paketnya.",
   "body": ["Cuma butuh promosi satu produk? Shore cukup. Isinya sering berubah? **Admin panel** bakal menghemat banyak waktu.",
            "Bisnismu mau tumbuh? Pilih fondasi yang bisa ditingkatkan tanpa bangun ulang."]},
  {"type": "cta", "eyebrow": "Masih bingung pilih?", "title": "Tanya dulu, gratis.",
   "sub": "Ceritain kebutuhanmu, kami bantu pilih paket yang pas. Rincian tiap paket ada di website.",
   "button": "Link di bio · seawise.id"}],
 "caption": """Pertanyaan yang paling sering masuk ke DM: \"bikin website berapa?\" 💬

Jadi kami taruh aja harganya di sini, terbuka:
• Shore: Rp2 juta
• Reef: Rp3,5 juta
• Current: Rp4,5 juta
• Trench: Rp12 juta
Maintenance Rp1,8 juta per tahun.

Bedanya ada di jumlah section, tingkat kustomisasi, admin panel, dan fitur tambahan. Detail tiap paket ada di slide dan di website.

Masih bingung pilih yang mana? DM aja, kami bantu cocokin sama kebutuhanmu. Link di bio.

#biayawebsite #hargawebsite #jasawebsite #websitebali #companyprofile #landingpage """ + HT_BASE},

# 11 ────────────────────────────────────────────
{"id": "11-tanda-erp", "date": "2026-10-16", "tag": "Edukasi", "slides": [
  {"type": "cover", "eyebrow": "Buat pemilik pabrik kecil", "title": "6 tanda pabrikmu sudah melampaui spreadsheet.",
   "sub": "ERP bukan cuma buat pabrik besar."},
  {"type": "list", "title": "Tanda 1 sampai 3", "items": [
    {"n": "01", "t": "Stok gudang nggak cocok dengan catatan"},
    {"n": "02", "t": "HPP dihitung sebulan sekali", "d": "Dan angkanya lebih mirip perkiraan."},
    {"n": "03", "t": "Bahan kedaluwarsa ketahuan terlambat", "d": "Pas sudah nggak bisa dipakai."}]},
  {"type": "list", "title": "Tanda 4 sampai 6", "items": [
    {"n": "04", "t": "Pembelian tanpa persetujuan jelas", "d": "Susah dilacak siapa pesan apa."},
    {"n": "05", "t": "Formula ada di satu file", "d": "Atau di kepala satu orang."},
    {"n": "06", "t": "Tiap tim pakai angka berbeda", "d": "Produksi, gudang, dan pembelian."}]},
  {"type": "text", "eyebrow": "Yang sering luput", "title": "HPP rata-rata bisa menipu.",
   "body": ["Bahan yang sama dibeli di harga berbeda per lot. Kalau dirata-rata, biaya produksi batch hari ini **bisa meleset** dari aslinya.",
            "ERP yang menghitung HPP per batch memakai harga lot yang benar-benar terpakai."]},
  CTA_BLOG("ERP manufaktur untuk pabrik kecil.", "Fitur wajib, contoh hitung HPP per batch, dan cara beralih tanpa menghentikan produksi.")],
 "caption": """Banyak pabrik kecil jalan pakai belasan spreadsheet. Awalnya aman, lama-lama angkanya nggak pernah sama antara gudang, produksi, dan pembelian 🏭

Ini 6 tanda pabrikmu sudah melampaui spreadsheet. Satu yang paling sering luput: HPP rata-rata. Bahan yang sama bisa dibeli di harga berbeda per lot, jadi biaya produksi batch hari ini bisa meleset dari aslinya.

ERP bukan cuma buat pabrik besar. Yang penting sistemnya mengikuti alur produksimu.

Artikel lengkap dengan contoh hitung HPP per batch ada di blog, link di bio.

#erp #erpmanufaktur #pabrik #produksi #hpp #manufaktur #umkm """ + HT_BASE},

# 12 ────────────────────────────────────────────
{"id": "12-studi-ims", "date": "2026-10-19", "tag": "Studi kasus", "slides": [
  {"type": "cover", "eyebrow": "Industry Management · Manufaktur", "title": "Dari spreadsheet terpisah ke satu sumber data produksi.",
   "image": "industry-management-ims-shot.jpg"},
  {"type": "text", "eyebrow": "Tantangannya", "title": "Margin tergerus tanpa disadari.",
   "body": ["Stok fisik nggak cocok dengan catatan, HPP cuma perkiraan, dan bahan mendekati kedaluwarsa lolos pantauan.",
            "Keputusan produksi diambil **tanpa data yang akurat**."]},
  {"type": "image", "eyebrow": "Yang kami bangun", "title": "Seluruh alur produksi dalam satu sistem.", "image": "industry-management-ims-g0.jpg",
   "cap": "Dari pembelian, stok bahan, formula, sampai HPP per batch.", "note": "Tampilan dengan data demo"},
  {"type": "list", "title": "Isinya", "items": [
    {"n": "01", "t": "Pembelian dengan alur persetujuan"},
    {"n": "02", "t": "Stok FEFO dan kontrol kedaluwarsa", "d": "Bahan yang lebih dulu kedaluwarsa, terpakai lebih dulu."},
    {"n": "03", "t": "Formula produk dan komposisi bahan"},
    {"n": "04", "t": "HPP otomatis per batch"},
    {"n": "05", "t": "Konsinyasi, POS, dan multi-user"}]},
  {"type": "text", "eyebrow": "Hasilnya", "title": "HPP bisa dilihat kapan saja.",
   "body": ["Rekap yang tadinya manual sekarang otomatis, tanpa hitung ulang.",
            "Tim produksi dan pembelian **bekerja dari satu sumber data** yang sama."]},
  CTA_TALK],
 "caption": """Kalau gudang, produksi, dan pembelian punya angka sendiri-sendiri, yang rugi biasanya margin 📉

Industry Management kami bangun buat nyatuin semuanya. Pembelian lewat alur persetujuan, stok bahan pakai FEFO biar yang lebih dulu kedaluwarsa terpakai duluan, formula produk tercatat rapi, dan HPP dihitung otomatis per batch dari harga lot yang benar-benar terpakai.

Hasilnya, HPP bisa dicek kapan saja, dan semua tim kerja dari satu sumber data.

Geser buat lihat isinya 👉 Punya pabrik atau usaha produksi? Ngobrol dulu yuk, link di bio.

#erp #erpmanufaktur #sistemproduksi #pabrik #fefo #hpp #manufaktur """ + HT_BASE},
]
