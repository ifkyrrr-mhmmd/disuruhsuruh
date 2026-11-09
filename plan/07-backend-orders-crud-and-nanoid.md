# Plan 07: Endpoint Pembuatan Pesanan NanoID & Pelacakan Publik

> **For agentic workers:** Sesuai metodologi `writing-plans`.

**Goal:** Membangun endpoint `POST /api/v1/orders` untuk mendaftarkan pesanan baru dengan token NanoID unik, dan endpoint `GET /api/v1/orders/:nanoId` untuk pelacakan publik pelanggan.

**Architecture:** Model `OrderModel`, Controller `OrderController`, dan Routes dengan validasi ketat nomor telepon Indonesia dan geofencing koordinat.

**Tech Stack:** Node.js, Express, nanoid, Joi, PostgreSQL (`orders`).

**Spec Reference:** [`design.md` Section 6.2 & 6.3](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3.1 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `server/src/schemas/order.schema.js`
- Create: `server/src/models/order.model.js`
- Create: `server/src/controllers/order.controller.js`
- Create: `server/src/routes/order.routes.js`
- Create: `server/src/utils/masking.js`
- Create: `server/test/orders.test.js`

## Interfaces
- Consumes: Payload pemesanan dari form pelanggan
- Produces: Data order tersimpan dengan token NanoID, URL pelacakan `/track/:nanoId`, dan tampilan masked data pelanggan

---

## Tasks

- [x] **Step 1: Buat skema validasi Joi `order.schema.js`**
  - Validasi regex nomor WhatsApp Indonesia: `/^(\+62|62|0)8[1-9][0-9]{7,11}$/`.
  - Validasi koordinat Samarinda (radius ~25 km).
  - Validasi batas maksimal plafon COD Rp50.000.

- [x] **Step 2: Buat utilitas penyembunyi data sensitif `server/src/utils/masking.js`**
  Contoh: `081234567890` $\rightarrow$ `0812****7890`; `Ahmad Faris` $\rightarrow$ `Ahmad F.`.

- [x] **Step 3: Implementasikan `order.model.js` & `order.controller.js`**
  - Generate NanoID acak 10 karakter dengan prefix `ds_` (contoh: `ds_9xK2mP1q`).
  - Simpan ke tabel `orders` dengan status awal `PENDING_REVIEW`.
  - Pada `GET /api/v1/orders/:nanoId`, kembalikan data dengan informasi kontak yang telah disamarkan demi privasi.

- [x] **Step 4: Verifikasi Terminal**
  Kirim request POST pesanan dummy via curl:
  ```powershell
  curl.exe -X POST http://localhost:5000/api/v1/orders -H "Content-Type: application/json" -d "{\"service_type\":\"antar_barang\",\"customer_name\":\"Budi Santoso\",\"customer_phone\":\"081234567890\",\"dropoff_address\":\"Jl. Pramuka\",\"dropoff_lat\":-0.48,\"dropoff_lng\":117.15,\"distance_km\":3,\"payment_method\":\"COD\"}"
  ```
  Expected: Respons 201 Created dengan `nano_id` unik dan status `PENDING_REVIEW`.

- [x] **Step 5: Definition of Done (DoD)**
  Pelanggan dapat membuat pesanan dan mengakses status resi publiknya dengan aman tanpa bocor data pribadi.
