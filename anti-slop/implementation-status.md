# Implementation Status: disuruhsuruh

Tanggal: 30 Oktober 2026  
Mode kerja: AFTER, perubahan dilakukan setelah persetujuan pengguna atas rencana audit.  
Arah: mempertahankan identitas visual, tiga layanan, wizard pemesanan, dan tag inti yang sudah ada.

## Perbaikan yang diterapkan

### Core, status, dan transaksi
- Memisahkan status operasional pesanan dari status pembayaran.
- Menambahkan status `CONFIRMED` untuk konfirmasi pesanan yang belum tentu berarti pembayaran sudah lunas.
- Menambahkan status `EXPIRED` untuk pembayaran QRIS yang melewati batas waktu.
- Menegakkan transisi status pada endpoint admin.
- Menambahkan pembatalan mandiri hanya selama `PENDING_REVIEW`, sesuai batasan PRD.
- Membuat pembatalan dan expiry menggunakan update kondisional di database.
- Menambahkan endpoint pembatalan pelanggan yang hanya aktif selama `PENDING_REVIEW`, serta expiry QRIS melalui webhook dan pemeriksaan tracking.
- Menghitung ulang jarak rute di backend saat order dibuat; nilai jarak dari browser tidak digunakan sebagai sumber harga transaksi.
- Memvalidasi koordinat dan radius operasional di backend.
- Menghapus koordinat default yang dapat membuat order terkirim dengan lokasi contoh yang tidak dipilih pelanggan.
- Mengoreksi nilai `standar` pada layanan Bersih-bersih agar sesuai dengan UI.
- Menautkan log inferensi AI ke UUID order; AI saat ini hanya memperkirakan durasi, sementara harga tetap dihitung pricing engine deterministik.

### Keamanan dan privasi
- Menghapus fallback JWT secret, PIN default, dan autentikasi bypass melalui header `x-admin-pin`.
- Memerlukan `JWT_SECRET` minimal 32 karakter dan `ADMIN_PIN` minimal 8 karakter.
- Menambahkan rate limit sederhana untuk login, order, tracking, refund, dan webhook.
- Membatasi ukuran request, mengatur CORS berbasis allowlist, dan menambahkan security headers.
- Memastikan error 500 tidak membocorkan detail internal di production.
- Memverifikasi signature Midtrans secara constant-time, memeriksa nominal notifikasi, dan menghindari pemrosesan settlement duplikat.
- Menjaga agar settlement yang datang setelah pesanan ditutup tidak otomatis membuka kembali pesanan; pembayaran dicatat dan diarahkan untuk verifikasi admin.
- Menghapus fallback QRIS simulator yang dapat terlihat seperti QR pembayaran asli.
- Membatasi simulasi pembayaran hanya untuk development non-production dan flag eksplisit.
- Mengenkripsi nomor rekening serta nama pemilik rekening refund menggunakan AES-256-GCM.
- Menambahkan skrip untuk mengenkripsi data refund lama.
- Menambahkan unique index agar satu order tidak memiliki pengajuan refund ganda.
- Membungkus pengajuan refund dan penyelesaian transfer beserta perubahan status order dalam transaksi database.
- Melindungi CSV export dari formula injection.
- Menghapus file `server/.env` dari paket hasil dan menyediakan `.env.example`.

### UI/UX dan motion
- Mempertahankan identitas hangat dan warna brand; tidak melakukan redesign total.
- Mengubah pemilihan layanan dan metode pembayaran berbasis `div` menjadi tombol semantik yang dapat digunakan keyboard.
- Menambahkan state `aria-pressed`, focus-visible, label input yang terhubung, dan target sentuh minimum pada layar kecil.
- Menambahkan transisi wizard singkat dan reduced-motion support.
- Mengganti parallax berbasis React state dengan `requestAnimationFrame`; efek mati pada mobile dan reduced-motion.
- Menampilkan pesan estimasi rute jika OSRM fallback digunakan.
- Memperjelas bahwa harga pada halaman pemesanan adalah estimasi dan harga final dikonfirmasi admin.
- Menghapus kontrol buka/tutup toko dan rating yang sebelumnya hanya menyimpan state lokal, bukan data backend.
- Membatasi tombol refund pada order Titip Beli yang telah dibayar dan memenuhi status.
- Memperjelas pesan status tracking dan menghilangkan pulse dekoratif berulang.

## Belum selesai / membutuhkan keputusan atau kredensial

1. **Tarif dari database:** pricing engine masih menggunakan angka tarif di kode. Perlu keputusan UMKM untuk menjadikan tabel `services` sebagai sumber tarif utama dan menyepakati angka final per layanan.
2. **AI pricing:** model AI belum menjadi sumber harga transaksi. Saat ini formula deterministik menghitung harga; AI hanya digunakan untuk prediksi durasi saat order dibuat.
3. **Geocoding alamat:** input alamat tidak otomatis mencari koordinat. Setelah teks alamat diedit, pelanggan harus memilih ulang pin peta. Integrasi geocoding perlu keputusan provider dan kebijakan privasi.
4. **Google Login:** belum diimplementasikan; tetap opsional sesuai prioritas MVP.
5. **Rating pelanggan:** kontrol frontend lokal dihapus sampai endpoint, tabel, dan tampilan admin tersedia.
6. **Status buka/tutup toko:** kontrol lokal dihapus sampai pengaturan tersimpan di backend dan memblokir order secara nyata.
7. **WhatsApp:** tombol saat ini membuka WhatsApp dengan tautan/pesan; belum ada pengiriman notifikasi otomatis melalui WhatsApp Business API.
8. **GPS real-time mitra:** tidak dibuat karena PRD menempatkannya di luar scope.
9. **Bukti foto pengerjaan:** belum ada alur upload dan penyimpanan file yang lengkap.
10. **Rate limit multi-instance:** limiter saat ini in-memory per proses. Deployment horizontal memerlukan Redis/shared store.
11. **Sesi admin:** token masih disimpan di `localStorage`. Untuk threat model yang lebih kuat, pertimbangkan HttpOnly Secure cookie dan proteksi CSRF.
12. **Refund legacy:** data refund plaintext yang sudah ada perlu dienkripsi satu kali menggunakan `npm run encrypt:refund-data` setelah `REFUND_ENCRYPTION_KEY` disetel. Simpan key dengan aman.

## Perubahan keputusan desain

- Form pemesanan tetap menggunakan wizard tiga langkah. Desain lama yang menyebut split view desktop diselaraskan karena peta lebih mudah dipahami sebagai langkah khusus dan tidak membebani formulir sekaligus.
- `design.md` diperbarui agar status, warna, motion dials, dan alur aktual tercatat. PRD tetap dipertahankan sebagai kebutuhan produk, bukan diam-diam ditulis ulang.
