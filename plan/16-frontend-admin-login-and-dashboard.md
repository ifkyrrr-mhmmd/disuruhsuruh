# Plan 16: Halaman Login Admin & Dasbor Manajemen Pesanan

> **For agentic workers:** Sesuai panduan `antislop-ui` & `writing-plans`.

**Goal:** Membangun portal operasional admin: form login admin terproteksi, dasbor tabel pesanan dengan filter status, modal peninjauan rute peta mini, aksi penugasan mitra kurir, dan tombol 1-Click WA ping.

**Architecture:** Halaman `AdminLoginPage.jsx` dan `AdminDashboardPage.jsx` dengan sistem autentikasi JWT token di localStorage/sessionStorage.

**Tech Stack:** React, Tailwind CSS, Shadcn Table & Dialog, Axios, Leaflet.

**Spec Reference:** [`design.md` Section 3.4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `client/src/pages/admin/AdminLoginPage.jsx`
- Create: `client/src/pages/admin/AdminDashboardPage.jsx`
- Create: `client/src/components/admin/OrderTable.jsx`
- Create: `client/src/components/admin/OrderDetailModal.jsx`
- Create: `client/src/components/admin/AssignMitraDialog.jsx`

## Interfaces
- Consumes: Endpoint `GET /api/v1/admin/orders` dan `PATCH /api/v1/admin/orders/:id/approve`
- Produces: Manajemen pesanan digital terpusat yang menggantikan buku catatan kertas UMKM

---

## Tasks

- [x] **Step 1: Bangun halaman login `AdminLoginPage.jsx`**
  Input Email & Password. Simpan token JWT setelah login sukses.

- [x] **Step 2: Bangun tabel data pesanan `OrderTable.jsx`**
  - Kolom: ID Order, Waktu, Pelanggan, Layanan, Tarif Final, Status (Badge), dan Aksi.
  - Tab Filter: `Semua`, `Pending`, `Diproses`, `Selesai`, `Butuh Refund`.
  - Tombol: `[Ekspor CSV]`.

- [x] **Step 3: Bangun modal rincian & peta mini `OrderDetailModal.jsx`**
  Menampilkan rute penjemputan/pengantaran di peta Leaflet mini dan detail variabel barang/kosan.

- [x] **Step 4: Bangun dialog penugasan mitra `AssignMitraDialog.jsx`**
  - Input nama mitra (contoh: *Budi Santoso*) dan no WhatsApp mitra.
  - Input penyesuaian harga jika ada (*Admin Price Override*).
  - Tombol hijau: `[1-Click Ping WhatsApp Pelanggan]` untuk verifikasi nomor sebelum mitra berangkat.

- [x] **Step 5: Verifikasi Terminal & Browser**
  Login ke dasbor admin $\rightarrow$ ubah status salah satu pesanan pending $\rightarrow$ periksa apakah status di layar pelanggan ikut ter-update.

- [x] **Step 6: Definition of Done (DoD)**
  Kak Gani dan 3 admin dapat mengelola puluhan pesanan masuk harian dengan cepat dan akurat.
