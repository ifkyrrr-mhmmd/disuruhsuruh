# Plan 14: Order Wizard Step 3 - Form Variabel Bebas & Rincian Harga Transparan

> **For agentic workers:** Sesuai panduan `antislop-ui` & `writing-plans`.

**Goal:** Membangun antarmuka Langkah 3 pada formulir pemesanan: input variabel bebas kondisional (Antar, Titip, Bersih), kartu rincian tarif terbuka, dan pemilihan metode pembayaran COD / QRIS.

**Architecture:** Komponen formulir modular `DynamicServiceFields.jsx`, `PriceBreakdownCard.jsx`, dan penanganan submit order ke backend `POST /api/v1/orders`.

**Tech Stack:** React, Tailwind CSS, Axios, React Router.

**Spec Reference:** [`prd.md` Section 3.1 & 4.3](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 3.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `client/src/components/order/DynamicServiceFields.jsx`
- Create: `client/src/components/order/PriceBreakdownCard.jsx`
- Create: `client/src/components/order/CustomerContactForm.jsx`

## Interfaces
- Consumes: Jarak dari Leaflet Map & input rincian pesanan dari pengguna
- Produces: Pemanggilan API `POST /api/v1/orders` dan pengalihan ke `/track/:nanoId`

---

## Tasks

- [x] **Step 1: Buat input variabel dinamis `DynamicServiceFields.jsx`**
  - Jika *Antar Barang*: Pilihan dimensi (Kecil/Sedang/Besar), berat (slider atau chip), catatan barang.
  - Jika *Titip Beli*: Daftar barang belanjaan, estimasi uang talangan, opsi jika stok kosong (dropdown wajib).
  - Jika *Bersih-bersih*: Tipe properti (Kosan/Rumah/Kantor), jumlah ruangan, tingkat kekotoran, preferensi gender mitra (Pria/Wanita/Bebas).

- [x] **Step 2: Buat kartu rincian transparan `PriceBreakdownCard.jsx`**
  - Tembak endpoint `POST /api/v1/pricing/estimate` setiap kali parameter jarak/variabel berubah.
  - Tampilkan rincian: Tarif Dasar, Tarif Jarak, Biaya Tambahan, Total Tagihan, dan Estimasi Waktu AI.

- [x] **Step 3: Buat form kontak & metode bayar `CustomerContactForm.jsx`**
  - Input Nama Lengkap & Nomor WhatsApp.
  - Radio button metode pembayaran: `COD (Tunai ke Mitra)` vs `QRIS Digital`.
  - Jika total > Rp50.000, opsi COD otomatis terkunci dengan keterangan ramah.

- [x] **Step 4: Eksekusi Submit & Redirect**
  Kirim data ke `POST /api/v1/orders` $\rightarrow$ tangkap `nano_id` $\rightarrow$ redirect ke `/track/:nanoId`.

- [x] **Step 5: Verifikasi Terminal & Browser**
  Isi formulir lengkap dan submit pesanan uji coba $\rightarrow$ pastikan browser berhasil berpindah ke `/track/ds_...`.

- [x] **Step 6: Definition of Done (DoD)**
  Seluruh alur pemesanan dari pilih layanan sampai submit bekerja utuh tanpa error.
