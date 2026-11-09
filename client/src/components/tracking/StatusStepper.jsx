import React from 'react';
import { Check, Clock, XCircle } from 'lucide-react';

export default function StatusStepper({ status, paymentMethod }) {
  const steps = [
    { key: 'PENDING_REVIEW', label: 'Menunggu Konfirmasi Admin' },
    ...(paymentMethod === 'QRIS_DIGITAL'
      ? [{ key: 'AWAITING_PAYMENT', label: 'Menunggu Pembayaran QRIS' }]
      : []),
    { key: 'CONFIRMED', label: 'Pesanan Dikonfirmasi' },
    { key: 'MITRA_ASSIGNED', label: 'Mitra Ditugaskan' },
    { key: 'IN_PROGRESS', label: 'Sedang Dikerjakan' },
    { key: 'COMPLETED', label: 'Pesanan Selesai' },
  ];

  // Mapping status order to step index
  const getActiveIndex = () => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 0;
      case 'AWAITING_PAYMENT':
        return paymentMethod === 'QRIS_DIGITAL' ? 1 : 0;
      case 'PAYMENT_CONFIRMED':
      case 'CONFIRMED':
        return paymentMethod === 'QRIS_DIGITAL' ? 2 : 1;
      case 'MITRA_ASSIGNED':
        return paymentMethod === 'QRIS_DIGITAL' ? 3 : 2;
      case 'IN_PROGRESS':
        return paymentMethod === 'QRIS_DIGITAL' ? 4 : 3;
      case 'COMPLETED':
        return paymentMethod === 'QRIS_DIGITAL' ? 5 : 4;
      case 'CANCELLED_BY_USER':
      case 'CANCELLED_BY_ADMIN':
      case 'REFUND_REQUESTED':
      case 'REFUNDED':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex();
  const statusDescriptions = {
    PENDING_REVIEW: 'Admin sedang meninjau detail pesanan dan estimasi tarif.',
    AWAITING_PAYMENT: 'Selesaikan pembayaran sebelum batas waktu agar pesanan dapat diproses.',
    PAYMENT_CONFIRMED: 'Pembayaran diterima. Pesanan menunggu penugasan mitra.',
    CONFIRMED: 'Pesanan sudah disetujui dan menunggu penugasan mitra.',
    MITRA_ASSIGNED: 'Mitra sudah ditugaskan untuk menangani pesanan.',
    IN_PROGRESS: 'Pesanan sedang dikerjakan oleh mitra.',
    COMPLETED: 'Pesanan telah selesai. Terima kasih telah menggunakan disuruhsuruh.',
  };
  const isExpired = status === 'EXPIRED';
  const isCancelled = status?.startsWith('CANCELLED');
  const isRefundState = status === 'REFUND_REQUESTED' || status === 'REFUNDED';

  if (isExpired) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900" role="status">
        <Clock className="w-5 h-5 text-amber-700 shrink-0" />
        <div>
          <span className="font-bold block text-sm">Waktu Pembayaran Telah Habis</span>
          <span>Pesanan belum dibayar dalam batas waktu. Hubungi admin jika masih ingin melanjutkan pemesanan.</span>
        </div>
      </div>
    );
  }

  if (isCancelled || isRefundState) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800">
        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <span className="font-bold block text-sm">
            {status === 'REFUNDED'
              ? 'Pesanan Telah Direfund 100%'
              : status === 'REFUND_REQUESTED'
              ? 'Pengajuan Refund Sedang Diproses Admin'
              : 'Pesanan Dibatalkan'}
          </span>
          <span className="text-red-700">
            {status === 'REFUNDED'
              ? 'Dana telah ditransfer kembali ke rekening bank Anda.'
              : status === 'REFUND_REQUESTED'
              ? 'Admin sedang memverifikasi rekening tujuan pengembalian dana.'
              : status === 'CANCELLED_BY_USER'
              ? 'Pesanan dibatalkan sesuai permintaan Anda.'
              : 'Pesanan dibatalkan oleh admin. Hubungi admin jika membutuhkan bantuan.'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Progres Status Pesanan
      </h3>

      <div className="relative pl-6 space-y-6">
        {steps.map((st, idx) => {
          const isDone = activeIndex > idx;
          const isCurrent = activeIndex === idx;

          return (
            <div key={st.key} className="relative flex items-start gap-3.5 group">
              {/* Connector line to next step - stops exactly at next circle, never below last step */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute -left-[15px] top-5 -bottom-6 w-0.5 ${
                    activeIndex > idx ? 'bg-brand-600' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Dot / Indicator */}
              <div
                className={`absolute z-10 -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-brand-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow'
                    : 'bg-white border-2 border-slate-300'
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                ) : null}
              </div>

              {/* Status Label */}
              <div>
                <p
                  className={`text-xs sm:text-sm font-bold transition ${
                    isCurrent
                      ? 'text-brand-600'
                      : isDone
                      ? 'text-charcoal-900'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {st.label}
                </p>
                {isCurrent && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {statusDescriptions[status] || 'Status pesanan sedang diperbarui.'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
