# Plan 05: Modul Kalkulasi Tarif Dinamis (Pricing Engine)

> **For agentic workers:** Sesuai metodologi `codebase-design` & `writing-plans`.

**Goal:** Membangun modul `PricingEngine` untuk menghitung rincian harga transparan bagi ketiga layanan berdasarkan jarak dan variabel bebas.

**Architecture:** Pure deep module di `server/src/services/pricing.service.js` dengan formula matematis deterministik dan breakdown biaya lengkap.

**Tech Stack:** Node.js, JavaScript, Joi.

**Spec Reference:** [`design.md` Section 6.1](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `server/src/services/pricing.service.js`
- Create: `server/src/controllers/pricing.controller.js`
- Create: `server/src/routes/pricing.routes.js`
- Create: `server/src/schemas/pricing.schema.js`
- Create: `server/test/pricing.test.js`

## Interfaces
- Consumes: `service_type`, `distance_km`, dan `dynamic_payload`
- Produces: Breakdown harga `{ base_fare, distance_fare, variable_fare, total_estimated_price, breakdown: [] }`

---

## Tasks

- [x] **Step 1: Tulis unit test logika pricing `server/test/pricing.test.js`**
  Uji skenario:
  - Antar Barang 1.5 km (masih tarif dasar Rp8.000).
  - Antar Barang 5 km + berat 8 kg (Rp8.000 + (3km x 3.000) + Rp3.000 handling).
  - Titip Beli 3 km + 1 toko + talangan Rp40.000.
  - Bersih Kos 2 jam + jarak basecamp 3 km.

- [x] **Step 2: Implementasikan service `pricing.service.js`**
  Logika formula:
  $$\text{Total} = \text{Tarif Dasar} + (\max(0, \text{Jarak} - 2) \times \text{Tarif/km}) + \text{Biaya Variabel}$$
  Kembalikan array `breakdown` terinci.

- [x] **Step 3: Hubungkan route dan controller `POST /api/v1/pricing/estimate`**
  Validasi payload dengan Joi skema.

- [x] **Step 4: Verifikasi Terminal**
  Jalankan unit test:
  ```powershell
  npm --prefix server test
  ```
  Expected: Seluruh unit test kalkulasi tarif lulus (PASS).

- [x] **Step 5: Definition of Done (DoD)**
  Endpoint `POST /api/v1/pricing/estimate` merespons breakdown biaya akurat dan transparan.
