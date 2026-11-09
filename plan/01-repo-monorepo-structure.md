# Plan 01: Inisialisasi Struktur Decoupled & Konfigurasi Workspace

> **For agentic workers:** Sesuai metodologi `superpowers:writing-plans`. Selesaikan langkah satu per satu, jalankan verifikasi, dan tandai checklist.

**Goal:** Menyiapkan struktur direktori decoupled (`client/` dan `server/`), file environment `.env.example`, `.gitignore`, dan konfigurasi workspace dasar.

**Architecture:** Arsitektur decoupled memisahkan penuh kode frontend (Vite React) dan backend (Express Node.js) agar independen dan mudah dideploy terpisah.

**Tech Stack:** Node.js, npm, Git.

**Spec Reference:** [`prd.md` Section 4.1](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `server/package.json`
- Create: `server/.env.example`
- Create: `.gitignore`
- Create: `README.md` (root project workspace description)

## Interfaces
- Consumes: None (Langkah awal fondasi)
- Produces: Struktur direktori bersih untuk backend server dan frontend client

---

## Tasks

- [x] **Step 1: Buat file `.gitignore` di root proyek**
  Abaikan `node_modules`, `.env`, `dist`, `.DS_Store`, dan build artifacts.

- [x] **Step 2: Buat direktori `server` dan inisialisasi `server/package.json`**
  Set nama package: `disuruhsuruh-server`, type: `module`, scripts: `dev`, `start`, `test`.

- [x] **Step 3: Buat template environment `server/.env.example`**
  Definisikan variabel kunci:
  ```env
  PORT=5000
  NODE_ENV=development
  DATABASE_URL=postgresql://user:password@neon-db-host/disuruhsuruh?sslmode=require
  MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
  MIDTRANS_IS_PRODUCTION=false
  AI_SERVICE_URL=http://localhost:8000
  JWT_SECRET=supersecretjwtkey_disuruhsuruh
  FRONTEND_URL=http://localhost:5173
  ```

- [x] **Step 4: Verifikasi Terminal**
  Jalankan perintah pemeriksaan:
  ```powershell
  Test-Path server/package.json, server/.env.example, .gitignore
  ```
  Expected: Mengembalikan output `True` untuk seluruh file.

- [x] **Step 5: Definition of Done (DoD)**
  Struktur direktori decoupled siap menampung modul backend dan frontend.
