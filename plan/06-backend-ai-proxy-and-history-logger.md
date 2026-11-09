# Plan 06: AI Gateway Proxy Adapter & History Logger

> **For agentic workers:** Sesuai metodologi `codebase-design` & batasan Side Quest.

**Goal:** Membangun adapter proxy aman yang memanggil model AI tim Python, mencatat riwayat inferensi ke database, dan memiliki mekanisme fallback degradation otomatis jika AI offline.

**Architecture:** Modul `AIProxyAdapter` yang memisahkan panggilan jaringan eksternal dari logika inti dengan timeout 3000ms dan circuit breaker.

**Tech Stack:** Node.js, Axios, PostgreSQL (`ai_inference_logs`).

**Spec Reference:** [`prd.md` Section 4.1 & 4.2](file:///d:/AKU%20TI/Projek/disuruhsuruh/prd.md) & [`design.md` Section 4](file:///d:/AKU%20TI/Projek/disuruhsuruh/design.md)

---

## Files

- Create: `server/src/adapters/aiProxy.adapter.js`
- Create: `server/src/models/aiLog.model.js`
- Create: `server/test/aiProxy.test.js`

## Interfaces
- Consumes: `features: { service_type, distance_km, dynamic_payload }`
- Produces: `{ predicted_duration_minutes, predicted_price, is_fallback, latency_ms }`

---

## Tasks

- [x] **Step 1: Tulis unit test fallback `server/test/aiProxy.test.js`**
  Simulasikan jika URL model AI mati (port tidak aktif) $\rightarrow$ sistem harus tetap mengembalikan hasil prediksi heuristik cadangan dengan `is_fallback: true` tanpa melempar error.

- [x] **Step 2: Implementasikan `server/src/adapters/aiProxy.adapter.js`**
  - Coba kirim payload via Axios ke `process.env.AI_SERVICE_URL` dengan timeout 3000ms.
  - Tangkap error (catch): Jika gagal/timeout, hitung rumus heuristik:
    $$\text{Durasi} = (\text{Jarak} \times 3\text{ menit}) + 10\text{ menit}$$
  - Catat latency dan status fallback.

- [x] **Step 3: Implementasikan pencatatan ke database `aiLog.model.js`**
  Fungsi asynchronous `logInferenceResult(data)` yang menyimpan ke tabel `ai_inference_logs` tanpa menghambat respons pengguna (*fire-and-forget*).

- [x] **Step 4: Verifikasi Terminal**
  Jalankan test:
  ```powershell
  npm --prefix server test test/aiProxy.test.js
  ```
  Expected: Uji fallback berhasil menangani kegagalan jaringan dengan elegan (PASS).

- [x] **Step 5: Definition of Done (DoD)**
  Kerahasiaan service AI terlindungi di server-side, riwayat inferensi tersimpan rapi, dan sistem anti-crash.
