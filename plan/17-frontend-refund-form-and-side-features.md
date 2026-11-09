# Plan 17: Formulir Pengajuan Refund 100% & Fitur Polesan (Side Features)

> **For agentic workers:** Sesuai panduan `antislop-ui` & `writing-plans`.

**Goal:** Membangun antarmuka pengajuan refund 100% bagi pelanggan jika barang kosong, serta fitur polesan: toggle jam buka/tutup toko, upload bukti foto, dan ulasan bintang 1-5.

**Architecture:** Komponen modal/drawer refund di halaman tracking dan modul pendukung di dasbor admin.

**Tech Stack:** React, Tailwind CSS, Lucide Icons, Axios.

**Spec Reference:** [`prd.md` Section 3.1 US-15 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 3.3](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `client/src/components/tracking/RefundClaimModal.jsx`
- Create: `client/src/components/tracking/RatingFeedbackModal.jsx`
- Create: `client/src/components/admin/StoreStatusToggle.jsx`

## Interfaces
- Consumes: Status `REFUND_REQUESTED` atau `COMPLETED` dari database
- Produces: Data rekening refund tersimpan dan evaluasi kepuasan pelanggan bintang 1-5

---

## Tasks

- [x] **Step 1: Buat komponen formulir refund `RefundClaimModal.jsx`**
  - Tampil otomatis saat status pesanan menjadi `BATAL_BUTUH_REFUND`.
  - Pilihan Bank/E-Wallet: *BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay*.
  - Input: Nomor Rekening & Nama Pemilik Rekening.
  - Banner ramah: *"Dana dikembalikan 100% penuh tanpa potongan sepeser pun."*
  - Kirim ke endpoint `POST /api/v1/orders/:nanoId/refund-request`.

- [x] **Step 2: Buat modal rating & ulasan bintang 1-5 `RatingFeedbackModal.jsx`**
  Muncul saat status pesanan `COMPLETED`:
  - Selector 5 bintang interaktif.
  - Textarea singkat: *"Bagaimana pelayanan mitra hari ini?"*.

- [x] **Step 3: Buat sakelar status operasional `StoreStatusToggle.jsx` di dasbor admin**
  Toggle: `BUKA (Layanan Berjalan Normal)` vs `TUTUP (Hanya Menerima Jadwal Booking Besok)`.

- [x] **Step 4: Verifikasi di Browser**
  Simulasikan pembatalan barang kosong pada pesanan Titip Beli $\rightarrow$ isi nomor rekening refund $\rightarrow$ pastikan data rekening muncul di tab antrean refund admin.

- [x] **Step 5: Definition of Done (DoD)**
  Hak refund pelanggan terlindungi transparan dan fitur evaluasi kepuasan operasional berfungsi nyata.
