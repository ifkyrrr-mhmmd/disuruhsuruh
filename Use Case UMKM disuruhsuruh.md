# 

# Asah 2026 

# *Template Use Case UMKM*

 

# 

# 

# **Petunjuk Pengisian**

* Dokumen dibuat untuk satu UMKM dan satu use case.  
* **Isi bagian yang di bold dan di highlight kuning. Setelah kamu mengisi, tidak perlu di highlight kuning lagi.**  
* Informasi harus berasal dari hasil wawancara dengan UMKM.  
* Jika ditemukan beberapa masalah, pilih satu masalah yang paling prioritas bagi UMKM.  
* Use case harus sesuai dengan skillset anggota tim dan feasible dikerjakan dalam timeline capstone selama empat minggu.  
* Scope harus dipersempit menjadi MVP yang dapat dikembangkan, diuji, dan didemonstrasikan kepada UMKM.  
* Gunakan bahasa bisnis yang mudah dipahami.  
* Jangan menentukan teknologi, arsitektur, atau fitur teknis secara berlebihan.  
* Bedakan informasi yang dikonfirmasi UMKM dengan asumsi atau usulan tim.  
* Konfirmasikan use case kepada PIC UMKM sebelum digunakan sebagai acuan capstone.

# **A. Informasi Umum**

**Nama UMKM:**  
disuruhsuruh

**Bidang usaha:**  
Jasa

**Nama narasumber:**  
Muhammad Zaini Gani

**Peran narasumber:**  
Owner

**PIC UMKM:**  
Muhammad Zaini Gani

**Kontak PIC:**  
085332455999

**Tanggal interview:**  
Sabtu, 24 Oktober 2026

**Nama tim:**  
A26-CS031

**Anggota tim:**  
Zulhilmi Shodiq  
Ahmad Faris   
Alif Satriya Wicaksono   
Dzaky Ayman Syauqi  
M. Fadlan Fadilah  
Muhammad Rifky Nuryadi Darmawan

**Status validasi use case:**  
Sudah dikonfirmasi oleh UMKM.

# **B. Penentuan Use Case**

Dari seluruh masalah yang ditemukan selama interview, tim perlu memilih satu masalah sebagai fokus capstone.

Use case yang dipilih harus:

* Menjadi masalah yang diprioritaskan oleh UMKM.  
* Memiliki dampak yang jelas terhadap bisnis atau customer.  
* Sesuai dengan skillset anggota tim.  
* Memiliki data, referensi, atau konteks yang cukup.  
* Dapat dikembangkan, diuji, dan didemonstrasikan dalam waktu empat minggu.  
* Tidak bergantung pada integrasi atau akses yang belum tersedia.  
* Dapat dipersempit menjadi satu MVP dengan alur utama yang jelas.  
* Dapat didemonstrasikan dan dinilai oleh UMKM.

**Masalah yang ditemukan dari hasil interview:**

1. Perhitungan dan transparansi harga layanan  
2. Proses pemesanan masih manual  
3. Pencatatan dan pelacakan pesanan belum terpusat

**Masalah yang dipilih sebagai use case:**  
Ketidakefisienan proses penentuan harga layanan

**Alasan menjadi prioritas bagi UMKM:**

Proses perhitungan harga layanan masih dilakukan secara manual oleh admin berdasarkan jarak, jenis layanan, dan kebutuhan pelanggan. Hal ini menyebabkan penentuan harga menjadi kurang efisien dan pelanggan tidak dapat mengetahui estimasi biaya secara langsung.

**Skill yang dibutuhkan:**

* Pengembangan Website: untuk membangun sistem yang memungkinkan pelanggan memilih layanan, mengisi informasi pesanan, dan melihat estimasi harga.  
* Pengelolaan data: untuk mengelola informasi layanan, tarif, jarak, durasi pekerjaan, dan data yang diperlukan dalam perhitungan harga serta estimasi waktu penyelesaian pesanan.  
* Artificial Intelligence: untuk mengembangkan model prediksi estimasi waktu penyelesaian layanan berdasarkan data historis dan karakteristik layanan.

**Skill yang dimiliki anggota tim:**

1. Zulhilmi Shodiq \- Data Science: Pengolahan, analisis, dan pengelolaan data yang diperlukan untuk mendukung prediksi estimasi waktu penyelesaian pesanan.  
2. Ahmad Faris \- AI Engineering: Pengembangan dan implementasi model AI untuk memprediksi estimasi waktu penyelesaian pesanan berdasarkan karakteristik layanan.  
3. Alif Satriya Wicaksono \- Full-Stack Development: Pengembangan website, baik frontend maupun backend, serta pengelolaan database.  
4. Dzaky Ayman Syauqi \- AI Engineering: Pengembangan dan implementasi model AI untuk memprediksi estimasi waktu penyelesaian pesanan berdasarkan karakteristik layanan.  
5. M. Fadlan Fadilah \- Data Science: Pengolahan, analisis, dan pengelolaan data yang diperlukan untuk mendukung prediksi estimasi waktu penyelesaian pesanan.  
6. Muhammad Rifky Nuryadi Darmawan \- Full-Stack Development: Pengembangan website, baik frontend maupun backend, serta pengelolaan database.

**Skill yang belum dimiliki tim:**

Implementasi peta interaktif dan kalkulasi jarak koordinat berbasis open-source menggunakan library pihak ketiga (seperti Leaflet.js dan OpenStreetMap).

**Cara mengatasi kekurangan skill:**

**Rencana Belajar:** Mengalokasikan waktu di minggu pertama untuk mempelajari dokumentasi resmi Leaflet.js serta tutorial implementasi penentuan titik koordinat jemput–antar pada web.

**Pembagian Tugas:** Menugaskan 1-2 anggota tim pengembang web untuk fokus meriset modul peta dan logika penarikan jarak antar-koordinat, sementara anggota lain menyiapkan antarmuka (UI) dan struktur datanya.

**Penyederhanaan Scope (*Fallback Plan*):** Jika integrasi rute jalan (routing) dirasa terlalu rumit dalam batas waktu 4 minggu, tim akan menyederhanakan kalkulasi dengan perhitungan melalui admin agar alur utama tetap selesai tepat waktu.

**Pemeriksaan kelayakan timeline capstone (4 minggu):**

- [x] ~~Alur utama dapat dikembangkan dalam empat minggu.~~  
- [x] ~~Data atau data dummy dapat disiapkan.~~  
- [x] ~~Solusi dapat diuji tanpa integrasi ke sistem produksi UMKM.~~  
- [x] ~~Tim memiliki skill utama yang diperlukan.~~  
- [x] ~~Ketergantungan kepada pihak lain dapat dihindari atau dikelola.~~  
- [x] ~~UMKM bersedia menerima demonstrasi dan memberikan feedback.~~  
- [x] ~~Tim memiliki waktu untuk pengujian dan perbaikan.~~

**Kesimpulan pemilihan use case:**

Use case ini dipilih karena proses perhitungan harga layanan disuruhsuruh masih dilakukan secara manual sehingga kurang efisien dan belum memberikan transparansi harga kepada pelanggan, sesuai dengan kemampuan tim dalam pengembangan website, pengelolaan data, dan penerapan AI untuk estimasi waktu penyelesaian pesanan, serta dapat dikembangkan dalam waktu empat minggu dengan membatasi scope pada fitur pemesanan layanan dan perhitungan estimasi waktu pengerjaan secara otomatis.

# **C. Judul Use Case**

Sistem Manajemen Pemesanan Terpusat dengan Fitur Kalkulasi Harga Transparan dan Prediksi Waktu Pengerjaan Layanan.

# **D. Ringkasan Use Case**

Kak Gani, pemilik disuruhsuruh, menghadapi kendala operasional dalam penentuan harga jasa serta pengalaman proses pemesanan. Saat ini, alur pemesanan masih berjalan dengan sistem lama, yaitu pelanggan memesan melalui WhatsApp atau Instagram, admin menanyakan alamat serata menentukan harga secara manual, lalu data dicatat. Informasi orderan kemudian disebarkan melalui grup WhatsApp. Setelah pesanan selesai dilaksanakan, informasi dicatat sebagai rekap data di kertas.

Kondisi tersebut memicu risiko tingginya human error, kesulitan dalam memproses pesanan, serta proses rekapitulasi data yang tidak efisien akibat pelacakan yang sulit, terutama ketika situasi sedang ramai pelanggan. Untuk mengatasi permasalahan ini, UMKM membutuhkan sistem yang mempermudah pelanggan dalam memesan serta melihat harga secara transparan. Keberhasilan implementasi sistem diukur dari kemudahan pemesanan bagi pelanggan, kejelasan pelacakan pesanan, serta kemudahan pengelolaan rekap data.

# **E. Latar Belakang**

**Produk atau layanan utama:**

Penyedia jasa, seperti layanan pengantaran barang, titip beli, serta jasa membersihkan rumah dan kantor.

**Target customer:**

Masyarakat umum, khususnya anak muda.

**Kanal penjualan atau pelayanan:**

WhatsApp dan Instagram.

**Tools yang digunakan saat ini:**

Google Maps dan Whatsapp.

**Gambaran bisnis:**

Disuruhsuruh.id merupakan UMKM yang bergerak di bidang penyedia jasa, seperti layanan pengantar barang, titip beli, serta jasa kebersihan rumah dan kantor. Target pelanggan mencakup masyarakat umum, khususnya anak muda. Saat ini, proses pemesanan layanan dilakukan melalui WhatsApp dan Instagram.

Dalam menjalankan operasionalnya, penentuan harga layanan masih dilakukan secara manual oleh admin berdasarkan jarak, jenis layanan, dan kebutuhan pelanggan. Untuk layanan pengantaran barang, admin menggunakan Google Maps untuk menghitung jarak perjalanan sebagai dasar penentuan tarif. Proses tersebut menyebabkan perhitungan harga menjadi kurang efisien dan kurang transparan.

# **F. Masalah Prioritas**

**Proses bisnis saat ini:**  
Customer melakukan pemesanan langsung melalui WhatsApp atau Instagram DM. Admin merespons secara manual, lalu menghitung tarif pemesanan (seperti kalkulasi tarif jarak via Google Maps dikali tarif per km, atau menghitung estimasi biaya/waktu layanan bersih-bersih). Admin kemudian mengonfirmasi alamat dan mencatat seluruh data orderan secara manual di catatan kertas. Layanan/pesanan diproses oleh tim mitra, dan pembayaran dilakukan oleh customer di akhir setelah layanan selesai.

**Masalah utama:**  
Kalkulasi penentuan estimasi waktu pengerjaan ataupun harga (jarak pengiriman & jasa bersih-bersih) yang masih dikerjakan secara manual dan kurang transparan bagi customer, serta sistem pencatatan orderan yang masih berbasis kertas (manual).

**Contoh kejadian:**  
Saat ada order antar barang, admin harus membuka Google Maps secara manual, mengukur jarak lokasi awal ke lokasi akhir (misal 5 km) lalu mengalikan nya secara manual dengan tarif per km (misal Rp3.000, menjadi Rp15.000). Selain itu, sering terjadi komplain atau penolakan karena ketidaksesuaian ekspektasi harga. Untuk layanan bersih-bersih, admin juga harus menanyakan detail item dan waktu secara berulang via chat.

**Frekuensi masalah:**  
Terjadi setiap kali ada transaksi/pemesanan baru dari customer melalui WhatsApp atau Instagram (terutama pada kategori layanan yang paling mendominasi, yaitu antar barang/kurir).

**Pihak yang terdampak:**  
Customer, Admin (3 orang), serta Mitra (50 orang).

**Dampak terhadap bisnis atau customer:**  
Waktu & Efisiensi: Waktu admin habis untuk menghitung tarif dan bertanya detail pesanan secara manual berulang kali via chat.

Operasional & Pembukuan: Risiko kesalahan pencatatan pesanan tinggi dan rekapitulasi data/laporan bisnis menjadi sangat rumit karena masih menggunakan media kertas.

**Penanganan saat ini:**  
Admin menghitung jarak secara manual menggunakan Google Maps, mengalikan nilai jarak dengan tarif dasar secara manual, menanyakan detail via chat WhatsApp, dan mencatat seluruh pesanan di buku/kertas.

# **G. Target Pengguna**

**Pengguna utama:**  
Customer disuruhsuruh (masyarakat umum, khususnya anak muda/anak kuliah) yang ingin memesan jasa antar barang atau bersih-bersih.

**Pengguna lain yang terlibat:**  
Admin disuruhsuruh (yang mengelola dan memantau pesanan masuk).

**Penerima manfaat:**  
Customer: Mendapatkan kepastian harga yang transparan secara otomatis saat memesan tanpa harus bertanya manual.

Admin & Pemilik (Kak Gani): Memiliki sistem yang terintegrasi dan terpusat dalam mengelola bisnis

# **H. Tujuan dan Outcome Bisnis**

**Tujuan utama:**

Use case ini bertujuan membantu Pelanggan dan Admin disuruhsuruh, untuk melakukan pemesanan serta penentuan harga secara otomatis via platform web, sehingga mempercepat proses pemesanan, meningkatkan transparansi harga bagi pelanggan, dan memudahkan pelacakan pesanan.

**Outcome yang diharapkan:**

* Peningkatan efisiensi dan kemudahan pemesanan dengan alur pemesanan yang lebih mudah bagi pengguna.  
* Pengurangan beban manual dan meminimalisir kesalahan dengan mengurangi proses kerja manual yang berulang serta pencatatan transaksi yang lebih akurat dan terstruktur.

# **I. Arah Solusi dan Scope MVP**

Scope MVP adalah bagian dari solusi yang benar-benar akan dibuat selama empat minggu. Peserta tidak perlu menyelesaikan seluruh kebutuhan UMKM.

Tentukan scope dengan langkah berikut:

1. **Tuliskan satu masalah yang akan diselesaikan.**  
   Jangan menggabungkan beberapa masalah bisnis dalam satu capstone.  
2. **Tentukan satu hasil utama yang ingin ditunjukkan.**  
   Jelaskan perubahan yang harus dapat dirasakan atau dilihat oleh pengguna.  
3. **Tentukan satu alur yang akan didemonstrasikan.**  
   Tentukan titik awal dan akhir proses yang harus dapat dijalankan.  
4. **Pilih hanya fitur yang diperlukan untuk menjalankan alur tersebut.**  
   Fitur yang tidak mendukung alur utama dipindahkan ke luar scope.  
5. **Pastikan alur utama dapat selesai paling lambat pada minggu ketiga.**  
   Minggu keempat digunakan untuk pengujian, demonstrasi kepada UMKM, feedback, perbaikan, dan dokumentasi.

**Arah solusi:**  
Pengembangan platform berbasis web yang menyediakan kalkulator/katalog pemesanan otomatis transparan bagi customer serta dashboard manajemen & pelacakan pesanan terpusat untuk admin disuruhsuruh.

**Pengguna utama MVP:**  
Stakeholders disuruhsuruh

**Masalah utama yang diselesaikan:**  
Proses pemesanan dan kalkulasi harga layanan yang manual serta kurang transparan.

**Alur utama MVP:**  
1\. Customer membuka platform web disuruhsuruh.

2\. Customer memilih jenis layanan dan waktu layanan (booking atau same day) lalu memasukkan data pemesanan (lokasi/jarak atau durasi/detail kebutuhan, dll).

3\. Customer melakukan pengajuan pesanan (submit order).

4\. Pesanan masuk ke dashboard admin, di mana admin dapat memantau, merubah status pesanan, dan melihat riwayat data pesanan tanpa pencatatan kertas.

**Cakupan MVP:**

* Form pemesanan bagi customer dengan penghitungan estimasi waktu pengerjaan.  
* Dashboard kelola pesanan bagi Admin untuk melihat daftar pesanan masuk dan memperbarui status pesanan (tracking order).

**Bentuk demonstrasi kepada UMKM:**  
Mensimulasikan alur pemesanan oleh customer di platform web hingga harga otomatis muncul, lalu memperlihatkan bagaimana data pemesanan tersebut langsung masuk dan dapat dikelola statusnya pada dashboard admin.

**Di luar scope:**

* Integrasi API peta live-tracking GPS secara real-time untuk posisi kurir di jalan.  
* Sistem alokasi/pemilihan otomatis untuk akun 50 freelancer/kurir.  
* Fitur komunikasi real-time antara pelanggan dan admin (in-app chat) di dalam web.  
* Aplikasi Android/iOS native (pengembangan difokuskan penuh pada platform web).

# **J. Hasil yang Diharapkan**

Pada akhir capstone, tim diharapkan menghasilkan:

* Aplikasi web yang mencakup antarmuka pelanggan untuk pemesanan dan dashboard admin untuk manajemen pesanan.  
* User Journey: Pengisian data pesanan $\rightarrow$ Kalkulasi harga $\rightarrow$ Konfirmasi pemesanan.  
  Admin Journey: Penerimaan pesanan masuk $\rightarrow$ Pelacakan status pesanan$\rightarrow$ Visualisasi data untuk laporan status pesan.  
* Panduan pengguna yang berisi petunjuk langkah demi langkah penggunaan web untuk pelanggan dan dashboard admin, serta dokumen teknis mengenai alur sistem dan arsitektur website.  
* Review konsep solusi, pengujian prototipe, hingga penilaian akhir dan pengumpulan umpan balik terkait efektivitas solusi yang dibuat.

Hasil capstone merupakan prototype atau MVP untuk demonstrasi dan validasi. Penggunaan dalam operasional produksi memerlukan evaluasi dan pengembangan lebih lanjut.

# **K. Indikator Keberhasilan**

**Indikator validasi selama capstone:**

* **Alur utama yang harus dapat dijalankan**  
  Pelanggan dapat memilih jenis layanan, memasukkan rincian kebutuhan pesanan, sistem menampilkan estimasi harga dan transparan, pelanggan mengkonfirmasi pesanan dan data pesanan tersebut langsung tercatat pada dashboard admin.

* **Tugas yang harus dapat dilakukan oleh pengguna**  
  Pelanggan: Memilih jenis layanan yang diinginkan, menginput informasi pesanan dan parameter lokasi, melihat rincian kalkulasi harga yang transparan sebelum bertransaksi, dan mengirimkan konfirmasi pesanan.

  Admin: Mengakses dashboard pesanan, melihat daftar pesanan baru yang masuk, memeriksa detail rincian biaya yang dihitung sistem, serta memperbarui status pengerjaan pesanan (Pending, Diproses, Selesai).

* **Kondisi yang akan diperiksa saat demonstrasi:**

1. Tampilan estimasi biaya menyajikan transparansi komponen harga dengan jelas (misalnya: rincian tarif dasar dan pengali jarak per kilometer).  
2. Data pesanan yang dikirimkan pelanggan berhasil tersimpan dan tampil pada daftar pesanan di dashboard admin secara tepat.  
3. Admin dapat mengubah dan memperbarui status pesanan pada dashboard secara lancar.

* **Isi bentuk feedback atau penilaian dari UMKM**

1. Uji coba langsung (*user testing*) oleh pihak UMKM saat sesi demonstrasi menggunakan skenario pesanan(misalnya: simulasi pesanan antar barang dan jasa kebersihan).  
2. Pemberian skor penilaian skala 1-5 oleh pihak UMKM terhadap kemudahan pemesanan dan kejelasan rincian harga setelah mencoba prototipe.   
3. Melakukan sesi tanya-jawab langsung dengan pihak UMKM di akhir demonstrasi untuk mendengar tanggapan, penilaian, serta saran perbaikan terhadap website yang telah dibuat.

**Potensi indikator bisnis jika solusi diimplementasikan:**

* **Efisiensi waktu proses kerja**  
  Memangkas waktu tunggu penentuan harga dari semula 5-10 menit per pesanan (akibat tanya-jawab rute manual via WhatsApp) menjadi instan di bawah 1–2 menit, karena pelanggan dapat melihat rincian harga secara mandiri sejak awal.   
* **Pengurangan pekerjaan manual**  
  Mengurangi proses perhitungan jarak dan biaya secara manual via Google Maps, serta mengurangi ketergantungan pencatatan transaksi manual pada buku ataupun excel.  
* **Pengurangan kesalahan manusia**  
  Mencegah insiden kesalahan hasil perhitungan pada sebuah pemesanan jasa.  
* **Peningkatan layanan atau penjualan**  
  Memudahkan user untuk memesan dengan tampilan web yang jelas serta membantu pemilik dalam melihat riwayat order dan menyusun laporan bulanan. 

Potensi indikator bisnis tidak boleh diklaim telah tercapai apabila solusi masih berupa prototype.

# **L. Data dan Referensi**

**Website UMKM:**  
\-

**Media sosial UMKM:**

| Media Sosial | Link Media Sosial |
| :---: | ----- |
| Instagram  | [https\://www\.instagram.com/disuruhsuruh/](https://www.instagram.com/disuruhsuruh.id/) |
| Tiktok  | [https\://www\.tiktok.com/@disuruhsuruh](https://www.tiktok.com/@disuruhsuruh.id) |
| Facebook  | [https\://www\.facebook.com/disuruh.suruh.2025/](https://www.facebook.com/disuruh.suruh.2025/) |
| Youtube  | [https\://www\.youtube.com/@disuruhsuruh](https://www.youtube.com/@disuruhsuruh) |

**Dokumen atau contoh proses:**  
Rekapan order dan alur pemesanan jasa/layanan.

**Data yang dapat digunakan:**  
Sample data riwayat order (Tanggal transaksi, ID order, biaya ongkir, potongan admin, biaya mobil, detail pesanan, serta titik/wilayah alamat pengambilan dan pengantaran).

**Data yang tidak tersedia atau tidak dapat digunakan:**  
Data sensitif pelanggan seperti no hp, alamat lengkap dan identitas pribadi.

**Sumber data alternatif:**  
Synthetic data/data dummy internal tim untuk kebutuhan awal model.

**Ketentuan penggunaan data:**  
Data hanya digunakan untuk kepentingan riset, use case, dan training model.

# **M. Asumsi dan Batasan**

* Kami mengasumsikan solusi terbaik adalah membuat website sederhana untuk customer memilih layanan dan melihat perkiraan Harga otomatis dan dashboard untuk melacak pemesanan jasa yang lebih akurat.  
* Mengingat UMKM selama ini mencatat transaksi di kertas, kami berasumsi bahwa data historis pesanan yang siap olah sangat terbatas.   
* UMKM belum memiliki sistem/aplikasi komputer sama sekali.  
* Waktu pengerjaan proyek dibatasi hanya 4 minggu. Oleh karena itu, ruang lingkup proyek difokuskan hanya pada 1 atau 2 fitur prioritas, dan membatasi interaksi sistem hanya untuk POV Admin dan Customer.  
* Hasil proyek ini berupa Minimum Viable Product (MVP) yang ditujukan untuk pembuktian konsep dan uji coba operasional dasar pada tugas capstone.  
* Jika UMKM ingin fitur peta otomatis (Google Maps) dan pembayaran online, dibutuhkan biaya tambahan untuk membeli lisensi resmi dan server di masa mendatang.

# **N. Keterlibatan dan Tindak Lanjut UMKM**

**PIC untuk tindak lanjut:**  
Muhammad Zaini Gani

**Kontak PIC:**  
085332455999

**UMKM bersedia memberikan klarifikasi tambahan:**  
Ya

**UMKM bersedia menerima demonstrasi:**  
Ya

**UMKM bersedia mencoba prototype jika memungkinkan:**  
Ya

**UMKM bersedia memberikan feedback atau penilaian:**  
Ya

**Catatan tindak lanjut:**  
Rangkuman use case telah disetujui oleh owner via whatsapp pada tanggal 25 Oktober 2026\. Tim melanjutkan untuk penyusunan project plan dan tahap pengembangan MVP serta diakhiri dengan sesi demonstrasi dan evaluasi produk.

Kesediaan menerima demonstrasi dan memberikan penilaian tidak mewajibkan UMKM untuk menggunakan atau mengadopsi solusi.

# **O. Konfirmasi Akhir**

Sebelum dokumen digunakan sebagai acuan capstone, pastikan:

* Dokumen hanya berisi satu use case utama.  
* Masalah berasal dari hasil wawancara.  
* Masalah menjadi prioritas bagi UMKM.  
* Masalah memiliki dampak yang jelas.  
* Pengguna yang terdampak sudah diketahui.  
* Use case sesuai dengan skillset anggota tim.  
* Use case feasible dikerjakan dalam empat minggu.  
* Scope telah dipersempit menjadi satu MVP.  
* Tim memiliki waktu untuk melakukan demonstrasi dan perbaikan.  
* Bagian di luar scope sudah ditentukan.  
* Data atau referensi yang diperlukan sudah diketahui.  
* Indikator keberhasilan dapat dinilai.  
* PIC UMKM sudah ditentukan.  
* UMKM bersedia menerima demonstrasi dan memberikan penilaian.  
* Dokumen tidak menjanjikan implementasi produksi atau adopsi wajib.

*Thank You*

Get in touch

| ![][image1] | capstone@student.devacademy.id | ![][image2] | @dicoding |
| :---- | :---- | :---- | :---- |
| ![][image3] | \+62 851-7342-2702 \- Denada | ![][image4] | Dicoding Indonesia |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1klEQVR4Xr1XvWsUQRQ/C7+IdoJaarQyhZBC7azU3M6c1cUIsRK0shBUcrsnHEKIf4Cgl9jbhfSCH4T41YhiYxnBQgUhJEJOkOf7vdmNuzOz695XHvy42Xkf85vZN2/fVSolhe7U9lOkL1OoFhjvGN8p1L8NMFZvKVLzFAZTsLX9exYKzx/m4A8ZvxhUErBdoJnaMTteaaGb9b28u3scaMOzQEnICd2nGxO77fiFAubU0B/dgD1jhcLaQXsdr1BYPUkN9c0TpF984fwYs9fLiNn5UBZPsJp7EtQ6u4cN3nucBo1X3pyIE842Hg4iNWctLlfNzvYOgW1DPe0LiGFqRTZ2c2I0RUDuedpgkxrVUymOfQkXsNPxhtKnMG+UqHBOkdHPMgEa+irPtbsC+2RicExrkxvUqu8DO5TXtIIRLIlTpC7RrXMjSBqKgseuXQ5gCx/4cgxDIFhy7EI9ieNHbbcUMYFQPWF8SN4X7+o62UeZRQc2Yss+4ssxCgi0sQg+LEUEMLfGJ3VR5maCcZL7bPuor5x0Z4xN9QI//4znCwio11jkh6twCAB/mHFElcoOul09xM/LKd2yzEEHG7Hd0uUT4KKHRTxH6iWQYFES99r4Th4/EGBsknnRY59PgG9bLwSAz3RXn4CN2DXVcd7NJ48d8F8CZV+BjTW2mzbA2NEnyCcQv4IySdgP8glIEkobZSu2i0DwCIopj2J7CERBvbAUc1G54pTYrhFMm1jquUVgHZUSOuzUroYdfEBEOQBBgZKY2U22/xmgE3I+mfI8rM/xJjX1kRRHnAJ3r1mj4SHSs5nFhYBUNv3SMR48VrwtGQQNI0n36jgNCvlNaSKctWM0HBKr6fJdKNTSB9jhhSdIryj/xyQR0wWpOXKuT1fAdZ7l1muXHb+0cANyNC7XdtdchHUpQvZV60fQQHLQSdRv/n1D5h8UTqdjxjyH7prL61aFKyF/AalOA5OyTlikAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADbUlEQVR4XrVWO28TQRC2oOAhoOMRIQoQ0IHEP6BAMvbuGSEwCQ2I9BQUgO/OoCOFCQ5QBsLjx1CAIdBECAkKmkQIAVICmEQEimEe68ft7cVnO4z0yeedx87uzM5MLpeRICrsgNA7D4F+jJhFfIXA+yOgb1wL9SMI1BhcK2239Qcm8IuH0fhTxDICMmIZQvUEqvqQbS8zwZXyFjzdXTT217FBRvDt1CE6vtm2vyaR56j4NmlwYDQgyI/Y+zgJKqVjIDG1jQyLBQhKR+39YmRO/j82b2EBrhb32PsyScx7XvtPxEeBeodZ/4ZB3+11lrH1utGAy4VN9v45k3C2MHAihfoOhuagrZNGJMs6koRJm6G6FVeQp+bIdjKg8iwTntqH3+OI68jzkTcZB60hz9eXSJZ1UDfFiWYsFCDv3BYiBybFQXUR/68k+alYIR1ju+7gk+1p2ZwqXFqR4aukk2fd3PsOVW8/VNUJ1iFdSWyHrP4FUXlbzpRXm0n4Ya5x3MFbxBNOoe4ZhuTPEsb9M0TeVnac5DAc5hbciRnqUWJSbU8yMaONsm+tv4Lo9C7mlcsbCSJX2o3OvmYn0Hkj6xsb9Dps+whvhpjUWBxM/Z6Vfe9m19oibU5Xx7WekolA37SGicVhaMmjrnHgg8M+oUHMbw4G0NsWZW+iY1BN8ZpsHpfHTigO63uddW9CbHCdSO7h6y/kwGqCIZgz3te6FM5CFG0AObkt3+SQhKrctVYzNuYc8oTfgzrgSqom8wZwIHsIMNuNwWTitkIQqPtd8plC0E8SLnG2U8KJEyYJcRLitfxI/0nIY1SCQUh7hrOtMspXjhA53JwbU0y2xzNUD+l6xpIMxhqFCE9J2U7x5pjztbfefgc9C5Eq52iAhHUrxTFkK8XsoetdC+rMH6QZBfqCnD6lzZukFQfYS1fbxLVK8aQ4iaehVistt0qdMgZes9uxVwBnm8enX1EH2g6IcGrblMm2jxHbHCh9og71bVsnR6Mz8PTqUOiAnl2vkcxVJbvx3DmSEUkz0fMOpfXCJ3R4r71vjGh0Bh6hE8rDYh5uFI/Y+zkJ/MJOjOEzh5FB8SJ1HE8jihNNr0DvNWkwK6jR1VJjnoXMkDEN/TmCst5M4qkNQzIF6VGq32j8JXUyc8JV+ca1QD/A33PtCpeB/gHDDxqh4a9XLgAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC10lEQVR4XrWXS2sUQRCAR0TwDeJBUBDf3kT0ByiCSjLdgx5G0Zsg4kEQQeLO9B72FkxyFOPzB3jwJ+ghCvGkrl58HBVcJSjKRhIRy6rumdnZ7p5nJgUfDF3VXdWv6hrHKSkw5m2AkJ8Hwe5ByJ4hH5H5iA+yjXSCnyNbvX9tgba3H4T7AB38RqAkZHsf2myvPl5pgWv+GpzxFPLH4qAksu8EdI6u1sfPFWh5eyDgb8wBa9OF9shu3Y9VIBw9CAH7ahlkqfRobN3fkKiZL4vzmF7mStA+4Sl+benUNG/pfOn+HQjcSYtxzE9k1tJeD8Fuas5H9+Wc9h+oOwSOswK/b1n0dVik7R4EoO65bqQIXC+xazIITFpqUJnhMpIMnokkykhUEPy2YVudPnT89Y5MnaYy5qEeAAmE3gGLbXUEO+tEud1UStxHhvMxbyuo3G+xr4p7B2cjHxaLklGEX+DS4VWJ8+D0ZmjMOcFfUAD0qlmUEcL1kwBCftHQLwVMehRA31CkEewl+P5KGUDr1A5s+27Y1GehOABCsMvJKrT5sZycURUZQP4WKH5RskqCCNgFbPtnsatGtAXZh3CYLnRGNiZBqPPwV7P5hlf0OFAxYva3MVtwDXX40/RDgtfoJLbPRfo5yg+yXWXMabO/wXRRIrIxAy13UxKEYNuQK3g2dsZtpYOgG5abirN5V1hcOFEQAXti6U/04fqJdcqw/J6lWcAtEdDhazW/icANvh3tPln6IvzuwBCrV6An0jAqxWfkKu7/lpRvvCn8CGQ6p+fY3ZW2p1WYsBhWAW+E+xxn9hio6jH1AwQbH3IuA6CSLGSvDOOmoWrbVpKRUMEIsnq1dGyGnrH0usiyfHmCKC7LY4lWomsZpB5UbRfNXJfoTNDBrHs7iEWqgCv/mqVF/qyodE1/wbqDLOZln6yfkDpCBSTVcFRGAaXjkL0H9ZQT9D2jdPyMLDZLyn9relOBGKnspAAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACsUlEQVR4Xr1WO4gUQRAdIxVUBBUUwUDQTMFQEM5Mdqd70WD9hMZyiOB6NzMKY6JwCGJynr/QyMTEzECT20MEA40MBG9VOMXIO3A1KKu6Z/emq3q82dlPwWNnuqqrXk9V11YQlBRIazsg0RcgVo8QbxDfIdZ/LOgZ1xL1EOLwPFxrbOf7KwtE9cPo/AliDQElsQZJ+Biuq0PcX2mBK82teLo76OyvJ0BJmK8zB+nJLdz/f4WY48b30mFltCE+tY/H8QrMNo6BzSl3Miw6EDeO8niOZCcfR/AeOtCq7+Vxjdicez87Fd9HRNejq4I2TNc28/hBVnDc+BWkp3ca/Yw+gO+fPDaDIwlvusHtVZPVHqm6YxeHM8KmGn45qQB7z7kREbiYi49E9V1hUxl63jqlDlfUZCK1YjobVi++X0b8FjbVsQppc1uQtVeunAwSdY4+P/V2qbQGL2zee1DvMt1Ld10v4dpnoK8U6Sk81Al8biG+CJ8O9AMiQH8sHiUi0ledGojVU7POqhhJTEN0Zld+zaynejem8YPwu05giZz+kIoBCQTBpvx7XpDAceG371+tkNPiBlOSQKa7hF/iOf16dNTIpH8s6pEQsDfF2Tfl6tUz4TtHYPgUROoe29ty9GZQ8fm3KRhFES6wvekG+h7axewmQiBckPmbJIEkbAbUDoHaIleOn4BtxcaABkhpMF4CmPp1AzMJmQFyUgS6MBsezNuQ8zlBgEaoRL3tI1Y/7br+xtbZGLeBPlG3neCGAI7OYKZXQWLUWPSOZCQ0paDBsmfTqPAVT7+fx3UkGz46ns3DYhlu1I/weF6BqLYH8/ja46QqFgvH8SKhPFG1Q1GPKAf6o7tVmPMyYutCz8NgRFZp2hFXbRgxHRNnOHuncQQzA6s5Ydc+m7HsPv6e7Xe4EvIPRJWjd06GF4UAAAAASUVORK5CYII=>