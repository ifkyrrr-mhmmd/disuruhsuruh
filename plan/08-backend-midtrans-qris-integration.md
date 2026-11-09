# Plan 08: Integrasi Dynamic QRIS Midtrans Sandbox & Webhook

> **For agentic workers:** Sesuai metodologi `writing-plans`.

**Goal:** Mengintegrasikan pembuatan QRIS Dinamis melalui Midtrans Core API (Sandbox) dan webhook handler yang mengubah status pesanan otomatis saat pembayaran diterima.

**Architecture:** Modul `PaymentAdapter` di `server/src/adapters/midtrans.adapter.js` dengan endpoint webhook `POST /api/v1/payments/notification`.

**Tech Stack:** Node.js, midtrans-client / Axios, crypto (SHA512 signature check).

**Spec Reference:** [`prd.md` Section 3.1 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 3.3](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `server/src/adapters/midtrans.adapter.js`
- Create: `server/src/controllers/payment.controller.js`
- Create: `server/src/routes/payment.routes.js`
- Create: `server/test/payment.test.js`

## Interfaces
- Consumes: `order_id`, `final_price` dari persetujuan admin
- Produces: `qris_qr_url`, `payment_expiry_at` (15 menit), dan mutasi status order menjadi `PAYMENT_CONFIRMED` via webhook

---

## Tasks

- [x] **Step 1: Buat adapter Midtrans `server/src/adapters/midtrans.adapter.js`**
  Fungsi `generateDynamicQRIS(order)`:
  - Panggil endpoint charge Sandbox Midtrans dengan payment type `qris`.
  - Pasang expiration time otomatis: 15 menit dari waktu persetujuan.
  - Kembalikan URL gambar QR code.

- [x] **Step 2: Buat webhook handler di `payment.controller.js`**
  - Verifikasi keamanan signature SHA512 dari payload Midtrans (`order_id + status_code + gross_amount + ServerKey`).
  - Jika `transaction_status === 'settlement'`, ubah status pesanan di database menjadi `PAYMENT_CONFIRMED` dan status bayar `PAID`.

- [x] **Step 3: Pasang rute pembayaran di `payment.routes.js`**
  Endpoint: `POST /api/v1/payments/notification`.

- [x] **Step 4: Verifikasi Terminal**
  Simulasikan webhook notifikasi sukses pembayaran via curl lokal:
  ```powershell
  npm --prefix server test test/payment.test.js
  ```
  Expected: Uji verifikasi signature dan pembaruan status pesanan berhasil (PASS).

- [x] **Step 5: Definition of Done (DoD)**
  QRIS Dinamis siap diterbitkan sesuai nominal final persetujuan admin dan status lunas terdeteksi otomatis.
