# Plan 18: Pengujian Alur End-to-End & Panduan Deployment Free-Tier

> **For agentic workers:** Sesuai metodologi `superpowers:verification-before-completion`.

**Goal:** Memverifikasi seluruh alur sistem secara menyeluruh (*End-to-End*) dari pemesanan pelanggan hingga penyelesaian di dasbor admin, serta menyusun panduan rilis ke cloud free-tier (Vercel, Render, dan Neon).

**Architecture:** Smoke test terpadu pada frontend dan backend yang terhubung nyata, serta persiapan file konfigurasi deployment (`vercel.json`, `render.yaml`).

**Tech Stack:** Vitest / Playwright / Manual Curl & Browser Script, Vercel, Render, Neon PostgreSQL.

**Spec Reference:** [`prd.md` Section 8](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `client/vercel.json`
- Create: `server/render.yaml`
- Create: `docs/deployment-guide.md`
- Create: `test/e2e-smoke-test.sh`

## Interfaces
- Consumes: Seluruh modul frontend dan backend yang telah selesai dari Plan 01 s/d Plan 17
- Produces: Sistem production-ready yang siap didemonstrasikan dan dinilai oleh Kak Gani dan tim penguji capstone

---

## Tasks

- [x] **Step 1: Jalankan Skenario Transaksi Nyata 1 (Antar Barang COD)**
  - Pelanggan buka web $\rightarrow$ pilih Antar Barang $\rightarrow$ pilih titik di Leaflet $\rightarrow$ isi nama & no WA $\rightarrow$ pilih COD $\rightarrow$ submit order.
  - Admin login $\rightarrow$ lihat notifikasi pesanan $\rightarrow$ klik 1-Click WA ping $\rightarrow$ tugaskan mitra $\rightarrow$ approve.
  - Pelanggan melihat status berubah menjadi *Mitra Menuju Lokasi*.
  - Admin tandai selesai $\rightarrow$ pelanggan melihat status *Selesai*.

- [x] **Step 2: Jalankan Skenario Transaksi Nyata 2 (Titip Beli Dynamic QRIS & Refund)**
  - Pelanggan pilih Titip Beli $\rightarrow$ isi belanjaan & opsi jika stok kosong $\rightarrow$ pilih QRIS.
  - Admin approve $\rightarrow$ QRIS Midtrans muncul di layar pelanggan dengan timer 15 menit.
  - Simulasikan toko tutup $\rightarrow$ pelanggan ajukan rekening refund $\rightarrow$ admin transfer balik 100% dan klik selesai.

- [x] **Step 3: Konfigurasi Deployment Free-Tier**
  - Siapkan `client/vercel.json` dengan URL rewrite untuk SPA routing.
  - Siapkan panduan environment variable di Render untuk server Express dan Neon untuk database.

- [x] **Step 4: Checklist Evaluasi Akhir (Main Quest & Side Quest)**
  - [x] Bebas error console di browser.
  - [x] Lolos uji kontras warna dan responsive di HP tanpa horizontal scrollbar.
  - [x] Tidak ada API Key rahasia yang bocor ke bundle client.

- [x] **Step 5: Definition of Done (DoD)**
  Platform web UMKM *disuruhsuruh* 100% siap live, memenuhi seluruh kriteria Main Quest & Side Quest, dan siap dipresentasikan.
