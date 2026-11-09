# Plan 04: Setup Server Express.js, Middleware & Joi Validator

> **For agentic workers:** Sesuai metodologi `superpowers:writing-plans`.

**Goal:** Membangun fondasi server Express.js dengan middleware CORS, JSON parser, global error handler, dan skema validasi Joi untuk request masuk.

**Architecture:** Arsitektur modular layer: `app.js` (konfigurasi), `server.js` (entry point listen), `middlewares/` (validator, error handler), dan `routes/`.

**Tech Stack:** Express 4.x, Joi 17+, cors, dotenv, morgan.

**Spec Reference:** [`prd.md` Section 4.1 & 6](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `server/src/app.js`
- Create: `server/src/server.js`
- Create: `server/src/middlewares/validate.js`
- Create: `server/src/middlewares/errorHandler.js`
- Create: `server/src/routes/health.routes.js`

## Interfaces
- Consumes: Request HTTP masuk
- Produces: Server Express aktif di port 5000 dengan routing standar `/api/v1/...`

---

## Tasks

- [x] **Step 1: Buat middleware validasi Joi `server/src/middlewares/validate.js`**
  Menerima skema Joi, memvalidasi `req.body` / `req.query`, mengembalikan error 400 terformat rapi jika payload tidak valid.

- [x] **Step 2: Buat global error handler `server/src/middlewares/errorHandler.js`**
  Menangani uncaught errors tanpa mengekspos stack trace sensitif di mode produksi, mengembalikan respons JSON standar `{ status: "error", message: "..." }`.

- [x] **Step 3: Rakit aplikasi Express `server/src/app.js`**
  Pasang CORS, JSON parser, route `/api/v1/health`, dan error handler.

- [x] **Step 4: Buat entry point server `server/src/server.js`**
  Menghubungkan port dari `.env` dan menyalakan listener `app.listen()`.

- [x] **Step 5: Verifikasi Terminal**
  Jalankan server dan uji endpoint health:
  ```powershell
  curl.exe http://localhost:5000/api/v1/health
  ```
  Expected: `{ "status": "ok", "service": "disuruhsuruh-api" }` dengan status code 200.

- [x] **Step 6: Definition of Done (DoD)**
  Server Express menyala stabil, middleware validasi siap dipakai, dan penanganan error terstruktur.
