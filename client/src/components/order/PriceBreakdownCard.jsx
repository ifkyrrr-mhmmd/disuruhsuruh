import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatRupiah } from '../../lib/utils';
import { ShieldCheck, Clock } from 'lucide-react';

export default function PriceBreakdownCard() {
  const { serviceType, pricing } = useOrder();

  const isCleaning = serviceType === 'bersih_rumah';

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-100 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
            Rincian Tarif
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          Tanpa Biaya Siluman
        </span>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-2.5 text-xs text-slate-600">
        {pricing.breakdown && pricing.breakdown.length > 0 ? (
          pricing.breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span>{item.label}</span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(item.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex justify-between items-center text-slate-400 italic">
            <span>Menghitung rincian tarif...</span>
          </div>
        )}
      </div>

      {/* Duration Badge */}
      <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600 border border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{isCleaning ? 'Estimasi Durasi Pengerjaan:' : 'Estimasi Waktu Tiba:'}</span>
        </div>
        <span className="font-bold text-charcoal-900">
          {isCleaning
            ? `${Math.round((pricing.predicted_duration_minutes || 120) / 60)} Jam (${pricing.predicted_duration_minutes || 120} Menit)`
            : `${pricing.predicted_duration_minutes || 20} Menit`}
        </span>
      </div>

      {pricing.error && !pricing.loading && (
        <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">Estimasi tarif belum dapat dihitung. Periksa koneksi lalu coba lagi.</p>
      )}

      {pricing.distance_is_fallback && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="status">
          Layanan peta sedang tidak tersedia. Jarak dan tarif menggunakan estimasi, admin akan mengonfirmasi harga akhir.
        </p>
      )}

      {/* Total Section */}
      <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase block">
            Total Biaya Transparan:
          </span>
          <span className="text-[11px] text-slate-400">
            Estimasi awal, harga final dikonfirmasi admin sebelum pembayaran
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-brand-600" aria-live="polite">
            {pricing.loading ? 'Menghitung…' : pricing.error ? 'Belum tersedia' : formatRupiah(pricing.total_estimated_price)}
          </span>
        </div>
      </div>
    </div>
  );
}
