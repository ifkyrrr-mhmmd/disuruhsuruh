# disuruhsuruh: 18 Micro-Plans Master Execution Matrix

Dokumen indeks ini merangkum 18 mikro-plan eksekusi bertahap (*Phased Sequential Execution*) untuk membangun platform web UMKM **disuruhsuruh** Samarinda.

- **Acuan Spesifikasi:** [`prd.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)
- **Metodologi:** `superpowers:writing-plans`, `codebase-design`, dan `antislop-ui`
- **Aturan Eksekusi:** Satu plan dalam satu waktu. Selesaikan checklist, jalankan verifikasi terminal, periksa Definition of Done (DoD), baru lanjut ke plan berikutnya.

---

## Peta Jalan 18 Mikro-Plan

### Fase 1: Fondasi Proyek & Database (Plan 01 - 03)
- [x] [`01-repo-monorepo-structure.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/01-repo-monorepo-structure.md) — Inisialisasi decoupled directory (`client/` & `server/`), `.env.example`, `.gitignore`, dan konfigurasi workspace.
- [x] [`02-database-schema-ddl-neon.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/02-database-schema-ddl-neon.md) — Skema migrasi DDL PostgreSQL (5 tabel: `services`, `orders`, `ai_inference_logs`, `refunds`, `blacklist_contacts`) di Neon DB.
- [x] [`03-database-seed-services.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/03-database-seed-services.md) — Skrip seeding data awal tarif dasar layanan UMKM disuruhsuruh Samarinda.

### Fase 2: Backend Express REST API & AI Proxy (Plan 04 - 09)
- [x] [`04-backend-express-and-joi-setup.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/04-backend-express-and-joi-setup.md) — Setup Express.js server, CORS, error handling terpusat, dan middleware Joi schema validator.
- [x] [`05-backend-pricing-calculation-engine.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/05-backend-pricing-calculation-engine.md) — Modul kalkulasi tarif dinamis (jarak OSRM, dimensi/berat barang, paket bersih, dan biaya talangan).
- [x] [`06-backend-ai-proxy-and-history-logger.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/06-backend-ai-proxy-and-history-logger.md) — AI Gateway Proxy aman ke model Python dengan circuit-breaker fallback dan logging inferensi ke DB.
- [x] [`07-backend-orders-crud-and-nanoid.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/07-backend-orders-crud-and-nanoid.md) — Endpoint pembuatan order baru ber-NanoID (`POST /api/v1/orders`) dan pelacakan publik masked (`GET /api/v1/orders/:nanoId`).
- [x] [`08-backend-midtrans-qris-integration.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/08-backend-midtrans-qris-integration.md) — Integrasi Dynamic QRIS Midtrans Sandbox dan webhook handler status lunas.
- [x] [`09-backend-admin-status-and-refund-api.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/09-backend-admin-status-and-refund-api.md) — Endpoint admin: login auth, update status, penugasan mitra, pengajuan & eksekusi refund 100%, serta ekspor CSV.

### Fase 3: Frontend React + Vite + Tailwind (Plan 10 - 17)
- [x] [`10-frontend-init-tailwind-shadcn.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/10-frontend-init-tailwind-shadcn.md) — Setup Vite + React, Tailwind CSS, komponen Shadcn UI, font Plus Jakarta Sans, dan Axios instance.
- [x] [`11-frontend-landing-page-responsive.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/11-frontend-landing-page-responsive.md) — Landing page (`/`) anti-slop, hero section dengan parallax subtle, kartu 3 layanan, dan sticky CTA mobile.
- [x] [`12-frontend-order-step1-service-selection.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/12-frontend-order-step1-service-selection.md) — Order Wizard Step 1: Selector layanan kartu interaktif ramah jempol.
- [x] [`13-frontend-order-step2-leaflet-samarinda.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/13-frontend-order-step2-leaflet-samarinda.md) — Order Wizard Step 2: Peta Leaflet.js OSM Samarinda, geofencing 25 km, dan kalkulasi rute OSRM live.
- [x] [`14-frontend-order-step3-details-and-review.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/14-frontend-order-step3-details-and-review.md) — Order Wizard Step 3: Input variabel bebas, kartu rincian tarif transparan, pemilihan bayar COD/QRIS, dan submit order.
- [x] [`15-frontend-tracking-page-and-qris-view.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/15-frontend-tracking-page-and-qris-view.md) — Halaman `/track/:nanoId`: status stepper visual, tampilan QRIS Dinamis + timer 15 menit, dan Smart WA button.
- [x] [`16-frontend-admin-login-and-dashboard.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/16-frontend-admin-login-and-dashboard.md) — Dasbor admin (`/admin/dashboard`): ringkasan metrik, tabel filter status, mini map modal, dan 1-Click WA ping.
- [x] [`17-frontend-refund-form-and-side-features.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/17-frontend-refund-form-and-side-features.md) — Form refund 100% di halaman tracking dan fitur polesan: toggle jam buka/tutup toko, upload foto bukti, dan rating.

### Fase 4: Pengujian & Distribusi (Plan 18)
- [x] [`18-end-to-end-verification-and-deploy.md`](file:///d:/AKU%20TI/Projek/disuruhsuruh/plan/18-end-to-end-verification-and-deploy.md) — Pengujian alur end-to-end (pesan $\rightarrow$ approve $\rightarrow$ bayar $\rightarrow$ selesai) dan panduan deployment free-tier (Vercel, Render, Neon).
