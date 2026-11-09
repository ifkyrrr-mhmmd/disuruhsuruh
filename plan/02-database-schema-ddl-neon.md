# Plan 02: Skema Migrasi Database PostgreSQL DDL di Neon DB

> **For agentic workers:** Sesuai metodologi `superpowers:writing-plans`. Ikuti DDL skema resmi dari `design.md`.

**Goal:** Menyusun skrip migrasi SQL DDL lengkap yang mendefinisikan 5 tabel inti: `services`, `orders`, `ai_inference_logs`, `refunds`, dan `blacklist_contacts`.

**Architecture:** Menggunakan database relasional PostgreSQL di cloud serverless Neon DB dengan enum types, index, dan foreign key cascade.

**Tech Stack:** PostgreSQL 15+, pg / node-postgres, SQL DDL.

**Spec Reference:** [`design.md` Section 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 4.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `server/src/db/schema.sql`
- Create: `server/src/db/migrate.js`
- Create: `server/src/db/connection.js`

## Interfaces
- Consumes: `DATABASE_URL` dari environment variable
- Produces: Koneksi database pool `query()` dan tabel-tabel persisten yang terinisialisasi

---

## Tasks

- [x] **Step 1: Buat modul koneksi pool `server/src/db/connection.js`**
  Menggunakan library `pg` (Pool) dengan konfigurasi SSL untuk koneksi ke Neon DB.

- [x] **Step 2: Buat skrip SQL lengkap `server/src/db/schema.sql`**
  Menyalin seluruh definisi DDL dari `design.md`:
  - Enums: `service_category`, `order_status`, `payment_method_type`, `payment_status_type`.
  - Tabel: `services`, `orders`, `ai_inference_logs`, `refunds`, `blacklist_contacts`.
  - Indexes: `idx_orders_nano_id`, `idx_orders_status`, `idx_orders_created_at`.

- [x] **Step 3: Buat script eksekusi migrasi `server/src/db/migrate.js`**
  Fungsi yang membaca `schema.sql` dan mengeksekusinya via client connection, lalu mencetak pesan sukses/gagal.

- [x] **Step 4: Verifikasi Terminal**
  Jalankan skrip migrasi terhadap database target:
  ```powershell
  node server/src/db/migrate.js
  ```
  Expected: Pesan `"Database schema migrated successfully"`.

- [x] **Step 5: Definition of Done (DoD)**
  Seluruh 5 tabel dan tipe enum telah aktif dan terverifikasi di PostgreSQL Neon DB.
