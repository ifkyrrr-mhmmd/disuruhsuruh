# Plan 15: Halaman Pelacakan Publik (`/track/:nanoId`), Dynamic QRIS & Smart WA

> **For agentic workers:** Sesuai panduan `antislop-ui` & `writing-plans`.

**Goal:** Membangun antarmuka pelacakan resi publik (`/track/:nanoId`) dengan status stepper visual, tampilan kode QRIS Dinamis + countdown timer 15 menit, dan tombol WhatsApp Smart Link.

**Architecture:** Halaman `TrackingPage.jsx` dengan polling status berkala (setiap 5–8 detik) dan audio chime notifikasi saat status berubah.

**Tech Stack:** React, Tailwind CSS, Lucide Icons, Axios, Audio API.

**Spec Reference:** [`design.md` Section 3.3](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3.1 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `client/src/pages/TrackingPage.jsx`
- Create: `client/src/components/tracking/StatusStepper.jsx`
- Create: `client/src/components/tracking/QRISContainer.jsx`
- Create: `client/src/components/tracking/WhatsAppSmartButton.jsx`

## Interfaces
- Consumes: Parameter URL `nanoId` dan endpoint `GET /api/v1/orders/:nanoId`
- Produces: Visualisasi status pesanan, pembayaran QRIS, dan akses langsung ke admin via WhatsApp

---

## Tasks

- [x] **Step 1: Buat komponen `StatusStepper.jsx`**
  Menampilkan urutan status:
  `Menunggu Konfirmasi Admin` $\rightarrow$ `Menunggu Pembayaran (QRIS)` $\rightarrow$ `Mitra Menuju Lokasi` $\rightarrow$ `Sedang Dikerjakan` $\rightarrow$ `Selesai`.
  Status aktif ditandai dengan lingkaran berwarna oranye dan animasi pulse halus.

- [x] **Step 2: Buat komponen `QRISContainer.jsx` dengan Countdown Timer 15 Menit**
  - Tampil hanya saat status `AWAITING_PAYMENT`.
  - Tampilkan gambar QRIS Midtrans Sandbox.
  - Tombol: *"Salin Total Nominal"*.
  - Penghitung waktu mundur 15 menit. Jika habis, status berubah menjadi kadaluarsa.

- [x] **Step 3: Buat tombol `WhatsAppSmartButton.jsx`**
  Tombol hijau elegan ber-URL format:
  `https://wa.me/6285332455999?text=Halo%20Admin%20disuruhsuruh,%20saya%20menanyakan%20pesanan%20resiko:%20<nanoId>`.

- [x] **Step 4: Mekanisme Polling & Audio Alert**
  Pasang `setInterval` 6 detik untuk refresh data. Jika status berubah dari `PENDING` menjadi `CONFIRMED`, putar efek suara chime singkat.

- [x] **Step 5: Verifikasi di Browser**
  Buka halaman `/track/ds_...` dummy $\rightarrow$ periksa apakah timer 15 menit berjalan, dan stepper status merespons dengan benar.

- [x] **Step 6: Definition of Done (DoD)**
  Pelanggan memiliki halaman status mandiri yang profesional dan transparan tanpa perlu chat manual.
