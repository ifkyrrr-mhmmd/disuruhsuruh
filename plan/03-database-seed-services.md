# Plan 03: Seeding Data Awal Tarif Dasar Layanan UMKM disuruhsuruh

> **For agentic workers:** Sesuai metodologi `superpowers:writing-plans`.

**Goal:** Mengisi data awal master layanan pada tabel `services` untuk 3 kategori: `antar_barang`, `titip_beli`, dan `bersih_rumah`.

**Architecture:** Database seed script idempotent (`INSERT ... ON CONFLICT DO UPDATE`) untuk memastikan tarif dasar terkonfigurasi dengan benar.

**Tech Stack:** Node.js, pg / SQL.

**Spec Reference:** [`design.md` Section 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 1 & 4](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `server/src/db/seed.js`

## Interfaces
- Consumes: `query` dari `server/src/db/connection.js`
- Produces: Data tabel `services` terisi tarif operasional resmi Samarinda

---

## Tasks

- [x] **Step 1: Tulis skrip seeding `server/src/db/seed.js`**
  Memasukkan data konfigurasi tarif:
  1. `antar_barang`: Base fare Rp8.000 (0-2 km pertama), Rp3.000/km berikutnya.
  2. `titip_beli`: Base fare Rp10.000 (Jasa belanja dasar), Rp3.000/km jarak toko ke rumah.
  3. `bersih_rumah`: Base fare Rp15.000 (Transport basecamp Samarinda), Rp30.000/jam pengerjaan.

- [x] **Step 2: Jalankan skrip seeding**
  ```powershell
  node server/src/db/seed.js
  ```
  Expected: Output `"Seeding services completed: 3 services inserted/updated"`.

- [x] **Step 3: Uji Query Verifikasi**
  Eksekusi query pengecekan via node:
  ```powershell
  node -e "import('./server/src/db/connection.js').then(async m => { const r = await m.query('SELECT category, base_fare, per_km_rate FROM services'); console.table(r.rows); process.exit(0); })"
  ```
  Expected: Menampilkan 3 baris data layanan dengan angka tarif yang tepat.

- [x] **Step 4: Definition of Done (DoD)**
  Tabel master layanan memiliki data aktif dan siap dikonsumsi oleh pricing engine backend.
