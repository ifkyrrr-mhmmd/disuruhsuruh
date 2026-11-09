# Panduan Deployment Cloud Free-Tier: disuruhsuruh Samarinda

Panduan distribusi production-ready tanpa biaya (*zero-cost free-tier*) menggunakan kombinasi **Vercel** (Frontend Client), **Render** (Backend Server), dan **Neon DB** (Serverless PostgreSQL).

---

## 1. Database: Neon Serverless PostgreSQL
1. Buka [neon.tech](https://neon.tech) dan buat project baru: `disuruhsuruh-db` (Region: `ap-southeast-1` Singapore).
2. Salin Connection String `DATABASE_URL` berformat:
   `postgresql://neondb_owner:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
3. Jalankan migrasi dan seeding dari lokal:
   ```bash
   cd server
   # Pasang DATABASE_URL di server/.env
   npm run migrate
   npm run seed
   ```

---

## 2. Backend API: Render.com
1. Buat akun di [render.com](https://render.com).
2. Pilih **New +** $\rightarrow$ **Web Service** $\rightarrow$ Hubungkan repo GitHub `disuruhsuruh`.
3. Konfigurasi Service:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Masukkan Environment Variables di dasbor Render:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Connection string dari Neon DB di atas)*
   - `JWT_SECRET`: *(String acak aman 32 karakter)*
   - `ADMIN_PIN`: `123456`
   - `FRONTEND_URL`: `https://disuruhsuruh.vercel.app`
   - `MIDTRANS_SERVER_KEY`: `SB-Mid-server-xxxx` (Akun sandbox Midtrans)
5. Simpan dan deploy. Catat URL API publik Anda, misalnya: `https://disuruhsuruh-api.onrender.com`.

---

## 3. Frontend Web: Vercel
1. Buka [vercel.com](https://vercel.com) dan impor repository GitHub `disuruhsuruh`.
2. Pengaturan Framework:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Masukkan Environment Variable:
   - `VITE_API_URL`: `https://disuruhsuruh-api.onrender.com/api/v1`
4. Klik **Deploy**. Web client Anda langsung live dan siap diakses publik di ponsel maupun desktop!
