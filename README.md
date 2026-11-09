# disuruhsuruh - Platform Jasa Titip, Antar & Bersih-bersih UMKM Samarinda

Platform pemesanan jasa berbasis web untuk UMKM disuruhsuruh di Samarinda, Kalimantan Timur. Menghubungkan warga Samarinda dengan layanan kurir lokal, titip beli, dan bersih-bersih rumah/kos dengan estimasi tarif transparan.

## Struktur Repositori (Decoupled)

```text
disuruhsuruh/
├── client/          # Frontend Web (React + Vite + Tailwind CSS + Lucide Icons)
├── server/          # Backend API (Node.js + Express.js + PostgreSQL Neon)
├── plan/            # Dokumentasi 18 Mikro-Plan Eksekusi
├── anti-slop/       # Audit, implementation status, dan delivery gate
├── prd.md           # Product Requirement Document
├── design.md        # Design Tokens, Schemas, & API Contracts
└── README.md
```

## Quick Start Backend

```bash
cd server
npm install
cp .env.example .env
# Isi DATABASE_URL, JWT_SECRET, ADMIN_PIN, REFUND_ENCRYPTION_KEY, dan kredensial layanan yang digunakan.
npm run migrate
npm run dev
```

## Pengujian lokal

- Backend: `cd server && npm install && npm test`.
- Jika `DATABASE_URL` masih placeholder, aplikasi memakai penyimpanan memori lokal dan data hilang saat server dimulai ulang. Untuk data persisten, isi koneksi PostgreSQL lalu jalankan `npm run migrate`.
- Frontend: `cd client && npm install && npm run build`.
- Untuk menguji pembayaran tanpa transaksi nyata, aktifkan `PAYMENT_MOCK_ENABLED=true` pada `server/.env` dan `VITE_ENABLE_PAYMENT_MOCK=true` pada `client/.env`. Kedua flag hanya untuk lokal; backend menolak mode mock saat `NODE_ENV=production`.

## Konfigurasi keamanan

- Jangan membagikan `server/.env` atau memasukkan secret ke Git.
- `JWT_SECRET` harus acak dan minimal 32 karakter.
- `ADMIN_PIN` wajib diganti dengan PIN unik minimal 8 karakter. Tidak ada PIN default.
- `REFUND_ENCRYPTION_KEY` wajib diisi dengan 32 byte acak dalam format hex (`openssl rand -hex 32`) untuk mengenkripsi nomor rekening dan nama pemilik rekening refund.
- `PAYMENT_MOCK_ENABLED=true` hanya untuk simulasi lokal dengan `NODE_ENV` selain `production`. Jangan aktifkan di deployment publik.
- Pembayaran QRIS nyata memerlukan kredensial Midtrans dan URL callback yang terkonfigurasi.

## Quick Start Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```
