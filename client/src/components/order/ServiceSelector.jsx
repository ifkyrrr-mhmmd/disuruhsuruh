import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { Package, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../../lib/utils';

export default function ServiceSelector() {
  const { serviceType, setServiceType, setStep } = useOrder();

  const options = [
    {
      id: 'antar_barang',
      title: 'Antar Barang / Kurir Instan',
      description: 'Pengantaran dokumen, makanan, paket dagangan, atau pindahan ringan.',
      baseFare: 8000,
      icon: Package,
      badge: '0-2 km pertama Rp8.000',
    },
    {
      id: 'titip_beli',
      title: 'Titip Beli / Jastip Belanja',
      description: 'Jasa belanja di pasar tradisional Segiri, swalayan, apotek, atau resto.',
      baseFare: 10000,
      icon: ShoppingBag,
      badge: 'Jasa dasar Rp10.000 + talangan',
    },
    {
      id: 'bersih_rumah',
      title: 'Bersih-bersih Rumah & Kos',
      description: 'Kamar kosan mahasiswa, rumah kontrakan, dan paket deep clean kamar mandi.',
      baseFare: 15000,
      icon: Sparkles,
      badge: 'Transport Rp15rb + Rp30rb/jam',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
          Pilih Kategori Layanan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pilih salah satu layanan untuk memuat formulir dan rincian tarif yang sesuai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = serviceType === opt.id;

          return (
            <button
              type="button"
              key={opt.id}
              aria-pressed={isSelected}
              onClick={() => setServiceType(opt.id)}
              className={`w-full text-left cursor-pointer rounded-2xl border-2 p-4 sm:p-5 flex items-start justify-between gap-4 transition-all duration-150 active:scale-[0.99] select-none ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 shadow-md ring-1 ring-brand-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-charcoal-900">
                      {opt.title}
                    </span>
                    <span className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                  <span className="text-xs font-bold text-brand-700 mt-2">
                    Mulai {formatRupiah(opt.baseFare)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 mt-1">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-brand-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Button to proceed to Step 2 */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setStep(2);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition active:scale-95"
        >
          <span>Lanjut ke Lokasi & Peta</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
