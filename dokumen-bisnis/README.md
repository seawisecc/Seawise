# Dokumen bisnis: Quotation, Proforma Invoice, Invoice

Buka `generator.html` di Chrome (klik dua kali). Isi form di kiri, dokumen A4
di kanan ikut berubah. **Cetak / Simpan PDF** lalu pilih "Save as PDF",
ukuran A4, margin "Default" atau "None", centang "Background graphics".

Contoh hasil ada di `contoh/`. Angka di sana ilustrasi, bukan harga resmi.
Untuk membuatnya ulang: `generator.html?contoh=quotation|proforma|invoice`.

## Alur

1. **Quotation** ke calon klien. Ada kolom "Disetujui oleh" untuk tanda tangan klien.
2. Klien setuju: tombol **Jadikan Proforma**. Isi, klien, dan nilai terbawa,
   nomor quotation masuk ke Referensi. Termin default 50%.
3. Pembayaran termin masuk, pekerjaan selesai: **Jadikan Invoice**. Nilai
   proforma otomatis masuk ke "Sudah dibayar", jadi yang tertagih sisa saja.
4. Sudah dibayar lunas: centang **Tandai LUNAS**, cetak ulang sebagai kuitansi.

Nomor otomatis `QUO|PRO|INV/SW/<tahun>/<bulan>/<urut>`, urutan dihitung dari
dokumen yang tersimpan. Nomor tetap bisa diketik manual.

## Tanda tangan QR

QR berisi teks yang bisa dibaca kamera HP mana pun tanpa internet: penanda
tangan, jenis dan nomor dokumen, tanggal, klien, nilai, dan **kode verifikasi**.
Kodenya hash dari nomor, tanggal, klien, dan nilai. Kalau salah satunya diubah
sesudah dokumen dikirim, kodenya tidak cocok lagi dengan salinan di studio.

Ini tanda tangan elektronik sederhana, cukup untuk quotation dan invoice
sehari-hari. Untuk kontrak yang butuh kekuatan hukum penuh, pakai layanan
tanda tangan elektronik tersertifikasi (PSrE).

## Yang perlu diisi sekali

Bagian **Data studio** di bawah form: rekening bank (bank, nomor, atas nama)
dan NPWP kalau ada. Selama rekening kosong, proforma dan invoice menulis
"Detail rekening dikirim terpisah". Pajak (PPN) default 0% dan barisnya
tersembunyi. Isi hanya kalau Seawise sudah PKP.

## Penyimpanan

Semua dokumen tersimpan di **browser ini saja** (localStorage), tidak ke
server dan tidak ke repo. Pakai **Backup JSON** berkala, dan **Impor** untuk
memindahkan ke komputer lain. Jangan commit file backup, isinya data klien.
