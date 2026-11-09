import React, { useState } from 'react';
import api from '../../lib/api';
import { formatRupiah } from '../../lib/utils';
import { X, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function RefundClaimModal({ nanoId, finalPrice, onClose, onSuccess }) {
  const [bankName, setBankName] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [reason, setReason] = useState('Barang belanjaan habis/toko tutup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bankOptions = [
    'BCA',
    'Mandiri',
    'BRI',
    'BNI',
    'Bankaltimtara',
    'GoPay',
    'OVO',
    'DANA',
    'ShopeePay',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!accountNumber.trim() || !accountHolderName.trim()) {
      setError('Nomor rekening/e-wallet dan nama pemilik wajib diisi');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/orders/${nanoId}/refund-request`, {
        bank_name: bankName,
        account_number: accountNumber.trim(),
        account_holder_name: accountHolderName.trim(),
        reason,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengajuan refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Pengajuan Refund
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Resi: {nanoId}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup formulir refund"
            className="p-1.5 text-slate-400 hover:text-charcoal-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Informasi Pengembalian Dana:</span>
            <span>
              Nominal pengembalian yang diajukan sebesar <strong>{formatRupiah(finalPrice)}</strong>. Pengajuan akan diverifikasi admin sebelum transfer dilakukan.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="refund-bank" className="block text-xs font-bold text-slate-700 mb-1">
              Pilih Bank / E-Wallet Tujuan:
            </label>
            <select
              id="refund-bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors font-medium"
            >
              {bankOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="refund-account" className="block text-xs font-bold text-slate-700 mb-1">
              Nomor Rekening / No. HP E-Wallet:
            </label>
            <input
              id="refund-account"
              type="text"
              placeholder="Contoh: 1234567890 / 081234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors font-semibold"
              required
            />
          </div>

          <div>
            <label htmlFor="refund-holder" className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Pemilik Rekening:
            </label>
            <input
              id="refund-holder"
              type="text"
              placeholder="Nama sesuai buku tabungan / akun e-wallet"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors uppercase"
              required
            />
          </div>

          <div>
            <label htmlFor="refund-reason" className="block text-xs font-bold text-slate-700 mb-1">
              Alasan Pengembalian:
            </label>
            <input
              id="refund-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow transition active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Pengajuan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
