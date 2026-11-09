# Plan 11: Landing Page (`/`) Responsif & Anti-Slop dengan Subtle Parallax

> **For agentic workers:** Sesuai panduan `antislop-ui` & `writing-plans`.

**Goal:** Membangun antarmuka Landing Page publik (`/`) yang elegan di desktop dengan sentuhan paralaks halus, informatif, dan memiliki Sticky Bottom CTA di ponsel.

**Architecture:** Komponen React modular: `Navbar`, `HeroSection`, `ServicesSection`, `TransparencySection`, `SocialProof`, dan `StickyBottomBar`.

**Tech Stack:** React, Tailwind CSS, Lucide Icons, React Router.

**Spec Reference:** [`design.md` Section 3.1](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md) & [`prd.md` Section 3.1](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md)

---

## Files

- Create: `client/src/pages/LandingPage.jsx`
- Create: `client/src/components/landing/Navbar.jsx`
- Create: `client/src/components/landing/HeroSection.jsx`
- Create: `client/src/components/landing/ServicesSection.jsx`
- Create: `client/src/components/landing/StickyBottomBar.jsx`

## Interfaces
- Consumes: Navigasi React Router (`/order`)
- Produces: Halaman beranda representatif dengan tingkat konversi tinggi

---

## Tasks

- [x] **Step 1: Buat `Navbar.jsx`**
  Logo `disuruhsuruh.id`, teks status operasional Samarinda 07.30 - 22.00 WITA, dan tombol cepat "Lacak Resi".

- [x] **Step 2: Buat `HeroSection.jsx` dengan sentuhan Subtle Parallax**
  - Teks judul utama: *"Jasa Antar Barang, Titip Belanja, dan Bersih Rumah di Samarinda"*.
  - Sisi kanan desktop: Kartu simulasi rute Samarinda interaktif dengan efek translasi Y halus saat scroll.
  - Tombol CTA utama: `[Pesan Layanan]`.

- [x] **Step 3: Buat `ServicesSection.jsx` (3 Layanan Dinamis)**
  Kartu asimetris: Antar Barang & Kurir (Flagship), Titip Beli & Belanja, Bersih-bersih Rumah & Kos.

- [x] **Step 4: Buat `StickyBottomBar.jsx` khusus layar ponsel**
  Muncul hanya di breakpoint mobile (`md:hidden`), menempel di bawah dengan tombol `[Pesan Sekarang]`.

- [x] **Step 5: Verifikasi Terminal & Browser**
  Buka halaman landing di browser:
  - Periksa di resolusi desktop (1280px+): Tampilan lapang, lega, dan estetik.
  - Periksa di resolusi mobile (390px): Scroll lancar, tidak ada horizontal overflow, tombol melayang di bawah aktif.

- [x] **Step 6: Definition of Done (DoD)**
  Landing page bersih dari gaya AI slop, memikat di desktop, dan sangat nyaman di layar HP.
