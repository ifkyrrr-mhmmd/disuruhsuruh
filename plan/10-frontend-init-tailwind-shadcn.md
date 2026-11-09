# Plan 10: Inisialisasi Frontend Vite + React, Tailwind CSS, & Shadcn UI

> **For agentic workers:** Sesuai standar `antislop-ui` & `writing-plans`.

**Goal:** Menyiapkan proyek client frontend dengan Vite, React, Tailwind CSS v3/v4, komponen Shadcn UI, font Plus Jakarta Sans, dan konfigurasi Axios instance.

**Architecture:** Client SPA modern di folder `client/` dengan token warna brand disuruhsuruh terdefinisi di Tailwind config.

**Tech Stack:** React 18+, Vite, Tailwind CSS, Shadcn UI / Radix UI, Lucide Icons, Axios.

**Spec Reference:** [`design.md` Section 2](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 4.1](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `client/package.json`
- Create: `client/vite.config.js`
- Create: `client/tailwind.config.js`
- Create: `client/src/index.css`
- Create: `client/src/lib/api.js` (Axios instance)
- Create: `client/src/components/ui/button.jsx`

## Interfaces
- Consumes: Backend server running di port 5000
- Produces: Fondasi frontend siap komponen dengan theme tokens `design.md`

---

## Tasks

- [x] **Step 1: Inisialisasi proyek Vite React di `client/`**
  Setup `package.json` dengan dependensi: `react`, `react-dom`, `react-router-dom`, `axios`, `lucide-react`, `clsx`, `tailwind-merge`.

- [x] **Step 2: Konfigurasi Tailwind & Token Warna `design.md`**
  Di `tailwind.config.js`:
  - Primary Amber: `#EA580C`
  - Emerald Success: `#047857`
  - Slate Base: `#F8FAFC`
  - Font: `Plus Jakarta Sans`, sans-serif.

- [x] **Step 3: Setup Axios Client terpusat di `client/src/lib/api.js`**
  Pasang `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'`.

- [x] **Step 4: Verifikasi Terminal**
  Build dan jalankan dev server frontend:
  ```powershell
  npm --prefix client run build
  ```
  Expected: Build Vite selesai tanpa error (`✓ built in ...ms`).

- [x] **Step 5: Definition of Done (DoD)**
  Frontend React siap koding komponen dengan tema warna anti-slop yang solid.
