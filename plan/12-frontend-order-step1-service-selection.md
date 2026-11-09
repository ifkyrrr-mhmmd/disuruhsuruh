# Plan 12: Order Wizard Step 1 - Pemilihan Kategori Layanan

> **For agentic workers:** Sesuai panduan `antislop-layoutmobile` & `writing-plans`.

**Goal:** Membangun antarmuka Langkah 1 pada wizard pemesanan (`/order`) berupa kartu selektor layanan dinamis ramah jempol (*thumb-friendly*).

**Architecture:** Halaman `OrderPage.jsx` dengan manajemen state form global `useOrderForm` context atau reducer.

**Tech Stack:** React, Tailwind CSS, Lucide Icons.

**Spec Reference:** [`design.md` Section 3.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3.1 US-01](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `client/src/pages/OrderPage.jsx`
- Create: `client/src/context/OrderContext.jsx`
- Create: `client/src/components/order/ServiceSelector.jsx`

## Interfaces
- Consumes: Pilihan klik pengguna
- Produces: State `selectedService` (`antar_barang`, `titip_beli`, atau `bersih_rumah`) yang mengondisikan form langkah berikutnya

---

## Tasks

- [x] **Step 1: Buat state management `OrderContext.jsx`**
  Menyimpan: `serviceType`, `locations`, `dynamicPayload`, `pricingBreakdown`, `customerInfo`.

- [x] **Step 2: Buat komponen `ServiceSelector.jsx`**
  3 Tombol kartu lebar dengan ikon dan deskripsi singkat:
  1. *Antar Barang / Kurir*
  2. *Titip Beli / Jastip*
  3. *Bersih-bersih Rumah & Kos*
  Setiap kartu memiliki active border `border-orange-600 bg-orange-50` saat dipilih.

- [x] **Step 3: Pasang Stepper Indikator Langkah**
  Menampilkan progress: `1. Pilih Layanan` $\rightarrow$ `2. Lokasi & Peta` $\rightarrow$ `3. Rincian & Konfirmasi`.

- [x] **Step 4: Verifikasi Tampilan**
  Uji klik kartu di layar ponsel: kartu merespons cepat dengan animasi scale halus, tombol navigasi "Lanjut ke Peta" aktif.

- [x] **Step 5: Definition of Done (DoD)**
  Pengguna dapat berpindah layanan dengan satu sentuhan jempol dan state tersimpan aman.
