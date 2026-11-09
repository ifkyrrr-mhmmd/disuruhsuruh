import React from 'react';
import { formatRupiah } from '../../lib/utils';
import { Eye, UserCheck, CheckCircle2, MessageCircle, ExternalLink } from 'lucide-react';

export default function OrderTable({
  orders,
  onViewDetail,
  onAssignMitra,
  onCompleteOrder,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Pending Review</span>;
      case 'EXPIRED':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Kedaluwarsa</span>;
      case 'AWAITING_PAYMENT':
        return <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Menunggu QRIS</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Dikonfirmasi</span>;
      case 'PAYMENT_CONFIRMED':
      case 'MITRA_ASSIGNED':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Mitra Ditugaskan</span>;
      case 'IN_PROGRESS':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Dikerjakan</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Selesai</span>;
      case 'REFUND_REQUESTED':
        return <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Butuh Refund</span>;
      case 'CANCELLED_BY_USER':
      case 'CANCELLED_BY_ADMIN':
        return <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[11px]">Dibatalkan</span>;
      case 'REFUNDED':
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[11px]">Direfund 100%</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full text-[11px]">{status}</span>;
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
        Belum ada pesanan pada filter ini.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-4">Resi / Waktu</th>
              <th className="py-3 px-4">Layanan</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Tujuan / Jarak</th>
              <th className="py-3 px-4">Harga Final</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Kelola & Rincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-charcoal-900 block">
                    {o.nano_id}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                  </span>
                </td>

                <td className="py-3.5 px-4 capitalize">
                  <span className="font-bold text-slate-800 block">
                    {o.service_type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {o.payment_method}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-800 block">{o.customer_name}</span>
                  <span className="text-[11px] text-slate-400 block">{o.customer_phone}</span>
                </td>

                <td className="py-3.5 px-4 max-w-[200px] truncate">
                  <span className="truncate block" title={o.dropoff_address}>
                    {o.dropoff_address}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block">
                    {o.distance_km} km
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-brand-600 block text-sm">
                    {formatRupiah(o.final_price)}
                  </span>
                  {o.price_override_reason && (
                    <span className="text-[9px] bg-amber-50 text-amber-700 px-1 py-0.5 rounded font-bold">
                      Override
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(o.status)}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Action button based on status */}
                    {['PENDING_REVIEW', 'CONFIRMED', 'PAYMENT_CONFIRMED'].includes(o.status) && (
                      <button
                        type="button"
                        onClick={() => onAssignMitra(o)}
                        className="inline-flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                        title={o.status === 'PENDING_REVIEW' ? 'Tugaskan Mitra & Setujui' : 'Tugaskan Mitra'}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{o.status === 'PENDING_REVIEW' ? 'Setujui & Tugaskan' : 'Tugaskan'}</span>
                      </button>
                    )}

                    {['MITRA_ASSIGNED', 'IN_PROGRESS'].includes(o.status) && (
                      <button
                        type="button"
                        onClick={() => onCompleteOrder(o)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                        title={o.status === 'IN_PROGRESS' ? 'Tandai Selesai' : 'Mulai Pengerjaan'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{o.status === 'IN_PROGRESS' ? 'Selesai' : 'Mulai'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onViewDetail(o)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-bold text-xs"
                      title="Lihat Rincian Pesanan"
                      aria-label={`Lihat rincian pesanan ${o.nano_id}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Rincian</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
