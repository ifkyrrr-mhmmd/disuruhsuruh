# Product Requirement Document (PRD)
## Proyek: Sistem Manajemen Pemesanan & Kalkulasi Tarif Transparan UMKM disuruhsuruh

- **Nama Dokumen:** `prd.md`
- **UMKM Sasaran:** disuruhsuruh (Penyedia Jasa Kurir, Titip Beli, & Kebersihan)
- **Lokasi Operasional:** Samarinda, Kalimantan Timur
- **Pemilik UMKM (Narasumber):** Muhammad Zaini Gani (Kak Gani)
- **Tim Pengembang (A26-CS031):** Full-Stack (2), AI Engineering (2), Data Science (2)
- **Status Dokumen:** Final Draft (Ready for System Design & Phased Execution)

---

## 1. Problem Statement

### 1.1 Sudut Pandang Pelaku UMKM (Kak Gani & 3 Admin)
1. **Penentuan Harga Manual & Lambat:** Setiap kali ada pesanan masuk lewat WhatsApp atau DM Instagram, admin harus membuka Google Maps secara manual, mengukur jarak penjemputan ke pengantaran, lalu mengalikan tarif per kilometer dengan kalkulator fisik. Proses ini memakan waktu 5–10 menit per transaksi, menyebabkan penumpukan antrean chat saat jam sibuk (*rush hour*).
2. **Keterbatasan Layanan Multi-Kategori:** Penentuan tarif untuk jasa *Bersih-bersih* (dipengaruhi tipe ruangan, luas, dan tingkat kekotoran) dan *Titip Beli* (dipengaruhi uang talangan dan rute toko) tidak memiliki formula terstandar dan hanya didasarkan pada perkiraan subjektif admin.
3. **Pencatatan Berbasis Kertas (*Paper-Based Operations*):** Rekapitulasi pesanan harian dan pembagian tugas ke 50 mitra kurir lepas masih dicatat pada buku/kertas fisik. Hal ini menimbulkan risiko tinggi kehilangan data, kesalahan pencatatan nomor telepon/alamat, dan kesulitan rekapitulasi keuangan di akhir bulan.

### 1.2 Sudut Pandang Pelanggan (Mahasiswa & Masyarakat Samarinda)
1. **Ketiadaan Transparansi Biaya:** Pelanggan tidak dapat mengetahui estimasi tarif secara instan sebelum menghubungi admin. Hal ini menimbulkan keraguan (*friction*) dan potensi pembatalan sepihak karena ketidaksesuaian ekspektasi biaya.
2. **Ketidakpastian Waktu Pengerjaan:** Pelanggan tidak memiliki gambaran berapa lama barang akan sampai atau berapa lama layanan kebersihan akan selesai dikerjakan.
3. **Pelacakan Status yang Mengambang:** Pelanggan harus berulang kali mengirim pesan teks chat (*"Min, sudah jalan belum?"*) untuk mengetahui posisi dan kejelasan penanganan pesanan mereka.

---

## 2. Solution

Membangun platform web terpadu dengan arsitektur *decoupled* yang menyediakan dua antarmuka utama:
1. **Portal Publik Pelanggan (`/order` & `/track/:nanoId`):**
   - Formulir pemesanan dinamis berbasis kartu interaktif untuk 3 layanan (*Antar Barang, Titip Beli, Bersih-bersih*).
   - Mesin kalkulasi rute dan jarak jalan raya otomatis menggunakan **Leaflet.js & OpenStreetMap (OSM)** tanpa ketergantungan API berbayar.
   - Kartu transparansi biaya instan (*open price breakdown*) yang membeberkan komponen tarif dasar, jarak, dan variabel barang/ruangan.
   - Integrasi model estimasi harga dinamis dan estimasi waktu pengerjaan (AI/Data Science).
   - Pelacakan status pesanan langsung (*Live Tracking*) menggunakan token URL aman (**NanoID**) tanpa kewajiban registrasi akun yang membebani pengguna ponsel.
2. **Portal Operasional Admin (`/admin/dashboard`):**
   - Dasbor pemantauan pesanan terpusat dengan notifikasi suara instan (*audio chime*).
   - Modal peninjauan rute pada peta mini, validasi ketersediaan mitra, dan fitur koreksi harga (*Admin Price Override*).
   - Penugasan 50 mitra kurir secara semi-manual dengan pencatatan nama & kontak kurir yang bertanggung jawab.
   - Tombol verifikasi instan *1-Click WhatsApp Quick Ping* untuk menangkal pesanan fiktif pada metode COD.
   - Manajemen pengembalian dana (*Refund 100%*) dan ekspor laporan transaksi digital ke format CSV/Excel untuk mengeliminasi buku kertas.

---

## 3. User Stories

### 3.1 Portal Pelanggan (Customer Facing)
1. **US-01 (Pemilihan Layanan):** Sebagai pelanggan, saya ingin memilih salah satu dari 3 kategori layanan (*Antar Barang, Titip Beli, Bersih-bersih*) melalui kartu selector interaktif di ponsel, agar formulir otomatis menampilkan kolom isian yang hanya relevan dengan kebutuhan saya.
2. **US-02 (Penentuan Titik Antar Barang):** Sebagai pelanggan layanan Antar Barang, saya ingin menandai titik penjemputan dan titik pengantaran pada peta Leaflet.js interaktif, agar sistem langsung menghitung rute jalan raya dan jarak tempuh dalam kilometer secara otomatis.
3. **US-03 (Penentuan Titik Titip Beli):** Sebagai pelanggan layanan Titip Beli, saya ingin menentukan titik toko belanja dan titik rumah pengantaran serta memasukkan estimasi uang talangan, agar saya mengetahui total estimasi biaya jasa dan belanjaan sebelum memesan.
4. **US-04 (Penanganan Stok Kosong):** Sebagai pelanggan layanan Titip Beli, saya ingin memilih preferensi tindakan di formulir jika barang kosong (*Hubungi via WA / Beli yang ada / Batalkan pesanan*), agar mitra tidak kebingungan saat berada di kasir toko.
5. **US-05 (Penentuan Titik Bersih-bersih):** Sebagai pelanggan layanan Bersih-bersih, saya ingin cukup menandai 1 titik alamat rumah saya di peta, agar sistem menghitung biaya kunjungan transportasi mitra secara otomatis dari basecamp kantor disuruhsuruh Samarinda.
6. **US-06 (Input Variabel Bebas Kebersihan):** Sebagai pelanggan layanan Bersih-bersih, saya ingin memilih tipe properti (*Kos, Rumah, Kantor*), jumlah ruangan, dan tingkat kekotoran (*Ringan, Standar, Deep Clean*), agar sistem memberikan penawaran harga yang adil dan akurat.
7. **US-07 (Preferensi Gender Mitra):** Sebagai pelanggan wanita (khususnya penghuni kos putri), saya ingin memilih preferensi gender mitra (*Pria / Wanita / Bebas*), agar saya merasa aman dan nyaman saat mitra datang ke ruangan saya.
8. **US-08 (Transparansi Rincian Biaya):** Sebagai pelanggan, saya ingin melihat kartu rincian harga terbuka yang memisahkan tarif dasar, tarif jarak tambahan, dan biaya layanan sebelum melakukan konfirmasi, agar saya yakin tidak ada biaya tersembunyi.
9. **US-09 (Estimasi Waktu Pengerjaan):** Sebagai pelanggan, saya ingin melihat estimasi durasi penyelesaian pesanan yang diprediksi oleh sistem, agar saya dapat mengatur jadwal aktivitas saya.
10. **US-10 (Checkout Tanpa Sandi - Hybrid Auth):** Sebagai pelanggan, saya ingin melakukan pemesanan dengan memasukkan nama dan nomor WhatsApp aktif atau memilih One-Click Google Login tanpa harus mengingat kata sandi baru, agar pemesanan dapat selesai dalam waktu kurang dari dua menit.
11. **US-11 (Pelacakan Status Mandiri):** Sebagai pelanggan yang telah mengajukan pesanan, saya ingin dialihkan ke halaman pelacakan mandiri ber-URL unik NanoID, agar saya dapat memantau apakah pesanan saya sedang diproses, menunggu pembayaran, atau selesai tanpa perlu chat manual.
12. **US-12 (Pembayaran QRIS Dinamis):** Sebagai pelanggan yang memilih metode non-tunai, saya ingin sistem menampilkan kode QRIS dinamis dengan nominal tagihan yang terkunci otomatis sesuai persetujuan admin, agar saya tinggal memindai dan membayar tanpa risiko salah ketik nominal.
13. **US-13 (Batas Waktu Pembayaran):** Sebagai pelanggan, saya ingin melihat penghitung waktu mundur (*countdown*) 15 menit untuk pembayaran digital, agar saya mengetahui batas waktu penyelesaian transaksi sebelum slot mitra dilepaskan.
14. **US-14 (Pembatalan Pesanan Adil):** Sebagai pelanggan, saya ingin dapat membatalkan pesanan secara mandiri selama status masih *Menunggu Konfirmasi Admin*, agar saya tidak dikenakan biaya jika terjadi perubahan rencana mendadak.
15. **US-15 (Pengajuan Refund Cepat):** Sebagai pelanggan Titip Beli yang pesanannya dibatalkan akibat toko tutup/stok habis, saya ingin mengisi rekening bank atau nomor e-wallet di halaman pelacakan untuk menerima pengembalian dana 100% penuh tanpa potongan.
16. **US-16 (WhatsApp Smart Link):** Sebagai pelanggan, saya ingin dapat menekan tombol bantuan WhatsApp yang otomatis terisi nomor resi pesanan saya, agar saya dapat langsung terhubung dengan admin saat ada instruksi khusus.

### 3.2 Portal Admin (Admin Facing)
17. **US-17 (Otentikasi Dasbor):** Sebagai admin disuruhsuruh, saya ingin login ke dasbor terlindungi menggunakan kredensial email dan kata sandi yang aman, agar data operasional dan pesanan pelanggan tidak dapat diakses publik.
18. **US-18 (Notifikasi Suara Pesanan Masuk):** Sebagai admin, saya ingin dasbor berbunyi chime (*"Ting!"*) dan memunculkan badge pesanan baru secara *real-time*, agar saya dapat segera memproses pesanan tanpa harus me-refresh halaman berulang kali.
19. **US-19 (Peninjauan Rute & Variabel):** Sebagai admin, saya ingin melihat modal rincian pesanan yang menampilkan peta rute penjemputan/pengantaran, deskripsi barang, dan variabel masukan pelanggan, agar saya dapat memvalidasi kelayakan order.
20. **US-20 (Koreksi Harga - Admin Price Override):** Sebagai admin, saya ingin memiliki wewenang untuk menyesuaikan total harga pesanan sebelum mengirimkan tagihan ke pelanggan (misal: penambahan biaya penanganan tangga lantai 3 atau barang ekstra berat), agar kompensasi mitra di lapangan terlindungi.
21. **US-21 (Verifikasi 1-Click WhatsApp):** Sebagai admin pada pesanan metode COD, saya ingin mengeklik tombol cepat WhatsApp yang langsung membuka chat pelanggan untuk memastikan nomornya aktif, sebelum menugaskan mitra meluncur ke jalan.
22. **US-22 (Penugasan Mitra Kurir):** Sebagai admin, saya ingin mencatatkan nama dan nomor telepon mitra kurir yang mengambil tugas (setelah koordinasi di grup WA mitra), agar di sistem tercatat siapa yang bertanggung jawab atas order tersebut.
23. **US-23 (Pembaruan Status Operasional):** Sebagai admin, saya ingin memperbarui status pesanan secara sekuensial (*Diproses $\rightarrow$ Mitra Menuju Lokasi $\rightarrow$ Sedang Dikerjakan $\rightarrow$ Selesai*), agar informasi di layar pelacakan pelanggan ter-update seketika.
24. **US-24 (Eksekusi Refund Toko Kosong):** Sebagai admin, saya ingin melihat antrean data rekening refund dari pelanggan dan menandai refund telah ditransfer setelah mengirimkannya lewat m-banking, agar pembukuan kas tetap seimbang.
25. **US-25 (Ekspor Data Transaksi):** Sebagai pemilik (Kak Gani), saya ingin mengunduh seluruh rekap riwayat pesanan ke file CSV/Excel dengan satu klik, agar proses evaluasi bulanan tidak lagi bergantung pada rekapan kertas.

---

## 4. Implementation Decisions

### 4.1 Arsitektur Decoupled (Frontend & Backend Terpisah)
1. **Frontend Client (`client/`):**
   - Framework: **React 18/19** dengan bundler **Vite** untuk build ringan dan kecepatan muat tinggi (< 1.5 detik di mobile 4G).
   - Styling: **Tailwind CSS** dipadukan dengan pustaka komponen **Shadcn UI (Radix UI)** untuk interaksi antarmuka yang modern, aksesibel, dan bersih dari gaya AI generik (*anti-slop*).
   - HTTP Client: **Axios** dengan konfigurasi base URL dan *error interceptor* terpusat.
   - Pemetaan: **Leaflet.js 1.9+** & OpenStreetMap Tiles, didukung routing machine **OSRM** publik untuk kalkulasi jarak jalan raya nyata (*driving distance*).
2. **Backend Server (`server/`):**
   - Runtime & Framework: **Node.js** dengan **Express.js**.
   - Validasi Data: **Joi Schema Validation** diterapkan di tingkat middleware pada seluruh endpoint masukan (*payload validation*).
   - Database: **PostgreSQL** yang di-host di layanan serverless **Neon DB**.
   - Token Tracking: Pustaka **NanoID** (menghasilkan string alfanumerik acak 10-12 karakter, non-sekuensial, URL-safe).
3. **AI Gateway Proxy & Fallback Degradation:**
   - Frontend **dilarang memanggil langsung service Python AI** untuk menjaga kerahasiaan endpoint dan API Key.
   - Backend Express bertindak sebagai perantara aman (*secure proxy*): `POST /api/v1/pricing/estimate`.
   - Backend meneruskan variabel ke model AI tim Python, menerima hasil prediksi durasi & harga, lalu mencatat riwayat inferensi (*inference logs*) ke database.
   - **Graceful Degradation:** Jika service Python AI *down*, *timeout* (> 3 detik), atau gagal merespons, Backend Express otomatis beralih ke formula cadangan internal (*heuristic pricing formula* berbasis kecepatan rata-rata kota Samarinda $25\text{ km/jam}$) dan tetap mengembalikan respons sukses dengan tanda `is_fallback: true`. Sistem tidak akan pernah crash di mata pelanggan.

### 4.2 Skema Database Relasional (PostgreSQL Neon)
Entitas inti yang akan dibangun mencakup:
* `services`: ID, nama (`antar_barang`, `titip_beli`, `bersih_rumah`), base_price, per_km_rate, config_json, is_active.
* `orders`: id (UUID), nano_id (varchar unik), customer_name, customer_phone, service_type, pickup_address, dropoff_address, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, distance_km, item_details (JSON: berat, dimensi, daftar belanja, tingkat kekotoran), calculated_price, final_price, price_override_reason, predicted_duration_minutes, payment_method (`COD` / `QRIS`), payment_status (`UNPAID`, `PAID`, `REFUNDED`), status (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), assigned_mitra_name, assigned_mitra_phone, proof_image_url, created_at, updated_at.
* `ai_inference_logs`: id, order_id, input_features (JSON), predicted_price, predicted_duration, model_version, is_fallback, response_time_ms, created_at.
* `refunds`: id, order_id, bank_or_ewallet_name, account_number, account_holder_name, refund_amount, status (`PENDING`, `COMPLETED`), transfer_receipt_url, created_at, completed_at.

### 4.3 Kontrak RESTful API Utama (`/api/v1/...`)
* `GET /api/v1/services` $\rightarrow$ Mengambil konfigurasi katalog dan tarif dasar layanan.
* `POST /api/v1/pricing/estimate` $\rightarrow$ Menerima payload variabel bebas, memanggil proxy AI/rumus, mengembalikan breakdown harga dan durasi.
* `POST /api/v1/orders` $\rightarrow$ Validasi skema Joi, generate NanoID, simpan pesanan berstatus `PENDING`.
* `GET /api/v1/orders/:nanoId` $\rightarrow$ Mengambil data pelacakan publik (nomor HP dan nama disamarkan sebagian demi privasi).
* `PATCH /api/v1/orders/:nanoId/cancel` $\rightarrow$ Pelanggan membatalkan pesanan (hanya diizinkan jika status masih `PENDING`).
* `POST /api/v1/orders/:nanoId/refund-request` $\rightarrow$ Menyimpan rekening pengajuan refund 100% dari pelanggan.
* `POST /api/v1/admin/login` $\rightarrow$ Otentikasi admin, mengembalikan session/JWT token.
* `GET /api/v1/admin/orders` $\rightarrow$ Mengambil daftar seluruh pesanan dengan filter status, pencarian, dan paginasi.
* `PATCH /api/v1/admin/orders/:id/action` $\rightarrow$ Admin update status, koreksi harga (*override*), atau menugaskan nama mitra.
* `GET /api/v1/admin/export` $\rightarrow$ Stream file data pesanan berformat CSV untuk pembukuan UMKM.

---

## 5. Business Rules & Guardrails Ketat

1. **Geofencing Radius Operasional Samarinda (25 km):**
   - Pusat koordinat acuan ditetapkan di area pusat kantor disuruhsuruh Samarinda (`lat: -0.502179, lng: 117.153709`).
   - Seluruh penempatan titik jemput/antar pada Leaflet.js dibatasi maksimum radius **25 kilometer** garis lurus dari pusat acuan. Jika titik berada di luar batas, sistem menampilkan notifikasi ramah: *"Maaf, lokasi di luar jangkauan layanan disuruhsuruh (Maksimal 25 km dari pusat Samarinda)."* dan tombol konfirmasi dinonaktifkan.
2. **Fast-Track COD & Plafon Keamanan (Anti-Fraud):**
   - Opsi pembayaran Tunai (COD) hanya diizinkan untuk pesanan dengan nilai total di bawah **Rp 50.000**.
   - Untuk pesanan bernilai > Rp 50.000 atau Titip Beli dengan uang talangan besar, sistem mewajibkan pembayaran digital / transfer DP.
   - Pada pesanan COD, admin **wajib melakukan 1-Click WhatsApp Ping** untuk memastikan nomor pelanggan aktif sebelum memberi izin mitra meluncur.
3. **Dynamic QRIS & Timer 15 Menit:**
   - Tagihan digital menggunakan QRIS Dinamis (Midtrans Sandbox / Simulator) di mana nominal pembayaran terkunci otomatis sesuai harga persetujuan admin.
   - Halaman pelacakan memberlakukan hitung mundur **15 menit**. Jika melewati 15 menit pembayaran belum terkonfirmasi, pesanan otomatis berstatus `KADALUARSA (EXPIRED)` agar mitra tidak tersandera menunggu.
4. **Kebijakan Refund 100% Penuh (Beban UMKM):**
   - Jika layanan Titip Beli dibatalkan karena seluruh barang di toko kosong atau toko tutup permanen, dana belanjaan dan ongkir pelanggan **dikembalikan 100% utuh tanpa potongan biaya administrasi atau bensin**.
   - Kompensasi lelah/bensin mitra sebesar **Rp 5.000** ditanggung penuh oleh kas operasional UMKM disuruhsuruh untuk menjaga reputasi dan loyalitas pelanggan.
5. **Keamanan URL Pelacakan (NanoID & Masking):**
   - Tautan resi pelacakan wajib menggunakan token NanoID acak (contoh: `/track/ds_k8x9m2`), melarang keras penggunaan ID sekuensial angka (`1, 2, 3`) guna mencegah eksploitasi data oleh pihak luar.
   - Pada halaman tracking publik, nomor telepon pelanggan disamarkan (*masked*, contoh: `0812****7890`) dan nama belakang disingkat (*Budi S.*).
6. **Protokol Komunikasi WhatsApp:**
   - Tautan komunikasi diarahkan menggunakan format *WhatsApp Deep Link* resmi (`wa.me`) yang menyertakan teks pembuka otomatis berisikan Nomor Resi NanoID dan Nama Layanan.

---

## 6. Testing & Quality Assurance Decisions

1. **Pola Pengujian Tingkat Tinggi (*High Seams Testing*):**
   - Mengikuti panduan *superpowers* dan *to-spec*, pengujian difokuskan pada perilaku eksternal (*behavioral seams*), bukan detail implementasi internal.
2. **Cakupan Pengujian Kunci:**
   - **Seam 1 (Joi Validation Middleware):** Memastikan nomor telepon non-Indonesia, koordinat di luar Samarinda, atau variabel negatif langsung ditolak dengan kode status 400 dan pesan kesalahan yang terstruktur.
   - **Seam 2 (Pricing Engine Calculation):** Memastikan formula matematika tarif dasar + tarif jarak + koefisien dimensi/berat/tingkat kekotoran menghasilkan nominal rupiah yang konsisten.
   - **Seam 3 (Order State Machine):** Menguji transisi status pesanan tidak melompati aturan (contoh: pesanan yang sudah `IN_PROGRESS` tidak boleh bisa dibatalkan sepihak oleh endpoint pelanggan).
   - **Seam 4 (AI Fallback Recovery):** Memastikan saat service AI disimulasikan mati (*connection refused*), endpoint pricing tetap merespons 200 OK dengan kalkulasi heuristic cadangan.

---

## 7. Out of Scope (Batasan Eksplisit)

Sesuai dokumen kesepakatan capstone 4 minggu, fitur-fitur berikut **ditetapkan berada di luar ruang lingkup (Out-of-Scope)** dan tidak akan dikembangkan pada fase ini:
1. ❌ **Live GPS Tracking Real-Time Kurir di Jalan:** Tidak ada pelacakan posisi satelit pergerakan motor kurir detik-demi-detik di atas peta (cukup status stepper pencapaian lokasi).
2. ❌ **Sistem Alokasi Otomatis Kurir (Matching Algorithm):** Penugasan kurir dari 50 mitra tetap dijalankan secara terpusat oleh admin melalui grup WhatsApp mitra, lalu nama kurir diinput ke sistem.
3. ❌ **Komunikasi In-App Chat di Web:** Tidak membangun fitur obrolan instan berbasis websocket di dalam browser (seluruh tektokan dialihkan ke WhatsApp resmi).
4. ❌ **Aplikasi Mobile Native (Android / iOS):** Proyek difokuskan penuh pada aplikasi web responsif (*Mobile-First Responsive Web*).
5. ❌ **Payment Gateway Berlisensi Produksi:** Integrasi pembayaran menggunakan lingkungan uji coba *Midtrans Sandbox / Simulator* yang realistis tanpa melibatkan perbankan live berbayar.

---

## 8. Kriteria Keberhasilan (Acceptance Criteria)

### 8.1 Pemenuhan Main Quest (100% Mandatory)
- [x] Aplikasi menyelesaikan permasalahan penentuan tarif manual dan pencatatan kertas pada UMKM disuruhsuruh Samarinda.
- [x] Menyediakan minimal 2 fitur utama yang berfungsi penuh: (1) Form Pemesanan Dinamis & Kalkulator Jarak Rute Leaflet, (2) Dashboard Manajemen Pesanan Admin.
- [x] Respons antarmuka akurat terhadap setiap aksi input (perubahan pin peta langsung memperbarui jarak dan total tarif secara real-time).
- [x] Umpan balik visual/audio jelas atas setiap aksi (loading skeleton, audio alert *"Ting!"*, badge status warna, timer countdown).
- [x] Dasbor admin intuitif dan mudah dioperasikan oleh Kak Gani dan 3 admin tanpa memerlukan keahlian teknis khusus.
- [x] Antarmuka dapat diakses dengan lancar melalui browser ponsel (*mobile web*) tanpa perlu instalasi lokal.
- [x] Bebas dari tombol dummy "segera hadir" dan tidak mengekspos kredensial rahasia di repositori publik.

### 8.2 Pemenuhan Side Quest (Nilai Tambah Ekstra)
- [x] Arsitektur *Decoupled*: Frontend (React + Vite) terpisah dari Backend (Express Framework).
- [x] Styling modern menggunakan Tailwind CSS dan Shadcn UI (Radix UI) yang responsif dan anti-slop.
- [x] HTTP networking calls dikelola terpusat menggunakan Axios.
- [x] Penyimpanan data persisten menggunakan PostgreSQL di cloud provider Neon DB.
- [x] RESTful API Express standar mengikuti konvensi URL `/api/v1/...`.
- [x] Validasi data yang ketat menggunakan Joi Schema Validation.
- [x] Backend bertindak sebagai proxy aman ke model AI/DS dan menyimpan riwayat inferensi ke database.
- [x] Menerapkan mekanisme pemulihan kegagalan (*graceful degradation*) jika layanan AI mengalami gangguan.
- [x] Keputusan desain antarmuka, warna, dan tipografi beridentitas jelas serta ramah sentuhan jempol (*thumb-friendly*).
- [x] Siap didistribusikan pada platform cloud gratis (*Vercel/Netlify* untuk client, *Render* untuk server, *Neon* untuk database).
