import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiCalculatorLine,
  RiArrowRightLine,
  RiMapPinRangeLine,
} from 'react-icons/ri';
import { formatRupiah } from '../../lib/utils';

export default function FareCalculatorSection() {
  const routes = [
    {
      id: 'r1',
      title: 'Lembuswana ➔ Pramuka',
      from: 'Mall Lembuswana',
      to: 'Kosan Jl. Pramuka (Samarinda Ulu)',
      distanceKm: 3.5,
      fare: 12500,
      duration: 15,
    },
    {
      id: 'r2',
      title: 'Pasar Segiri ➔ Juanda',
      from: 'Pasar Segiri',
      to: 'Jl. Juanda (Air Hitam)',
      distanceKm: 4.8,
      fare: 16400,
      duration: 20,
    },
    {
      id: 'r3',
      title: 'Big Mall ➔ Samarinda Seberang',
      from: 'Big Mall (Untung Suropati)',
      to: 'Jl. Bung Tomo (Seberang)',
      distanceKm: 7.2,
      fare: 23600,
      duration: 25,
    },
  ];

  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [customKm, setCustomKm] = useState(3.5);

  const handleSelectPreset = (route) => {
    setSelectedRoute(route);
    setCustomKm(route.distanceKm);
  };

  const handleSliderChange = (km) => {
    setCustomKm(km);
    // Formula tarif dasar kurir: Rp8.000 (0-2 km) + Rp3.000 / km berikutnya
    const extra = Math.max(0, km - 2);
    const calculated = 8000 + Math.round(extra * 3000);
    setSelectedRoute({
      id: 'custom',
      title: 'Rute Anda',
      from: 'Titik Jemput Anda di Samarinda',
      to: 'Lokasi Pengantaran / Tujuan',
      distanceKm: km,
      fare: calculated,
      duration: Math.round(km * 2.5 + 8),
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-stone-200/80 scroll-mt-24" id="kalkulator">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Kalkulator Rute
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Simulasi Tarif Rute Samarinda
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Hitung tarif kurir secara instan berdasarkan jarak jalan raya nyata sebelum membuat pesanan.
          </p>
        </div>

        {/* Card Kalkulator Lega & Nyaman Dipakai */}
        <div className="bg-cream rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* Preset Rute Pilihan */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-600">
              Pilih rute contoh yang sering dipesan warga:
            </span>
            <div className="flex flex-wrap gap-2">
              {routes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectPreset(r)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition ${
                    selectedRoute.id === r.id
                      ? 'border-brand-600 bg-white text-brand-700 font-bold shadow-sm'
                      : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          {/* Rincian Rute A ➔ B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-stone-200/80 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-stone-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                A
              </span>
              <div>
                <span className="text-stone-400 font-medium block">Titik Jemput:</span>
                <span className="font-semibold text-stone-900">{selectedRoute.from}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                B
              </span>
              <div>
                <span className="text-stone-400 font-medium block">Tujuan Pengantaran:</span>
                <span className="font-semibold text-stone-900">{selectedRoute.to}</span>
              </div>
            </div>
          </div>

          {/* Slider Jarak Interaktif */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-stone-600 font-medium">Geser untuk atur jarak rute:</span>
              <span className="font-extrabold text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-xl font-mono">
                {customKm} km
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={customKm}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>1 km</span>
              <span>5 km</span>
              <span>10 km</span>
              <span>15 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Box Hasil Estimasi Biaya */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-stone-500 block">
                Estimasi tarif resmi:
              </span>
              <span className="text-xs text-stone-400">
                Waktu tempuh estimasi ~{selectedRoute.duration} menit (tergantung lalu lintas)
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-3xl sm:text-4xl font-black text-brand-600 tracking-tight font-mono">
                {formatRupiah(selectedRoute.fare)}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/order?service=antar_barang"
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-sm transition active:scale-[0.98]"
          >
            <RiCalculatorLine className="w-4 h-4" />
            <span>Pesan Sekarang dengan Rute Ini</span>
            <RiArrowRightLine className="w-4 h-4" />
          </Link>

        </div>

      </div>
    </section>
  );
}
