# Plan 09: Endpoint Admin Dashboard, Penugasan Mitra, Refund 100% & Ekspor CSV

> **For agentic workers:** Sesuai metodologi `writing-plans`.

**Goal:** Membangun API operasional admin: otentikasi admin sederhana, daftar pesanan berfilter, penugasan nama mitra, aksi koreksi harga (*price override*), pengelolaan antrean refund 100%, dan ekspor CSV.

**Architecture:** Modul `AdminController` terproteksi JWT middleware, controller refund, dan streaming CSV parser di `server/src/routes/admin.routes.js`.

**Tech Stack:** Node.js, jsonwebtoken, bcryptjs, fast-csv / native CSV stream.

**Spec Reference:** [`prd.md` Section 3.2 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 3.4 & 6.4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `server/src/middlewares/auth.js`
- Create: `server/src/controllers/admin.controller.js`
- Create: `server/src/controllers/refund.controller.js`
- Create: `server/src/routes/admin.routes.js`
- Create: `server/test/admin.test.js`

## Interfaces
- Consumes: Aksi admin dari dasbor
- Produces: Data list pesanan berfilter, eksekusi status, pencatatan refund 100%, dan stream file CSV

---

## Tasks

- [x] **Step 1: Buat auth middleware `server/src/middlewares/auth.js`**
  Memvalidasi header `Authorization: Bearer <token>`.

- [x] **Step 2: Implementasikan approval & penugasan mitra di `admin.controller.js`**
  - Endpoint `PATCH /api/v1/admin/orders/:id/approve`: Update `final_price`, simpan `price_override_reason`, catat `assigned_mitra_name` dan `assigned_mitra_phone`.
  - Jika metode QRIS, picu pembuatan Dynamic QRIS.

- [x] **Step 3: Implementasikan modul refund di `refund.controller.js`**
  - Endpoint `POST /api/v1/orders/:nanoId/refund-request`: Pelanggan mengisi nomor rekening.
  - Endpoint `PATCH /api/v1/admin/refunds/:id/complete`: Admin menandai refund 100% selesai ditransfer.

- [x] **Step 4: Implementasikan ekspor CSV `GET /api/v1/admin/export`**
  Menyajikan stream CSV seluruh riwayat transaksi untuk menggantikan buku catatan kertas UMKM.

- [x] **Step 5: Verifikasi Terminal**
  Jalankan test suite admin:
  ```powershell
  npm --prefix server test test/admin.test.js
  ```
  Expected: Seluruh endpoint admin dan ekspor CSV lulus verifikasi (PASS).

- [x] **Step 6: Definition of Done (DoD)**
  Seluruh kebutuhan backend operasional Kak Gani dan 3 admin telah lengkap dan siap disambungkan ke frontend.
