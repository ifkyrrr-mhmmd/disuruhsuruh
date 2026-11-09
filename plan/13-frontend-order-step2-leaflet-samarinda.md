# Plan 13: Order Wizard Step 2 - Integrasi Peta Leaflet.js OSM Samarinda & OSRM Routing

> **For agentic workers:** Sesuai panduan `no-invented-code` & `writing-plans`.

**Goal:** Membangun modul peta interaktif Leaflet.js dengan batas geofencing 25 km Kota Samarinda, kemampuan menaruh pin jemput/antar, dan penarikan garis rute jalan raya via OSRM.

**Architecture:** Komponen React Leaflet di `client/src/components/map/LeafletMap.jsx` dengan gesture handling aman (dua jari di ponsel) dan service OSRM.

**Tech Stack:** React, leaflet, react-leaflet, OpenStreetMap, OSRM Public Routing API.

**Spec Reference:** [`prd.md` Section 3.1 US-02/05 & 5](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 3.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `client/src/components/map/LeafletMap.jsx`
- Create: `client/src/services/osrm.service.js`
- Create: `client/src/utils/geo.js` (Geofencing 25 km calculator)

## Interfaces
- Consumes: Titik klik pin dari pengguna pada peta
- Produces: Koordinat `pickup_coords`, `dropoff_coords`, rute polyline jalan raya, dan `distance_km` akurat

---

## Tasks

- [x] **Step 1: Buat utilitas geofencing Samarinda di `client/src/utils/geo.js`**
  Pusat Samarinda: `[-0.502179, 117.153709]`. Rumus Haversine untuk memvalidasi apakah pin berada di dalam radius $\le 25\text{ km}$. Jika di luar, munculkan toast peringatan dan batalkan penempatan pin.

- [x] **Step 2: Buat service OSRM di `client/src/services/osrm.service.js`**
  Memanggil API publik OSRM `http://router.project-osrm.org/route/v1/driving/...` untuk mendapatkan jarak meter dan koordinat garis rute (*polyline*).

- [x] **Step 3: Bangun komponen `LeafletMap.jsx`**
  - Center awal: Samarinda.
  - Pin A (Jemput/Toko): Ikon Marker Hijau.
  - Pin B (Antar/Rumah): Ikon Marker Oranye.
  - Fitur: Auto-fit viewport agar kedua pin dan rute garis biru terlihat pas di layar.
  - Mode Bersih-bersih: Pin A terkunci di kantor basecamp, pengguna hanya menaruh Pin B (rumah pelanggan).

- [x] **Step 4: Verifikasi di Browser**
  - Geser pin dari Kampus UNMUL ke Samarinda Seberang.
  - Periksa apakah jarak (sekitar 7–8 km) dan garis rute jalan raya biru langsung terhitung.

- [x] **Step 5: Definition of Done (DoD)**
  Peta Leaflet berjalan lancar tanpa macet di layar ponsel dan mengembalikan jarak jalan raya secara otomatis.
