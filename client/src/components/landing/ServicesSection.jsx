import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiMotorbikeLine,
  RiShoppingBag3Line,
  RiSparkling2Line,
  RiArrowRightLine,
  RiCheckLine,
  RiMapPinLine,
} from 'react-icons/ri';
import { formatRupiah } from '../../lib/utils';

export default function ServicesSection() {
  const [jarakKm, setJarakKm] = useState(2);
  const estimasiTarif = jarakKm <= 2 ? 8000 : 8000 + (jarakKm - 2) * 3000;

  return (
    <section className="py-16 md:py-24 bg-cream border-b border-stone-200/80 scroll-mt-24" id="layanan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading Bersih & Bernafas */}
        <div className="max-w-xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Layanan Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Tiga Bantuan Utama di Samarinda
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Pilih layanan yang Anda perlukan. Tarif dihitung pasti sebelum konfirmasi pesanan.
          </p>
        </div>

        {/* Layout Bento 12 Kolom Terang */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Kartu 1: Kurir & Antar Barang (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-7 flex flex-col justify-between shadow-sm hover:border-orange-300 transition duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center font-bold">
                  <RiMotorbikeLine className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-brand-700 bg-orange-50/80 border border-orange-200/70 px-2.5 py-1 rounded-lg">
                  Mulai Rp8.000 (0-2 km)
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Antar Barang & Kurir Instan
              </h3>
              
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Pengantaran dokumen penting, makanan, paket dagangan, hingga barang sampai 20 kg. Kurir jemput di titik awal dan antar langsung ke tujuan tanpa oper gudang.
              </p>

              {/* Widget Simulasi Tarif Interaktif di dalam Kartu */}
              <div className="bg-[#FAF7F2] border border-stone-200/80 rounded-xl p-3.5 my-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Simulasi Jarak Rute:</span>
                  <span className="font-bold text-stone-900 bg-white border border-stone-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                    {jarakKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={jarakKm}
                  onChange={(e) => setJarakKm(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-stone-500">Estimasi Tarif:</span>
                  <span className="text-base font-black text-brand-700">
                    {formatRupiah(estimasiTarif)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4 text-xs text-stone-700">
                <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg">
                  <RiCheckLine className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Rp3.000 / km berikutnya</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg">
                  <RiCheckLine className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Kapasitas muat s/d 20 kg</span>
                </div>
              </div>
            </div>

            <Link
              to="/order?service=antar_barang"
              className="inline-flex items-center justify-between w-full p-3.5 bg-stone-50 hover:bg-orange-50 hover:text-brand-700 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 transition"
            >
              <span>Pesan Kurir Barang</span>
              <RiArrowRightLine className="w-4 h-4 text-brand-600" />
            </Link>
          </div>

          {/* Kartu 2: Titip Beli & Jastip (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200/90 p-7 flex flex-col justify-between shadow-sm hover:border-orange-300 transition duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center font-bold">
                  <RiShoppingBag3Line className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-brand-700 bg-orange-50/80 border border-orange-200/70 px-2.5 py-1 rounded-lg">
                  Mulai Rp10.000
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Titip Beli & Jastip Pasar
              </h3>
              
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Belanja di Pasar Segiri, toko kelontong, atau apotek. Mitra menyediakan dana talangan belanja dengan perlindungan refund penuh bila barang habis.
              </p>

              {/* Deretan Pill Lokasi Populer */}
              <div className="my-5 space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Lokasi Populer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-orange-50/70 text-brand-700 border border-orange-200/60 rounded-lg px-2.5 py-1 text-xs font-semibold">
                    <RiMapPinLine className="w-3.5 h-3.5" />
                    Pasar Segiri
                  </span>
                  <span className="inline-flex items-center gap-1 bg-orange-50/70 text-brand-700 border border-orange-200/60 rounded-lg px-2.5 py-1 text-xs font-semibold">
                    <RiMapPinLine className="w-3.5 h-3.5" />
                    Toko Kelontong
                  </span>
                  <span className="inline-flex items-center gap-1 bg-orange-50/70 text-brand-700 border border-orange-200/60 rounded-lg px-2.5 py-1 text-xs font-semibold">
                    <RiMapPinLine className="w-3.5 h-3.5" />
                    Apotek
                  </span>
                </div>
              </div>

              <div className="my-5 p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 block">Garansi 100% Refund:</span>
                <span className="text-stone-500">
                  Tagihan Titip Beli dikembalikan 100% jika toko tutup atau stok barang kosong. Pengajuan diverifikasi admin setelah pembayaran.
                </span>
              </div>
            </div>

            <Link
              to="/order?service=titip_beli"
              className="inline-flex items-center justify-between w-full p-3.5 bg-stone-50 hover:bg-orange-50 hover:text-brand-700 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 transition"
            >
              <span>Pesan Jastip Belanja</span>
              <RiArrowRightLine className="w-4 h-4 text-brand-600" />
            </Link>
          </div>

          {/* Kartu 3: Bersih Kos & Rumah (12 cols Banner) */}
          <div className="md:col-span-12 bg-white rounded-2xl border border-stone-200/90 p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:border-orange-300 transition duration-200">
            <div className="max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center font-bold">
                  <RiSparkling2Line className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-brand-700 bg-orange-50/80 border border-orange-200/70 px-2.5 py-0.5 rounded-lg">
                  Rp15.000 transport + Rp30.000 / jam
                </span>
                {/* Badge Khusus Mitra Wanita */}
                <span className="bg-orange-50 text-brand-700 border border-orange-200/70 px-3 py-1 rounded-full text-xs font-semibold">
                  Tersedia Mitra Wanita (Aman untuk Kos Putri)
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Bersih-bersih Rumah & Kamar Kos
              </h3>
              
              <p className="text-sm text-stone-600 leading-relaxed">
                Pembersihan kamar kos mahasiswa, rumah tinggal, hingga kerak kamar mandi. Tersedia pilihan mitra wanita untuk kenyamanan dan privasi penghuni kos putri.
              </p>
            </div>

            <Link
              to="/order?service=bersih_rumah"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              <span>Pesan Jasa Kebersihan</span>
              <RiArrowRightLine className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
